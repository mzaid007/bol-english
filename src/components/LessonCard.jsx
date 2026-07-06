import React, { useState, useEffect, useRef } from 'react';
import { speakEnglish, getSpeechRecognition, evaluatePronunciation } from '../services/speech';

export default function LessonCard({ lesson, onComplete, onBack }) {
  const [phase, setPhase] = useState('learning'); // 'learning' | 'grammar' | 'quiz' | 'complete'
  const [cardIndex, setCardIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  
  // Quiz states
  const [selectedOption, setSelectedOption] = useState(null);
  const [reorderedWords, setReorderedWords] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Audio playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Speech practice states (both in flashcards and quizzes)
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [speechResult, setSpeechResult] = useState(null);
  const [spokenText, setSpokenText] = useState("");
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const recognition = getSpeechRecognition();
    if (!recognition) {
      setSpeechRecognitionSupported(false);
    }
  }, []);

  // Cleanup speech recognition on card, quiz, or phase transitions
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
      setIsListeningSpeech(false);
    };
  }, [cardIndex, quizIndex, phase]);

  // Play card audio when navigating to a card
  useEffect(() => {
    if (phase === 'learning' && lesson.cards[cardIndex]) {
      handlePlayAudio(lesson.cards[cardIndex].english);
      // Reset card speech practice
      setSpeechResult(null);
      setSpokenText("");
    }
  }, [cardIndex, phase]);

  // Reset quiz states when navigating questions
  useEffect(() => {
    if (phase === 'quiz') {
      setSelectedOption(null);
      setReorderedWords([]);
      setIsAnswered(false);
      setIsCorrect(false);
      setSpeechResult(null);
      setSpokenText("");
      setIsListeningSpeech(false);
      
      const currentQuiz = lesson.practice[quizIndex];
      if (currentQuiz && currentQuiz.type === 'listening') {
        handlePlayAudio(currentQuiz.audioText);
      }
    }
  }, [quizIndex, phase]);

  const handlePlayAudio = async (text) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    await speakEnglish(text, 0.9);
    setIsPlayingAudio(false);
  };

  // Card Speech recognition
  const handleStartCardSpeech = (targetText) => {
    if (isListeningSpeech) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setIsListeningSpeech(false);
      return;
    }
    
    const recognition = getSpeechRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    setIsListeningSpeech(true);
    setSpokenText("");
    setSpeechResult(null);

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setSpokenText(text);
      
      const evaluation = evaluatePronunciation(text, targetText);
      setSpeechResult(evaluation);
      setIsListeningSpeech(false);
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        console.error("Speech recognition error:", event.error);
      }
      setIsListeningSpeech(false);
    };

    recognition.onend = () => {
      setIsListeningSpeech(false);
    };
  };

  // Quiz Selection
  const handleSelectOption = (option, correctAnswer) => {
    if (isAnswered) return;
    setSelectedOption(option);
    const correct = option === correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  // Quiz Reorder
  const handleWordTap = (word) => {
    if (isAnswered) return;
    setReorderedWords(prev => [...prev, word]);
  };

  const handleRemoveWordTap = (index) => {
    if (isAnswered) return;
    setReorderedWords(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCheckReorder = (correctAnswer) => {
    if (isAnswered) return;
    const isMatched = reorderedWords.length === correctAnswer.length &&
      reorderedWords.every((word, idx) => word === correctAnswer[idx]);
    
    setIsCorrect(isMatched);
    setIsAnswered(true);
  };

  // Quiz Speech recognition
  const handleStartQuizSpeech = (targetText) => {
    if (isListeningSpeech) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setIsListeningSpeech(false);
      return;
    }
    
    const recognition = getSpeechRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    setIsListeningSpeech(true);
    setSpokenText("");
    setSpeechResult(null);

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setSpokenText(text);
      
      const evaluation = evaluatePronunciation(text, targetText);
      setSpeechResult(evaluation);
      
      const passed = evaluation.score >= 60;
      setIsCorrect(passed);
      setIsAnswered(true);
      setIsListeningSpeech(false);
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        console.error("Speech recognition error:", event.error);
      }
      setIsListeningSpeech(false);
    };

    recognition.onend = () => {
      setIsListeningSpeech(false);
    };
  };

  const handleNextCard = () => {
    if (cardIndex < lesson.cards.length - 1) {
      setCardIndex(prev => prev + 1);
    } else {
      setPhase('grammar');
    }
  };

  const handlePrevCard = () => {
    if (cardIndex > 0) {
      setCardIndex(prev => prev - 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < lesson.practice.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setPhase('complete');
      onComplete(lesson.id, lesson.xpReward);
    }
  };

  // Render Functions
  const renderLearningPhase = () => {
    const card = lesson.cards[cardIndex];
    if (!card) return null;
    
    const progressPercent = ((cardIndex + 1) / lesson.cards.length) * 100;

    return (
      <div className="deck-view">
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
            <span>पार्ट 1: शब्द-ज्ञान (Vocabulary Cards)</span>
            <span>{cardIndex + 1} / {lesson.cards.length}</span>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="card-deck">
          <div className={`flashcard ${isListeningSpeech ? 'speaking-state' : ''}`}>
            <div className="flashcard-header">
              <span>Card {cardIndex + 1}</span>
              <button 
                className="btn-icon-only" 
                onClick={() => handlePlayAudio(card.english)} 
                disabled={isPlayingAudio}
                style={{ width: '32px', height: '32px', fontSize: '14px' }}
                aria-label="Play pronunciation"
              >
                🔊
              </button>
            </div>
            
            <div className="flashcard-body">
              <div className="flashcard-en">{card.english}</div>
              <div className="flashcard-pronun">{card.pronunciation}</div>
              <div className="flashcard-hi hindi-text">{card.hindi}</div>
              {card.useCase && <div className="flashcard-use hindi-text">{card.useCase}</div>}
              
              {speechRecognitionSupported && (
                <div 
                  className="flashcard-speak-badge" 
                  onClick={() => handleStartCardSpeech(card.english)}
                  style={{ borderColor: speechResult ? (speechResult.score >= 60 ? 'var(--success)' : 'var(--error)') : 'transparent' }}
                >
                  <span>🎤</span>
                  <span>
                    {isListeningSpeech ? "सुन रहे हैं..." : "बोलकर अभ्यास करें (Speak)"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {speechResult && (
          <div className="card" style={{ marginBottom: '16px', padding: '12px', textAlign: 'center', animation: 'slideUp 0.25s' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              आपने बोला: "{spokenText}" (स्कोर: {speechResult.score}%)
            </div>
            <div className="speech-feedback-words" style={{ marginTop: '6px' }}>
              {speechResult.words.map((item, idx) => (
                <span key={idx} className={`feedback-word ${item.isCorrect ? 'correct' : 'incorrect'}`} style={{ fontSize: '13px', padding: '2px 6px' }}>
                  {item.word}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="deck-footer">
          <button 
            className="btn btn-secondary" 
            onClick={handlePrevCard} 
            disabled={cardIndex === 0}
            style={{ flex: 1 }}
          >
            ← पिछला (Prev)
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleNextCard}
            style={{ flex: 1 }}
          >
            आगे बढ़ें (Next) →
          </button>
        </div>
      </div>
    );
  };

  const renderGrammarPhase = () => {
    return (
      <div className="screen" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>पार्ट 2: व्याकरण निर्देश (Grammar Rules)</h2>
          <p style={{ marginBottom: '20px' }}>पाठ में उपयोग होने वाले वाक्यों की बनावट समझें।</p>
          
          <div className="grammar-sheet">
            <h3 className="hindi-text">
              <span>📘</span> {lesson.grammar.titleHindi}
            </h3>
            <div className="grammar-sheet-content hindi-text">
              {lesson.grammar.contentHindi}
            </div>
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={() => setPhase('quiz')}
          style={{ marginTop: '24px' }}
        >
          अभ्यास प्रश्न शुरू करें (Start Quiz) →
        </button>
      </div>
    );
  };

  const renderQuizPhase = () => {
    const quiz = lesson.practice[quizIndex];
    if (!quiz) return null;
    
    const progressPercent = ((quizIndex + 1) / lesson.practice.length) * 100;

    return (
      <div className="deck-view">
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
            <span>पार्ट 3: अभ्यास (Practice Quiz)</span>
            <span>{quizIndex + 1} / {lesson.practice.length}</span>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="question-container">
          <span className="question-tag">{quiz.type === 'speech' ? 'बोलने का अभ्यास (Speech)' : 'लिखित प्रश्न (Quiz)'}</span>
          <h2 className="question-text-hi hindi-text">{quiz.questionHindi}</h2>
        </div>

        <div style={{ flexGrow: 1 }}>
          {quiz.type === 'mcq' && (
            <div className="selector-list">
              {quiz.options.map((option, idx) => {
                let btnClass = "option-btn";
                if (isAnswered) {
                  if (option === quiz.correctAnswer) {
                    btnClass += " correct";
                  } else if (option === selectedOption) {
                    btnClass += " incorrect";
                  }
                } else if (option === selectedOption) {
                  btnClass += " selected";
                }

                return (
                  <button
                    key={idx}
                    className={btnClass}
                    onClick={() => handleSelectOption(option, quiz.correctAnswer)}
                    disabled={isAnswered}
                  >
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {quiz.type === 'reorder' && (
            <div>
              <div className="selected-words-bin">
                {reorderedWords.length === 0 ? (
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    शब्दों को यहाँ व्यवस्थित करें...
                  </span>
                ) : (
                  reorderedWords.map((word, idx) => (
                    <span
                      key={idx}
                      className="word-chip"
                      onClick={() => handleRemoveWordTap(idx)}
                      style={{ backgroundColor: 'rgba(143, 67, 255, 0.15)', borderColor: 'var(--primary)' }}
                    >
                      {word}
                    </span>
                  ))
                )}
              </div>

              <div className="scrambled-words">
                {quiz.words.map((word, idx) => {
                  const usedCount = reorderedWords.filter(w => w === word).length;
                  const totalCountInQuestion = quiz.words.filter(w => w === word).length;
                  const isUsed = usedCount >= totalCountInQuestion;

                  return (
                    <button
                      key={idx}
                      className={`word-chip ${isUsed ? 'used' : ''}`}
                      onClick={() => !isUsed && handleWordTap(word)}
                      disabled={isAnswered || isUsed}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {!isAnswered && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleCheckReorder(quiz.correctAnswer)}
                  disabled={reorderedWords.length === 0}
                  style={{ marginTop: '12px' }}
                >
                  उत्तर जाँचे (Check)
                </button>
              )}
            </div>
          )}

          {quiz.type === 'speech' && (
            <div className="speech-container">
              <div className="speech-phrase-card">
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--secondary)' }}>
                  {quiz.speechText}
                </div>
              </div>

              {speechRecognitionSupported ? (
                <>
                  <button
                    className={`mic-btn ${isListeningSpeech ? 'listening' : ''}`}
                    onClick={() => handleStartQuizSpeech(quiz.speechText)}
                    disabled={isAnswered}
                    aria-label="Record pronunciation"
                  >
                    🎤
                  </button>
                  <div className={`speech-status-text ${isListeningSpeech ? 'listening' : ''}`}>
                    {isListeningSpeech ? "बोलिए..." : "माइक दबाकर अंग्रेजी में वाक्य बोलें"}
                  </div>
                </>
              ) : (
                <div style={{ color: 'var(--error)', textAlign: 'center', fontSize: '13px' }}>
                  ⚠️ स्पीच-टू-टेक्स्ट उपलब्ध नहीं है। बिना बोले जारी रख सकते हैं।
                </div>
              )}

              {speechResult && (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontStyle: 'italic', fontSize: '14px', marginBottom: '8px' }}>
                    आपने बोला: "{spokenText}"
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: isCorrect ? 'var(--success)' : 'var(--warning)', marginBottom: '8px' }}>
                    शुद्धता: {speechResult.score}%
                  </div>
                  <div className="speech-feedback-words">
                    {speechResult.words.map((item, idx) => (
                      <span key={idx} className={`feedback-word ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                        {item.word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isAnswered && (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsCorrect(false); // Do not mark skipped questions as correct
                    setIsAnswered(true);
                    setSpokenText("Skipped / छोड़ दिया");
                    setSpeechResult({
                      score: 0,
                      words: quiz.speechText.split(" ").map(w => ({ word: w, isCorrect: false }))
                    });
                  }}
                  style={{ marginTop: '8px' }}
                >
                  छोड़ें (Skip)
                </button>
              )}
            </div>
          )}
        </div>

        {isAnswered && (
          <div style={{ marginTop: '20px' }}>
            <div className={`quiz-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
              <div className="feedback-title">
                {isCorrect ? "🎉 बहुत बढ़िया! (Correct)" : "💡 कोई बात नहीं (Keep practicing)"}
              </div>
              <p className="feedback-explanation hindi-text">
                {quiz.type === 'speech' 
                  ? "अंग्रेजी बोलने का अभ्यास करते रहने से आपका उच्चारण सुधरता है।" 
                  : `सही उत्तर है: "${Array.isArray(quiz.correctAnswer) ? quiz.correctAnswer.join(' ') : quiz.correctAnswer}"`}
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleNextQuiz}
              style={{ marginTop: '16px' }}
            >
              {quizIndex < lesson.practice.length - 1 ? "अगला प्रश्न (Next) →" : "पाठ समाप्त करें (Finish Lesson) →"}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderCompletePhase = () => {
    return (
      <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
        <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '8px' }}>बधाई हो! (Congratulations!)</h2>
        <p className="hindi-text" style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '90%' }}>
          आपने सफलतापूर्वक यह पाठ पूरा कर लिया है और नई अंग्रेजी सीखी है।
        </p>

        <div className="card" style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <span style={{ fontSize: '28px' }}>💎</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--secondary)' }}>+{lesson.xpReward} XP</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>अर्जित अंक (XP Earned)</div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onBack}>
          डैशबोर्ड पर वापस जाएं (Back to Dashboard)
        </button>
      </div>
    );
  };

  return (
    <div className="screen app-container">
      {/* Custom header block inside the screen if needed, but onBack is passed to trigger app level state back */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button className="btn-icon-only" onClick={onBack} aria-label="Go back to Dashboard">
          ✕
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>
          {lesson.titleEnglish}
        </span>
        <div style={{ width: '40px' }}></div> {/* spacer */}
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {phase === 'learning' && renderLearningPhase()}
        {phase === 'grammar' && renderGrammarPhase()}
        {phase === 'quiz' && renderQuizPhase()}
        {phase === 'complete' && renderCompletePhase()}
      </div>
    </div>
  );
}
