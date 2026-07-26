import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import SyncSheet from '../components/SyncSheet';

const AVATARS = ['🧑‍🎓', '👩‍💻', '👨‍💼', '🚀', '🌟', '🐼', '🦁', '🦊'];

const GOALS = [
  { id: 'speaking', title: 'आम बोलचाल (Daily Conversation)', sub: 'मित्रों और परिवार के साथ बात करने के लिए', icon: '💬' },
  { id: 'career', title: 'नौकरी और व्यवसाय (Career & Job)', sub: 'इंटरव्यू और ऑफिस में संवाद करने के लिए', icon: '💼' },
  { id: 'travel', title: 'यात्रा और घूमना (Travel)', sub: 'विदेश या अन्य राज्यों में यात्रा करने के लिए', icon: '✈️' },
  { id: 'education', title: 'शिक्षा और परीक्षा (Education)', sub: 'परीक्षाओं और पठन-पाठन को बेहतर बनाने के लिए', icon: '📚' },
];

export default function OnboardingRoute() {
  const { profile, updateProfile, connectEmail, isConnecting, signOut } = useApp();
  const navigate = useNavigate();

  // Mode: 'signup' | 'restore'
  const [mode, setMode] = useState('signup');

  // Sign up fields
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [avatar, setAvatar] = useState(profile.avatar || '🧑‍🎓');
  const [goal, setGoal] = useState(profile.goal || '');

  // Restore fields
  const [restoreEmail, setRestoreEmail] = useState('');

  // Result Pop-Out Modal state: null | { type: 'signup_success' | 'restore_success' | 'restore_fail', title, message, details, dest }
  const [resultModal, setResultModal] = useState(null);

  // Handle New Sign-Up Submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim() || !goal) return;

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    // If an email was provided during sign-up, connect to cloud
    if (cleanEmail) {
      const connResult = await connectEmail(cleanEmail, cleanName);
      if (connResult && connResult.success) {
        if (connResult.isExistingUser) {
          // Found existing record for this email!
          setResultModal({
            type: 'restore_success',
            title: '🎉 पुरानी प्रगति लोड हो गई! (Cloud Restored)',
            subtitle: `ईमेल "${cleanEmail}" से आपका पुराना डेटा सफलतापूर्वक मिल गया।`,
            details: {
              name: connResult.profile.name || cleanName,
              avatar: connResult.profile.avatar || avatar,
              xp: connResult.progress.xp || 0,
              completedCount: connResult.progress.completedLessons?.length || 0,
              goal: GOALS.find((g) => g.id === (connResult.profile.goal || goal))?.title || 'बोलचाल',
            },
            dest: connResult.profile.assessmentCompleted ? '/dashboard' : '/assessment',
          });
          return;
        }
      }
    }

    // New profile creation
    updateProfile({
      name: cleanName,
      email: cleanEmail,
      avatar,
      goal,
      onboarded: true,
    });

    setResultModal({
      type: 'signup_success',
      title: '🎉 अकाउंट सफलतापूर्वक बन गया! (Account Created)',
      subtitle: `नमस्ते ${cleanName}! आपका प्रोफाइल सफलतापूर्वक तैयार हो गया है।`,
      details: {
        name: cleanName,
        avatar,
        goalTitle: GOALS.find((g) => g.id === goal)?.title || 'बोलचाल',
      },
      dest: '/assessment',
    });
  };

  // Handle Restore Progress Submission
  const handleRestore = async (e) => {
    e.preventDefault();
    if (!restoreEmail.trim() || isConnecting) return;

    const cleanEmail = restoreEmail.trim();
    const res = await connectEmail(cleanEmail);

    if (res && res.success) {
      if (res.isExistingUser) {
        setResultModal({
          type: 'restore_success',
          title: '🎉 प्रगति रीस्टोर हो गई! (Restore Successful)',
          subtitle: `नमस्ते ${res.profile.name || 'शिक्षार्थी'}! आपकी सारी प्रगति लोड कर दी गई है।`,
          details: {
            name: res.profile.name || 'शिक्षार्थी',
            avatar: res.profile.avatar || '🧑‍🎓',
            xp: res.progress.xp || 0,
            completedCount: res.progress.completedLessons?.length || 0,
            goal: GOALS.find((g) => g.id === res.profile.goal)?.title || 'सेट नहीं है',
          },
          dest: res.profile.assessmentCompleted ? '/dashboard' : '/assessment',
        });
      } else {
        setResultModal({
          type: 'restore_success',
          title: '✅ नया क्लाउड अकाउंट कनेक्ट हुआ!',
          subtitle: `ईमेल "${cleanEmail}" पहली बार कनेक्ट हुआ है। आपकी प्रगति अब सुरक्षित रहेगी।`,
          details: {
            name: res.profile.name || 'शिक्षार्थी',
            avatar: res.profile.avatar || '🧑‍🎓',
            xp: res.progress.xp || 0,
            completedCount: 0,
            goal: GOALS.find((g) => g.id === res.profile.goal)?.title || 'सेट नहीं है',
          },
          dest: '/assessment',
        });
      }
    } else {
      setResultModal({
        type: 'restore_fail',
        title: '⚠️ रीस्टोर नहीं हो सका (Restore Failed)',
        subtitle: res?.error || `ईमेल "${cleanEmail}" से जुड़ा रिकॉर्ड नहीं मिला या कनेक्शन में त्रुटि हुई।`,
        message: 'कृपया अपना ईमेल सही दर्ज करें या "नया अकाउंट बनाएं" विकल्प चुनें।',
      });
    }
  };

  const closeResultModal = () => {
    const dest = resultModal?.dest;
    setResultModal(null);
    if (dest) navigate(dest);
  };

  return (
    <div className="app-container no-nav page">
      {/* Top Header Capsule Bar */}
      <div className="row-between py-12 mb-20" style={{ borderBottom: '1px solid var(--glass-border)' }}>
        <div className="app-header-brand" style={{ fontSize: 22 }}>
          <span className="brand-mark" style={{ width: 32, height: 32, fontSize: 16 }}>B</span>
          <span>BolEnglish</span>
        </div>
        
        {profile.onboarded ? (
          <div className="row gap-8 items-center">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/dashboard')}
            >
              डैशबोर्ड →
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={signOut}
            >
              🚪 साइन आउट
            </button>
          </div>
        ) : (
          <div className="text-xs muted bold">
            मुफ़्त ऑनलाइन क्लास
          </div>
        )}
      </div>

      {/* Hero Header */}
      <div className="center mb-28 pt-4">
        <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: 10 }}>
          The future of English learning is yours to <span className="rainbow-text">create</span>
        </h1>
        <p className="hindi-text" style={{ fontSize: 15.5, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>
          हिन्दी से अंग्रेज़ी सीखें — बिल्कुल मुफ़्त!
        </p>
        <p className="text-xs muted">100% Free, Forever.</p>
      </div>

      {/* Main Glass Onboarding Card */}
      <Card className="mb-28 p-24">
        
        {/* Side-by-Side Mode Switcher Buttons */}
        <div className="onboarding-mode-switcher mb-24">
          <button
            type="button"
            className={`tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            <span>✨ नया अकाउंट (Sign Up)</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${mode === 'restore' ? 'active' : ''}`}
            onClick={() => setMode('restore')}
          >
            <span>🔄 पुरानी प्रगति (Restore)</span>
          </button>
        </div>

        {/* MODE 1: Sign Up Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp}>
            <div className="mb-20">
              <h2 className="text-lg bold mb-4" style={{ color: '#ffffff' }}>
                नया प्रोफ़ाइल बनाएं (Create Profile)
              </h2>
              <p className="hindi-text text-xs text-secondary" style={{ fontSize: 13.5 }}>
                अपनी भाषा यात्रा शुरू करने के लिए ये सरल जानकारी भरें:
              </p>
            </div>

            <div className="form-group mb-16">
              <label className="form-label" htmlFor="name">1. आपका नाम (Your Name) *</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="अमित कुमार..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isConnecting}
              />
            </div>

            <div className="form-group mb-20">
              <label className="form-label" htmlFor="email">
                2. ईमेल (Email) <span style={{ textTransform: 'none', opacity: 0.7 }}>(ऐच्छिक - क्लाउड बैकअप के लिए)</span>
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isConnecting}
              />
            </div>

            <div className="form-group mb-20">
              <span className="form-label">3. अवतार चुनें (Select Avatar)</span>
              <div className="avatar-grid" role="radiogroup" aria-label="अवतार चुनें">
                {AVATARS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    className={`avatar-option ${avatar === emoji ? 'selected' : ''}`}
                    onClick={() => setAvatar(emoji)}
                    role="radio"
                    aria-checked={avatar === emoji}
                    aria-label={`अवतार ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group mb-24">
              <span className="form-label">4. आपका लक्ष्य (Learning Goal) *</span>
              <div className="selector-list" role="radiogroup" aria-label="सीखने का लक्ष्य">
                {GOALS.map((g) => (
                  <div
                    key={g.id}
                    className={`selectable ${goal === g.id ? 'selected' : ''}`}
                    onClick={() => setGoal(g.id)}
                    role="radio"
                    aria-checked={goal === g.id}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setGoal(g.id); }
                    }}
                  >
                    <div className="selectable-icon" aria-hidden="true">{g.icon}</div>
                    <div className="selectable-text">
                      <span className="selectable-title hindi-text">{g.title}</span>
                      <span className="selectable-sub hindi-text">{g.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="btn-primary btn-block" disabled={!name.trim() || !goal || isConnecting}>
              {isConnecting ? 'प्रोफ़ाइल बन रही है...' : 'अकाउंट बनाएं & शुरू करें →'}
            </Button>
          </form>
        )}

        {/* MODE 2: Inline Restore Progress Form */}
        {mode === 'restore' && (
          <form onSubmit={handleRestore}>
            <div className="mb-20">
              <h2 className="text-lg bold mb-4" style={{ color: '#ffffff' }}>
                पुरानी प्रगति लाएं (Restore Progress)
              </h2>
              <p className="hindi-text text-xs text-secondary" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                क्या आपने पहले BolEnglish का उपयोग किया है? अपना वही ईमेल दर्ज करें — हम आपकी पिछली प्रगति, XP और पाठ तुरंत लोड कर देंगे।
              </p>
            </div>

            <div className="form-group mb-24">
              <label className="form-label" htmlFor="restoreEmail">आपका ईमेल दर्ज करें (Registered Email) *</label>
              <input
                id="restoreEmail"
                type="email"
                className="form-input"
                placeholder="user@example.com"
                value={restoreEmail}
                onChange={(e) => setRestoreEmail(e.target.value)}
                required
                disabled={isConnecting}
                autoFocus
              />
            </div>

            <Button type="submit" className="btn-primary btn-block" disabled={!restoreEmail.trim() || isConnecting}>
              {isConnecting ? 'प्रगति खोजी जा रही है...' : '🔄 पुरानी प्रगति लाएं (Restore Progress) →'}
            </Button>

            <div className="center mt-16">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setMode('signup')}
              >
                नया अकाउंट बनाना चाहते हैं? यहाँ क्लिक करें
              </button>
            </div>
          </form>
        )}
      </Card>

      {/* POP-OUT SUCCESS / FAILURE RESULT MODAL */}
      {resultModal && (
        <Modal
          open={!!resultModal}
          onClose={closeResultModal}
          title=""
        >
          <div className="result-modal-content">
            <div className="result-modal-icon">
              {resultModal.type === 'restore_fail' ? '⚠️' : '🎉'}
            </div>

            <h3 className="bold text-lg mb-6" style={{ color: resultModal.type === 'restore_fail' ? '#f87171' : '#ffffff' }}>
              {resultModal.title}
            </h3>

            <p className="hindi-text text-sm secondary mb-16" style={{ lineHeight: 1.55 }}>
              {resultModal.subtitle}
            </p>

            {/* Details Box for Success */}
            {resultModal.details && (
              <div className="result-summary-box">
                <div className="row gap-12 items-center mb-8">
                  <div style={{ fontSize: 32 }}>{resultModal.details.avatar || '🧑‍🎓'}</div>
                  <div>
                    <div className="bold" style={{ fontSize: 16, color: '#ffffff' }}>{resultModal.details.name}</div>
                    <div className="text-xs muted">लक्ष्य: {resultModal.details.goalTitle || resultModal.details.goal}</div>
                  </div>
                </div>
                {typeof resultModal.details.xp !== 'undefined' && (
                  <div className="row-between pt-8" style={{ borderTop: '1px solid var(--glass-border)', fontSize: 13 }}>
                    <span className="muted">रीस्टोर हुई XP:</span>
                    <span className="bold" style={{ color: '#c084fc' }}>💎 {resultModal.details.xp} XP</span>
                  </div>
                )}
              </div>
            )}

            {/* Error Message for Fail */}
            {resultModal.message && (
              <p className="hindi-text text-xs text-muted mb-16" style={{ fontStyle: 'italic' }}>
                {resultModal.message}
              </p>
            )}

            <Button
              className="btn-primary btn-block mt-12"
              onClick={closeResultModal}
            >
              {resultModal.type === 'restore_fail' ? 'पुनः प्रयास करें (Try Again)' : 'सीखना शुरू करें (Start Learning) →'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
