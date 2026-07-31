// API endpoint: /api/generate-question
// Generates a dynamic English-Hindi practice question using Gemini / AI API or smart curriculum fallback.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { topic = 'General English', level = 'beginner', goal = 'speaking', type = 'mcq' } = req.body || {};

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `Generate a single ${level} level English learning question for Hindi speakers learning English for ${goal} goal.
Topic: ${topic}.
Question Type: ${type} (must be one of 'mcq', 'reorder', 'listening', 'speech').

Return ONLY a JSON object with this exact structure:
{
  "id": "gen_${Date.now()}",
  "type": "${type}",
  "questionHindi": "Hindi instruction or translation",
  "questionEnglish": "English phrase or prompt",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": "Option 1",
  "phoneticHindi": "Devanagari phonetic helper, e.g. ह्वाट इज योर नेम?",
  "speechText": "Target English sentence for speaking or listening",
  "audioText": "Target English sentence for audio listening",
  "explanationHindi": "Brief Hindi explanation why the answer is correct"
}`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );

      const geminiData = await geminiRes.json();
      const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (responseText) {
        const parsed = JSON.parse(responseText);
        res.status(200).json({ success: true, question: parsed, source: 'ai' });
        return;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart dynamic generator:', err);
    }
  }

  // Smart Dynamic Fallback Generator when API key is unconfigured or rate limited
  const fallbackQuestions = [
    {
      id: `gen_fb_${Date.now()}`,
      type: 'mcq',
      questionHindi: 'सही अनुवाद चुनें: "मैं रोज़ अंग्रेज़ी सीखता हूँ।"',
      questionEnglish: 'Choose the correct translation for daily learning:',
      options: ['I learn English every day.', 'I learning English every day.', 'I am learn English every day.', 'I learned English every day.'],
      correctAnswer: 'I learn English every day.',
      explanationHindi: 'साधारण वर्तमान काल (Present Simple) में "I" के साथ क्रिया का मूल रूप उपयोग होता है।'
    },
    {
      id: `gen_fb_${Date.now() + 1}`,
      type: 'reorder',
      questionHindi: 'वाक्य को सही क्रम में व्यवस्थित करें:',
      words: ['What', 'is', 'your', 'name?'],
      correctAnswer: 'What is your name?',
      explanationHindi: 'अंग्रेज़ी प्रश्नों में Question Word (What) सबसे पहले आता है।'
    },
    {
      id: `gen_fb_${Date.now() + 2}`,
      type: 'speech',
      questionHindi: 'इस वाक्य का स्पष्ट उच्चारण करें:',
      questionEnglish: 'Nice to meet you!',
      speechText: 'Nice to meet you',
      phoneticHindi: 'नाइस टू मीट यू',
      explanationHindi: 'यह एक विनम्र अभिवादन है जिसका अर्थ "आपसे मिलकर खुशी हुई" है।'
    }
  ];

  const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
  res.status(200).json({ success: true, question: randomQuestion, source: 'fallback' });
}
