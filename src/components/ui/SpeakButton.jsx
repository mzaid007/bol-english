import React, { useState } from 'react';
import { speakEnglish } from '../../services/speech';

/**
 * Reusable icon button to read any English phrase aloud.
 * Helps Hindi medium students instantly hear correct pronunciation.
 */
export default function SpeakButton({ text, className = '', ...props }) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = async (e) => {
    e.stopPropagation();
    if (speaking || !text) return;
    setSpeaking(true);
    await speakEnglish(text, 0.85);
    setSpeaking(false);
  };

  return (
    <button
      type="button"
      className={`btn-icon-only speak-btn-inline ${speaking ? 'speaking' : ''} ${className}`}
      onClick={handleSpeak}
      disabled={speaking}
      aria-label={`Pronounce: ${text}`}
      {...props}
    >
      🔊
    </button>
  );
}
