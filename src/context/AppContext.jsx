import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { StorageService } from '../services/storage';
import { SyncService } from '../services/sync';
import { useToast } from './ToastContext';

const AppContext = createContext(null);

const DEFAULT_PROFILE = {
  name: '',
  goal: '',
  level: null,
  assessmentCompleted: false,
  onboarded: false,
  avatar: '🧑‍🎓',
  email: '',
};

const DEFAULT_PROGRESS = {
  completedLessons: [],
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  correctAnswers: 0,
  totalQuestionsAnswered: 0,
};

export function AppProvider({ children }) {
  const toast = useToast();

  const [profile, setProfile] = useState(() => ({
    ...DEFAULT_PROFILE,
    ...StorageService.getProfile(),
  }));
  const [progress, setProgress] = useState(() => ({
    ...DEFAULT_PROGRESS,
    ...StorageService.getProgress(),
  }));

  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Keep cloud sync debounce timer in a ref so it survives renders.
  const syncTimer = useRef(null);

  /* ----- Mutators (persist to localStorage on every change) ----- */
  const updateProfile = useCallback((updater) => {
    setProfile((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      StorageService.saveProfile(next);
      return next;
    });
  }, []);

  const updateProgress = useCallback((updater) => {
    setProgress((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      StorageService.saveProgress(next);
      return next;
    });
  }, []);

  /* ----- Mark first paint done (so RouteGuard knows localStorage was read) ----- */
  useEffect(() => { setLoaded(true); }, []);

  /* ----- Reactive cloud sync: debounced after progress changes ----- */
  useEffect(() => {
    if (!profile.email) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      setIsSyncing(true);
      await SyncService.syncToCloud(profile.email, profile, progress);
      setIsSyncing(false);
    }, 1000);
    return () => clearTimeout(syncTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, profile.email]);

  /* ----- Lesson completion ----- */
  const completeLesson = useCallback((lessonId, xpReward) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) {
        // Already done; no double XP, but keep streak fresh.
        const updated = { ...prev };
        StorageService.updateStreak(updated);
        StorageService.saveProgress(updated);
        return updated;
      }
      const updated = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        xp: (prev.xp || 0) + xpReward,
      };
      StorageService.updateStreak(updated);
      StorageService.saveProgress(updated);
      return updated;
    });
  }, []);

  /* ----- Assessment completion ----- */
  const finishAssessment = useCallback((score, level) => {
    updateProfile((p) => ({ ...p, level, assessmentCompleted: true }));
    setProgress((prev) => {
      const updated = { ...prev };
      StorageService.updateStreak(updated);
      StorageService.saveProgress(updated);
      return updated;
    });
    return { score, level };
  }, [updateProfile]);

  /* ----- Answer accuracy tracking (wires the previously-unused trackAnswer) ----- */
  const trackAnswer = useCallback((isCorrect) => {
    updateProgress((p) => ({
      ...p,
      totalQuestionsAnswered: (p.totalQuestionsAnswered || 0) + 1,
      correctAnswers: (p.correctAnswers || 0) + (isCorrect ? 1 : 0),
    }));
  }, [updateProgress]);

  /* ----- Email cloud login + smart merge ----- */
  const connectEmail = useCallback(async (email, nameForProfile) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return false;
    setIsConnecting(true);
    try {
      const cloudData = await SyncService.fetchFromCloud(cleanEmail);

      let nextProfile = {
        ...profile,
        email: cleanEmail,
        name: nameForProfile || profile.name || 'User',
        onboarded: true,
      };
      let nextProgress = { ...progress };

      if (cloudData && cloudData.progress) {
        // Smart merge: union lessons, take the higher stats.
        nextProgress = {
          completedLessons: Array.from(new Set([
            ...progress.completedLessons,
            ...(cloudData.progress.completedLessons || []),
          ])),
          xp: Math.max(progress.xp || 0, cloudData.progress.xp || 0),
          streak: Math.max(progress.streak || 0, cloudData.progress.streak || 0),
          lastActiveDate: progress.lastActiveDate || cloudData.progress.lastActiveDate,
          correctAnswers: Math.max(progress.correctAnswers || 0, cloudData.progress.correctAnswers || 0),
          totalQuestionsAnswered: Math.max(progress.totalQuestionsAnswered || 0, cloudData.progress.totalQuestionsAnswered || 0),
        };
        nextProfile = {
          ...nextProfile,
          level: cloudData.profile.level || profile.level,
          goal: cloudData.profile.goal || profile.goal,
          avatar: cloudData.profile.avatar || profile.avatar,
          assessmentCompleted: cloudData.profile.assessmentCompleted || profile.assessmentCompleted,
        };
        toast.success(`क्लाउड डेटा मिल गया! ${nextProgress.xp} XP रीस्टोर हुआ।`);
      } else {
        // No existing cloud record — push current local state as baseline.
        await SyncService.syncToCloud(cleanEmail, nextProfile, nextProgress);
        toast.success('क्लाउड सिंक सक्रिय हो गया! अब आपकी प्रगति सुरक्षित है।');
      }

      StorageService.saveProfile(nextProfile);
      StorageService.saveProgress(nextProgress);
      setProfile(nextProfile);
      setProgress(nextProgress);
      return { profile: nextProfile, progress: nextProgress };
    } catch (err) {
      console.error(err);
      toast.error('क्लाउड कनेक्शन विफल रहा। कृपया पुनः प्रयास करें।');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [profile, progress, toast]);

  const disconnectEmail = useCallback(() => {
    updateProfile((p) => ({ ...p, email: '' }));
    toast.show('लॉगआउट हो गया। प्रगति अब केवल इस डिवाइस पर रहेगी।', { icon: '🔌' });
  }, [updateProfile, toast]);

  /* ----- Reset everything ----- */
  const resetAll = useCallback(() => {
    StorageService.resetAll();
    setProfile(DEFAULT_PROFILE);
    setProgress(DEFAULT_PROGRESS);
    toast.show('सारा डेटा रीसेट हो गया।', { type: 'warning', icon: '🔄' });
  }, [toast]);

  const value = {
    profile,
    progress,
    loaded,
    isSyncing,
    isConnecting,
    updateProfile,
    updateProgress,
    completeLesson,
    finishAssessment,
    trackAnswer,
    connectEmail,
    disconnectEmail,
    resetAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
