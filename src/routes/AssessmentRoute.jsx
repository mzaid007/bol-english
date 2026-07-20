import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSESSMENT_QUESTIONS } from '../data/curriculum';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import QuestionBody from '../components/quiz/QuestionBody';
import SpeakButton from '../components/ui/SpeakButton';

const DIFFICULTY_LABEL = {
  beginner: 'बुनियादी (Beginner)',
  intermediate: 'मध्यम (Intermediate)',
  advanced: 'उच्च (Advanced)',
};

const hasEnglishText = (text) => text && /[a-zA-Z]/.test(text);

export default function AssessmentRoute() {
  const navigate = useNavigate();
  const { finishAssessment, trackAnswer } = useApp();
  const speech = useSpeech();

  const [index, setIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAccent, setSelectedAccent] = useState('IN'); // 'IN' | 'US' | 'UK'

  const question = ASSESSMENT_QUESTIONS[index];
  const total = ASSESSMENT_QUESTIONS.length;

  // Reset interaction state when moving to a new question.
  useEffect(() => {
    setIsAnswered(false);
    setIsCorrect(false);
    speech.resetSpeech();
    // Auto-play listening questions once.
    if (question?.type === 'listening') {
      const t = setTimeout(() => speech.speak(question.audioText, 0.85, selectedAccent), 250);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, selectedAccent]);

  const handleResolved = (correct) => {
    if (isAnswered) return; // guard against double resolve
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore((s) => s + 1);
    try {
      trackAnswer(correct);
    } catch (e) {
      console.warn("AssessmentRoute: Failed to track answer accuracy", e);
    }
  };

  const next = () => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
    } else {
      // Compute placement level.
      let level = 'beginner';
      if (score >= 8) level = 'advanced';
      else if (score >= 5) level = 'intermediate';
      finishAssessment(score, level);
      navigate('/dashboard');
    }
  };

  const progressPercent = ((index + 1) / total) * 100;

  const ansStr = question
    ? Array.isArray(question.correctAnswer)
      ? question.correctAnswer.join(' ')
      : question.correctAnswer
    : '';

  return (
    <div className="app-container no-nav page">
      {/* Header row */}
      <div className="row-between mb-12">
        <span className="bold text-sm">प्रारंभिक मूल्यांकन (Analyzer)</span>
        <span className="text-xs muted">प्रश्न {index + 1} / {total}</span>
      </div>
      <ProgressBar value={progressPercent} className="mb-16" />

      {/* Tri-Accent Selector Bar */}
      <div className="row gap-8 mb-16 justify-center" style={{ background: 'var(--surface)', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        <span className="text-xs muted bold" style={{ fontSize: 11 }}>उच्चारण (Accent):</span>
        {['IN', 'US', 'UK'].map((acc) => (
          <button
            key={acc}
            type="button"
            onClick={() => setSelectedAccent(acc)}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              borderRadius: 'var(--radius-sm)',
              background: selectedAccent === acc ? 'var(--accent)' : 'var(--surface-3)',
              color: selectedAccent === acc ? 'white' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)'
            }}
          >
            {acc === 'IN' && '🇮🇳 India'}
            {acc === 'US' && '🇺🇸 US'}
            {acc === 'UK' && '🇬🇧 UK'}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="mb-20">
        {question.difficulty && (
          <span className="badge badge-accent mb-12">{DIFFICULTY_LABEL[question.difficulty]}</span>
        )}
        <h2 className="hindi-text" style={{ fontSize: 18, marginBottom: 6, fontWeight: 600 }}>
          {question.questionHindi}
        </h2>
        {question.questionEnglish && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            {question.questionEnglish}
          </p>
        )}
      </div>

      {/* Interactive Body */}
      <div className="mb-24">
        <QuestionBody key={question.id} question={question} speech={speech} onResolved={handleResolved} accent={selectedAccent} />
      </div>

      {/* Feedback + next */}
      {isAnswered && (
        <div className="mt-20">
          <div className={`quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="feedback-title">
              {isCorrect ? '🎉 सही उत्तर! (Correct)' : '💡 कोई बात नहीं (Keep practicing)'}
            </div>
            <p className="feedback-explanation hindi-text">{question.explanation}</p>
            {hasEnglishText(ansStr) && (
              <div className="mt-8 row gap-6 text-xs bold secondary items-center" style={{ flexWrap: 'wrap' }}>
                <span>सही उत्तर: <strong>{ansStr}</strong></span>
                <SpeakButton text={ansStr} accent={selectedAccent} />
              </div>
            )}
          </div>
          <Button className="mt-12" onClick={next}>
            {index < total - 1 ? 'अगला प्रश्न (Next) →' : 'नतीजा देखें (Show Results) →'}
          </Button>
        </div>
      )}
    </div>
  );
}
