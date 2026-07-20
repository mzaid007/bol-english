import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatChip from '../components/ui/StatChip';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import SyncSheet from '../components/SyncSheet';

const GOAL_LABELS = {
  speaking: '🗣️ आम बोलचाल (Daily Conversation)',
  career: '💼 नौकरी और व्यवसाय (Career & Job)',
  travel: '✈️ यात्रा और घूमना (Travel)',
  education: '📚 शिक्षा और परीक्षा (Education)',
};

export default function ProfileRoute() {
  const navigate = useNavigate();
  const { profile, progress, disconnectEmail, signOut, resetAll } = useApp();
  
  const [syncOpen, setSyncOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const total = progress.totalQuestionsAnswered || 0;
  const correct = progress.correctAnswers || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="app-container page">
      {/* Profile Details Header */}
      <Card className="mb-20 center">
        <div className="user-avatar mb-12" style={{ width: 68, height: 68, fontSize: 32, margin: '0 auto' }} aria-hidden="true">
          {profile.avatar || '🧑‍🎓'}
        </div>
        <h2 className="bold text-lg">{profile.name || 'शिक्षार्थी'}</h2>
        <p className="text-xs muted mt-4">
          लक्ष्य: {GOAL_LABELS[profile.goal] || 'सेट नहीं है'}
        </p>
      </Card>

      {/* Accuracy Stats Card */}
      <Card className="mb-20">
        <p className="bold text-sm mb-12">💯 अभ्यास शुद्धता (Practice Accuracy)</p>
        <div className="dashboard-stats">
          <StatChip icon="📊">{total} Total</StatChip>
          <StatChip icon="✅">{correct} Correct</StatChip>
          <StatChip icon="🎯">{accuracy}% Accuracy</StatChip>
        </div>
        <p className="text-xs muted mt-12" style={{ fontStyle: 'italic', lineHeight: 1.4 }}>
          प्रश्नों का सही उत्तर देकर अपनी अभ्यास शुद्धता प्रतिशत को बढ़ाएं!
        </p>
      </Card>

      {/* Cloud Sync Settings */}
      <Card className="mb-20">
        <p className="bold text-sm mb-4">🔄 क्लाउड सिंक (Cloud Backup)</p>
        {profile.email ? (
          <div>
            <p className="hindi-text text-xs secondary mb-12">
              प्रगति सुरक्षित है! आपका डेटा **{profile.email}** पर बैकअप हो रहा है।
            </p>
            <Button variant="secondary" className="btn-auto" onClick={disconnectEmail}>
              🔌 लॉगआउट (Disconnect Email)
            </Button>
          </div>
        ) : (
          <div>
            <p className="hindi-text text-xs secondary mb-12" style={{ lineHeight: 1.5 }}>
              आपका डेटा अभी केवल इस डिवाइस पर सुरक्षित है। ऑनलाइन बैकअप लेने और किसी अन्य डिवाइस पर प्रोग्रेस लोड करने के लिए ईमेल कनेक्ट करें।
            </p>
            <Button variant="primary" onClick={() => setSyncOpen(true)}>
              🔗 ईमेल कनेक्ट करें (Connect Email)
            </Button>
          </div>
        )}
      </Card>

      {/* Account Session & Danger Zone */}
      <Card className="mb-20">
        <p className="bold text-sm mb-4">🚪 अकाउंट सत्र (Account Session)</p>
        <p className="hindi-text text-xs secondary mb-12" style={{ lineHeight: 1.5 }}>
          यदि आप किसी दूसरे अकाउंट से लॉगिन करना चाहते हैं या सत्र समाप्त करना चाहते हैं:
        </p>
        <div className="row gap-8 flex-wrap">
          <Button
            variant="secondary"
            className="btn-auto"
            onClick={() => {
              signOut();
              navigate('/onboarding');
            }}
          >
            🚪 साइन आउट (Sign Out)
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="mb-20">
        <p className="bold text-sm mb-4" style={{ color: 'var(--error)' }}>⚠️ खतरनाक क्षेत्र (Danger Zone)</p>
        <p className="hindi-text text-xs secondary mb-12" style={{ lineHeight: 1.5 }}>
          यदि आप फिर से शुरू करना चाहते हैं, तो आप अपनी सारी स्थानीय प्रगति (XP, पूरे किए गए पाठ और विश्लेषण स्तर) को रीसेट कर सकते हैं।
        </p>
        <Button variant="secondary" style={{ borderColor: 'var(--error-border)', color: 'var(--error)' }} onClick={() => setResetOpen(true)}>
          🔄 प्रगति रीसेट करें (Reset All Progress)
        </Button>
      </Card>

      {/* Synching Modal */}
      <SyncSheet open={syncOpen} onClose={() => setSyncOpen(false)} />

      {/* Reset progress Confirmation modal */}
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
    </div>
  );
}
