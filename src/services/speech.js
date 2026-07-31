// Speech Service utilizing browser-native Web Speech API (SpeechSynthesis & SpeechRecognition)

let cachedVoices = [];

// Pre-load voices on browser initialization
if (typeof window !== 'undefined' && window.speechSynthesis) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Text-To-Speech (TTS) Wrapper supporting dynamic tri-accents (IN, US, UK)
 * Enforces British (en-GB) and Indian (en-IN) phonetic synthesis natively across all browsers.
 */
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
    utterance.rate = rate;

    // Determine target BCP-47 language tag
    let targetLang = "en-US";
    if (accent === "UK") targetLang = "en-GB";
    else if (accent === "IN") targetLang = "en-IN";

    // Set target language tag on utterance FIRST
    utterance.lang = targetLang;

    // Get fresh voices array or fall back to cached list
    let voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      voices = cachedVoices;
    }

    let selectedVoice = null;

    if (voices && voices.length > 0) {
      if (accent === "UK") {
        // Match explicit UK / British voices
        selectedVoice = voices.find((v) => {
          const name = v.name.toLowerCase();
          const lang = v.lang.toLowerCase().replace('_', '-');
          return (
            lang === 'en-gb' ||
            lang === 'en-uk' ||
            name.includes('uk english') ||
            name.includes('great britain') ||
            name.includes('united kingdom') ||
            name.includes('british') ||
            name.includes('hazel') ||
            name.includes('george') ||
            name.includes('susan') ||
            name.includes('daniel') ||
            name.includes('oliver') ||
            name.includes('kate') ||
            name.includes('serena') ||
            name.includes('stephanie')
          );
        });

        if (!selectedVoice) {
          selectedVoice = voices.find((v) => {
            const lang = v.lang.toLowerCase().replace('_', '-');
            return lang.startsWith('en-gb') || lang.startsWith('en-uk') || lang.endsWith('-gb') || lang.endsWith('-uk');
          });
        }
      } else if (accent === "IN") {
        // Match explicit Indian English voices
        selectedVoice = voices.find((v) => {
          const name = v.name.toLowerCase();
          const lang = v.lang.toLowerCase().replace('_', '-');
          return (
            lang === 'en-in' ||
            name.includes('english (india)') ||
            name.includes('india') ||
            name.includes('hindi') ||
            name.includes('heera') ||
            name.includes('ravi') ||
            name.includes('veena') ||
            name.includes('sangeeta')
          );
        });

        if (!selectedVoice) {
          selectedVoice = voices.find((v) => {
            const lang = v.lang.toLowerCase().replace('_', '-');
            return lang.startsWith('en-in') || lang.endsWith('-in');
          });
        }
      } else {
        // Match explicit American English voices
        selectedVoice = voices.find((v) => {
          const name = v.name.toLowerCase();
          const lang = v.lang.toLowerCase().replace('_', '-');
          return (
            lang === 'en-us' ||
            name.includes('us english') ||
            name.includes('united states') ||
            name.includes('david') ||
            name.includes('zira') ||
            name.includes('mark')
          );
        });
      }
    }

    // CRITICAL: Only override utterance.voice if a genuine accent-matching voice object was found.
    // Do NOT assign a generic US fallback voice object, as that breaks en-GB / en-IN native browser synthesis!
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
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
