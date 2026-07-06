import React, { useState, useEffect, useRef } from 'react';
import { ASSESSMENT_QUESTIONS } from '../data/curriculum';
import { speakEnglish, getSpeechRecognition, evaluatePronunciation } from '../services/speech';

export default function Assessment({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [reorderedWords, setReorderedWords] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  
  // Listening state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // Speech Practice states
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [speechResult, setSpeechResult] = useState(null);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  const [spokenText, setSpokenText] = useState("");

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const recognitionRef = useRef(null);

  // Clean up speech recognition on question change or unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, [currentIndex]);

  useEffect(() => {
    // Check if speech recognition is supported
    const recognition = getSpeechRecognition();
    if (!recognition) {
      setSpeechRecognitionSupported(false);
    }
  }, []);

  // For listening questions, play automatically on transition
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'listening') {
      handlePlayAudio(currentQuestion.audioText);
    }
    // Reset states for the new question
    setSelectedOption(null);
    setReorderedWords([]);
    setIsAnswered(false);
    setIsCorrect(false);
    setSpeechResult(null);
    setSpokenText("");
    setIsListeningSpeech(false);
  }, [currentIndex]);

  const handlePlayAudio = async (text) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    await speakEnglish(text, 0.8);
    setIsPlayingAudio(false);
  };

  // MCQ/Vocab/Grammar selection handler
  const handleSelectOption = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  // Reorder chips handler
  const handleWordTap = (word) => {
    if (isAnswered) return;
    setReorderedWords(prev => [...prev, word]);
  };

  const handleRemoveWordTap = (index) => {
    if (isAnswered) return;
    setReorderedWords(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCheckReorder = () => {
    if (isAnswered) return;
    const isMatched = reorderedWords.length === currentQuestion.correctAnswer.length &&
      reorderedWords.every((word, idx) => word === currentQuestion.correctAnswer[idx]);
    
    setIsCorrect(isMatched);
    setIsAnswered(true);
    if (isMatched) {
      setScore(prev => prev + 1);
    }
  };

  // Speech Pronunciation Recognition handler
  const handleStartSpeech = () => {
    if (isListeningSpeech) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setIsListeningSpeech(false);
      return;
    }
    
    const recognition = getSpeechRecognition();
    if (!recognition) {
      alert("स्पीच रिकग्निशन आपके ब्राउज़र में समर्थित नहीं है। कृपया Google Chrome का उपयोग करें।");
      return;
    }

    recognitionRef.current = recognition;
    setIsListeningSpeech(true);
    setSpokenText("");
    setSpeechResult(null);

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setSpokenText(text);
      
      const evaluation = evaluatePronunciation(text, currentQuestion.speechText);
      setSpeechResult(evaluation);
      
      // If pronunciation score is >= 60%, count as correct
      const passed = evaluation.score >= 60;
      setIsCorrect(passed);
      setIsAnswered(true);
      if (passed) {
        setScore(prev => prev + 1);
      }
      setIsListeningSpeech(false);
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        console.error("Speech recognition error:", event.error);
        alert("आवाज रिकॉर्ड करने में त्रुटि हुई। कृपया दोबारा प्रयास करें या माइक अनुमति की जाँच करें।");
      }
      setIsListeningSpeech(false);
    };

    recognition.onend = () => {
      setIsListeningSpeech(false);
    };
  };

  const handleSkipSpeech = () => {
    setIsCorrect(false);
    setIsAnswered(true);
    setSpokenText("Skipped / छोड़ दिया");
    setSpeechResult({
      score: 0,
      words: currentQuestion.speechText.split(" ").map(w => ({ word: w, isCorrect: false }))
    });
  };

  const handleNext = () => {
    if (currentIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate level based on score
      let recommendedLevel = "beginner";
      if (score >= 8) {
        recommendedLevel = "advanced";
      } else if (score >= 5) {
        recommendedLevel = "intermediate";
      }
      onComplete(score, recommendedLevel);
    }
  };

  const renderQuestionBody = () => {
    switch (currentQuestion.type) {
      case 'vocab':
      case 'mcq':
      case 'grammar':
        return (
          <div className="selector-list">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "option-btn";
              if (isAnswered) {
                if (option === currentQuestion.correctAnswer) {
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
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                >
                  <span>{option}</span>
                  {isAnswered && option === currentQuestion.correctAnswer && <span>✓</span>}
                  {isAnswered && option === selectedOption && option !== currentQuestion.correctAnswer && <span>✗</span>}
                </button>
              );
            })}
          </div>
        );

      case 'reorder':
        return (
          <div>
            {/* Bin where words are assembled */}
            <div className="selected-words-bin">
              {reorderedWords.length === 0 ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  नीचे दिए गए शब्दों को छूकर वाक्य पूरा करें...
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

            {/* List of scrambled word options */}
            <div className="scrambled-words">
              {currentQuestion.words.map((word, idx) => {
                // Check how many times this word has been used
                const usedCount = reorderedWords.filter(w => w === word).length;
                const totalCountInQuestion = currentQuestion.words.filter(w => w === word).length;
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
                onClick={handleCheckReorder}
                disabled={reorderedWords.length === 0}
                style={{ marginTop: '12px' }}
              >
                उत्तर जाँचे (Check Answer)
              </button>
            )}
          </div>
        );

      case 'listening':
        return (
          <div>
            <div className="audio-play-container">
              <button
                className={`audio-pulse-btn ${isPlayingAudio ? 'playing' : ''}`}
                onClick={() => handlePlayAudio(currentQuestion.audioText)}
                disabled={isPlayingAudio}
                aria-label="Listen audio"
              >
                🔊
              </button>
            </div>
            <p style={{ textAlign: 'center', marginBottom: '16px', fontSize: '13px' }}>
              ऊपर बटन दबाकर वाक्य सुनें
            </p>

            <div className="selector-list">
              {currentQuestion.options.map((option, idx) => {
                let btnClass = "option-btn";
                if (isAnswered) {
                  if (option === currentQuestion.correctAnswer) {
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
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                  >
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'speech':
        return (
          <div className="speech-container">
            <div className="speech-phrase-card">
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: 'var(--secondary)',
                  marginBottom: '8px'
                }}
              >
                {currentQuestion.speechText}
              </div>
              <p className="hindi-text" style={{ color: 'var(--text-secondary)' }}>
                {currentQuestion.questionHindi}
              </p>
            </div>

            {speechRecognitionSupported ? (
              <>
                <button
                  className={`mic-btn ${isListeningSpeech ? 'listening' : ''}`}
                  onClick={handleStartSpeech}
                  disabled={isAnswered}
                  aria-label="Record speech"
                >
                  🎤
                </button>
                <div className={`speech-status-text ${isListeningSpeech ? 'listening' : ''}`}>
                  {isListeningSpeech ? "बोलिए... हम सुन रहे हैं (Listening...)" : "माइक छुएँ और बोलना शुरू करें"}
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--error)', textAlign: 'center', fontSize: '13px' }}>
                ⚠️ आपके डिवाइस/ब्राउज़र पर स्पीच-टू-टेक्स्ट उपलब्ध नहीं है। <br />
                (हम इसे छोड़ कर आगे बढ़ सकते हैं)
              </div>
            )}

            {speechResult && (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  आपने बोला (Spoken):
                </div>
                <div style={{ fontStyle: 'italic', fontWeight: '500', marginBottom: '10px' }}>
                  "{spokenText}"
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: isCorrect ? 'var(--success)' : 'var(--warning)' }}>
                  शुद्धता स्कोर (Accuracy): {speechResult.score}%
                </div>
                <div className="speech-feedback-words">
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

            {!isAnswered && (
              <button
                className="btn btn-secondary"
                onClick={handleSkipSpeech}
                style={{ marginTop: '8px' }}
              >
                बिना बोले आगे बढ़ें (Skip)
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercent = ((currentIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <div className="screen app-container">
      {/* Quiz Progress Bar */}
      <div className="quiz-header">
        <span style={{ fontSize: '14px', fontWeight: '700' }}>प्रारंभिक मूल्यांकन (Analyzer)</span>
        <span className="quiz-steps">प्रश्न {currentIndex + 1} / {ASSESSMENT_QUESTIONS.length}</span>
      </div>
      <div className="progress-container" style={{ marginBottom: '24px' }}>
        <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className="question-container">
        <span className="question-tag">
          {currentQuestion.difficulty === 'beginner' && 'बुनियादी (Beginner)'}
          {currentQuestion.difficulty === 'intermediate' && 'मध्यम (Intermediate)'}
          {currentQuestion.difficulty === 'advanced' && 'उच्च (Advanced)'}
        </span>
        <h2 className="question-text-hi hindi-text">{currentQuestion.questionHindi}</h2>
        <p className="question-text-en">{currentQuestion.questionEnglish}</p>
      </div>

      <div style={{ flexGrow: 1 }}>
        {renderQuestionBody()}
      </div>

      {isAnswered && (
        <div style={{ marginTop: '20px' }}>
          <div className={`quiz-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
            <div className="feedback-title">
              <span>{isCorrect ? "🎉 सही उत्तर! (Correct)" : "💡 कोई बात नहीं (No problem)"}</span>
            </div>
            <p className="feedback-explanation hindi-text">
              {currentQuestion.explanation}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleNext}
            style={{ marginTop: '16px' }}
          >
            {currentIndex < ASSESSMENT_QUESTIONS.length - 1 ? "अगला प्रश्न (Next Question) →" : "नतीजा देखें (Show Results) →"}
          </button>
        </div>
      )}
    </div>
  );
}
