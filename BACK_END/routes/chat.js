import express from "express";
import { callLLM } from "../services/llmService.js";
import { teacherPrompt, peerPrompt } from "../prompts.js";
import { verifyAuth } from "../middleware/auth.js"; 

const router = express.Router();

router.post("/", verifyAuth, async (req, res) => {
  try {
    const { message, role = "teacher", userLang = "English" } = req.body;

    // Select system prompt based on role
    let systemPrompt;
    if (role === "teacher") {
      systemPrompt = teacherPrompt;
    } else if (role === "peer") {
      systemPrompt = peerPrompt;
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    const result = await callLLM({ systemPrompt, message, userLang });
    
    res.json({
      reply: result.text || result,
      usage: result.usage || null,
      truncated: result.finishReason === "MAX_TOKENS"
    });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
