import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatChip from '../ui/StatChip';
import SyncSheet from '../SyncSheet';

/**
 * Sticky top header with brand, streak/XP, and Cloud Sync button.
 */
export default function AppHeader() {
  const { profile, progress } = useApp();
  const [syncOpen, setSyncOpen] = useState(false);

  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/dashboard" className="app-header-brand" aria-label="BolEnglish होम">
            <span className="brand-mark" aria-hidden="true">B</span>
            <span>BolEnglish</span>
          </Link>
          <div className="app-header-stats row gap-8 items-center">
            <StatChip icon="🔥" title="Daily streak">{progress.streak || 0}</StatChip>
            <StatChip icon="💎" title="Total XP">{progress.xp || 0}</StatChip>
            
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSyncOpen(true)}
              title="Cloud Sync & Session"
              aria-label="Cloud Sync & Session"
              style={{ padding: '6px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5 }}
            >
              <span>☁️</span>
              <span className="hide-mobile">{profile.email ? 'Synced' : 'Sync'}</span>
            </button>
          </div>
        </div>
      </header>

      <SyncSheet open={syncOpen} onClose={() => setSyncOpen(false)} />
    </>
  );
}
