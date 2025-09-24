// routes/chat.js
import express from "express";
import { verifyJwt } from "../middleware/auth.js";
import { callLLM } from "../services/llmService.js";
import Chat from "../models/Chat.js";

const router = express.Router();

// POST /api/chat
router.post("/", verifyJwt, async (req, res) => {
  try {
    const { message, mode = "teacher", userLang = "en" } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    // choose budgets per mode (env or fallback)
    const teacherBudget = parseInt(process.env.TEACHER_MAX_TOKENS || "2048", 10);
    const friendBudget = parseInt(process.env.FRIEND_MAX_TOKENS || "200", 10);
    const maxOutputTokens = mode === "teacher" ? teacherBudget : friendBudget;
    const temperature = parseFloat(process.env.GEMINI_TEMPERATURE || "0.25");

    const systemPrompt = mode === "teacher"
      ? `You are a concise language teacher. Correct the sentence, give a 1-2 sentence explanation and a one-line exercise. Do not provide chain-of-thought. Keep the response concise.`
      : `You are a friendly conversational partner. Chat casually; don't correct unless asked.`;

    // call LLM - expect an object { text, usage, finishReason }
    const llmResult = await callLLM({
      systemPrompt,
      message,
      userLang,
      maxOutputTokens,
      temperature
    });

    // llmResult may already be a string in older code; handle both shapes safely:
    const text = typeof llmResult === "string" ? llmResult : (llmResult?.text || "");
    const usage = llmResult?.usage || llmResult?.usageMetadata || null;
    const finishReason = llmResult?.finishReason || null;

    // Save chat: ensure content fields are strings (no objects)
    const chat = new Chat({
      userId: req.user.id,
      messages: [
        { role: "user", content: String(message) },
        { role: "assistant", content: String(text) }
      ],
      usage,
      finishReason
    });
    await chat.save();

    return res.json({
      reply: text,
      usage,
      truncated: finishReason === "MAX_TOKENS"
    });

  } catch (err) {
    console.error("Error in /api/chat:", err);
    // keep the error message friendly but useful for dev
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;
