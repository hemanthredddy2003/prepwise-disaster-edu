const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const { protect } = require("../middleware/auth.middleware");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function detectDisasterType(message) {
  const msg = message.toLowerCase();
  if (/flood|river|water rising/.test(msg)) return "flood";
  if (/fire|wildfire|smoke/.test(msg)) return "wildfire";
  if (/earthquake|quake|tremor/.test(msg)) return "earthquake";
  if (/cyclone|hurricane|typhoon/.test(msg)) return "hurricane";
  if (/tsunami|tidal wave/.test(msg)) return "tsunami";
  if (/first aid|bleeding|cpr|choking|burn/.test(msg)) return "first_aid";
  if (/evacuate|evacuation|escape/.test(msg)) return "evacuation";
  return "general";
}

router.post("/message", protect, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const systemPrompt = `You are PREPWISE AI, a highly intelligent and helpful AI assistant built into the PREPWISE disaster preparedness education platform. You are like Claude or ChatGPT — knowledgeable, articulate, and genuinely helpful.

## YOUR CAPABILITIES
- Expert in disaster preparedness, emergency response, and survival (your primary strength)
- Can answer general knowledge questions, explain concepts, help with math, science, history, coding, and more
- Provide India-specific disaster guidance with correct emergency numbers
- Give first aid instructions clearly and accurately

## COMMUNICATION STYLE
- Be conversational, warm and helpful like a knowledgeable friend
- Use markdown formatting: **bold** for key points, bullet lists, numbered steps
- For emergencies: Lead with immediate action steps, then details
- For general questions: Give direct, accurate, well-structured answers
- Keep responses concise but complete — no unnecessary filler

## INDIA EMERGENCY NUMBERS
- 112: National Emergency (Police/Fire/Ambulance)
- 108: Ambulance
- 101: Fire
- 100: Police  
- 1078: NDRF (National Disaster Response Force)
- 1070: State Disaster Management

## FORMATTING RULES
- Use **bold** for important terms
- Use numbered lists for steps
- Use bullet points for options/lists
- Use headers (##) for long responses
- Use \`code\` for technical terms
- Always end emergency responses with relevant helpline numbers

You are helpful, accurate, safe and honest. Never make up facts. If unsure, say so.`;

    const sanitizedHistory = Array.isArray(history)
      ? history.slice(-8).map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content).slice(0, 1000) }))
      : [];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedHistory,
        { role: "user", content: message }
      ],
      temperature: 0.4,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || "I could not generate a response. Please try again.";
    return res.json({ success: true, message: reply, data: { message: reply } });

  } catch (err) {
    console.error("Chat error:", err.message);
    if (err?.status === 429) return res.status(429).json({ success: false, message: "AI service busy. Please retry." });
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

module.exports = router;
