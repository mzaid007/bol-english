// Speech Service utilizing browser-native Web Speech API (SpeechSynthesis & SpeechRecognition)

let cachedVoices = [];

// Pre-load voices on browser initialization
if (typeof window !== 'undefined' && window.speechSynthesis) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

// 1. Text-To-Speech (TTS) Wrapper supporting dynamic tri-accents (IN, US, UK)
export const speakEnglish = (text, rate = 0.9, accent = "US") => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      console.warn("Speech Synthesis is not supported in this browser.");
      resolve(false);
      return;
    }

    // Immediately cancel any active utterance to switch accent cleanly
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    let targetLang = "en-US";
    if (accent === "UK") targetLang = "en-GB";
    else if (accent === "IN") targetLang = "en-IN";
    
    utterance.lang = targetLang;
    utterance.rate = rate;

    // Get fresh voices array or fall back to cached list
    let voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      voices = cachedVoices;
    }

    if (voices && voices.length > 0) {
      const cleanTarget = targetLang.toLowerCase().replace('_', '-');
      const regionCode = accent.toLowerCase(); // "in", "uk", "us"

      // 1. Precise language tag match (e.g., en-IN)
      let selectedVoice = voices.find((v) => {
        const vl = v.lang.toLowerCase().replace('_', '-');
        return vl === cleanTarget;
      });

      // 2. Region-specific keyword match if exact tag is absent
      if (!selectedVoice && accent === "UK") {
        selectedVoice = voices.find((v) =>
          v.lang.toLowerCase().includes("gb") ||
          v.name.toLowerCase().includes("uk") ||
          v.name.toLowerCase().includes("united kingdom") ||
          v.name.toLowerCase().includes("great britain")
        );
      } else if (!selectedVoice && accent === "IN") {
        selectedVoice = voices.find((v) =>
          v.lang.toLowerCase().includes("in") ||
          v.name.toLowerCase().includes("india") ||
          v.name.toLowerCase().includes("hindi")
        );
      } else if (!selectedVoice && accent === "US") {
        selectedVoice = voices.find((v) =>
          v.lang.toLowerCase().includes("us") ||
          v.name.toLowerCase().includes("united states")
        );
      }

      // 3. Fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
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
export const evaluatePronunciation = (spokenText, targetText) => {
  const cleanWord = (word) => word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();

  const targetWords = targetText.split(/\s+/);
  const spokenWords = spokenText.split(/\s+/).map(cleanWord);

  let correctCount = 0;
  
  const wordsResult = targetWords.map((word) => {
    const cleanedTarget = cleanWord(word);
    const isCorrect = spokenWords.includes(cleanedTarget);
    if (isCorrect) {
      correctCount++;
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
    score,
    words: wordsResult
  };
};
