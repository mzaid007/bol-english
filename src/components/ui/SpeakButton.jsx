import React, { useState } from 'react';
import { speakEnglish } from '../../services/speech';

/**
 * Reusable icon button to read any English phrase aloud.
 * Supports both normal speed (🔊) and slow speed (🐢) playback with dynamic accents.
 */
export default function SpeakButton({ text, accent = "US", className = '', showSlow = true, ...props }) {
  const [speakingNormal, setSpeakingNormal] = useState(false);
  const [speakingSlow, setSpeakingSlow] = useState(false);

  const handleSpeakNormal = async (e) => {
    e.stopPropagation();
    if (speakingNormal || speakingSlow || !text) return;
    setSpeakingNormal(true);
    await speakEnglish(text, 0.85, accent);
    setSpeakingNormal(false);
  };

  const handleSpeakSlow = async (e) => {
    e.stopPropagation();
    if (speakingNormal || speakingSlow || !text) return;
    setSpeakingSlow(true);
    await speakEnglish(text, 0.60, accent);
    setSpeakingSlow(false);
  };

  return (
    <span className="row gap-4 items-center" style={{ display: 'inline-flex' }}>
      <button
        type="button"
        className={`btn-icon-only speak-btn-inline ${speakingNormal ? 'speaking' : ''} ${className}`}
        onClick={handleSpeakNormal}
        disabled={speakingNormal || speakingSlow}
        title="सामान्य गति (Normal Speed)"
        aria-label={`Pronounce normal speed: ${text}`}
        {...props}
      >
        🔊
      </button>
      {showSlow && (
        <button
          type="button"
          className={`btn-icon-only speak-btn-inline ${speakingSlow ? 'speaking' : ''} ${className}`}
          onClick={handleSpeakSlow}
          disabled={speakingNormal || speakingSlow}
          title="धीमी गति (Slow Speed)"
          aria-label={`Pronounce slow speed: ${text}`}
          {...props}
        >
          🐢
        </button>
      )}
    </span>
  );
}
