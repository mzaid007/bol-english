// API endpoint: /api/generate-question
// Generates dynamic English-Hindi practice questions using Groq / Grok API (ultra-fast LLaMA-3), Gemini API, or smart fallback.

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

  const groqApiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || process.env.GROK_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  const systemPrompt = `Generate a single ${level} level English learning question for Hindi speakers learning English for ${goal} goal.
Topic: ${topic}.
Question Type: ${type} (must be one of 'mcq', 'reorder', 'listening', 'speech').

Return ONLY a JSON object matching this exact schema:
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

  // 1. Try Groq API (Ultra-fast ~200ms LLaMA 3.3 70B, 14,400 free requests/day)
  if (groqApiKey) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are an expert bilingual English teacher for Hindi speakers. Output ONLY valid JSON.',
            },
            {
              role: 'user',
              content: systemPrompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      const groqData = await groqRes.json();
      const content = groqData?.choices?.[0]?.message?.content;

      if (content) {
        const parsed = JSON.parse(content);
        res.status(200).json({ success: true, question: parsed, provider: 'groq' });
        return;
      }
    } catch (err) {
      console.warn('Groq API call failed, attempting fallback provider:', err);
    }
  }

  // 2. Fallback to Gemini API if configured
  if (geminiApiKey) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );

      const geminiData = await geminiRes.json();
      const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (responseText) {
        const parsed = JSON.parse(responseText);
        res.status(200).json({ success: true, question: parsed, provider: 'gemini' });
        return;
      }
    } catch (err) {
      console.warn('Gemini API call failed:', err);
    }
  }

  // 3. Smart Dynamic Fallback Generator when no API keys are supplied
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
  res.status(200).json({ success: true, question: randomQuestion, provider: 'fallback' });
}
