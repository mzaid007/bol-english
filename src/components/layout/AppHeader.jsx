import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatChip from '../ui/StatChip';

/**
 * Sticky top header. Shows brand + streak/XP + Sign Out button.
 * Hidden on onboarding (controlled by the layout that renders it).
 */
export default function AppHeader() {
  const { profile, progress, signOut } = useApp();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/onboarding');
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/dashboard" className="app-header-brand" aria-label="BolEnglish होम">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>BolEnglish</span>
        </Link>
        <div className="app-header-stats row gap-8 items-center">
          <StatChip icon="🔥" title="Daily streak">{progress.streak || 0}</StatChip>
          <StatChip icon="💎" title="Total XP">{progress.xp || 0}</StatChip>
          {profile.onboarded && (
            <button
              type="button"
              className="btn-icon-only"
              onClick={handleSignOut}
              title="साइन आउट करें (Sign Out)"
              aria-label="Sign Out"
              style={{ fontSize: 14, padding: '4px 8px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            >
              🚪
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
