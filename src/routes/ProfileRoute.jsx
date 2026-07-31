import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import SyncSheet from '../components/SyncSheet';

const GOAL_LABELS = {
  speaking: '🗣️ आम बोलचाल (Daily Conversation)',
  career: '💼 नौकरी और व्यवसाय (Career & Job)',
  travel: '✈️ यात्रा और घूमना (Travel)',
  education: '📚 शिक्षा और परीक्षा (Education)',
};

const AVATARS = ['🧑‍🎓', '👩‍💻', '👨‍💼', '🚀', '🌟', '🐼', '🦁', '🦊'];

export default function ProfileRoute() {
  const navigate = useNavigate();
  const { profile, progress, updateProfile, disconnectEmail, resetAll } = useApp();

  const [syncOpen, setSyncOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [editName, setEditName] = useState(profile.name || 'Learner');
  const [editAvatar, setEditAvatar] = useState(profile.avatar || '🧑‍🎓');

  const total = progress.totalQuestionsAnswered || 0;
  const correct = progress.correctAnswers || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const saveEditProfile = (e) => {
    e.preventDefault();
    updateProfile({ name: editName.trim() || 'Learner', avatar: editAvatar });
    setEditOpen(false);
  };

  return (
    <div className="app-container page" style={{ maxWidth: 640 }}>
      {/* 1. Hero Learner Identity Card */}
      <Card className="mb-20 center p-24" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Glow Accent Ambient Blob */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="user-avatar mb-12"
          style={{
            width: 76,
            height: 76,
            fontSize: 36,
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '2px solid rgba(168, 85, 247, 0.4)',
            boxShadow: '0 0 24px rgba(168, 85, 247, 0.3)',
          }}
        >
          {profile.avatar || '🧑‍🎓'}
        </div>

        <h2 className="bold text-xl mb-4" style={{ color: '#ffffff' }}>
          {profile.name || 'Learner'}
        </h2>

        {/* Goal Badge & Sync Status Pill */}
        <div className="row gap-8 justify-center items-center flex-wrap mb-16">
          <span
            style={{
              padding: '4px 12px',
              fontSize: 11.5,
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-secondary)',
            }}
          >
            {GOAL_LABELS[profile.goal] || '🗣️ आम बोलचाल'}
          </span>

          <span
            style={{
              padding: '4px 12px',
              fontSize: 11.5,
              borderRadius: 'var(--radius-pill)',
              background: profile.email ? 'rgba(56, 189, 248, 0.12)' : 'rgba(234, 179, 8, 0.12)',
              border: profile.email ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
              color: profile.email ? '#38bdf8' : '#facc15',
              fontWeight: 600,
            }}
          >
            {profile.email ? `🟢 Synced` : `☁️ Local Storage`}
          </span>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm btn-auto"
          onClick={() => {
            setEditName(profile.name || 'Learner');
            setEditAvatar(profile.avatar || '🧑‍🎓');
            setEditOpen(true);
          }}
          style={{ fontSize: 12.5, padding: '6px 16px', borderRadius: 'var(--radius-pill)' }}
        >
          ✏️ प्रोफ़ाइल संपादित करें (Edit Profile)
        </button>
      </Card>

      {/* 2. 4-Grid Gamified Achievements Cards */}
      <div className="mb-20">
        <p className="bold text-sm mb-10" style={{ color: 'var(--text-primary)' }}>
          🏆 आपकी उपलब्धियां (Learning Achievements)
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
          }}
        >
          {/* Streak Card */}
          <Card className="p-16 center">
            <div style={{ fontSize: 24, marginBottom: 4 }}>🔥</div>
            <div className="bold text-lg" style={{ color: '#f97316' }}>
              {progress.streak || 0} Days
            </div>
            <div className="text-xs muted" style={{ fontSize: 11 }}>
              Daily Streak
            </div>
          </Card>

          {/* XP Card */}
          <Card className="p-16 center">
            <div style={{ fontSize: 24, marginBottom: 4 }}>💎</div>
            <div className="bold text-lg" style={{ color: '#a855f7' }}>
              {progress.xp || 0} XP
            </div>
            <div className="text-xs muted" style={{ fontSize: 11 }}>
              Total Points
            </div>
          </Card>

          {/* Accuracy Card */}
          <Card className="p-16 center">
            <div style={{ fontSize: 24, marginBottom: 4 }}>🎯</div>
            <div className="bold text-lg" style={{ color: '#22c55e' }}>
              {accuracy}%
            </div>
            <div className="text-xs muted" style={{ fontSize: 11 }}>
              Accuracy ({correct}/{total})
            </div>
          </Card>

          {/* Total Questions Card */}
          <Card className="p-16 center">
            <div style={{ fontSize: 24, marginBottom: 4 }}>📚</div>
            <div className="bold text-lg" style={{ color: '#38bdf8' }}>
              {total}
            </div>
            <div className="text-xs muted" style={{ fontSize: 11 }}>
              Questions Solved
            </div>
          </Card>
        </div>
      </div>

      {/* 3. Unified Cloud Backup Card (Single Clean Card) */}
      <Card className="mb-20 p-20">
        <div className="row gap-12 items-center mb-12">
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            ☁️
          </div>
          <div>
            <h3 className="bold text-sm" style={{ color: '#ffffff' }}>
              क्लाउड सिंक & बैकअप (Cloud Backup)
            </h3>
            <p className="hindi-text text-xs muted" style={{ fontSize: 12 }}>
              अपनी प्रोग्रेस सुरक्षित रखें और किसी भी नए फोन या कंप्यूटर पर पढ़ाई जारी रखें।
            </p>
          </div>
        </div>

        {profile.email ? (
          <div
            className="p-14 mb-12"
            style={{
              background: 'rgba(168, 85, 247, 0.08)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div className="row-between items-center">
              <div>
                <p className="text-xs muted mb-2">Connected Account:</p>
                <p className="bold text-sm" style={{ color: '#c084fc' }}>
                  ✉️ {profile.email}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={disconnectEmail}
                style={{ fontSize: 11.5, color: 'var(--error)' }}
              >
                🔌 Disconnect
              </button>
            </div>
          </div>
        ) : (
          <Button
            className="btn-primary btn-block"
            onClick={() => setSyncOpen(true)}
          >
            ☁️ ईमेल से सिंक करें (Sync Cloud Progress) →
          </Button>
        )}
      </Card>

      {/* 4. Danger Zone Card */}
      <Card className="mb-28 p-20">
        <p className="bold text-sm mb-4" style={{ color: 'var(--error)' }}>
          ⚠️ प्रगति रीसेट करें (Reset All Progress)
        </p>
        <p className="hindi-text text-xs muted mb-12" style={{ lineHeight: 1.5 }}>
          यदि आप शुरुआत से दोबारा पढ़ाई शुरू करना चाहते हैं, तो अपनी स्थानीय प्रगति (XP और पूरे किए गए पाठ) रीसेट कर सकते हैं।
        </p>
        <Button
          variant="secondary"
          style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--error)' }}
          onClick={() => setResetOpen(true)}
        >
          🔄 ऑल डेटा रीसेट करें (Reset Progress)
        </Button>
      </Card>

      {/* Sync Sheet Modal */}
      <SyncSheet open={syncOpen} onClose={() => setSyncOpen(false)} />

      {/* Reset Progress Confirmation Modal */}
      <Modal
        open={resetOpen}
        title="प्रगति रीसेट करें? (Reset Progress)"
        onClose={() => setResetOpen(false)}
        confirm={{
          label: 'हाँ, रीसेट करें (Yes, Reset)',
          cancelLabel: 'रद्द करें (Cancel)',
          variant: 'error',
          onConfirm: () => {
            resetAll();
            setResetOpen(false);
            navigate('/');
          },
        }}
      >
        <p className="hindi-text text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          क्या आप वाकई अपनी सारी प्रगति रीसेट करना चाहते हैं? आपकी XP, वर्तमान स्तर और पूरे किए गए पाठ डिलीट हो जाएंगे। यह क्रिया वापस नहीं ली जा सकती।
        </p>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        open={editOpen}
        title="प्रोफ़ाइल संपादित करें (Edit Profile)"
        onClose={() => setEditOpen(false)}
      >
        <form onSubmit={saveEditProfile}>
          <div className="form-group mb-16">
            <label className="form-label" htmlFor="editName">आपका नाम (Your Name)</label>
            <input
              id="editName"
              type="text"
              className="form-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="अमित कुमार..."
              required
            />
          </div>

          <div className="form-group mb-20">
            <span className="form-label">अवतार चुनें (Select Avatar)</span>
            <div className="avatar-grid">
              {AVATARS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  className={`avatar-option ${editAvatar === emoji ? 'selected' : ''}`}
                  onClick={() => setEditAvatar(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="row gap-10">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              रद्द करें (Cancel)
            </Button>
            <Button type="submit">
              सेव करें (Save Profile)
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
