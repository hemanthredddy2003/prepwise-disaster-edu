const Groq = require('groq-sdk');
const ChatSession = require('../models/mongodb/ChatSession');
const { sendSuccess, sendError } = require('../utils/response');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are PrepBot, an expert AI assistant for disaster preparedness education built into the PREPWISE system. You help students, teachers, and emergency staff learn about:

- Natural disasters: floods, earthquakes, cyclones, fires, tsunamis, landslides
- Emergency preparedness: kits, evacuation plans, shelter-in-place protocols
- First aid and CPR basics
- Crisis communication strategies
- Risk assessment and hazard identification
- Drill planning and safety procedures
- Post-disaster recovery and mental health

Guidelines:
- Be concise, clear and actionable — use bullet points for steps
- Always prioritize life safety in your advice
- For medical emergencies, always recommend calling emergency services first
- Use simple language suitable for students aged 14+
- Be encouraging and supportive
- Keep responses focused on disaster preparedness topics
- If asked off-topic questions, gently redirect to preparedness topics`;

const sendMessage = async (req, res) => {
  try {
    const { message, session_id } = req.body;
    if (!message || message.trim() === '') return sendError(res, 'Message is required.', 400);

    let session;
    if (session_id) {
      session = await ChatSession.findById(session_id);
    }
    if (!session) {
      session = new ChatSession({
        user_id: req.user.id,
        user_name: req.user.name,
        title: message.substring(0, 50),
        messages: [],
      });
    }

    session.messages.push({ role: 'user', content: message.trim() });

    const recentMessages = session.messages.slice(-20).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...recentMessages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0].message.content;

    session.messages.push({ role: 'assistant', content: assistantMessage });

    if (session.messages.length === 2) {
      session.title = message.substring(0, 60);
    }

    await session.save();

    return sendSuccess(res, {
      session_id: session._id,
      message: assistantMessage,
      title: session.title,
    });

  } catch (err) {
    console.error('Chat error:', err);
    return sendError(res, 'AI service error: ' + err.message);
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ user_id: req.user.id })
      .select('_id title created_at updated_at')
      .sort({ updated_at: -1 })
      .limit(20);
    return sendSuccess(res, { sessions });
  } catch (err) { return sendError(res, err.message); }
};

const getSession = async (req, res) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!session) return sendError(res, 'Session not found.', 404);
    return sendSuccess(res, { session });
  } catch (err) { return sendError(res, err.message); }
};

const deleteSession = async (req, res) => {
  try {
    await ChatSession.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    return sendSuccess(res, {}, 'Session deleted.');
  } catch (err) { return sendError(res, err.message); }
};

module.exports = { sendMessage, getSessions, getSession, deleteSession };