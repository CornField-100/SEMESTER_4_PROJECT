import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const DEFAULT_MAX_OUTPUT_TOKENS = parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || "150", 10);
const DEFAULT_TEMPERATURE = parseFloat(process.env.GEMINI_TEMPERATURE || "0.25");

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

function deepFindText(node) {
  if (node == null) return null;
  if (typeof node === "string") return node;
  if (Array.isArray(node)) {
    // join multiple pieces into one passage if present
    const parts = node.map((el) => deepFindText(el)).filter(Boolean);
    if (parts.length) return parts.join("");
    return null;
  }
  if (typeof node === "object") {
    // direct 'text' field
    if (typeof node.text === "string" && node.text.length) return node.text;
    // 'parts' array common pattern
    if (node.parts) {
      const p = deepFindText(node.parts);
      if (p) return p;
    }
    // 'content' field common pattern
    if (node.content) {
      const c = deepFindText(node.content);
      if (c) return c;
    }
    // try other nested keys
    for (const k of Object.keys(node)) {
      const v = deepFindText(node[k]);
      if (v) return v;
    }
  }
  return null;
}

/**
 * callLLM - call Google Gemini and return reply text
 * @param {{systemPrompt:string, message:string, userLang?:string, maxOutputTokens?:number, temperature?:number}} params
 * @returns {Promise<string>}
 */
export async function callLLM({
  systemPrompt = "",
  message = "",
  userLang = "en",
  maxOutputTokens = DEFAULT_MAX_OUTPUT_TOKENS,
  temperature = DEFAULT_TEMPERATURE,
} = {}) {
  if (!GEMINI_API_KEY) {
    const warning = "Gemini API key not configured (GEMINI_API_KEY).";
    console.warn(warning);
    return `ERROR: ${warning} Please set GEMINI_API_KEY in your .env to call Gemini.`;
  }

  try {
    const prompt = `${systemPrompt}\nUser (${userLang}): ${message}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        temperature,
        maxOutputTokens,
        candidateCount: 1,
      },
    });

    const usage = response?.usageMetadata || response?.usage || null;
    const finishReason = response?.candidates?.[0]?.finishReason || response?.finishReason || null;
    const text = deepFindText(response) || "...";

    return { text, usage, finishReason }
  } catch (err) {
    console.error("LLM service (Gemini) error:", err);
    // bubble a friendlier message for known quota/rate issues
    const msg = (err?.statusCode === 429 || (err?.message && err.message.toLowerCase().includes("quota"))) ?
      "Gemini API quota exceeded or rate limited. Check billing/quotas." :
      err?.message || "Unknown Gemini error";
    throw new Error(msg);
  }
}
