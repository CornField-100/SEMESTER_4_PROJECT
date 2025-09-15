// routes/chat.js
import express from 'express';
import { verifyJwt } from '../middleware/auth.js'; // optional auth
import { callLLM } from '../services/llmService.js';

const router = express.Router();

// POST /api/chat
router.post('/', verifyJwt /* optional */, async (req, res) => {
  try {
    const { message, conversationId, mode = 'teacher', userLang = 'en' } = req.body;
    // Build system prompt based on mode & userLang
    const systemPrompt = mode === 'teacher'
      ? `You are a helpful language teacher. Correct grammar, explain mistakes concisely...`
      : `You are a friendly conversational partner. Keep replies casual...`;

    const llmResponse = await callLLM({ systemPrompt, message, conversationId, userLang });
    // Optionally save to DB if user opted in
    res.json({ success: true, reply: llmResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
