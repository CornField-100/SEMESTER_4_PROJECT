// services/llmService.js
import OpenAI from 'openai'; // if using hosted API
// or import gpt4all wrapper if using local

export async function callLLM({ systemPrompt, message, conversationId, userLang }) {
  // Example: OpenAI completion (synchronous)
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `${systemPrompt}\nUser (${userLang}): ${message}\nAssistant:`;
  const resp = await client.responses.create({
    model: 'gpt-4o-mini', // example; pick actual model available to you
    input: prompt,
    temperature: 0.3,
    max_output_tokens: 512
  });
  return resp.output_text || resp.output?.[0]?.content?.[0]?.text;
}
