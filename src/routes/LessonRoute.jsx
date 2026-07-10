import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { LESSONS } from '../data/curriculum';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import QuestionBody from '../components/quiz/QuestionBody';
import SpeakButton from '../components/ui/SpeakButton';

const hasEnglishText = (text) => text && /[a-zA-Z]/.test(text);

export default function LessonRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeLesson, trackAnswer } = useApp();
  const speech = useSpeech();

  const [phase, setPhase] = useState('learning'); // 'learning' | 'grammar' | 'quiz' | 'complete'
  const [cardIndex, setCardIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  // Quiz question states
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Find active lesson across levels
  const lesson = [
    ...(LESSONS.beginner || []),
    ...(LESSONS.intermediate || []),
    ...(LESSONS.advanced || []),
  ].find((l) => l.id === id);

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
    // Reset answers for quiz questions
    if (phase === 'quiz') {
      setIsAnswered(false);
      setIsCorrect(false);
      const quiz = lesson?.practice?.[quizIndex];
      if (quiz?.type === 'listening') {
        const t = setTimeout(() => speech.speak(quiz.audioText, 0.85), 250);
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
    if (isAnswered) return;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setQuizScore((s) => s + 1);
    trackAnswer(correct);
  };

  const nextQuiz = () => {
    if (quizIndex < lesson.practice.length - 1) {
      setQuizIndex((q) => q + 1);
    } else {
      completeLesson(lesson.id, lesson.xpReward);
      setPhase('complete');
    }
  };

  // Render helpers
  const renderLearning = () => {
    const card = lesson.cards[cardIndex];
    if (!card) return null;
    const pct = ((cardIndex + 1) / lesson.cards.length) * 100;

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
              <button
                type="button"
                className="btn-icon-only"
                onClick={() => speech.speak(card.english, 0.9)}
                disabled={speech.isSpeaking}
                style={{ fontSize: 16 }}
                aria-label="Play audio"
              >
                🔊
              </button>
            </div>
            
            <div className="flashcard-body">
              <div className="flashcard-en">{card.english}</div>
              <div className="flashcard-pronun">{card.pronunciation}</div>
              <div className="flashcard-hi hindi-text">{card.hindi}</div>
              {card.useCase && <div className="flashcard-use hindi-text">{card.useCase}</div>}
              
              {speech.sttSupported && (
                <div
                  className="flashcard-speak-badge mt-16"
                  onClick={() => speech.startListening(card.english)}
                  style={{
                    borderColor: speech.speechResult
                      ? speech.speechResult.score >= 60
                        ? 'var(--success)'
                        : 'var(--error)'
                      : 'var(--border)',
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
    const quiz = lesson.practice?.[quizIndex];
    if (!quiz) return null;
    const pct = ((quizIndex + 1) / lesson.practice.length) * 100;

    return (
      <div className="deck-view page grow">
        <div className="row-between mb-8">
          <span className="bold text-xs secondary">पार्ट 3: अभ्यास (Practice Quiz)</span>
          <span className="text-xs muted">{quizIndex + 1} / {lesson.practice.length}</span>
        </div>
        <ProgressBar value={pct} className="mb-24" />

        <div className="question-container mb-16">
          <span className="question-tag block text-xs bold uppercase secondary mb-6">
            {quiz.type === 'speech' ? '🎙️ बोलने का अभ्यास (Speech)' : '📝 लिखित प्रश्न (Quiz)'}
          </span>
          <h2 className="question-text-hi hindi-text" style={{ fontSize: 18, fontWeight: 600 }}>
            {quiz.questionHindi}
          </h2>
        </div>

        <div className="grow">
          <QuestionBody question={quiz} speech={speech} onResolved={handleQuizResolved} />
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
                  <SpeakButton text={Array.isArray(quiz.correctAnswer) ? quiz.correctAnswer.join(' ') : quiz.correctAnswer} />
                </div>
              )}
            </div>

            <Button onClick={nextQuiz} className="mt-12">
              {quizIndex < lesson.practice.length - 1 ? 'अगला प्रश्न (Next) →' : 'पाठ समाप्त करें (Finish Lesson) →'}
            </Button>
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
        <p className="hindi-text text-sm secondary mb-24" style={{ maxWidth: '85%' }}>
          आपने सफलतापूर्वक यह पाठ पूरा कर लिया है और नई अंग्रेजी सीखी है।
        </p>

        <Card className="row gap-12 px-32 py-16 mb-32" style={{ width: 'auto' }}>
          <span style={{ fontSize: 28 }}>💎</span>
          <div style={{ textAlign: 'left' }}>
            <div className="bold accent" style={{ fontSize: 18 }}>+{lesson.xpReward} XP</div>
            <div className="text-xs muted uppercase tracking-wide">अर्जित अंक (XP Earned)</div>
          </div>
        </Card>

        <Button onClick={() => navigate('/dashboard')} className="btn-auto">
          डैशबोर्ड पर वापस जाएं (Back to Dashboard)
        </Button>
      </div>
    );
  };

  return (
    <div className="app-container page grow">
      {/* Mini header */}
      <div className="row-between mb-16">
        <button
          type="button"
          className="btn-icon-only"
          onClick={() => navigate('/dashboard')}
          aria-label="Go back"
        >
          ✕
        </button>
        <span className="text-sm bold secondary truncate" style={{ maxWidth: '70%' }}>
          {lesson.titleEnglish}
        </span>
        <div style={{ width: 32 }} /> {/* spacer */}
      </div>

      <div className="grow flex-column">
        {phase === 'learning' && renderLearning()}
        {phase === 'grammar' && renderGrammar()}
        {phase === 'quiz' && renderQuiz()}
        {phase === 'complete' && renderComplete()}
      </div>
    </div>
  );
}
