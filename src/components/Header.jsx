import React from 'react';

export default function Header({ title, onBack, streak = 0, xp = 0, showStats = true, onReset }) {
  return (
    <header className="header">
      <div className="header-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onBack ? (
            <button className="btn-icon-only" onClick={onBack} aria-label="Go back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          ) : null}
          <span className="header-title" onClick={onReset ? () => {
            if(window.confirm("क्या आप अपनी प्रोग्रेस रीसेट करना चाहते हैं?")) {
              onReset();
            }
          } : undefined} style={{ cursor: onReset ? 'pointer' : 'default' }}>
            {title || "BolEnglish"}
          </span>
        </div>

        {showStats && (
          <div className="header-stats">
            <div className="stat-item stat-item-streak" title="Daily Streak / दैनिक निरंतरता">
              <span>🔥</span>
              <span>{streak}</span>
            </div>
            <div className="stat-item stat-item-xp" title="Experience Points (XP) / अनुभव अंक">
              <span>💎</span>
              <span>{xp} XP</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

