const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Transcribe an audio file using OpenAI Whisper.
 * @param {string} filePath
 * @returns {Promise<string>}
 */
async function transcribeAudio(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const resp = await openai.audio.transcriptions.create({
    file: fileStream,
    model: "whisper-1"
  });
  return resp?.text || "";
}

/**
 * Analyze text mood & return structured info.
 * @param {string} text
 * @returns {Promise<{label:string, confidence:number, rationale:string}>}
 */
async function analyzeTextMood(text) {
  const systemPrompt = `You are a concise assistant that maps short youth check-in text to a single emotion label and a confidence (0..1). Respond ONLY with valid JSON with keys: label, confidence, rationale. Labels allowed: happy, sad, anxious, neutral, angry, stressed, depressed. Confidence should be a number between 0 and 1. Keep rationale short.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Text: """${text}"""` }
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 200,
    temperature: 0.0
  });

  const content = completion.choices?.[0]?.message?.content ?? "";
  let json = { label: "neutral", confidence: 0.5, rationale: "" };

  try {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      const block = content.slice(start, end + 1);
      json = JSON.parse(block);
    } else {
      json = JSON.parse(content);
    }
  } catch (err) {
    json.rationale = content.slice(0, 300);
  }

  json.label = json.label || "neutral";
  json.confidence = Number(json.confidence) || 0.5;
  json.rationale = json.rationale || "";
  return json;
}

/**
 * Generate a short adaptive quiz using OpenAI.
 * @param {string} context
 * @returns {Promise<{title:string, description:string, questions:any[]}>}
 */
async function generateQuizWithOpenAI(context = "general wellness") {
  const prompt = `Generate a supportive 6-question adaptive mental wellness quiz.
Context: ${context}.
The quiz should be conversational, each next question can depend on the previous answer.
Return valid JSON with keys: title, description, questions.
Each question: { "qId": "q1", "text": "...", "type": "text|scale|mcq", "options": ["opt1","opt2"] }`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  let data = { title: "Daily Wellness Quiz", description: "Check-in", questions: [] };
  try {
    data = JSON.parse(res.choices[0].message.content);
  } catch (err) {
    console.error("Quiz parse error:", err);
  }

  return data;
}
/**
 * Generate a supportive daily suggestion from transcribed voice input.
 * @param {string} text
 * @returns {Promise<string>}
 */
async function generateDailySuggestion(text) {
  const systemPrompt = `You are a caring wellness companion. 
The user will speak freely about their day. 
Your job:
1. Understand their mood.
2. Suggest 1–2 small, actionable, supportive things they can do to enhance their day. 
3. Keep it short (2-3 sentences max), positive, and empathetic.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `User said: """${text}"""` }
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 150,
    temperature: 0.7
  });

  return completion.choices?.[0]?.message?.content?.trim() || "Try to take a deep breath and do something small that makes you happy today.";
}

module.exports = {
  openai,
  transcribeAudio,
  analyzeTextMood,
  generateQuizWithOpenAI,
  generateDailySuggestion   // ✅ export new function
};



