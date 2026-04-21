const Groq = require("groq-sdk");
let groq = null;
const getGroq = () => {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
};

const getAiQuestion = async (req, res) => {
  const { topic } = req.body;
  const prompt = 'Generate 1 multiple choice quiz question about ' + topic + ' disaster preparedness for Indian students. Return ONLY valid JSON with keys: q, options (array of 4), answer (index 0-3), explanation.';
  try {
    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }]
    });
    const text = completion.choices[0].message.content.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const json = JSON.parse(clean);
    res.json({ question: json });
  } catch (err) {
    console.error("AI Quiz error:", err.message);
    res.status(500).json({ error: "AI question generation failed" });
  }
};

module.exports = { getAiQuestion };
