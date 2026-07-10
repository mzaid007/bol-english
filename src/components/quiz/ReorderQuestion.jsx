import React, { useState } from 'react';
import Button from '../ui/Button';

/**
 * Reorder/tap-to-build-a-sentence question.
 *
 * props:
 *  - words: string[]                 scrambled pool
 *  - correctAnswer: string[]         the expected sequence
 *  - onResolved: (isCorrect) => void
 */
export default function ReorderQuestion({ words = [], correctAnswer = [], onResolved }) {
  const [picked, setPicked] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const useCountOf = (word) => picked.filter((w) => w === word).length;
  const totalOf = (word) => words.filter((w) => w === word).length;

  const addWord = (word) => {
    if (answered) return;
    if (useCountOf(word) >= totalOf(word)) return;
    setPicked((p) => [...p, word]);
  };

  const removeAt = (idx) => {
    if (answered) return;
    setPicked((p) => p.filter((_, i) => i !== idx));
  };

  const check = () => {
    if (answered || picked.length === 0) return;
    const matched =
      picked.length === correctAnswer.length &&
      picked.every((w, i) => w === correctAnswer[i]);
    setIsCorrect(matched);
    setAnswered(true);
    onResolved?.(matched);
  };

  return (
    <div>
      <div className="word-bin" aria-label="Sentence builder">
        {picked.length === 0 ? (
          <span className="text-xs muted hindi-text">
            नीचे दिए शब्दों को छूकर वाक्य बनाएं...
          </span>
        ) : (
          picked.map((word, idx) => (
            <span
              key={idx}
              className="word-chip"
              onClick={() => removeAt(idx)}
              role="button"
              tabIndex={answered ? -1 : 0}
            >
              {word}
            </span>
          ))
        )}
      </div>

      <div className="scrambled-words">
        {words.map((word, idx) => {
          const used = useCountOf(word) >= totalOf(word);
          return (
            <button
              key={idx}
              type="button"
              className={`word-chip ${used ? 'used' : ''}`}
              onClick={() => addWord(word)}
              disabled={used || answered}
            >
              {word}
            </button>
          );
        })}
      </div>

      {!answered && (
        <Button className="mt-12" onClick={check} disabled={picked.length === 0}>
          उत्तर जाँचे (Check)
        </Button>
      )}
    </div>
  );
}
