import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { useApp } from '../context/AppContext';

/**
 * Email-connect sheet. Replaces the inline login modal.
 * On success it routes the user to the right screen (assessment vs dashboard).
 */
export default function SyncSheet({ open, onClose, onSuccess }) {
  const { connectEmail, isConnecting, profile } = useApp();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (open) setEmail('');
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || isConnecting) return;
    const result = await connectEmail(email, profile.name);
    if (result) {
      onClose?.();
      // Route to wherever the merged profile says they should be.
      const dest = result.profile.assessmentCompleted ? '/dashboard' : '/assessment';
      if (onSuccess) onSuccess(result);
      else navigate(dest);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="प्रगति सिंक करें (Cloud Sync)"
    >
      <p className="hindi-text text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>
        अपनी प्रगति सुरक्षित रखें! यहाँ अपना ईमेल दर्ज करने से आपका सारा डेटा क्लाउड में सेव हो जाएगा।
        इससे आपकी प्रोग्रेस कभी डिलीट नहीं होगी और आप किसी भी फोन पर पढ़ाई जारी रख सकेंगे।
      </p>
      <p className="text-xs muted mt-8" style={{ fontStyle: 'italic', lineHeight: 1.5 }}>
        Secure your progress! Your email backs up your learning history so you never lose it and can
        continue on any device.
      </p>

      <form onSubmit={submit} className="mt-16">
        <div className="form-group">
          <input
            type="email"
            className="form-input"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isConnecting}
            autoFocus
            aria-label="ईमेल (Email)"
          />
        </div>
        <div className="row gap-10 mt-12">
          <Button variant="secondary" onClick={onClose} disabled={isConnecting}>
            बंद करें (Close)
          </Button>
          <Button type="submit" disabled={isConnecting || !email.trim()}>
            {isConnecting ? 'सिंक हो रहा है...' : 'कनेक्ट करें (Connect)'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
