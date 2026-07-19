import React, { useState } from 'react';
import Button from '../ui/Button';

/**
 * Speech-practice question. Uses the shared useSpeech() instance.
 * Resolves with a pronunciation pass/fail (>= 60% = pass) OR a skip.
 *
 * props:
 *  - speechText: string
 *  - phoneticHindi: string (optional pronunciation hint)
 *  - onResolved: (isCorrect, result) => void
 *  - speech: object from useSpeech()
 *  - accent: string ('IN' | 'US' | 'UK')
 */
export default function SpeechQuestion({ speechText, phoneticHindi, onResolved, speech, accent = "US" }) {
  const {
    sttSupported,
    isListening,
    speechResult,
    spokenText,
    speak,
    isSpeaking,
    startListening,
  } = speech;

  const [resolved, setResolved] = useState(false);

  const handleMic = () => {
    if (resolved || isListening) return;
    startListening?.(speechText);
  };

  // When a recognition result lands, resolve once.
  React.useEffect(() => {
    if (resolved || !speechResult) return;
    const passed = speechResult.score >= 60;
    setResolved(true);
    onResolved?.(passed, speechResult);
  }, [speechResult, resolved, onResolved]);

  const skip = () => {
    if (resolved) return;
    setResolved(true);
    onResolved?.(false, {
      score: 0,
      words: speechText.split(' ').map((w) => ({ word: w, isCorrect: false })),
    });
  };

  return (
    <div className="stack center gap-12">
      <div className="speech-phrase-card" style={{ width: '100%' }}>
        <div style={{ fontSize: '21px', fontWeight: 700, color: 'var(--accent)', marginBottom: 6 }}>
          {speechText}
        </div>
        
        {/* Phonetic Pronunciation Guide */}
        {phoneticHindi && (
          <div 
            className="text-xs secondary mb-12 hindi-text" 
            style={{ 
              fontSize: 13, 
              background: 'var(--surface-2)', 
              padding: '6px 12px', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border)',
              display: 'inline-block'
            }}
          >
            उच्चारण (Pronunciation): <strong>"{phoneticHindi}"</strong>
          </div>
        )}

        <div className="row gap-8 justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="btn-auto"
            onClick={() => speak?.(speechText, 0.85, accent)}
            disabled={isSpeaking}
          >
            {isSpeaking ? 'बोल रहा है...' : '🔊 सुनें'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="btn-auto"
            onClick={() => speak?.(speechText, 0.60, accent)}
            disabled={isSpeaking}
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}
          >
            🐢 धीमे सुनें
          </Button>
        </div>
      </div>

      {sttSupported ? (
        <>
          <button
            type="button"
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={handleMic}
            disabled={resolved}
            aria-label="बोलें (Record)"
          >
            🎤
          </button>
          <span className={`speech-status ${isListening ? 'listening' : ''}`}>
            {isListening ? 'बोलिए... हम सुन रहे हैं' : 'माइक छुएँ और बोलें'}
          </span>
        </>
      ) : (
        <p className="text-sm" style={{ color: 'var(--danger)' }}>
          ⚠️ आपके ब्राउज़र पर स्पीच-टू-टेक्स्ट उपलब्ध नहीं है। नीचे से छोड़ें दबाएँ।
        </p>
      )}

      {speechResult && (
        <div className="center full-w">
          <p className="text-sm secondary mb-4">आपने बोला (Spoken):</p>
          <p className="bold mb-8">“{spokenText}”</p>
          <p className="bold" style={{ color: speechResult.score >= 60 ? 'var(--success)' : 'var(--warning)' }}>
            शुद्धता: {speechResult.score}%
          </p>
          <div className="speech-words">
            {speechResult.words.map((item, idx) => (
              <span
                key={idx}
                className={`feedback-word ${item.isCorrect ? 'correct' : 'incorrect'}`}
              >
                {item.word}
              </span>
            ))}
          </div>
        </div>
      )}

      {!resolved && (
        <Button variant="ghost" size="sm" className="btn-auto mt-8" onClick={skip}>
          बिना बोले आगे बढ़ें (Skip)
        </Button>
      )}
    </div>
  );
}
