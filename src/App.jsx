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
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

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

  // Simple Email Login Handler (Option A - Passwordless Email Sync)
  const handleEmailLoginSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    await processUserLogin(emailInput.trim(), tempName || profile.name || "User", "");
    setEmailInput('');
    setShowLoginModal(false);
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
      name: name || profile.name || tempName,
      onboarded: true // User is now considered onboarded on successful sign in
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

        {/* Social Authentication Block */}
        <div style={{ marginBottom: '16px', textAlign: 'center', width: '100%', animation: 'slideUp 0.3s ease-out' }}>
          {profile.email ? (
            <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>✅ लॉग इन हैं (Signed In)</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                ईमेल: <strong>{profile.email}</strong>
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleLogout}
                style={{ marginTop: '8px', padding: '6px 16px', fontSize: '12px', width: 'auto' }}
              >
                लॉगआउट (Sign Out)
              </button>
            </div>
          ) : (
            <div style={{ maxWidth: '380px', margin: '0 auto', width: '100%' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>वापस आने वाले उपयोगकर्ता (Returning Users)</p>
              <p className="hindi-text" style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: '1.4' }}>
                क्या आपने पहले BolEnglish का उपयोग किया है? अपना वही ईमेल दर्ज करें जिसे आपने पहले उपयोग किया था। हम आपकी पिछली प्रगति, अर्जित अंक (XP), और सीखे गए पाठों को तुरंत लोड कर देंगे।
              </p>
              
              <form onSubmit={handleEmailLoginSubmit} style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '6px' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  style={{ margin: 0, flexGrow: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: 'auto', whiteSpace: 'nowrap', padding: '0 20px' }}>
                  सिंक करें (Connect)
                </button>
              </form>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.4' }}>
                Have you used BolEnglish before? Enter the same email you used previously. We will instantly load your saved progress, XP, and completed lessons.
              </p>
            </div>
          )}
        </div>

        {/* OR Divider */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '8px 0 20px 0', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '500', animation: 'slideUp 0.3s ease-out' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <span style={{ padding: '0 12px' }}>या (OR) नया प्रोफाइल बनाएं</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        </div>

        <form onSubmit={handleStartOnboarding} className="screen" style={{ animation: 'slideUp 0.3s ease-out', width: '100%' }}>
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
          {profile.email ? (
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
          ) : (
            <div style={{
              backgroundColor: 'rgba(143, 67, 255, 0.04)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderBottom: '1px solid var(--border-color)',
              padding: '8px 20px',
              fontSize: '11px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'var(--text-secondary)'
            }}>
              <span>⚠️ <strong>प्रगति सुरक्षित करें:</strong> क्लाउड सिंक सक्षम करने के लिए साइन-इन करें। (Save progress to cloud)</span>
              <button 
                onClick={() => setShowLoginModal(true)} 
                style={{ 
                  background: 'var(--primary-gradient)', 
                  border: 'none', 
                  color: '#fff', 
                  fontSize: '10px', 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  boxShadow: '0 4px 10px rgba(143, 67, 255, 0.2)' 
                }}
              >
                साइन-इन (Sign In)
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

      {/* Global Email Sync Modal Overlay */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.25)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '380px', textAlign: 'left' }}>
            <h3 style={{ marginBottom: '8px' }}>प्रगति सिंक करें (Cloud Sync)</h3>
            <p className="hindi-text" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', lineHeight: '1.4' }}>
              अपनी प्रगति को सुरक्षित रखें! यहाँ अपना ईमेल दर्ज करने से आपका सारा डेटा क्लाउड में सेव हो जाएगा। इससे आपकी प्रोग्रेस कभी डिलीट नहीं होगी और आप किसी भी फोन या कंप्यूटर पर अपनी पढ़ाई जारी रख सकेंगे।
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px', fontStyle: 'italic', lineHeight: '1.4' }}>
              Secure your progress! Entering your email here backs up your learning history to the cloud. Your progress will never be lost, and you can continue learning on any phone or computer.
            </p>
            
            <form onSubmit={handleEmailLoginSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  className="form-input"
                  placeholder="user@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLoginModal(false)}>बंद करें (Close)</button>
                <button type="submit" className="btn btn-primary">कनेक्ट करें (Connect)</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
