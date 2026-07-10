import React, { useState } from 'react';

/**
 * Multiple-choice question. Shared between Assessment and Lesson practice.
 *
 * props:
 *  - options: string[]
 *  - correctAnswer: string
 *  - onResolved: (isCorrect: boolean) => void   // called once when answered
 *  - disabled: boolean
 *  - reveal: boolean                             // force reveal (used on re-render after answer)
 */
export default function McqQuestion({ options = [], correctAnswer, onResolved, disabled = false }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;

  const handlePick = (option) => {
    if (answered) return;
    setSelected(option);
    const isCorrect = option === correctAnswer;
    onResolved?.(isCorrect);
  };

  const classFor = (option) => {
    if (!answered) return 'option-btn';
    if (option === correctAnswer) return 'option-btn correct';
    if (option === selected) return 'option-btn incorrect';
    return 'option-btn';
  };

  return (
    <div className="selector-list">
      {options.map((option, idx) => (
        <button
          key={idx}
          type="button"
          className={classFor(option)}
          onClick={() => handlePick(option)}
          disabled={answered || disabled}
        >
          <span>{option}</span>
          {answered && option === correctAnswer && <span className="check">✓</span>}
          {answered && option === selected && option !== correctAnswer && <span className="check">✗</span>}
        </button>
      ))}
    </div>
  );
}
