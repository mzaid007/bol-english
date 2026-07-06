// Speech Service utilizing browser-native Web Speech API (SpeechSynthesis & SpeechRecognition)

// 1. Text-To-Speech (TTS) Wrapper
export const speakEnglish = (text, rate = 0.9) => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      console.warn("Speech Synthesis is not supported in this browser.");
      resolve(false);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate; // slightly slower for language learners

    // Try to find a high-quality native English voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) => v.lang.startsWith("en-US") && v.name.includes("Google")
    ) || voices.find((v) => v.lang.startsWith("en"));
    
    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);

    window.speechSynthesis.speak(utterance);
  });
};

// 2. Speech-To-Text (SpeechRecognition) Wrapper for pronunciation checking
export const getSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  return recognition;
};

// 3. Pronunciation matching evaluator
// Returns an array of word objects with correctness flags
export const evaluatePronunciation = (spokenText, targetText) => {
  const cleanWord = (word) => word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();

  const targetWords = targetText.split(/\s+/);
  const spokenWords = spokenText.split(/\s+/).map(cleanWord);

  let correctCount = 0;
  
  const wordsResult = targetWords.map((word) => {
    const cleanedTarget = cleanWord(word);
    
    // Find if the target word exists in the spoken words array within a reasonable search window
    // (This helps account for skipped or added words)
    const isCorrect = spokenWords.includes(cleanedTarget);
    if (isCorrect) {
      correctCount++;
      // Remove it so it doesn't get matched twice
      const idx = spokenWords.indexOf(cleanedTarget);
      spokenWords.splice(idx, 1);
    }

    return {
      word: word,
      isCorrect: isCorrect
    };
  });

  const score = Math.round((correctCount / targetWords.length) * 100);

  return {
    score, // 0 to 100 percentage
    words: wordsResult // e.g. [{word: "Hello", isCorrect: true}, ...]
  };
};
