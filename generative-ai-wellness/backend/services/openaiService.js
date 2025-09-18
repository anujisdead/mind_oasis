const fs = require('fs');
const OpenAI = require('openai');
const path = require('path');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Transcribe an audio file using OpenAI Whisper (or hosted transcription).
 * @param {string} filePath - local path to audio file
 * @returns {Promise<string>} transcript
 */
async function transcribeAudio(filePath) {
  const fileStream = fs.createReadStream(filePath);
  // Node SDK uses client.audio.transcriptions.create
  const resp = await client.audio.transcriptions.create({
    file: fileStream,
    model: "gpt-4o-transcribe" in client ? "whisper-1" : "whisper-1", // keep whisper-1
    // note: depending on the client version your environment may require model: "whisper-1"
  });
  if (!resp || !resp.text) return "";
  return resp.text;
}

/**
 * Analyze text mood & return structured info.
 * We'll instruct the model to respond with JSON for easy parsing.
 * @param {string} text
 * @returns {Promise<{label:string, confidence:number, rationale:string}>}
 */
async function analyzeTextMood(text) {
  const systemPrompt = `You are a concise assistant that maps short youth check-in text to a single emotion label and a confidence (0..1). Respond ONLY with valid JSON with keys: label, confidence, rationale. Labels allowed: happy, sad, anxious, neutral, angry, stressed, depressed. Confidence should be a number between 0 and 1. Keep rationale short.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Text: """${text}"""` }
  ];

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 200,
    temperature: 0.0
  });

  const content = completion.choices?.[0]?.message?.content ?? "";
  // Try to parse JSON from content. Be forgiving.
  let json = { label: "neutral", confidence: 0.5, rationale: "" };
  try {
    // find first "{" ... "}" block
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      const block = content.slice(start, end + 1);
      json = JSON.parse(block);
    } else {
      // fallback: try to parse whole content
      json = JSON.parse(content);
    }
  } catch (err) {
    // if parse fails, attempt simple heuristic
    json.rationale = content.slice(0, 300);
  }
  // Ensure keys exist and normalize
  json.label = json.label || "neutral";
  json.confidence = Number(json.confidence) || 0.5;
  json.rationale = json.rationale || "";
  return json;
}

module.exports = {
  transcribeAudio,
  analyzeTextMood
};
