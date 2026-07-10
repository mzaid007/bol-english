import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import SyncSheet from '../components/SyncSheet';

const AVATARS = ['🧑‍🎓', '👩‍💻', '👨‍💼', '🚀', '🌟', '🐼', '🦁', '🦊'];

const GOALS = [
  { id: 'speaking', title: 'आम बोलचाल (Daily Conversation)', sub: 'मित्रों और परिवार के साथ बात करने के लिए', icon: '💬' },
  { id: 'career', title: 'नौकरी और व्यवसाय (Career & Job)', sub: 'इंटरव्यू और ऑफिस में संवाद करने के लिए', icon: '💼' },
  { id: 'travel', title: 'यात्रा और घूमना (Travel)', sub: 'विदेश या अन्य राज्यों में यात्रा करने के लिए', icon: '✈️' },
  { id: 'education', title: 'शिक्षा और परीक्षा (Education)', sub: 'परीक्षाओं और पठन-पाठन को बेहतर बनाने के लिए', icon: '📚' },
];

export default function OnboardingRoute() {
  const { profile, updateProfile, isConnecting } = useApp();
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
      {/* Brand hero */}
      <div className="center" style={{ margin: '32px 0 24px' }}>
        <div className="app-header-brand" style={{ justifyContent: 'center', fontSize: 32, marginBottom: 8 }}>
          <span className="brand-mark" style={{ width: 44, height: 44, fontSize: 22 }}>B</span>
          <span>BolEnglish</span>
        </div>
        <p className="hindi-text" style={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 500 }}>
          हिन्दी से अंग्रेज़ी सीखें — बिल्कुल मुफ़्त!
        </p>
        <p className="text-xs muted mt-4">Learn English from Hindi — 100% Free, Forever.</p>
      </div>

      {/* Returning users: email restore */}
      <div className="mb-16">
        {profile.email ? (
          <div className="card center" style={{ padding: 16 }}>
            <span className="bold text-sm">✅ लॉगिन है (Signed In)</span>
            <span className="text-xs secondary mt-4">
              ईमेल: <strong>{profile.email}</strong>
            </span>
            <Button variant="ghost" size="sm" className="btn-auto mt-8"
              onClick={() => navigate('/dashboard')}>
              डैशबोर्ड पर जाएं →
            </Button>
          </div>
        ) : (
          <div className="card">
            <p className="bold text-sm mb-4">वापस आने वाले उपयोगकर्ता (Returning Users)</p>
            <p className="hindi-text text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>
              क्या आपने पहले BolEnglish इस्तेमाल किया है? अपना वही ईमेल दर्ज करें — हम आपकी पिछली प्रगति, XP और पाठ तुरंत लोड कर देंगे।
            </p>
            <Button variant="secondary" className="btn-block" onClick={() => setSyncOpen(true)}>
              🔄 पुरानी प्रगति लाएं (Restore Progress)
            </Button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="row mb-16" style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>
        <div className="grow" style={{ height: 1, background: 'var(--border)' }} />
        <span style={{ padding: '0 12px' }}>या (OR) नया प्रोफ़ाइल बनाएं</span>
        <div className="grow" style={{ height: 1, background: 'var(--border)' }} />
      </div>

      {/* New profile form */}
      <form onSubmit={start} className="page">
        <div className="form-group">
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

        <div className="form-group">
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

        <div className="form-group">
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

        <Button type="submit" className="mt-12" disabled={!name.trim() || !goal}>
          आगे बढ़ें (Let's Go) →
        </Button>
      </form>

      <SyncSheet open={syncOpen} onClose={() => setSyncOpen(false)} />
    </div>
  );
}
