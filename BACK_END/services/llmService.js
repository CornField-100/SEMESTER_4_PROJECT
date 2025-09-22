// services/llmService.js
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callLLM({ systemPrompt, message, userLang }) {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.3,
      max_tokens: 512
    });

    return resp.choices[0]?.message?.content || "No response generated.";
  } catch (err) {
    console.error("LLM service error:", err);
    throw err; // let Express catch it
  }
}

