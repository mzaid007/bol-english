import { useState, useEffect, useRef, useCallback } from 'react';
import { speakEnglish, getSpeechRecognition, evaluatePronunciation } from '../services/speech';

/**
 * Single source of truth for speech features (was duplicated in Assessment + LessonCard).
 *
 * Returns:
 *  - ttsSupported, sttSupported   capability flags
 *  - isSpeaking                   TTS playback state
 *  - isListening  STT active state
 *  - speechResult { score, words } | null
 *  - spokenText   string
 *  - speak(text)                  play pronunciation
 *  - startListening(targetText)   begin STT, evaluate on result
 *  - stopListening()              abort STT
 *  - resetSpeech()                clear result/spoken text
 */
export function useSpeech() {
  const [ttsSupported] = useState(() => typeof window !== 'undefined' && !!window.speechSynthesis);
  const [sttSupported, setSttSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState(null);
  const [spokenText, setSpokenText] = useState('');

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!getSpeechRecognition()) setSttSupported(false);
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  const speak = useCallback(async (text, rate = 0.9) => {
    if (!ttsSupported || isSpeaking) return;
    setIsSpeaking(true);
    await speakEnglish(text, rate);
    setIsSpeaking(false);
  }, [ttsSupported, isSpeaking]);

  const resetSpeech = useCallback(() => {
    setSpeechResult(null);
    setSpokenText('');
    setIsListening(false);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.abort();
    setIsListening(false);
  }, []);

  /**
   * Start (or toggle off) speech recognition against a target phrase.
   * Returns the evaluation via the `speechResult` state once the user finishes.
   */
  const startListening = useCallback((targetText) => {
    // Toggle off if already listening.
    if (isListening) {
      stopListening();
      return null;
    }
    const recognition = getSpeechRecognition();
    if (!recognition) return null;

    // Abort any previous instance before starting a fresh one.
    if (recognitionRef.current) recognitionRef.current.abort();
    recognitionRef.current = recognition;

    setIsListening(true);
    setSpokenText('');
    setSpeechResult(null);

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setSpokenText(text);
      const evaluation = evaluatePronunciation(text, targetText);
      setSpeechResult(evaluation);
      setIsListening(false);
      return evaluation;
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    return null;
  }, [isListening, stopListening]);

  return {
    ttsSupported,
    sttSupported,
    isSpeaking,
    isListening,
    speechResult,
    spokenText,
    speak,
    startListening,
    stopListening,
    resetSpeech,
  };
}
