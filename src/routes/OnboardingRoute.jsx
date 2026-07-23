import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SyncSheet from '../components/SyncSheet';

const AVATARS = ['🧑‍🎓', '👩‍💻', '👨‍💼', '🚀', '🌟', '🐼', '🦁', '🦊'];

const GOALS = [
  { id: 'speaking', title: 'आम बोलचाल (Daily Conversation)', sub: 'मित्रों और परिवार के साथ बात करने के लिए', icon: '💬' },
  { id: 'career', title: 'नौकरी और व्यवसाय (Career & Job)', sub: 'इंटरव्यू और ऑफिस में संवाद करने के लिए', icon: '💼' },
  { id: 'travel', title: 'यात्रा और घूमना (Travel)', sub: 'विदेश या अन्य राज्यों में यात्रा करने के लिए', icon: '✈️' },
  { id: 'education', title: 'शिक्षा और परीक्षा (Education)', sub: 'परीक्षाओं और पठन-पाठन को बेहतर बनाने के लिए', icon: '📚' },
];

export default function OnboardingRoute() {
  const { profile, updateProfile, isConnecting, signOut } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(profile.name || '');
  const [avatar, setAvatar] = useState(profile.avatar || '🧑‍🎓');
  const [goal, setGoal] = useState(profile.goal || '');
  const [syncOpen, setSyncOpen] = useState(false);

  const start = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!goal) return;
    updateProfile({ name: name.trim(), avatar, goal, onboarded: true });
    navigate('/assessment');
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
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setSyncOpen(true)}
          >
            <span>🔐</span>
            <span>लॉगिन करें (Sign In)</span>
          </button>
        )}
      </div>

      {/* CreativeGlu AI Hero Header */}
      <div className="center mb-32 pt-8">
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: 12 }}>
          The future of English learning is yours to <span className="rainbow-text">create</span>
        </h1>
        <p className="hindi-text" style={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>
          हिन्दी से अंग्रेज़ी सीखें — बिल्कुल मुफ़्त!
        </p>
        <p className="text-xs muted">100% Free, Forever.</p>
      </div>

      {/* Main Glass Registration Card */}
      <Card className="mb-28 p-24">
        <div className="mb-20">
          <h2 className="text-lg bold mb-4" style={{ color: '#ffffff' }}>
            नया प्रोफ़ाइल बनाएं (Start Learning)
          </h2>
          <p className="hindi-text text-xs text-secondary" style={{ fontSize: 13.5 }}>
            शुरू करने के लिए अपना नाम और सीखने का लक्ष्य चुनें:
          </p>
        </div>

        <form onSubmit={start}>
          <div className="form-group mb-20">
            <label className="form-label" htmlFor="name">आपका नाम (Your Name)</label>
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
            <span className="form-label">अवतार चुनें (Select Avatar)</span>
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
            <span className="form-label">आपका लक्ष्य (Learning Goal)</span>
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

          <Button type="submit" className="btn-primary btn-block" disabled={!name.trim() || !goal}>
            सीखना शुरू करें (Start Learning) →
          </Button>
        </form>
      </Card>

      {/* Secondary Link for Returning Users */}
      <div className="center py-12 mb-32">
        <p className="hindi-text text-xs text-secondary mb-10">
          क्या आपने पहले BolEnglish का उपयोग किया है?
        </p>
        <Button variant="secondary" size="sm" className="btn-auto" onClick={() => setSyncOpen(true)}>
          🔄 पुरानी प्रगति लाएं (Restore Progress)
        </Button>
      </div>

      <SyncSheet open={syncOpen} onClose={() => setSyncOpen(false)} />
    </div>
  );
}
