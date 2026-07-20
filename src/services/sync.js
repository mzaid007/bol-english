// Sync Service - Bridges local React state/storage with Vercel Serverless Functions + MongoDB Atlas

export const SyncService = {
  // Save local profile & progress states to the serverless MongoDB database
  async syncToCloud(email, profile, progress) {
    if (!email) return false;
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, profile, progress })
      });
      
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        const errorMsg = data.details || data.error || `HTTP status ${response.status}`;
        throw new Error(errorMsg);
      }
      
      return data.success;
    } catch (e) {
      console.error("Cloud Sync Failed:", e.message);
      return false;
    }
  },

  // Fetch profile & progress from MongoDB database
  async fetchFromCloud(email) {
    if (!email) return null;
    try {
      const response = await fetch(`/api/fetch?email=${encodeURIComponent(email)}`);
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        const errorMsg = data.details || data.error || `HTTP status ${response.status}`;
        throw new Error(errorMsg);
      }
      
      if (data.success && data.exists) {
        return {
          profile: data.profile,
          progress: data.progress
        };
      }
      return null;
    } catch (e) {
      console.error("Cloud Fetch Failed:", e.message);
      return null;
    }
  }
};
