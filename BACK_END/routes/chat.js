import express from "express";
import { verifyJwt } from "../middleware/auth.js";
import { callLLM } from "../services/llmService.js";
import Chat from "../models/Chat.js";

const router = express.Router();

// chat endpoint
router.post("/", verifyJwt, async (req, res) => {
  try {
    const { message, mode = "teacher", userLang = "en" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const systemPrompt = mode === "teacher"
      ? `You are a language teacher. Correct and explain in ${userLang}.`
      : `You are a casual friend. Chat naturally in ${userLang}.`;

    const reply = await callLLM({ systemPrompt, message, userLang });

    const chat = new Chat({
      userId: req.user.id,
      messages: [
        { role: "user", content: message },
        { role: "assistant", content: reply }
      ]
    });
    await chat.save();

    return res.json({ reply });  // <-- return here ensures no further code runs
  } catch (err) {
    console.error("Error in /api/chat:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;
