import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Assessment from './components/Assessment';
import Dashboard from './components/Dashboard';
import LessonCard from './components/LessonCard';
import { StorageService } from './services/storage';
import { SyncService } from './services/sync';

const AVATAR_OPTIONS = ["🧑‍🎓", "👩‍💻", "👨‍💼", "🚀", "🌟", "🐼", "🦁", "🦊"];

const GOAL_OPTIONS = [
  { id: 'speaking', title: 'आम बोलचाल (Daily Conversation)', sub: 'मित्रों और परिवार के साथ बात करने के लिए', icon: '💬' },
  { id: 'career', title: 'नौकरी और व्यवसाय (Career & Job)', sub: 'इंटरव्यू और ऑफिस में संवाद करने के लिए', icon: '💼' },
  { id: 'travel', title: 'यात्रा और घूमना (Travel)', sub: 'विदेश या अन्य राज्यों में यात्रा करने के लिए', icon: '✈️' },
  { id: 'education', title: 'शिक्षा और परीक्षा (Education)', sub: 'परीक्षाओं और पठन-पाठन को बेहतर बनाने के लिए', icon: '📚' }
];

export default function App() {
  const [profile, setProfile] = useState({
    name: '',
    goal: '',
    level: null,
    assessmentCompleted: false,
    onboarded: false,
    avatar: '🧑‍🎓',
    email: '',
    avatarUrl: ''
  });

  const [progress, setProgress] = useState({
    completedLessons: [],
    xp: 0,
    streak: 0,
    lastActiveDate: null
  });

  // Current screen state: 'onboarding' | 'assessment' | 'dashboard' | 'lesson'
  const [screen, setScreen] = useState('onboarding');
  const [activeLesson, setActiveLesson] = useState(null);

  // Temporary onboarding states
  const [tempName, setTempName] = useState('');
  const [tempGoal, setTempGoal] = useState('');
  const [tempAvatar, setTempAvatar] = useState('🧑‍🎓');
  
  // Custom developer testing state
  const [showSimulatedLogin, setShowSimulatedLogin] = useState(false);
  const [simulatedEmail, setSimulatedEmail] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Google client ID loaded from environment variables
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Load profile and progress on mount
  useEffect(() => {
    const savedProfile = StorageService.getProfile();
    const savedProgress = StorageService.getProgress();

    setProfile(savedProfile);
    setProgress(savedProgress);

    if (savedProfile.onboarded) {
      if (savedProfile.assessmentCompleted) {
        setScreen('dashboard');
      } else {
        setScreen('assessment');
      }
    } else {
      setScreen('onboarding');
    }
  }, []);

  // Set up Google Sign-In SDK
  useEffect(() => {
    if (GOOGLE_CLIENT_ID && window.google) {
      /* global google */
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse
      });

      // Render button in container if it exists
      const btnContainer = document.getElementById("google-signin-btn");
      if (btnContainer) {
        google.accounts.id.renderButton(btnContainer, {
          theme: "dark",
          size: "large",
          width: "100%",
          text: "signin_with"
        });
      }
    }
  }, [screen, GOOGLE_CLIENT_ID]);

  // Reactive Sync: Auto-syncs to MongoDB when progress updates and user is logged in
  useEffect(() => {
    if (profile.email) {
      const syncData = async () => {
        setIsSyncing(true);
        await SyncService.syncToCloud(profile.email, profile, progress);
        setIsSyncing(false);
      };
      // Simple debounce/delay to avoid double hits
      const t = setTimeout(syncData, 1000);
      return () => clearTimeout(t);
    }
  }, [progress, profile.email]);

  const updateProfileState = (newProfile) => {
    setProfile(newProfile);
    StorageService.saveProfile(newProfile);
  };

  const updateProgressState = (newProgress) => {
    setProgress(newProgress);
    StorageService.saveProgress(newProgress);
  };

  // Google Login Token Handler
  const handleGoogleCredentialResponse = async (response) => {
    try {
      // Decode JWT token locally (JWT payload is base64-url encoded JSON)
      const token = response.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      const email = payload.email;
      const name = payload.name;
      const picture = payload.picture;

      await processUserLogin(email, name, picture);
    } catch (e) {
      console.error("Failed to parse Google credentials:", e);
      alert("गूगल लॉगिन विफल रहा।");
    }
  };

  // Simulated Login for quick MongoDB testing without Client ID
  const handleSimulatedLoginSubmit = async (e) => {
    e.preventDefault();
    if (!simulatedEmail.trim()) return;
    await processUserLogin(simulatedEmail.trim(), tempName || profile.name || "Test User", "");
    setShowSimulatedLogin(false);
  };

  // Core Login Processing & Cloud Fetch
  const processUserLogin = async (email, name, picture) => {
    setIsSyncing(true);
    // Fetch data from MongoDB
    const cloudData = await SyncService.fetchFromCloud(email);

    let updatedProfile = {
      ...profile,
      email: email,
      avatarUrl: picture,
      name: name || profile.name || tempName
    };

    let updatedProgress = { ...progress };

    if (cloudData) {
      // Smart Merge logic: combine completed lessons and pick higher stats
      const mergedLessons = Array.from(new Set([
        ...progress.completedLessons,
        ...cloudData.progress.completedLessons
      ]));
      
      updatedProgress = {
        completedLessons: mergedLessons,
        xp: Math.max(progress.xp, cloudData.progress.xp),
        streak: Math.max(progress.streak, cloudData.progress.streak),
        lastActiveDate: progress.lastActiveDate || cloudData.progress.lastActiveDate
      };

      updatedProfile = {
        ...updatedProfile,
        level: cloudData.profile.level || profile.level,
        goal: cloudData.profile.goal || profile.goal || tempGoal,
        avatar: cloudData.profile.avatar || profile.avatar || tempAvatar,
        assessmentCompleted: cloudData.profile.assessmentCompleted || profile.assessmentCompleted,
        onboarded: true
      };

      alert(`क्लाउड डेटा प्राप्त किया गया! ${updatedProgress.xp} XP रीस्टोर हुआ।`);
    } else {
      // No cloud data exists, sync current local state to cloud as baseline
      await SyncService.syncToCloud(email, updatedProfile, updatedProgress);
    }

    updateProfileState(updatedProfile);
    updateProgressState(updatedProgress);
    setIsSyncing(false);

    // Route based on state
    if (updatedProfile.assessmentCompleted) {
      setScreen('dashboard');
    } else {
      setScreen('assessment');
    }
  };

  // Handlers
  const handleStartOnboarding = (e) => {
    e.preventDefault();
    if (!tempName.trim()) {
      alert("कृपया अपना नाम दर्ज करें!");
      return;
    }
    if (!tempGoal) {
      alert("कृपया एक लक्ष्य चुनें!");
      return;
    }

    const newProfile = {
      ...profile,
      name: tempName,
      goal: tempGoal,
      avatar: tempAvatar,
      onboarded: true
    };
    updateProfileState(newProfile);
    setScreen('assessment');
  };

  const handleAssessmentComplete = (score, calculatedLevel) => {
    const newProfile = {
      ...profile,
      level: calculatedLevel,
      assessmentCompleted: true
    };
    updateProfileState(newProfile);

    const newProgress = { ...progress };
    StorageService.updateStreak(newProgress);
    updateProgressState(newProgress);

    setScreen('dashboard');
  };

  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson);
    setScreen('lesson');
  };

  const handleLessonComplete = (lessonId, xpReward) => {
    const updatedProgress = StorageService.completeLesson(lessonId, xpReward);
    updateProgressState(updatedProgress);
  };

  const handleRetakeAssessment = () => {
    const newProfile = {
      ...profile,
      assessmentCompleted: false,
      level: null
    };
    updateProfileState(newProfile);
    setScreen('assessment');
  };

  const handleResetApp = () => {
    StorageService.resetAll();
    setProfile({
      name: '',
      goal: '',
      level: null,
      assessmentCompleted: false,
      onboarded: false,
      avatar: '🧑‍🎓',
      email: '',
      avatarUrl: ''
    });
    setProgress({
      completedLessons: [],
      xp: 0,
      streak: 0,
      lastActiveDate: null
    });
    setTempName('');
    setTempGoal('');
    setTempAvatar('🧑‍🎓');
    setSimulatedEmail('');
    setScreen('onboarding');
  };

  const handleLogout = () => {
    const newProfile = { ...profile, email: '', avatarUrl: '' };
    updateProfileState(newProfile);
    alert("लॉग आउट किया गया। प्रोग्रेस अब केवल आपके डिवाइस पर रहेगी।");
  };

  // Render Screens
  const renderOnboarding = () => {
    return (
      <div className="screen app-container" style={{ justifyContent: 'center' }}>
        <div className="onboard-hero">
          <div className="onboard-logo">BolEnglish</div>
          <div className="onboard-logo-sub">हिन्दी से अंग्रेजी सीखें, बिल्कुल मुफ्त!</div>
        </div>

        <form onSubmit={handleStartOnboarding} className="screen" style={{ animation: 'slideUp 0.3s ease-out' }}>
          {/* Name input */}
          <div className="form-group">
            <label className="form-label">आपका नाम (Your Name)</label>
            <input
              type="text"
              className="form-input"
              placeholder="अमित कुमार..."
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              required
            />
          </div>

          {/* Avatar selector */}
          <div className="form-group">
            <label className="form-label">अवतार चुनें (Select Avatar)</label>
            <div className="avatar-selector" role="radiogroup" aria-label="अवतार चुनें (Select Avatar)">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  className={`avatar-option ${tempAvatar === emoji ? 'selected' : ''}`}
                  onClick={() => setTempAvatar(emoji)}
                  role="radio"
                  aria-checked={tempAvatar === emoji}
                  aria-label={`Avatar option ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Selector */}
          <div className="form-group">
            <label className="form-label">आपका लक्ष्य (Learning Goal)</label>
            <div className="selector-list" role="radiogroup" aria-label="सीखने का लक्ष्य (Learning Goal)">
              {GOAL_OPTIONS.map((goal) => (
                <div
                  key={goal.id}
                  className={`selector-item ${tempGoal === goal.id ? 'selected' : ''}`}
                  onClick={() => setTempGoal(goal.id)}
                  role="radio"
                  aria-checked={tempGoal === goal.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setTempGoal(goal.id);
                    }
                  }}
                >
                  <div className="selector-icon" aria-hidden="true">{goal.icon}</div>
                  <div className="selector-details">
                    <span className="selector-title">{goal.title}</span>
                    <span className="selector-sub">{goal.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }}>
            आगे बढ़ें (Let's Go) →
          </button>
        </form>

        {/* Social Authentication Block */}
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', marginBottom: '12px' }}>वापस आने वाले उपयोगकर्ता (Returning Users):</p>
          
          {GOOGLE_CLIENT_ID ? (
            <div id="google-signin-btn" style={{ minHeight: '44px' }}></div>
          ) : (
            <button className="btn btn-secondary" onClick={() => setShowSimulatedLogin(true)}>
              🔗 ईमेल से डेटा रीस्टोर करें (Atlas Sync)
            </button>
          )}
        </div>

        {/* Simulated Login Modal/Overlay */}
        {showSimulatedLogin && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '380px', textAlign: 'left' }}>
              <h3 style={{ marginBottom: '8px' }}>डेटाबेस सिंक टेस्ट (Atlas Test)</h3>
              <p style={{ fontSize: '13px', marginBottom: '16px' }}>गूगल क्लाइंट आईडी अनुपस्थित है। डेटाबेस कनेक्शन जांचने के लिए कोई भी ईमेल टाइप करें:</p>
              
              <form onSubmit={handleSimulatedLoginSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="user@example.com"
                    value={simulatedEmail}
                    onChange={(e) => setSimulatedEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSimulatedLogin(false)}>बंद करें</button>
                  <button type="submit" className="btn btn-primary">कनेक्ट करें</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {screen !== 'onboarding' && screen !== 'lesson' && (
        <>
          <Header
            title="BolEnglish"
            streak={progress.streak}
            xp={progress.xp}
            showStats={profile.assessmentCompleted}
            onReset={handleResetApp}
          />
          
          {/* Status Indicator for Database Sync */}
          {profile.email && (
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid var(--border-color)',
              padding: '6px 20px',
              fontSize: '11px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'var(--text-secondary)'
            }}>
              <span>💾 सिंक किया गया: <strong>{profile.email}</strong></span>
              {isSyncing ? (
                <span style={{ color: 'var(--secondary)' }}>सहेज रहा है (Syncing)...</span>
              ) : (
                <span style={{ color: 'var(--success)' }}>सुरक्षित (Cloud Synced)</span>
              )}
              <button 
                onClick={handleLogout} 
                style={{ background: 'none', border: 'none', color: 'var(--error)', fontSize: '11px', cursor: 'pointer', fontWeight: '500' }}
              >
                लॉगआउट (Logout)
              </button>
            </div>
          )}
        </>
      )}

      {screen === 'onboarding' && renderOnboarding()}
      
      {screen === 'assessment' && (
        <Assessment onComplete={handleAssessmentComplete} />
      )}
      
      {screen === 'dashboard' && (
        <Dashboard
          profile={profile}
          progress={progress}
          onSelectLesson={handleLessonSelect}
          onRetakeAssessment={handleRetakeAssessment}
        />
      )}
      
      {screen === 'lesson' && activeLesson && (
        <LessonCard
          lesson={activeLesson}
          onComplete={handleLessonComplete}
          onBack={() => setScreen('dashboard')}
        />
      )}
    </>
  );
}
