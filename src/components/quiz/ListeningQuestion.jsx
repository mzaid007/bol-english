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
 *  - speak: (text, rate) => Promise   from useSpeech()
 *  - isSpeaking: boolean
 */
export default function ListeningQuestion({
  audioText,
  options = [],
  correctAnswer,
  onResolved,
  speak,
  isSpeaking,
}) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;

  const play = () => { if (!isSpeaking) speak?.(audioText, 0.85); };

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
      <div className="row" style={{ justifyContent: 'center', margin: '8px 0 20px' }}>
        <button
          type="button"
          className={`audio-pulse-btn ${isSpeaking ? 'playing' : ''}`}
          onClick={play}
          disabled={isSpeaking}
          aria-label="वाक्य सुनें (Play audio)"
        >
          🔊
        </button>
      </div>
      <p className="center text-xs muted mb-16">ऊपर बटन दबाकर वाक्य सुनें</p>

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
