// Storage Service using HTML5 localStorage with an extensible adapter pattern

const STORAGE_KEYS = {
  PROFILE: 'lang_teacher_profile',
  PROGRESS: 'lang_teacher_progress'
};

export const StorageService = {
  // Get user profile (details about placement level, onboarding status, name)
  getProfile() {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
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
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  // Get user progress stats (completed lessons, XP, streaks, and timestamps)
  getProgress() {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
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
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
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
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  }
};
