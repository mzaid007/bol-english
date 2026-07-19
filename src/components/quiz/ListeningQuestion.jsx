import React, { useState } from 'react';

/**
 * Listening comprehension. Plays TTS audio, then shows MCQ options.
 * Auto-plays once on mount (the user came here explicitly to listen).
 *
 * props:
 *  - audioText: string
 *  - options: string[]
 *  - correctAnswer: string
 *  - onResolved: (isCorrect) => void
 *  - speak: (text, rate, accent) => Promise   from useSpeech()
 *  - isSpeaking: boolean
 *  - accent: string ('IN' | 'US' | 'UK')
 */
export default function ListeningQuestion({
  audioText,
  options = [],
  correctAnswer,
  onResolved,
  speak,
  isSpeaking,
  accent = "US"
}) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;

  const play = () => { if (!isSpeaking) speak?.(audioText, 0.85, accent); };
  const playSlow = () => { if (!isSpeaking) speak?.(audioText, 0.60, accent); };

  const handlePick = (option) => {
    if (answered) return;
    setSelected(option);
    onResolved?.(option === correctAnswer);
  };

  const classFor = (option) => {
    if (!answered) return 'option-btn';
    if (option === correctAnswer) return 'option-btn correct';
    if (option === selected) return 'option-btn incorrect';
    return 'option-btn';
  };

  return (
    <div>
      <div className="row gap-16" style={{ justifyContent: 'center', margin: '8px 0 20px' }}>
        <button
          type="button"
          className={`audio-pulse-btn ${isSpeaking ? 'playing' : ''}`}
          onClick={play}
          disabled={isSpeaking}
          title="सामान्य गति (Normal Speed)"
          aria-label="वाक्य सुनें (Play audio)"
        >
          🔊
        </button>
        <button
          type="button"
          className={`audio-pulse-btn ${isSpeaking ? 'playing' : ''}`}
          onClick={playSlow}
          disabled={isSpeaking}
          style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}
          title="धीमी गति (Slow Speed)"
          aria-label="धीमे वाक्य सुनें (Play slow audio)"
        >
          🐢
        </button>
      </div>
      <p className="center text-xs muted mb-16">सामान्य गति (🔊) या धीमी गति (🐢) में वाक्य सुनें</p>

      <div className="selector-list">
        {options.map((option, idx) => (
          <button
            key={idx}
            type="button"
            className={classFor(option)}
            onClick={() => handlePick(option)}
            disabled={answered}
          >
            <span className="hindi-text">{option}</span>
            {answered && option === correctAnswer && <span className="check">✓</span>}
            {answered && option === selected && option !== correctAnswer && <span className="check">✗</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
