// Bilingual Curriculum and Assessment Data for English Learning Site (Hindi -> English)

export const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    type: "vocab",
    difficulty: "beginner",
    questionHindi: "अंग्रेजी में 'पानी' को क्या कहते हैं?",
    questionEnglish: "What is 'water' called in English?",
    options: ["Milk", "Water", "Food", "Air"],
    correctAnswer: "Water",
    explanation: "'पानी' को अंग्रेजी में 'Water' कहा जाता है।"
  },
  {
    id: 2,
    type: "mcq",
    difficulty: "beginner",
    questionHindi: "'वह एक डॉक्टर है।' का सही अंग्रेजी अनुवाद चुनें।",
    questionEnglish: "Choose the correct English translation for 'वह एक डॉक्टर है।'",
    options: ["He is a doctor.", "He are a doctor.", "He am a doctor.", "He doctor is."],
    correctAnswer: "He is a doctor.",
    explanation: "एकवचन (singular) 'He' के साथ वर्तमान काल में 'is' का प्रयोग होता है।"
  },
  {
    id: 3,
    type: "reorder",
    difficulty: "beginner",
    questionHindi: "इस वाक्य को अंग्रेजी में व्यवस्थित करें: 'मेरा नाम अमित है।'",
    questionEnglish: "Arrange this sentence in English: 'My name is Amit.'",
    words: ["Amit", "is", "My", "name"],
    correctAnswer: ["My", "name", "is", "Amit"],
    explanation: "अंग्रेजी में वाक्य का सामान्य क्रम Subject + Verb + Object होता है: 'My name' (Subject) + 'is' (Verb) + 'Amit' (Complement)।"
  },
  {
    id: 4,
    type: "grammar",
    difficulty: "intermediate",
    questionHindi: "खाली स्थान भरें: 'She _____ to school every day.'",
    questionEnglish: "Fill in the blank: 'She _____ to school every day.'",
    options: ["go", "goes", "going", "gone"],
    correctAnswer: "goes",
    explanation: "Present Simple Tense में, 'She' (third-person singular) के साथ क्रिया में 's/es' (goes) लगता है।"
  },
  {
    id: 5,
    type: "listening",
    difficulty: "intermediate",
    audioText: "I am learning English",
    questionHindi: "सुने गए वाक्य का हिंदी अर्थ क्या है? (वाक्य: 'I am learning English')",
    questionEnglish: "What is the Hindi meaning of the sentence: 'I am learning English'?",
    options: [
      "मैं अंग्रेजी सीख रहा हूँ।",
      "मैं अंग्रेजी सिखा रहा हूँ।",
      "मैं अंग्रेजी सीख चुका हूँ।",
      "मैं अंग्रेजी सीखूँगा।"
    ],
    correctAnswer: "मैं अंग्रेजी सीख रहा हूँ।",
    explanation: "'I am learning' का मतलब है 'मैं सीख रहा हूँ' (Present Continuous Tense)।"
  },
  {
    id: 6,
    type: "mcq",
    difficulty: "intermediate",
    questionHindi: "'कल वर्षा हो रही थी।' का सही अनुवाद क्या होगा?",
    questionEnglish: "What is the correct translation of 'कल वर्षा हो रही थी।'?",
    options: [
      "It was raining yesterday.",
      "It is raining yesterday.",
      "It has rained yesterday.",
      "It will rain yesterday."
    ],
    correctAnswer: "It was raining yesterday.",
    explanation: "भूतकाल (Past Continuous) में 'was + verb-ing' का प्रयोग होता है। 'Yesterday' बीते हुए कल को दर्शाता है।"
  },
  {
    id: 7,
    type: "grammar",
    difficulty: "advanced",
    questionHindi: "खाली स्थान भरें: 'If I _____ rich, I would travel the world.'",
    questionEnglish: "Fill in the blank: 'If I _____ rich, I would travel the world.'",
    options: ["am", "was", "were", "would be"],
    correctAnswer: "were",
    explanation: "काल्पनिक परिस्थितियों (unreal/conditional situations) को व्यक्त करने के लिए 'If I were' का प्रयोग किया जाता है, भले ही कर्ता एकवचन हो।"
  },
  {
    id: 8,
    type: "reorder",
    difficulty: "advanced",
    questionHindi: "अंग्रेजी में व्यवस्थित करें: 'मैं सुबह से आपका इंतज़ार कर रहा हूँ।'",
    questionEnglish: "Arrange in English: 'I have been waiting for you since morning.'",
    words: ["waiting", "since", "you", "for", "morning", "have", "been", "I"],
    correctAnswer: ["I", "have", "been", "waiting", "for", "you", "since", "morning"],
    explanation: "Present Perfect Continuous Tense में, 'have been + verb-ing' के साथ निश्चित समय के लिए 'since' का प्रयोग होता है।"
  },
  {
    id: 9,
    type: "vocab",
    difficulty: "advanced",
    questionHindi: "अंग्रेजी शब्द 'Peculiar' का सही हिंदी अर्थ क्या है?",
    questionEnglish: "What is the correct Hindi meaning of the English word 'Peculiar'?",
    options: ["सामान्य (Normal)", "अजीब/अनोखा (Strange/Unique)", "सुंदर (Beautiful)", "सस्ता (Cheap)"],
    correctAnswer: "अजीब/अनोखा (Strange/Unique)",
    explanation: "'Peculiar' का अर्थ होता है कुछ ऐसा जो सामान्य से अलग या अनोखा हो (Strange or unusual)।"
  },
  {
    id: 10,
    type: "speech",
    difficulty: "advanced",
    speechText: "Consistency is the key to success",
    questionHindi: "इस वाक्य को जोर से बोलें: 'Consistency is the key to success'",
    questionEnglish: "Pronounce this sentence aloud: 'Consistency is the key to success'",
    explanation: "यह वाक्य नियमित अभ्यास के महत्व को दर्शाता है: 'निरंतरता ही सफलता की कुंजी है।'"
  }
];

export const LESSONS = {
  beginner: [
    {
      id: "b1",
      titleHindi: "शुभकामनाएं और बुनियादी बातें",
      titleEnglish: "Greetings & Basics",
      descriptionHindi: "दैनिक जीवन में उपयोग होने वाले बुनियादी शब्द और अभिवादन सीखें।",
      descriptionEnglish: "Learn basic vocabulary and greetings used in daily life.",
      xpReward: 50,
      cards: [
        {
          english: "Hello",
          hindi: "नमस्ते / नमस्कार",
          pronunciation: "हैलो",
          useCase: "किसी से मिलने पर सम्मानपूर्वक अभिवादन करने के लिए।"
        },
        {
          english: "Good morning",
          hindi: "शुभ प्रभात / नमस्ते (सुबह का)",
          pronunciation: "गुड मॉर्निंग",
          useCase: "सुबह से दोपहर 12 बजे तक अभिवादन के लिए।"
        },
        {
          english: "How are you?",
          hindi: "आप कैसे हैं? / तुम कैसे हो?",
          pronunciation: "हाउ आर यू?",
          useCase: "किसी का हाल-चाल पूछने के लिए।"
        },
        {
          english: "I am fine, thank you.",
          hindi: "मैं ठीक हूँ, धन्यवाद।",
          pronunciation: "आई ऍम फाइन, थैंक यू",
          useCase: "हाल-चाल का जवाब देने और धन्यवाद प्रकट करने के लिए।"
        },
        {
          english: "Please",
          hindi: "कृपया",
          pronunciation: "प्लीज",
          useCase: "विनम्रता से कोई अनुरोध करने के लिए।"
        },
        {
          english: "Thank you",
          hindi: "धन्यवाद / शुक्रिया",
          pronunciation: "थैंक यू",
          useCase: "आभार प्रकट करने के लिए।"
        }
      ],
      grammar: {
        titleHindi: "बुनियादी वाक्य संरचना (Basic Sentence Structure)",
        contentHindi: `अंग्रेजी में बहुत ही साधारण वाक्यों को बनाने के लिए हम कर्ता (Subject) के साथ सहायक क्रिया (Helping Verb) 'is', 'am', या 'are' का प्रयोग करते हैं।
- **I** के साथ **am** लगता है। (जैसे: I am Rahul - मैं राहुल हूँ)
- **He, She, It, Single Name** के साथ **is** लगता है। (जैसे: He is happy - वह खुश है)
- **You, We, They** के साथ **are** लगता है। (जैसे: We are learning - हम सीख रहे हैं)`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "'कृपया मुझे पानी दें' में 'कृपया' का अंग्रेजी शब्द क्या है?",
          options: ["Hello", "Please", "Thank you", "Sorry"],
          correctAnswer: "Please"
        },
        {
          type: "reorder",
          questionHindi: "व्यवस्थित करें: 'मैं ठीक हूँ।'",
          words: ["fine", "am", "I"],
          correctAnswer: ["I", "am", "fine"]
        },
        {
          type: "speech",
          speechText: "Thank you very much",
          questionHindi: "इस वाक्य को बोलें: 'Thank you very much'"
        }
      ]
    },
    {
      id: "b2",
      titleHindi: "अपना परिचय देना",
      titleEnglish: "Introducing Yourself",
      descriptionHindi: "लोगों को अपना नाम, पेशा और शहर बताना सीखें।",
      descriptionEnglish: "Learn to tell people your name, profession, and hometown.",
      xpReward: 50,
      cards: [
        {
          english: "My name is...",
          hindi: "मेरा नाम ... है।",
          pronunciation: "माई नेम इज़...",
          useCase: "अपना नाम बताने के लिए।"
        },
        {
          english: "I am a student.",
          hindi: "मैं एक छात्र हूँ।",
          pronunciation: "आई ऍम अ स्टूडेंट",
          useCase: "अपना पेशा बताने के लिए। (student की जगह doctor/teacher आदि लगा सकते हैं)"
        },
        {
          english: "I live in Delhi.",
          hindi: "मैं दिल्ली में रहता हूँ।",
          pronunciation: "आई लिव इन देहली",
          useCase: "अपना रहने का स्थान बताने के लिए।"
        },
        {
          english: "Nice to meet you.",
          hindi: "आप आपसे मिलकर अच्छा लगा।",
          pronunciation: "नाइस टू मीट यू",
          useCase: "पहली बार किसी से मिलने पर विदाई या बातचीत के अंत में।"
        }
      ],
      grammar: {
        titleHindi: "'A' और 'An' का प्रयोग (Usage of Articles A/An)",
        contentHindi: `एकवचन (singular nouns) के पहले 'a' या 'an' का प्रयोग किया जाता है।
- **An** का प्रयोग उन शब्दों के पहले होता है जिनकी ध्वनि (pronunciation sound) स्वर (Vowel: A, E, I, O, U) से शुरू होती है। 
  *उदाहरण:* **an** apple, **an** engineer.
- **A** का प्रयोग उन शब्दों के पहले होता है जिनकी ध्वनि व्यंजन (Consonant) से शुरू होती है। 
  *उदाहरण:* **a** student, **a** doctor.`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "खाली स्थान भरें: 'I am _____ engineer.'",
          options: ["a", "an", "the", "no article"],
          correctAnswer: "an"
        },
        {
          type: "reorder",
          questionHindi: "व्यवस्थित करें: 'मेरा नाम राहुल है।'",
          words: ["name", "is", "Rahul", "My"],
          correctAnswer: ["My", "name", "is", "Rahul"]
        },
        {
          type: "speech",
          speechText: "Nice to meet you",
          questionHindi: "इस वाक्य को बोलें: 'Nice to meet you'"
        }
      ]
    }
  ],
  intermediate: [
    {
      id: "i1",
      titleHindi: "रेस्टोरेंट में बातचीत",
      titleEnglish: "At a Restaurant",
      descriptionHindi: "खाना ऑर्डर करना और बिल मांगना सीखें।",
      descriptionEnglish: "Learn to order food and request the bill.",
      xpReward: 75,
      cards: [
        {
          english: "Could I see the menu, please?",
          hindi: "क्या मैं मेनू देख सकता हूँ, कृपया?",
          pronunciation: "कुड आई सी द मेनू, प्लीज?",
          useCase: "रेस्टोरेंट में वेटर से मेनू कार्ड मांगने के लिए।"
        },
        {
          english: "I would like to order...",
          hindi: "मैं ... ऑर्डर करना चाहूँगा।",
          pronunciation: "आई वुड लाइक टू आर्डर...",
          useCase: "अपना मनपसंद खाना ऑर्डर करने के लिए।"
        },
        {
          english: "Is this dish spicy?",
          hindi: "क्या यह डिश मसालेदार है?",
          pronunciation: "इज़ दिस डिश स्पाइसी?",
          useCase: "तीखेपन के बारे में पूछने के लिए।"
        },
        {
          english: "Could we have the bill, please?",
          hindi: "क्या हमें बिल मिल सकता है, कृपया?",
          pronunciation: "कुड वी हैव the bill, please?",
          useCase: "खाना खाने के बाद भुगतान के लिए बिल मंगाने के लिए।"
        }
      ],
      grammar: {
        titleHindi: "विनम्र अनुरोध के लिए 'Could' और 'Would like' का प्रयोग",
        contentHindi: `जब हम किसी दुकान या रेस्टोरेंट में विनम्रता से कुछ मांगते हैं, तो 'Can' या 'Want' की जगह 'Could' और 'Would like' का उपयोग अधिक सभ्य (polite) माना जाता है।
- **Could I/we + [action]**: क्या मैं / हम... कर सकते हैं? (जैसे: Could I sit here? - क्या मैं यहाँ बैठ सकता हूँ?)
- **I would like + [noun/verb]**: मैं ... पसंद करूँगा / चाहती हूँ। (जैसे: I would like tea - मैं चाय लेना पसंद करूँगा।)`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "'मैं एक कॉफी लेना चाहूँगा' का सबसे विनम्र अनुवाद कौन सा है?",
          options: [
            "I want a coffee.",
            "Give me a coffee.",
            "I would like to have a coffee.",
            "Coffee please fast."
          ],
          correctAnswer: "I would like to have a coffee."
        },
        {
          type: "speech",
          speechText: "Could we have the bill please",
          questionHindi: "इस वाक्य को बोलें: 'Could we have the bill, please?'"
        }
      ]
    },
    {
      id: "i2",
      titleHindi: "रास्ता और दिशा-निर्देश पूछना",
      titleEnglish: "Asking for Directions",
      descriptionHindi: "अपरिचित स्थानों पर रास्ता पूछना और समझना सीखें।",
      descriptionEnglish: "Learn to ask for and understand directions in unfamiliar places.",
      xpReward: 75,
      cards: [
        {
          english: "Excuse me, where is the nearest metro station?",
          hindi: "माफ़ कीजिएगा, सबसे पास का मेट्रो स्टेशन कहाँ है?",
          pronunciation: "एक्सक्यूज़ मी, वेयर इज़ द नियरेस्ट मेट्रो स्टेशन?",
          useCase: "रास्ते में किसी से पास के मेट्रो स्टेशन का पता पूछने के लिए।"
        },
        {
          english: "Go straight and turn left.",
          hindi: "सीधे जाएं और बाएं मुड़ें।",
          pronunciation: "गो स्ट्रेट एंड टर्न लेफ्ट",
          useCase: "दिशा बताने के लिए (सीधे जाना और बायीं ओर मुड़ना)।"
        },
        {
          english: "Is it far from here?",
          hindi: "क्या यह यहाँ से दूर है?",
          pronunciation: "इज़ इट फार फ्रॉम हियर?",
          useCase: "दूरी का अंदाज़ा लगाने के लिए।"
        },
        {
          english: "It is within walking distance.",
          hindi: "यह पैदल चलने की दूरी पर है।",
          pronunciation: "इट इज़ विदिन वॉकिंग डिस्टेंस",
          useCase: "यह बताने के लिए कि स्थान बहुत पास है।"
        }
      ],
      grammar: {
        titleHindi: "दिशा और स्थान सूचक शब्द (Prepositions of Place & Direction)",
        contentHindi: `रास्ता बताने के लिए इन मुख्य शब्दों का प्रयोग किया जाता है:
- **Turn left / Turn right**: बाएं / दाएं मुड़ें।
- **Go straight / Go past**: सीधे जाएं / उस स्थान के आगे जाएं।
- **Opposite / Next to**: सामने / बगल में। (जैसे: The park is opposite the school - पार्क स्कूल के सामने है।)`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "'सीधे जाएं और दाएं मुड़ें' का सही अंग्रेजी अनुवाद क्या है?",
          options: [
            "Go back and turn left.",
            "Go straight and turn right.",
            "Stop here and walk right.",
            "Go straight and left turn."
          ],
          correctAnswer: "Go straight and turn right."
        },
        {
          type: "speech",
          speechText: "Where is the station",
          questionHindi: "इस वाक्य को बोलें: 'Where is the station?'"
        }
      ]
    }
  ],
  advanced: [
    {
      id: "a1",
      titleHindi: "नौकरी के लिए इंटरव्यू",
      titleEnglish: "Job Interview",
      descriptionHindi: "इंटरव्यू में आत्मविश्वास से अंग्रेजी में उत्तर देना सीखें।",
      descriptionEnglish: "Learn to answer questions confidently in English during interviews.",
      xpReward: 100,
      cards: [
        {
          english: "Tell me about yourself.",
          hindi: "मुझे अपने बारे में बताएं।",
          pronunciation: "टेल मी अबाउट योरसेल्फ",
          useCase: "इंटरव्यूअर द्वारा पहला और सामान्य प्रश्न।"
        },
        {
          english: "I have three years of experience in this field.",
          hindi: "मुझे इस क्षेत्र में तीन साल का अनुभव है।",
          pronunciation: "आई हैव थ्री ईयर्स ऑफ़ एक्सपीरियंस इन दिस फील्ड",
          useCase: "अपने पिछले कार्य अनुभव को बताने के लिए।"
        },
        {
          english: "My strengths are teamwork and problem-solving.",
          hindi: "मेरी ताकत टीमवर्क और समस्याओं को हल करना है।",
          pronunciation: "माई स्ट्रेंग्थ्स आर टीमवर्क एंड प्रॉब्लम-सॉल्विंग",
          useCase: "अपनी कार्यक्षमताओं और गुणों को दर्शाने के लिए।"
        },
        {
          english: "Why do you want to join our company?",
          hindi: "आप हमारी कंपनी में क्यों शामिल होना चाहते हैं?",
          pronunciation: "वाय डू यू वांट टू जॉइन आवर कंपनी?",
          useCase: "कंपनी में रुचि दर्शाने का प्रश्न।"
        }
      ],
      grammar: {
        titleHindi: "अनुभव बताने के लिए Present Perfect Tense का प्रयोग",
        contentHindi: `जब हम अपने पिछले अनुभवों की बात करते हैं जिसका असर वर्तमान में भी है, तब हम **Present Perfect Tense** (Subject + has/have + Verb 3rd form) का प्रयोग करते हैं।
- *उदाहरण:* I **have worked** in Delhi. (मैंने दिल्ली में काम किया है।)
- जब समय का बिंदु निश्चित हो (जैसे: 3 साल से), तो **Present Perfect Continuous** भी उपयोग करते हैं: I **have been working** here for three years.`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "खाली स्थान भरें: 'I _____ in this industry for five years.' (मैं 5 साल से काम कर रहा हूँ)",
          options: [
            "am working",
            "have worked",
            "worked",
            "have been working"
          ],
          correctAnswer: "have been working"
        },
        {
          type: "speech",
          speechText: "I am ready for the interview",
          questionHindi: "इस वाक्य को बोलें: 'I am ready for the interview'"
        }
      ]
    }
  ]
};
