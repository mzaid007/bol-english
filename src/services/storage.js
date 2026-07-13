// Storage Service using HTML5 localStorage with an extensible adapter pattern
// Wrapped in safe try-catch blocks to prevent browser security settings (e.g. cookies blocked) from crashing the app.

const STORAGE_KEYS = {
  PROFILE: 'lang_teacher_profile',
  PROGRESS: 'lang_teacher_progress'
};

const safeLocalStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("StorageService: localStorage read blocked or unavailable.", e);
      return null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("StorageService: localStorage write blocked or unavailable.", e);
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("StorageService: localStorage remove blocked or unavailable.", e);
    }
  }
};

export const StorageService = {
  // Get user profile (details about placement level, onboarding status, name)
  getProfile() {
    const data = safeLocalStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : {
      name: '',
      goal: '',
      level: null, // 'beginner' | 'intermediate' | 'advanced' | null
      assessmentCompleted: false,
      onboarded: false
    };
  },

  // Save user profile
  saveProfile(profile) {
    safeLocalStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  // Get user progress stats (completed lessons, XP, streaks, and timestamps)
  getProgress() {
    const data = safeLocalStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : {
      completedLessons: [], // Array of lesson IDs
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      correctAnswers: 0,
      totalQuestionsAnswered: 0
    };
  },

  // Save user progress stats
  saveProgress(progress) {
    safeLocalStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  },

  // Add XP to the user
  addXP(amount) {
    const progress = this.getProgress();
    progress.xp = (progress.xp || 0) + amount;
    this.saveProgress(progress);
    return progress.xp;
  },

  // Mark a lesson as completed, award XP, and check the daily streak
  completeLesson(lessonId, xpReward) {
    const progress = this.getProgress();
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.xp = (progress.xp || 0) + xpReward;
    }
    this.updateStreak(progress);
    this.saveProgress(progress);
    return progress;
  },

  // Increment correct answers count for tracking proficiency history
  trackAnswer(isCorrect) {
    const progress = this.getProgress();
    progress.totalQuestionsAnswered = (progress.totalQuestionsAnswered || 0) + 1;
    if (isCorrect) {
      progress.correctAnswers = (progress.correctAnswers || 0) + 1;
    }
    this.saveProgress(progress);
  },

  // Calculate and update the daily learning streak
  updateStreak(progress) {
    const today = new Date().toDateString();
    const lastActive = progress.lastActiveDate;

    if (!lastActive) {
      progress.streak = 1;
    } else {
      const lastDate = new Date(lastActive);
      const diffTime = Math.abs(new Date(today) - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        progress.streak += 1;
      } else if (diffDays > 1) {
        progress.streak = 1;
      }
      // If diffDays is 0 (same day activity), streak remains unchanged
    }
    progress.lastActiveDate = today;
  },

  // Reset local storage database to clear progress and restart onboarding
  resetAll() {
    safeLocalStorage.removeItem(STORAGE_KEYS.PROFILE);
    safeLocalStorage.removeItem(STORAGE_KEYS.PROGRESS);
  }
};
