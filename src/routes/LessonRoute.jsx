import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LESSONS } from '../data/curriculum';
import { useSpeech } from '../hooks/useSpeech';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import QuestionBody from '../components/quiz/QuestionBody';
import SpeakButton from '../components/ui/SpeakButton';

// Helper to check if string contains English text
const hasEnglishText = (str) => typeof str === 'string' && /[a-zA-Z]/.test(str);

export default function LessonRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeLesson, trackAnswer, profile } = useApp();
  const speech = useSpeech();

  // Selected pronunciation accent ('IN' | 'US' | 'UK')
  const [selectedAccent, setSelectedAccent] = useState('US');

  // Phases: 'learning' -> 'grammar' -> 'quiz' -> 'complete'
  const [phase, setPhase] = useState('learning');
  const [cardIndex, setCardIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);

  // Active Quiz State
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Find active lesson across levels
  const lesson = [
    ...(LESSONS.beginner || []),
    ...(LESSONS.intermediate || []),
    ...(LESSONS.advanced || []),
  ].find((l) => l.id === id);

  // Dynamic practice queue (supports AI question additions)
  const [practiceQueue, setPracticeQueue] = useState([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    if (lesson?.practice) {
      setPracticeQueue(lesson.practice);
    }
  }, [lesson]);

  useEffect(() => {
    // Warm up speech synthesis voices once on mount
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(u);
    }
  }, []);

  // Handle phase & index changes
  useEffect(() => {
    speech.resetSpeech();
    if (phase === 'quiz') {
      setIsAnswered(false);
      setIsCorrect(false);
      const quiz = practiceQueue?.[quizIndex];
      if (quiz?.type === 'listening') {
        const t = setTimeout(() => speech.speak(quiz.audioText, 0.85, selectedAccent), 250);
        return () => clearTimeout(t);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardIndex, quizIndex, phase]);

  if (!lesson) {
    return (
      <div className="app-container page center py-40">
        <p className="bold">पाठ नहीं मिला (Lesson not found)</p>
        <Button className="mt-16 btn-auto" onClick={() => navigate('/dashboard')}>
          डैशबोर्ड पर वापस जाएं
        </Button>
      </div>
    );
  }

  // Phase navigation handlers
  const prevCard = () => {
    if (cardIndex > 0) setCardIndex((c) => c - 1);
  };

  const nextCard = () => {
    if (cardIndex < lesson.cards.length - 1) {
      setCardIndex((c) => c + 1);
    } else {
      setPhase('grammar');
    }
  };

  const handleQuizResolved = (correct) => {
    setIsAnswered(true);
    setIsCorrect(correct);
    trackAnswer(correct);
  };

  const nextQuiz = () => {
    if (quizIndex < practiceQueue.length - 1) {
      setQuizIndex((q) => q + 1);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      completeLesson(lesson.id, lesson.xpReward);
      setPhase('complete');
    }
  };

  // AI Question Generator Handler
  const handleGenerateAIQuestion = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: lesson.titleEnglish,
          level: profile.level || 'beginner',
          goal: profile.goal || 'speaking',
          type: 'mcq',
        }),
      });
      const data = await res.json();
      if (data && data.question) {
        const newQueue = [...practiceQueue, data.question];
        setPracticeQueue(newQueue);
        setQuizIndex(newQueue.length - 1);
        setPhase('quiz');
        setIsAnswered(false);
        setIsCorrect(false);
      }
    } catch (err) {
      console.error('AI question generation error:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Render helpers
  const renderLearning = () => {
    const card = lesson.cards[cardIndex];
    if (!card) return null;
    const pct = ((cardIndex + 1) / lesson.cards.length) * 100;

    const pronun = typeof card.pronunciation === 'object'
      ? card.pronunciation[selectedAccent]
      : card.pronunciation;

    return (
      <div className="deck-view page grow">
        <div className="row-between mb-8">
          <span className="bold text-xs secondary">पार्ट 1: शब्द-ज्ञान (Vocabulary Cards)</span>
          <span className="text-xs muted">{cardIndex + 1} / {lesson.cards.length}</span>
        </div>
        <ProgressBar value={pct} className="mb-24" />

        <div className="card-deck grow">
          <Card className={`flashcard ${speech.isListening ? 'speaking-state' : ''}`}>
            <div className="flashcard-header row-between">
              <span className="text-xs bold secondary">CARD {cardIndex + 1}</span>
              <div className="row gap-8">
                <button
                  type="button"
                  className="btn-icon-only"
                  onClick={() => speech.speak(card.english, 0.9, selectedAccent)}
                  disabled={speech.isSpeaking}
                  style={{ fontSize: 16 }}
                  title="सामान्य गति (Normal Speed)"
                  aria-label="Play normal speed audio"
                >
                  🔊
                </button>
                <button
                  type="button"
                  className="btn-icon-only"
                  onClick={() => speech.speak(card.english, 0.6, selectedAccent)}
                  disabled={speech.isSpeaking}
                  style={{ fontSize: 16 }}
                  title="धीमी गति (Slow Speed)"
                  aria-label="Play slow speed audio"
                >
                  🐢
                </button>
              </div>
            </div>
            
            <div className="flashcard-body">
              {/* Tri-Accent Selector */}
              <div className="row gap-8 mb-16 justify-center" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: 12 }}>
                {['IN', 'US', 'UK'].map((acc) => (
                  <button
                    key={acc}
                    type="button"
                    onClick={() => setSelectedAccent(acc)}
                    style={{
                      padding: '5px 12px',
                      fontSize: 11.5,
                      borderRadius: 'var(--radius-pill)',
                      background: selectedAccent === acc ? 'var(--accent-gradient)' : 'var(--surface-2)',
                      color: selectedAccent === acc ? '#ffffff' : 'var(--text-secondary)',
                      border: selectedAccent === acc ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      boxShadow: selectedAccent === acc ? '0 0 16px rgba(168, 85, 247, 0.4)' : 'none',
                      transition: 'all var(--dur-fast) var(--ease)'
                    }}
                  >
                    {acc === 'IN' && '🇮🇳 India'}
                    {acc === 'US' && '🇺🇸 US'}
                    {acc === 'UK' && '🇬🇧 UK'}
                  </button>
                ))}
              </div>

              <div className="flashcard-en">{card.english}</div>
              
              {pronun && (
                <div className="flashcard-pronun">
                  🗣️ उच्चारण: {pronun}
                </div>
              )}
              
              <div className="flashcard-hi hindi-text">{card.hindi}</div>
              {card.usageHindi && (
                <div className="flashcard-use hindi-text">"{card.usageHindi}"</div>
              )}

              {/* Speech Pronunciation Feature */}
              {speech.sttSupported && (
                <div
                  className={`btn ${speech.isListening ? 'btn-danger' : 'btn-secondary'} btn-sm mt-12 btn-auto`}
                  onClick={() => {
                    if (speech.isListening) speech.stopListening();
                    else speech.startListening(card.english);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (speech.isListening) speech.stopListening();
                      else speech.startListening(card.english);
                    }
                  }}
                >
                  <span>🎤</span>
                  <span>
                    {speech.isListening ? 'सुन रहे हैं (Listening)...' : 'बोलकर अभ्यास करें (Speak)'}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Speech Recognition Feedback */}
        {speech.speechResult && (
          <Card className="mt-16 p-12 center" style={{ animation: 'slideUp 0.2s ease-out' }}>
            <div className="text-xs secondary">
              आपने बोला: "{speech.spokenText}" (स्कोर: {speech.speechResult.score}%)
            </div>
            <div className="speech-feedback-words mt-6">
              {speech.speechResult.words.map((item, idx) => (
                <span
                  key={idx}
                  className={`feedback-word ${item.isCorrect ? 'correct' : 'incorrect'}`}
                  style={{ fontSize: 12, padding: '2px 6px', margin: '0 2px' }}
                >
                  {item.word}
                </span>
              ))}
            </div>
          </Card>
        )}

        <div className="deck-footer mt-24">
          <Button variant="secondary" onClick={prevCard} disabled={cardIndex === 0}>
            ← पिछला (Prev)
          </Button>
          <Button onClick={nextCard}>
            आगे बढ़ें (Next) →
          </Button>
        </div>
      </div>
    );
  };

  const renderGrammar = () => {
    return (
      <div className="page grow" style={{ justifyContent: 'space-between' }}>
        <div>
          <span className="bold text-xs secondary">पार्ट 2: व्याकरण निर्देश (Grammar Rules)</span>
          <p className="text-sm muted mt-4 mb-20">पाठ में उपयोग होने वाले वाक्यों की बनावट समझें।</p>
          
          <div className="grammar-sheet">
            <h3 className="hindi-text flex items-center gap-6" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
              <span>📘</span> {lesson.grammar.titleHindi}
            </h3>
            <div className="grammar-sheet-content hindi-text mt-12 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {lesson.grammar.contentHindi}
            </div>
          </div>
        </div>

        <Button onClick={() => setPhase('quiz')} className="mt-24">
          अभ्यास प्रश्न शुरू करें (Start Quiz) →
        </Button>
      </div>
    );
  };

  const renderQuiz = () => {
    const quiz = practiceQueue?.[quizIndex];
    if (!quiz) return null;
    const pct = ((quizIndex + 1) / practiceQueue.length) * 100;

    return (
      <div className="deck-view page grow">
        <div className="row-between mb-8">
          <span className="bold text-xs secondary">पार्ट 3: अभ्यास (Practice Quiz)</span>
          <span className="text-xs muted">{quizIndex + 1} / {practiceQueue.length}</span>
        </div>
        <ProgressBar value={pct} className="mb-16" />

        {/* Tri-Accent Selector Bar */}
        <div className="row gap-8 mb-16 justify-center" style={{ background: 'var(--surface-2)', padding: '8px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--glass-border)' }}>
          <span className="text-xs muted bold" style={{ fontSize: 11 }}>उच्चारण (Accent):</span>
          {['IN', 'US', 'UK'].map((acc) => (
            <button
              key={acc}
              type="button"
              onClick={() => setSelectedAccent(acc)}
              style={{
                padding: '4px 12px',
                fontSize: 11.5,
                borderRadius: 'var(--radius-pill)',
                background: selectedAccent === acc ? 'var(--accent-gradient)' : 'var(--surface-3)',
                color: selectedAccent === acc ? '#ffffff' : 'var(--text-secondary)',
                border: selectedAccent === acc ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid var(--glass-border)',
                cursor: 'pointer',
                fontWeight: 600,
                boxShadow: selectedAccent === acc ? '0 0 16px rgba(168, 85, 247, 0.4)' : 'none',
                transition: 'all var(--dur-fast) var(--ease)'
              }}
            >
              {acc === 'IN' && '🇮🇳 India'}
              {acc === 'US' && '🇺🇸 US'}
              {acc === 'UK' && '🇬🇧 UK'}
            </button>
          ))}
        </div>

        <div className="question-container mb-16">
          <span className="question-tag block text-xs bold uppercase secondary mb-6">
            {quiz.type === 'speech' ? '🎙️ बोलने का अभ्यास (Speech)' : '📝 लिखित प्रश्न (Quiz)'}
          </span>
          <h2 className="question-text-hi hindi-text" style={{ fontSize: 18, fontWeight: 600 }}>
            {quiz.questionHindi}
          </h2>
        </div>

        <div className="mb-24">
          <QuestionBody key={quizIndex} question={quiz} speech={speech} onResolved={handleQuizResolved} accent={selectedAccent} />
        </div>

        {isAnswered && (
          <div className="mt-20">
            <div className={`quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="feedback-title">
                {isCorrect ? '🎉 बहुत बढ़िया! (Correct)' : '💡 कोई बात नहीं (Keep practicing)'}
              </div>
              <p className="feedback-explanation hindi-text mt-4 text-xs">
                {quiz.type === 'speech'
                  ? 'अंग्रेजी बोलने का अभ्यास करते रहने से आपका उच्चारण सुधरता है।'
                  : `सही उत्तर है: "${Array.isArray(quiz.correctAnswer) ? quiz.correctAnswer.join(' ') : quiz.correctAnswer}"`}
              </p>
              {quiz.type !== 'speech' && hasEnglishText(
                Array.isArray(quiz.correctAnswer) ? quiz.correctAnswer.join(' ') : quiz.correctAnswer
              ) && (
                <div className="mt-8 row gap-6 text-xs bold secondary items-center" style={{ flexWrap: 'wrap' }}>
                  <span>सुनें (Listen):</span>
                  <SpeakButton 
                    text={Array.isArray(quiz.correctAnswer) ? quiz.correctAnswer.join(' ') : quiz.correctAnswer} 
                    accent={selectedAccent}
                  />
                </div>
              )}
            </div>

            <div className="row gap-8 mt-12 flex-wrap">
              <Button onClick={nextQuiz} className="flex-1">
                {quizIndex < practiceQueue.length - 1 ? 'अगला प्रश्न (Next) →' : 'पाठ समाप्त करें (Finish Lesson) →'}
              </Button>
              <Button
                variant="secondary"
                onClick={handleGenerateAIQuestion}
                disabled={isGeneratingAI}
                style={{ borderColor: '#c084fc', color: '#c084fc' }}
              >
                {isGeneratingAI ? '✨ AI प्रश्न बन रहा है...' : '✨ AI प्रश्न बनाएं'}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderComplete = () => {
    return (
      <div className="page center grow" style={{ justifyContent: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
        <h2 className="bold" style={{ fontSize: 24, marginBottom: 8 }}>बधाई हो! (Congratulations!)</h2>
        <p className="hindi-text text-sm secondary mb-20" style={{ maxWidth: '85%' }}>
          आपने सफलतापूर्वक यह पाठ पूरा कर लिया है और नई अंग्रेजी सीखी है।
        </p>

        <Card className="row gap-12 px-32 py-16 mb-24" style={{ width: 'auto' }}>
          <span style={{ fontSize: 28 }}>💎</span>
          <div style={{ textAlign: 'left' }}>
            <div className="bold accent" style={{ fontSize: 18 }}>+{lesson.xpReward} XP</div>
            <div className="text-xs muted uppercase tracking-wide">अर्जित अंक (XP Earned)</div>
          </div>
        </Card>

        <div className="row gap-10 flex-wrap justify-center">
          <Button onClick={() => navigate('/dashboard')} className="btn-auto">
            डैशबोर्ड पर वापस जाएं (Back to Dashboard)
          </Button>
          <Button
            variant="secondary"
            onClick={handleGenerateAIQuestion}
            disabled={isGeneratingAI}
            style={{ borderColor: '#c084fc', color: '#c084fc' }}
          >
            {isGeneratingAI ? '✨ AI नए प्रश्न बना रहा है...' : '✨ AI अतिरिक्त प्रश्न का अभ्यास करें'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container no-nav page-container">
      {phase === 'learning' && renderLearning()}
      {phase === 'grammar' && renderGrammar()}
      {phase === 'quiz' && renderQuiz()}
      {phase === 'complete' && renderComplete()}
    </div>
  );
}
