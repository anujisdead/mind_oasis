const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateDailyQuiz() {
  const prompt = `
  Create a JSON array of up to 6 adaptive daily wellness questions for a student.
  - Each question must have: qId, text, type ("mcq" | "scale" | "text"), maxScore, and optionally options (for mcq) and next (map of option->qId).
  - Make it conversational and supportive, not clinical.
  - Use branching via "next" to adapt later questions based on earlier answers.
  - Ensure at most 6 questions in any flow.
  Example:
  [
    {
      "qId": "q1",
      "text": "How do you feel right now?",
      "type": "mcq",
      "options": ["Good", "Okay", "Stressed", "Sad"],
      "maxScore": 5,
      "next": { "1": "q2_good", "2": "q2_okay", "3": "q2_stress", "4": "q2_sad" }
    },
    { "qId": "q2_good", "text": "What made you feel good today?", "type": "text", "maxScore": 5 }
  ]
  `;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a supportive quiz generator for mental wellness." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  return JSON.parse(res.choices[0].message.content);
}

module.exports = { generateDailyQuiz };
