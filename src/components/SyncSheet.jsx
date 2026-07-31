import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { useApp } from '../context/AppContext';

/**
 * CreativeGlu style Sync / Resume Session Modal.
 * Eliminates traditional sign in/sign out confusion with a single, intelligent Cloud Sync action.
 */
export default function SyncSheet({ open, onClose, onSuccess }) {
  const { connectEmail, disconnectEmail, isConnecting, profile } = useApp();
  const [email, setEmail] = useState(profile.email || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (open) setEmail(profile.email || '');
  }, [open, profile.email]);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || isConnecting) return;
    const result = await connectEmail(email, profile.name);
    if (result && result.success) {
      onClose?.();
      const dest = result.profile?.assessmentCompleted ? '/dashboard' : '/assessment';
      if (onSuccess) onSuccess(result);
      else navigate(dest);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
    >
      <div className="p-4">
        {/* Header Icon + Title */}
        <div className="row gap-12 items-center mb-16">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#38bdf8',
            }}
          >
            ☁️
          </div>
          <div>
            <h3 className="bold text-base" style={{ color: '#ffffff', lineHeight: 1.2 }}>
              Sync / Resume Cloud Progress
            </h3>
            <p className="text-xs muted" style={{ fontSize: 12.5 }}>
              Enable multi-device access with your email
            </p>
          </div>
        </div>

        {/* If already connected, show active status & option to disconnect */}
        {profile.email ? (
          <div className="mb-20">
            <div
              className="p-14 mb-14"
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <p className="text-xs muted mb-2">Connected Account:</p>
              <p className="bold text-sm" style={{ color: '#c084fc' }}>
                ✉️ {profile.email}
              </p>
            </div>
            <div className="row gap-10">
              <Button
                variant="secondary"
                className="btn-block"
                onClick={() => {
                  disconnectEmail();
                  setEmail('');
                }}
              >
                🔌 Disconnect Email
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="form-group mb-20">
              <label className="form-label" htmlFor="studentEmail" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Student Email Address
              </label>
              <input
                id="studentEmail"
                type="email"
                className="form-input"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isConnecting}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="btn-primary btn-block mb-16"
              disabled={isConnecting || !email.trim()}
            >
              {isConnecting ? 'Syncing with Cloud...' : '☁️ Sync & Resume Session →'}
            </Button>
          </form>
        )}

        {/* Footer Note */}
        <p
          className="center text-xs muted"
          style={{ fontSize: 11.5, lineHeight: 1.4, fontStyle: 'italic', opacity: 0.7 }}
        >
          Progress is automatically synchronized whenever you complete questions.
        </p>
      </div>
    </Modal>
  );
}
