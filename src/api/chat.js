export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Faqat POST so‘rov qabul qilinadi' });
  }

  try {
    const { prompt, currentCode = '', history = [] } = req.body || {};

    if (!prompt || !String(prompt).trim()) {
      return res.status(400).json({ error: 'Savol bo‘sh bo‘lmasligi kerak' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply:
          "AI moduli hali API kalit bilan ulanmagan. Vercel -> Settings -> Environment Variables bo‘limiga GEMINI_API_KEY qo‘shsangiz, men istalgan savolga to‘liq javob bera boshlayman.",
        fallback: true
      });
    }

    const contents = [
      ...(Array.isArray(history)
        ? history.slice(-8).map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(m.text || '') }]
          }))
        : []),
      {
        role: 'user',
        parts: [
          {
            text: currentCode
              ? `Foydalanuvchi savoli: ${prompt}\n\nStudiydagi joriy kod:\n\`\`\`javascript\n${currentCode}\n\`\`\``
              : String(prompt)
          }
        ]
      }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
                  "Sen aqlli, samimiy, aniq va foydali AI yordamchisan. Foydalanuvchiga o‘zbek tilida (agar boshqa tilda so‘rasa, o‘sha tilda) tushunarli, tuzilgan va amaliy javob ber. Algoritm va kod savollarida murakkablik (Big-O) va xatolarni aniq ko‘rsat; boshqa savollarda ham to‘liq va lo‘nda javob ber."
              }
            ]
          },
          contents
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'Gemini API xatoligi'
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .filter(Boolean)
        .join('\n') || 'Javob qaytarilmadi.';

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server xatoligi' });
  }
}