import React from 'react';

export default function ProgressBar({ value = 0, className = '', style }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={['progress', className].filter(Boolean).join(' ')} style={style}>
      <div className="progress-bar" style={{ width: `${pct}%` }} />
    </div>
  );
}
