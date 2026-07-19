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
    phoneticHindi: "कंसिस्टेंसी इज़ द की टू सक्सेस",
    explanation: "यह वाक्य नियमित अभ्यास के महत्व को दर्शाता है: 'निरंतरता ही सफलता की कुंजी है।'"
  }
];

export const LESSONS = {
  beginner: [
    {
      id: "b1",
      titleHindi: "1. अंग्रेजी वर्णमाला और बुनियादी शब्द",
      titleEnglish: "Alphabet & Foundational Words",
      descriptionHindi: "वर्णमाला की बुनियादी आवाज़ें, स्वर (Vowels) और सरल दैनिक वस्तुओं के नाम सीखें।",
      descriptionEnglish: "Learn basic alphabet sounds, vowels, and names of simple everyday objects.",
      xpReward: 50,
      cards: [
        {
          english: "Vowels (A, E, I, O, U)",
          hindi: "स्वर (ये 5 अक्षर विशेष आवाज़ें बनाते हैं)",
          pronunciation: "वाउल्स",
          useCase: "अंग्रेजी में हर शब्द को बनाने और बोलने के लिए स्वर आवश्यक हैं।"
        },
        {
          english: "Book",
          hindi: "किताब / पुस्तक",
          pronunciation: "बुक",
          useCase: "पढ़ने वाली वस्तु को दर्शाने के लिए।"
        },
        {
          english: "Water",
          hindi: "पानी / जल",
          pronunciation: {
            IN: "वॉटर (Clear 't')",
            US: "वाडर (Soft 'd' sound)",
            UK: "वोटा (Silent 'r' at end)"
          },
          useCase: "पीने के पानी को मांगने या बताने के लिए।"
        },
        {
          english: "Food",
          hindi: "खाना / भोजन",
          pronunciation: "फूड",
          useCase: "खाने की किसी भी वस्तु के बारे में बात करने के लिए।"
        },
        {
          english: "House",
          hindi: "घर / मकान",
          pronunciation: "हाउस",
          useCase: "रहने की जगह को बताने के लिए।"
        },
        {
          english: "School",
          hindi: "स्कूल / विद्यालय",
          pronunciation: "स्कूल",
          useCase: "पढ़ाई करने की जगह का नाम।"
        }
      ],
      grammar: {
        titleHindi: "स्वर (Vowels) और व्यंजन (Consonants) का अंतर",
        contentHindi: `अंग्रेजी वर्णमाला में 26 अक्षर होते हैं। इनमें से 5 स्वर (Vowels) होते हैं: **A, E, I, O, U**।
बाकी बचे 21 अक्षर व्यंजन (Consonants) कहलाते हैं (जैसे B, C, D, F, G, आदि)।
- हम किसी एक वस्तु को दर्शाने के लिए उसके नाम के आगे 'a' या 'an' लगाते हैं।
- यदि शब्द की शुरुआत **स्वर ध्वनि (Vowel sound)** से होती है, तो हम **an** लगाते हैं। जैसे: **an** Apple (ऐपल), **an** Umbrella (अम्ब्रेला)।
- यदि शब्द की शुरुआत **व्यंजन ध्वनि (Consonant sound)** से होती है, तो हम **a** लगाते हैं। जैसे: **a** Book (बुक), **a** House (हाउस)।`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "सही आर्टिकल चुनें: '____ Orange (ऑरेंज)'",
          options: ["a", "an", "the", "कोई आर्टिकल नहीं"],
          correctAnswer: "an"
        },
        {
          type: "reorder",
          questionHindi: "व्यवस्थित करें: 'यह एक किताब है।' (This is a book.)",
          words: ["a", "is", "This", "book"],
          correctAnswer: ["This", "is", "a", "book"]
        },
        {
          type: "speech",
          speechText: "This is my school",
          questionHindi: "इस वाक्य को बोलें: 'This is my school' (यह मेरा स्कूल है)",
          phoneticHindi: "दिस इज़ माई स्कूल"
        }
      ]
    },
    {
      id: "b2",
      titleHindi: "2. दैनिक अभिवादन और शिष्टाचार",
      titleEnglish: "Greetings & Polite Manners",
      descriptionHindi: "दैनिक जीवन में सम्मानपूर्वक बात करना और जादुई शिष्टाचार शब्द (Magic Words) सीखें।",
      descriptionEnglish: "Learn respectful communication and polite magic words for daily usage.",
      xpReward: 50,
      cards: [
        {
          english: "Hello",
          hindi: "नमस्ते / नमस्कार",
          pronunciation: {
            IN: "हैलो",
            US: "ह-लो (Huh-loh)",
            UK: "हे-लो (Heh-loh)"
          },
          useCase: "किसी से मिलने पर सम्मानपूर्वक बातचीत शुरू करने के लिए।"
        },
        {
          english: "Good morning",
          hindi: "शुभ प्रभात / नमस्ते (सुबह का)",
          pronunciation: "गुड मॉर्निंग",
          useCase: "सुबह से दोपहर 12 बजे तक किसी का अभिवादन करने के लिए।"
        },
        {
          english: "Please",
          hindi: "कृपया",
          pronunciation: "प्लीज",
          useCase: "जब आप किसी से मदद या कोई वस्तु मांगते हैं (विनम्रता के लिए)।"
        },
        {
          english: "Thank you",
          hindi: "धन्यवाद / शुक्रिया",
          pronunciation: {
            IN: "थैंक यू",
            US: "थैंक्यू (Fast blend)",
            UK: "थैंक यू"
          },
          useCase: "जब कोई आपकी मदद करे या आपको कोई वस्तु दे (आभार जताने के लिए)।"
        },
        {
          english: "Sorry",
          hindi: "माफ़ कीजिये / खेद है",
          pronunciation: "सॉरी",
          useCase: "जब आपसे कोई गलती हो जाए या आप किसी को परेशान करें।"
        },
        {
          english: "Welcome",
          hindi: "आपका स्वागत है",
          pronunciation: "वेलकम",
          useCase: "जब कोई आपको 'Thank you' बोले, तो शिष्टाचार के नाते यह कहें।"
        }
      ],
      grammar: {
        titleHindi: "शिष्टाचार के शब्दों का महत्व (Importance of Manners)",
        contentHindi: `अंग्रेजी संस्कृति में शिष्टाचार के शब्दों का बहुत अधिक महत्व है।
- **Please** का प्रयोग हर अनुरोध के साथ करें। जैसे: "Please give me water" (कृपया मुझे पानी दें)।
- **Thank you** बोलना कभी न भूलें, यह आपकी विनम्रता दर्शाता है।
- जब आपसे कोई गलती हो, तो तुरंत **Sorry** कहें।
- **Welcome** या **You're welcome** (आपका स्वागत है) का प्रयोग 'Thank you' का जवाब देने के लिए किया जाता है।`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "यदि कोई आपकी मदद करता है, तो आप उससे क्या कहेंगे?",
          options: ["Sorry", "Please", "Thank you", "Hello"],
          correctAnswer: "Thank you"
        },
        {
          type: "reorder",
          questionHindi: "व्यवस्थित करें: 'कृपया मुझे पानी दें।' (Please give me water.)",
          words: ["water", "Please", "me", "give"],
          correctAnswer: ["Please", "give", "me", "water"]
        },
        {
          type: "speech",
          speechText: "You are welcome",
          questionHindi: "इस वाक्य को बोलें: 'You are welcome'"
        }
      ]
    },
    {
      id: "b3",
      titleHindi: "3. अपना परिचय देना",
      titleEnglish: "Introducing Yourself",
      descriptionHindi: "दूसरों को अपना नाम, उम्र, रहने का स्थान और काम बताना सीखें।",
      descriptionEnglish: "Learn to introduce your name, age, residence, and occupation.",
      xpReward: 50,
      cards: [
        {
          english: "My name is...",
          hindi: "मेरा नाम ... है।",
          pronunciation: "माई नेम इज़...",
          useCase: "सामने वाले को अपना नाम बताने के लिए।"
        },
        {
          english: "I am ten years old.",
          hindi: "मैं दस साल का हूँ।",
          pronunciation: "आई ऍम टेन इयर्स ओल्ड",
          useCase: "अपनी उम्र बताने के लिए (दस की जगह अपनी उम्र की संख्या बोलें)।"
        },
        {
          english: "I live in...",
          hindi: "मैं ... में रहता हूँ / रहती हूँ।",
          pronunciation: "आई लिव इन...",
          useCase: "अपने शहर या गाँव का नाम बताने के लिए।"
        },
        {
          english: "I am a student.",
          hindi: "मैं एक छात्र हूँ।",
          pronunciation: "आई ऍम अ स्टूडेंट",
          useCase: "यह बताने के लिए कि आप पढ़ाई करते हैं।"
        },
        {
          english: "Nice to meet you",
          hindi: "आपसे मिलकर अच्छा लगा",
          pronunciation: "नाइस टू मीट यू",
          useCase: "किसी से पहली बार परिचय समाप्त करते समय बोला जाता है।"
        }
      ],
      grammar: {
        titleHindi: "सरल परिचय संरचना (Basic Self Intro Structure)",
        contentHindi: `अपना परिचय देने के लिए अंग्रेजी में इन वाक्यों का ढांचा याद रखें:
- **नाम बताने के लिए**: My name is + [आपका नाम] (जैसे: My name is Rahul).
- **रहने की जगह**: I live in + [जगह का नाम] (जैसे: I live in Patna).
- **पेशा बताने के लिए**: I am a/an + [आपका काम] (जैसे: I am a teacher, I am a student). Note करें कि 'teacher' T से शुरू होता है (व्यंजन) इसलिए 'a' लगा, 'engineer' E से शुरू होता है (स्वर) इसलिए 'an' लगेगा: 'I am an engineer.'`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "यदि राहुल को कहना हो 'मैं दिल्ली में रहता हूँ', तो वह क्या कहेगा?",
          options: ["I go Delhi.", "I live in Delhi.", "My live Delhi.", "I am Delhi live."],
          correctAnswer: "I live in Delhi."
        },
        {
          type: "reorder",
          questionHindi: "व्यवस्थित करें: 'मेरा नाम सीमा है।' (My name is Seema.)",
          words: ["is", "name", "My", "Seema"],
          correctAnswer: ["My", "name", "is", "Seema"]
        },
        {
          type: "speech",
          speechText: "My name is Amit",
          questionHindi: "इस वाक्य को बोलें: 'My name is Amit'"
        }
      ]
    },
    {
      id: "b4",
      titleHindi: "4. क्रिया शब्द (काम वाले शब्द)",
      titleEnglish: "Action Verbs & Basic Sentences",
      descriptionHindi: "रोजाना की जाने वाली क्रियाएं (जैसे खाना, पीना, पढ़ना) और छोटे वाक्य बनाना सीखें।",
      descriptionEnglish: "Learn common daily actions and how to construct tiny active sentences.",
      xpReward: 50,
      cards: [
        {
          english: "Eat",
          hindi: "खाना (भोजन करना)",
          pronunciation: "ईट",
          useCase: "भोजन करने की क्रिया को दर्शाने के लिए।"
        },
        {
          english: "Drink",
          hindi: "पीना (तरल पदार्थ)",
          pronunciation: "ड्रिंक",
          useCase: "पानी, दूध या जूस पीने की क्रिया।"
        },
        {
          english: "Read",
          hindi: "पढ़ना (पुस्तक आदि)",
          pronunciation: "रीड",
          useCase: "पढ़ने की क्रिया।"
        },
        {
          english: "Write",
          hindi: "लिखना (कागज पर)",
          pronunciation: "राइट",
          useCase: "लिखने की क्रिया।"
        },
        {
          english: "Run",
          hindi: "दौड़ना / भागना",
          pronunciation: "रन",
          useCase: "तेजी से भागने की क्रिया।"
        },
        {
          english: "Sleep",
          hindi: "सोना (नींद लेना)",
          pronunciation: "स्लीप",
          useCase: "रात को या आराम करने के लिए सोने की क्रिया।"
        }
      ],
      grammar: {
        titleHindi: "Subject + Verb वाक्य संरचना (कर्ता और क्रिया)",
        contentHindi: `हिन्दी में हम बोलते हैं: "मैं दौड़ता हूँ" या "वह सोता है"।
अंग्रेजी में वाक्य बनाने के लिए सबसे पहले **कर्ता (Subject - जो काम कर रहा है)** आता है, और फिर सीधे **क्रिया (Verb - जो काम हो रहा है)** आती है।
- **I, You, We, They** के साथ क्रिया का पहला रूप सीधे आता है: 
  *जैसे:* **I run** (मैं दौड़ता हूँ), **We write** (हम लिखते हैं)।
- **He, She, It, Single Name** (एकवचन कर्ता) के साथ क्रिया में **'s' या 'es'** जुड़ जाता है: 
  *जैसे:* **He sleeps** (वह सोता है), **She reads** (वह पढ़ती है)।`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "खाली स्थान भरें: 'He _____ water.' (वह पानी पीता है - क्रिया 'drink')",
          options: ["drink", "drinks", "drinking", "drank"],
          correctAnswer: "drinks"
        },
        {
          type: "reorder",
          questionHindi: "व्यवस्थित करें: 'मैं एक पुस्तक पढ़ता हूँ।' (I read a book.)",
          words: ["book", "read", "I", "a"],
          correctAnswer: ["I", "read", "a", "book"]
        },
        {
          type: "speech",
          speechText: "She writes every day",
          questionHindi: "इस वाक्य को बोलें: 'She writes every day'"
        }
      ]
    },
    {
      id: "b5",
      titleHindi: "5. रिश्तेदार और परिवार",
      titleEnglish: "Family & Relations",
      descriptionHindi: "परिवार के सदस्यों के नाम और अपने परिवार के बारे में बातचीत करना सीखें।",
      descriptionEnglish: "Learn family member relations and how to talk about your family.",
      xpReward: 50,
      cards: [
        {
          english: "Father",
          hindi: "पिता / पापा",
          pronunciation: "फादर",
          useCase: "अपने या किसी के पिता को बताने के लिए।"
        },
        {
          english: "Mother",
          hindi: "माता / मम्मी",
          pronunciation: "मदर",
          useCase: "अपनी या किसी की माता को संबोधित करने के लिए।"
        },
        {
          english: "Brother",
          hindi: "भाई",
          pronunciation: "ब्रदर",
          useCase: "अपने भाई के बारे में बात करने के लिए।"
        },
        {
          english: "Sister",
          hindi: "बहन",
          pronunciation: "सिस्टर",
          useCase: "अपनी बहन के बारे में बात करने के लिए।"
        },
        {
          english: "Parents",
          hindi: "माता-पिता (अभिभावक)",
          pronunciation: "पेरेंट्स",
          useCase: "माता और पिता दोनों को एक साथ बताने के लिए।"
        },
        {
          english: "Family",
          hindi: "परिवार / कुनबा",
          pronunciation: "फैमिली",
          useCase: "घर के सभी सदस्यों के समूह के लिए।"
        }
      ],
      grammar: {
        titleHindi: "संबंध दर्शाने के लिए 'My' और 'His/Her' का प्रयोग",
        contentHindi: `अपने परिवार के सदस्यों के बारे में बात करते समय मालिकाना हक (possession) दर्शाने वाले शब्दों का प्रयोग होता है:
- **My**: मेरा / मेरी। (जैसे: **My father** is a doctor - मेरे पिता एक डॉक्टर हैं)।
- **His**: उसका / उसकी (पुरुष के लिए)। (जैसे: **His brother** runs fast - उसका भाई तेज दौड़ता है)।
- **Her**: उसका / उसकी (स्त्री के लिए)। (जैसे: **Her sister** is singing - उसकी बहन गा रही है)।`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "यदि आपको कहना हो 'यह मेरी बहन है', तो आप क्या कहेंगे?",
          options: [
            "This is my sister.",
            "This is he sister.",
            "This is her sister.",
            "This is you sister."
          ],
          correctAnswer: "This is my sister."
        },
        {
          type: "reorder",
          questionHindi: "व्यवस्थित करें: 'मेरे पिता एक शिक्षक हैं।' (My father is a teacher.)",
          words: ["is", "father", "My", "teacher", "a"],
          correctAnswer: ["My", "father", "is", "a", "teacher"]
        },
        {
          type: "speech",
          speechText: "I love my family",
          questionHindi: "इस वाक्य को बोलें: 'I love my family'"
        }
      ]
    }
  ],
  intermediate: [
    {
      id: "i1",
      titleHindi: "1. रेस्टोरेंट में बातचीत",
      titleEnglish: "At a Restaurant",
      descriptionHindi: "खाना ऑर्डर करना, वेटर से विनम्रता से बात करना और बिल मांगना सीखें।",
      descriptionEnglish: "Learn to order food, speak politely to waiters, and ask for the bill.",
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
          useCase: "अपना मनपसंद खाना ऑर्डर करने के लिए (खाली जगह में भोजन का नाम बोलें)।"
        },
        {
          english: "Is this dish spicy?",
          hindi: "क्या यह डिश मसालेदार है?",
          pronunciation: "इज़ दिस डिश स्पाइसी?",
          useCase: "खाने में मिर्च-मसालों के बारे में पूछने के लिए।"
        },
        {
          english: "Could we have the bill, please?",
          hindi: "क्या हमें बिल मिल सकता है, कृपया?",
          pronunciation: "कुड वी हैव द बिल, प्लीज?",
          useCase: "भोजन के बाद भुगतान के लिए बिल मंगाने के लिए।"
        }
      ],
      grammar: {
        titleHindi: "विनम्र अनुरोध के लिए 'Could' और 'Would like' का प्रयोग",
        contentHindi: `जब हम किसी दुकान या रेस्टोरेंट में विनम्रता से कुछ मांगते हैं, तो 'Can' या 'Want' की जगह 'Could' और 'Would like' का उपयोग अधिक सभ्य (polite) माना जाता है।
- **Could I/we + [action]**: क्या मैं / हम... कर सकते हैं? (जैसे: **Could I** sit here? - क्या मैं यहाँ बैठ सकता हूँ?)
- **I would like + [noun/verb]**: मैं ... पसंद करूँगा / चाहती हूँ। (जैसे: **I would like** tea - मैं चाय लेना पसंद करूँगा।)`
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
      titleHindi: "2. रास्ता और दिशा-निर्देश",
      titleEnglish: "Asking for Directions",
      descriptionHindi: "अपरिचित स्थानों पर रास्ता पूछना, मुड़ना और दूरी समझना सीखें।",
      descriptionEnglish: "Learn to ask for and understand directions in unfamiliar locations.",
      xpReward: 75,
      cards: [
        {
          english: "Excuse me, where is the nearest hospital?",
          hindi: "माफ़ कीजिएगा, सबसे पास का अस्पताल कहाँ है?",
          pronunciation: "एक्सक्यूज़ मी, वेयर इज़ द नियरेस्ट हॉस्पिटल?",
          useCase: "रास्ते में किसी अजनबी से अस्पताल या किसी जगह का पता पूछने के लिए।"
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
          useCase: "चलने से पहले दूरी का अंदाज़ा लगाने के लिए।"
        },
        {
          english: "It is opposite the park.",
          hindi: "यह पार्क के सामने है।",
          pronunciation: "इट इज़ अपोजिट द पार्क",
          useCase: "किसी प्रमुख स्थान (पार्क) के संदर्भ में किसी इमारत का पता बताना।"
        }
      ],
      grammar: {
        titleHindi: "दिशा और स्थान सूचक शब्द (Prepositions of Place & Direction)",
        contentHindi: `रास्ता बताने के लिए इन मुख्य शब्दों का प्रयोग किया जाता है:
- **Turn left / Turn right**: बाएं / दाएं मुड़ें।
- **Go straight / Go past**: सीधे जाएं / उस स्थान के आगे जाएं।
- **Opposite**: सामने। (जैसे: Opposite the school - स्कूल के सामने)।
- **Next to**: ठीक बगल में। (जैसे: Next to the bank - बैंक के बगल में)।`
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
    },
    {
      id: "i3",
      titleHindi: "3. दैनिक जीवन में काल (Tenses)",
      titleEnglish: "Tenses in Daily Conversation",
      descriptionHindi: "भूतकाल (Past), वर्तमान काल (Present) और भविष्य काल (Future) में बात करना सीखें।",
      descriptionEnglish: "Learn to communicate in Past, Present, and Future tenses effectively.",
      xpReward: 75,
      cards: [
        {
          english: "I cook food every day.",
          hindi: "मैं रोज़ खाना बनाता हूँ। (वर्तमान आदत)",
          pronunciation: "आई कुक फूड एवरी डे",
          useCase: "अपनी रोज़ाना की आदत बताने के लिए (Present Simple)।"
        },
        {
          english: "I cooked food yesterday.",
          hindi: "मैंने कल खाना बनाया था। (भूतकाल में पूरा हुआ काम)",
          pronunciation: "आई कुक्ड फूड यस्टरडे",
          useCase: "कल किए गए किसी काम को बताने के लिए (Past Simple)।"
        },
        {
          english: "I will cook food tomorrow.",
          hindi: "मैं कल खाना बनाऊँगा। (भविष्य का काम)",
          pronunciation: "आई विल कुक फूड टुमॉरो",
          useCase: "आने वाले कल में कोई काम करने की योजना बताने के लिए (Future Simple)।"
        },
        {
          english: "I am cooking right now.",
          hindi: "मैं अभी खाना बना रहा हूँ। (इस समय जारी काम)",
          pronunciation: "आई ऍम कुकिंग राइट नाउ",
          useCase: "वर्तमान समय में जो काम हो रहा है उसे बताने के लिए (Present Continuous)।"
        }
      ],
      grammar: {
        titleHindi: "तीनों मुख्य कालों का सरल नियम (Simple Tense Rules)",
        contentHindi: `तीनों मुख्य कालों में वाक्यों की बनावट इस प्रकार होती है:
1. **Present Simple (आदत)**: Subject + Verb 1st form (He/She के साथ s/es)।
   *उदाहरण:* I write (मैं लिखता हूँ) / He writes (वह लिखता है)।
2. **Past Simple (बीता समय)**: Subject + Verb 2nd form (ed रूप)।
   *उदाहरण:* I writed/wrote (मैंने लिखा) / He went (वह गया)।
3. **Future Simple (आने वाला समय)**: Subject + **will** + Verb 1st form.
   *उदाहरण:* I **will** write (मैं लिखूँगा) / He **will** go (वह जाएगा)।`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "वाक्य को भूतकाल (Past Tense) में बदलें: 'I play cricket.' (मैं कल खेला)",
          options: [
            "I will play cricket tomorrow.",
            "I played cricket yesterday.",
            "I am playing cricket now.",
            "I plays cricket."
          ],
          correctAnswer: "I played cricket yesterday."
        },
        {
          type: "speech",
          speechText: "I will call you tomorrow",
          questionHindi: "इस वाक्य को बोलें: 'I will call you tomorrow'"
        }
      ]
    },
    {
      id: "i4",
      titleHindi: "4. विशेषण (चीजों का वर्णन करना)",
      titleEnglish: "Adjectives - Describing Things",
      descriptionHindi: "चीजों और लोगों की खूबियाँ (जैसे सुंदर, बड़ा, छोटा, तेज) बताना सीखें।",
      descriptionEnglish: "Learn to describe traits and qualities of people and objects.",
      xpReward: 75,
      cards: [
        {
          english: "Beautiful",
          hindi: "सुंदर / आकर्षक",
          pronunciation: "ब्यूटीफुल",
          useCase: "किसी व्यक्ति, फूल या दृश्य की सुंदरता की प्रशंसा करने के लिए।"
        },
        {
          english: "Expensive",
          hindi: "महँगा / कीमती",
          pronunciation: "इक्सपेंसिव",
          useCase: "अधिक कीमत वाली वस्तुओं (जैसे कार, फोन) के लिए।"
        },
        {
          english: "Easy",
          hindi: "आसान / सरल",
          pronunciation: "इज़ी",
          useCase: "किसी सरल काम या परीक्षा के लिए।"
        },
        {
          english: "Difficult",
          hindi: "कठिन / मुश्किल",
          pronunciation: "डिफिकल्ट",
          useCase: "किसी पेचीदा काम या समस्या के लिए।"
        },
        {
          english: "Fast",
          hindi: "तेज / फुर्तीला",
          pronunciation: "फास्ट",
          useCase: "दौड़ने या गाड़ी चलाने की गति के लिए।"
        }
      ],
      grammar: {
        titleHindi: "विशेषण लगाने का सही नियम (Position of Adjectives)",
        contentHindi: `अंग्रेजी में विशेषण (Adjectives) आमतौर पर संज्ञा (Noun - जिस वस्तु की बात हो रही है) के **ठीक पहले** आते हैं।
- *जैसे:* A **beautiful** flower (एक सुंदर फूल), A **fast** car (एक तेज कार)।
- या फिर वे सहायक क्रिया (verb) के **बाद** आते हैं:
  *जैसे:* This exam is **easy** (यह परीक्षा आसान है), That house is **expensive** (वह घर महँगा है)।`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "खाली स्थान भरें: 'This is a _____ questions.' (यह एक कठिन प्रश्न है)",
          options: ["difficult", "difficultly", "difficulty", "more difficult"],
          correctAnswer: "difficult"
        },
        {
          type: "reorder",
          questionHindi: "व्यवस्थित करें: 'अंग्रेजी एक आसान भाषा है।' (English is an easy language.)",
          words: ["easy", "is", "language", "English", "an"],
          correctAnswer: ["English", "is", "an", "easy", "language"]
        },
        {
          type: "speech",
          speechText: "This car is very fast",
          questionHindi: "इस वाक्य को बोलें: 'This car is very fast'"
        }
      ]
    },
    {
      id: "i5",
      titleHindi: "5. प्रश्न पूछना (Wh- Questions)",
      titleEnglish: "Asking Questions (Who, What, Why)",
      descriptionHindi: "अंग्रेजी में सवाल पूछने के मुख्य शब्द (कहाँ, क्यों, कब, कैसे) सीखें।",
      descriptionEnglish: "Learn the primary question words to ask inquiries in English.",
      xpReward: 75,
      cards: [
        {
          english: "What are you doing?",
          hindi: "तुम क्या कर रहे हो?",
          pronunciation: "व्हाट आर यू डूइंग?",
          useCase: "किसी के काम के बारे में पूछने के लिए (What = क्या)।"
        },
        {
          english: "Where is my book?",
          hindi: "मेरी किताब कहाँ है?",
          pronunciation: "वेयर इज़ माई बुक?",
          useCase: "किसी खोई हुई वस्तु का पता पूछने के लिए (Where = कहाँ)।"
        },
        {
          english: "Why are you laughing?",
          hindi: "तुम क्यों हंस रहे हो?",
          pronunciation: "वाय आर यू लाफिंग?",
          useCase: "हंसने या किसी क्रिया का कारण पूछने के लिए (Why = क्यों)।"
        },
        {
          english: "When will you come?",
          hindi: "तुम कब आओगे?",
          pronunciation: "व्हेन विल यू कम?",
          useCase: "समय के बारे में पूछने के लिए (When = कब)।"
        },
        {
          english: "How are you?",
          hindi: "आप कैसे हैं?",
          pronunciation: "हाउ आर यू?",
          useCase: "हाल-चाल या स्थिति पूछने के लिए (How = कैसे)।"
        }
      ],
      grammar: {
        titleHindi: "प्रश्नवाचक वाक्य संरचना (Wh- Question Structure)",
        contentHindi: `अंग्रेजी में प्रश्न पूछने के लिए वाक्य की शुरुआत **Question Word (What, Where, Why, etc.)** से होती है, जिसके तुरंत बाद **सहायक क्रिया (Helping Verb: is, am, are, do, will, etc.)** आती है, और फिर **कर्ता (Subject)** आता है।
- *हिन्दी क्रम:* तुम (Subject) + कहाँ (Question) + जा रहे हो (Verb)?
- *अंग्रेजी क्रम:* Where (Question) + are (Helping Verb) + you (Subject) + going (Verb)?
  *जैसे:* **Where are you going?**`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "'तुम्हारा नाम क्या है?' का सही अंग्रेजी अनुवाद क्या है?",
          options: [
            "Your name is what?",
            "What is your name?",
            "Who is your name?",
            "Where is your name?"
          ],
          correctAnswer: "What is your name?"
        },
        {
          type: "reorder",
          questionHindi: "व्यवस्थित करें: 'तुम कहाँ रहते हो?' (Where do you live?)",
          words: ["live", "do", "Where", "you"],
          correctAnswer: ["Where", "do", "you", "live"]
        },
        {
          type: "speech",
          speechText: "Why are you late",
          questionHindi: "इस वाक्य को बोलें: 'Why are you late?'"
        }
      ]
    }
  ],
  advanced: [
    {
      id: "a1",
      titleHindi: "1. नौकरी के लिए इंटरव्यू",
      titleEnglish: "Job Interview",
      descriptionHindi: "इंटरव्यू में आत्मविश्वास से अंग्रेजी में अपनी ताकत और अनुभव बताना सीखें।",
      descriptionEnglish: "Learn to describe your strengths and experience confidently in interviews.",
      xpReward: 100,
      cards: [
        {
          english: "Tell me about yourself.",
          hindi: "मुझे अपने बारे में बताएं।",
          pronunciation: "टेल मी अबाउट योरसेल्फ",
          useCase: "इंटरव्यू में पूछा जाने वाला सबसे पहला और महत्वपूर्ण प्रश्न।"
        },
        {
          english: "I have three years of experience in this field.",
          hindi: "मुझे इस क्षेत्र में तीन साल का अनुभव है।",
          pronunciation: "आई हैव थ्री ईयर्स ऑफ़ एक्सपीरियंस इन दिस फील्ड",
          useCase: "अपने पिछले कार्य अनुभव को बताने के लिए।"
        },
        {
          english: "My strengths are teamwork and problem-solving.",
          hindi: "मेरी ताकत टीमवर्क (समूह में काम करना) और समस्याओं को हल करना है।",
          pronunciation: "माई स्ट्रेंग्थ्स आर टीमवर्क एंड प्रॉब्लम-सॉल्विंग",
          useCase: "अपने पेशेवर गुणों और शक्तियों को दर्शाने के लिए।"
        },
        {
          english: "Why do you want to join our company?",
          hindi: "आप हमारी कंपनी में क्यों शामिल होना चाहते हैं?",
          pronunciation: "वाय डू यू वांट टू जॉइन आवर कंपनी?",
          useCase: "कंपनी में अपनी रुचि और समर्पण को साबित करने का प्रश्न।"
        }
      ],
      grammar: {
        titleHindi: "अनुभव बताने के लिए Present Perfect Tense का प्रयोग",
        contentHindi: `जब हम अपने पिछले अनुभवों की बात करते हैं जिसका असर वर्तमान में भी है, तब हम **Present Perfect Tense** (Subject + has/have + Verb 3rd form) का प्रयोग करते हैं।
- *जैसे:* I **have worked** in Delhi. (मैंने दिल्ली में काम किया है।)
- जब समय का बिंदु निश्चित हो और काम अभी भी जारी हो (जैसे: 3 साल से), तो **Present Perfect Continuous** भी उपयोग करते हैं: 
  *जैसे:* I **have been working** here **for** three years.`
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
    },
    {
      id: "a2",
      titleHindi: "2. अपनी राय और सहमति व्यक्त करना",
      titleEnglish: "Expressing Opinions & Agreement",
      descriptionHindi: "औपचारिक चर्चाओं में शिष्टता से अपनी राय देना, दूसरों से सहमत या असहमत होना सीखें।",
      descriptionEnglish: "Learn to politely state your opinion, agree, or disagree in formal meetings.",
      xpReward: 100,
      cards: [
        {
          english: "In my opinion, we should focus on quality.",
          hindi: "मेरी राय में, हमें गुणवत्ता पर ध्यान देना चाहिए।",
          pronunciation: "इन माई ओपिनियन, वी शुड फोकस ऑन क्वालिटी",
          useCase: "चर्चा में अपनी निजी राय सामने रखने के लिए।"
        },
        {
          english: "I completely agree with you.",
          hindi: "मैं आपकी बात से पूरी तरह सहमत हूँ।",
          pronunciation: "आई कम्प्लीटली अग्री विद यू",
          useCase: "किसी के विचार का पूर्ण समर्थन करने के लिए।"
        },
        {
          english: "I respect your point, but I disagree.",
          hindi: "मैं आपके विचार का सम्मान करता हूँ, लेकिन मैं असहमत हूँ।",
          pronunciation: "आई रिस्पेक्ट योर पॉइंट, बट आई डिसअग्री",
          useCase: "विनम्रतापूर्वक और बिना किसी कड़वाहट के असहमति व्यक्त करने के लिए।"
        },
        {
          english: "Could you please explain that further?",
          hindi: "क्या आप कृपया इसे और स्पष्ट कर सकते हैं?",
          pronunciation: "कुड यू प्लीज एक्सप्लेन दैट फर्दर?",
          useCase: "चर्चा में किसी बिंदु पर अधिक स्पष्टीकरण मांगने के लिए।"
        }
      ],
      grammar: {
        titleHindi: "सभ्य असहमति जताने की कला (Polite Disagreement)",
        contentHindi: `पेशेवर माहौल में सीधे "You are wrong" (आप गलत हैं) कहना रूखा और असभ्य माना जाता है। 
इसके बजाय, इन वाक्यों का प्रयोग करें:
- **I respect your point, but...** (मैं आपके विचार का सम्मान करता हूँ, लेकिन...)
- **I see what you mean, but I have a different view.** (मैं समझता हूँ कि आपका क्या मतलब है, लेकिन मेरा दृष्टिकोण अलग है।)`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "किसी मीटिंग में सभ्य तरीके से अपनी असहमति जताने के लिए कौन सा वाक्य सही है?",
          options: [
            "You are completely wrong.",
            "I don't like your idea.",
            "I respect your point, but I disagree.",
            "Shut up, your point is bad."
          ],
          correctAnswer: "I respect your point, but I disagree."
        },
        {
          type: "speech",
          speechText: "In my opinion this is correct",
          questionHindi: "इस वाक्य को बोलें: 'In my opinion, this is correct'"
        }
      ]
    },
    {
      id: "a3",
      titleHindi: "3. काल्पनिक परिस्थितियां (Conditional Sentences)",
      titleEnglish: "Imaginary Tenses & Conditionals",
      descriptionHindi: "कल्पनाओं और शर्तों (जैसे 'अगर मैं राजा होता तो...') पर आधारित वाक्य बनाना सीखें।",
      descriptionEnglish: "Learn to construct conditional sentences for hypothetical scenarios.",
      xpReward: 100,
      cards: [
        {
          english: "If I were the Prime Minister, I would help everyone.",
          hindi: "अगर मैं प्रधानमंत्री होता, तो सबकी मदद करता। (काल्पनिक परिस्थिति)",
          pronunciation: "इफ आई वर द प्राइम मिनिस्टर, आई वुड हेल्प एवरीवन",
          useCase: "किसी असंभव या पूर्णतः काल्पनिक स्थिति की कल्पना करने के लिए।"
        },
        {
          english: "If it rains tomorrow, we will stay at home.",
          hindi: "अगर कल बारिश होगी, तो हम घर पर रहेंगे। (भविष्य की संभावित शर्त)",
          pronunciation: "इफ इट रेन्स टुमॉरो, वी विल स्टे एट होम",
          useCase: "भविष्य की किसी संभावित परिस्थिति के परिणाम को बताने के लिए।"
        },
        {
          english: "If you study hard, you will pass the exam.",
          hindi: "अगर तुम कड़ी मेहनत करोगे, तो परीक्षा पास कर लोगे।",
          pronunciation: "इफ यू स्टडी हार्ड, यू विल पास द एग्जाम",
          useCase: "किसी कार्य के निश्चित या संभावित परिणाम को दर्शाने के लिए।"
        }
      ],
      grammar: {
        titleHindi: "कंडीशनल वाक्यों के नियम (Types of Conditionals)",
        contentHindi: `कंडीशनल (शर्त वाले) वाक्यों में मुख्य रूप से दो भाग होते हैं: **If-clause (शर्त)** और **Main clause (परिणाम)**।
1. **संभावित भविष्य (Type 1)**: If + Present Simple, will + Verb 1st form.
   *जैसे:* If you **come** (Present Simple), I **will meet** you.
2. **काल्पनिक वर्तमान/असंभव स्थिति (Type 2)**: If + Subject + **were** (सभी कर्ताओं के साथ were), Subject + **would** + Verb 1st form.
   *जैसे:* If I **were** a bird, I **would** fly.`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "खाली स्थान भरें: 'If she _____ harder, she would pass.' (काल्पनिक वर्तमान)",
          options: ["study", "studies", "studied", "will study"],
          correctAnswer: "studied"
        },
        {
          type: "reorder",
          questionHindi: "व्यवस्थित करें: 'यदि मैं अमीर होता, तो एक नया घर खरीदता।' (If I were rich, I would buy a new house.)",
          words: ["a new house", "If", "I would buy", "were rich,", "I"],
          correctAnswer: ["If", "I", "were rich,", "I would buy", "a new house"]
        },
        {
          type: "speech",
          speechText: "If I were you I would try again",
          questionHindi: "इस वाक्य को बोलें: 'If I were you, I would try again'"
        }
      ]
    },
    {
      id: "a4",
      titleHindi: "4. अंग्रेजी मुहावरे और वाक्यांश",
      titleEnglish: "Idioms & Conversational Phrases",
      descriptionHindi: "अंग्रेजी बातचीत को आकर्षक और प्रभावी बनाने वाले लोकप्रिय मुहावरे सीखें।",
      descriptionEnglish: "Learn popular idioms to make your English sound natural and expressive.",
      xpReward: 100,
      cards: [
        {
          english: "A piece of cake",
          hindi: "बहुत आसान काम (बच्चों का खेल)",
          pronunciation: "अ पीस ऑफ़ केक",
          useCase: "जब कोई काम बहुत आसान हो (जैसे: 'This exam was a piece of cake' - यह परीक्षा बहुत आसान थी)।"
        },
        {
          english: "Break a leg",
          hindi: "शुभकामनाएं (Good Luck!)",
          pronunciation: "ब्रेक अ लेग",
          useCase: "किसी को परीक्षा, स्टेज परफॉर्मेंस या इंटरव्यू से पहले शुभकामना देने के लिए।"
        },
        {
          english: "Once in a blue moon",
          hindi: "ईद का चाँद होना (बहुत कम होने वाली घटना)",
          pronunciation: "वन्स इन अ ब्लू मून",
          useCase: "जो काम कभी-कभार ही होता हो (जैसे: 'He goes to temple once in a blue moon')।"
        },
        {
          english: "Under the weather",
          hindi: "तबीयत ठीक न होना / अस्वस्थ महसूस करना",
          pronunciation: "अंडर द वेदर",
          useCase: "जब आप थोड़ा बीमार महसूस कर रहे हों।"
        }
      ],
      grammar: {
        titleHindi: "मुहावरों का शाब्दिक बनाम वास्तविक अर्थ (Idioms vs Literal Meanings)",
        contentHindi: `मुहावरे (Idioms) ऐसे शब्दों के समूह होते हैं जिनका शाब्दिक (word-by-word) अर्थ निकालने पर वह बेतुका लगता है, लेकिन उनका सांस्कृतिक और व्यावहारिक अर्थ अलग और गहरा होता है।
- **Break a leg** का शाब्दिक अर्थ है 'पैर तोड़ना', लेकिन वास्तव में इसका अर्थ है **'गुड लक' (शुभकामनाएं)**।
- **A piece of cake** का शाब्दिक अर्थ है 'केक का टुकड़ा', लेकिन वास्तव में इसका अर्थ है **'बहुत सरल काम'**।`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "यदि आपको किसी दोस्त को परीक्षा देने जाने से पहले शुभकामना देनी हो, तो आप क्या कहेंगे?",
          options: ["Break a leg!", "Under the weather!", "Once in a blue moon!", "A piece of cake!"],
          correctAnswer: "Break a leg!"
        },
        {
          type: "speech",
          speechText: "This exam was a piece of cake",
          questionHindi: "इस वाक्य को बोलें: 'This exam was a piece of cake'"
        }
      ]
    },
    {
      id: "a5",
      titleHindi: "5. भाषण और कहानी सुनाना",
      titleEnglish: "Public Speaking & Storytelling",
      descriptionHindi: "अंग्रेजी में विचारों को जोड़ने वाले शब्द (Connectors) और धाराप्रवाह बात करना सीखें।",
      descriptionEnglish: "Learn connector words to join thoughts and speak English fluently.",
      xpReward: 100,
      cards: [
        {
          english: "However",
          hindi: "तथापि / हालांकि / लेकिन",
          pronunciation: "हाउएवर",
          useCase: "दो विरोधी विचारों को जोड़ने के लिए (जैसे: 'She is small; however, she is very strong')।"
        },
        {
          english: "Therefore",
          hindi: "इसलिए / अतः",
          pronunciation: "देयरफ़ोर",
          useCase: "किसी परिणाम या निष्कर्ष को दर्शाने के लिए (जैसे: 'I was sick; therefore, I could not attend the class')।"
        },
        {
          english: "Meanwhile",
          hindi: "इसी दौरान / इस बीच",
          pronunciation: "मीनव्हाइल",
          useCase: "एक ही समय पर होने वाली दो घटनाओं को जोड़ने के लिए।"
        },
        {
          english: "First of all, then, finally",
          hindi: "सबसे पहले, फिर, अंत में",
          pronunciation: "फर्स्ट ऑफ़ ऑल, देन, फाइनली",
          useCase: "किसी कहानी, रेसिपी या प्रक्रिया को क्रमवार बताने के लिए।"
        }
      ],
      grammar: {
        titleHindi: "वाक्य जोड़ने वाले शब्द (Transition Connectors)",
        contentHindi: `भाषण देने या लंबी बातें करने के लिए विचारों का आपस में जुड़ना ज़रूरी है। इन्हें जोड़ने वाले शब्दों को **Connectors** कहते हैं:
- **First of all**... (सबसे पहले...) से शुरुआत करें।
- उसके बाद अपनी बात को आगे बढ़ाने के लिए **Then** (फिर) या **Next** (उसके बाद) बोलें।
- परिणाम बताने के लिए **Therefore** (अतः/इसलिए) का प्रयोग करें।
- और अंत में अपनी बात समाप्त करने के लिए **Finally** (अंततः/अंत में) बोलें।`
      },
      practice: [
        {
          type: "mcq",
          questionHindi: "खाली स्थान भरें: 'I did not study; _____, I failed the test.'",
          options: ["However", "Therefore", "Meanwhile", "First of all"],
          correctAnswer: "Therefore"
        },
        {
          type: "reorder",
          questionHindi: "व्यवस्थित करें: 'सबसे पहले, मैं हाथ धोता हूँ।' (First of all, I wash my hands.)",
          words: ["hands.", "my", "I wash", "First of all,", "then"],
          correctAnswer: ["First of all,", "I wash", "my", "hands."]
        },
        {
          type: "speech",
          speechText: "Therefore we decided to wait",
          questionHindi: "इस वाक्य को बोलें: 'Therefore, we decided to wait'"
        }
      ]
    }
  ]
};
