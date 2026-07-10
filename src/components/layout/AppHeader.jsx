import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatChip from '../ui/StatChip';

/**
 * Sticky top header. Shows brand + streak/XP.
 * Hidden on onboarding (controlled by the layout that renders it).
 */
export default function AppHeader() {
  const { profile, progress } = useApp();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/dashboard" className="app-header-brand" aria-label="BolEnglish होम">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>BolEnglish</span>
        </Link>
        <div className="app-header-stats">
          <StatChip icon="🔥" title="Daily streak">{progress.streak || 0}</StatChip>
          <StatChip icon="💎" title="Total XP">{progress.xp || 0}</StatChip>
        </div>
      </div>
    </header>
  );
}
