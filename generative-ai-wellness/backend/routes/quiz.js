const express = require('express');
const router = express.Router();
const QuizSession = require('../models/QuizSession');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { openai } = require('../services/openaiService');

// ✅ Simple keyword-based crisis detection
function detectCrisis(answerText = "") {
  const redFlags = [
    "suicide",
    "kill myself",
    "end my life",
    "leave this body",
    "die",
    "ending life",
    "no reason to live",
    "can't go on",
    "take my life"
  ];
  return redFlags.some(flag => answerText.toLowerCase().includes(flag));
}

// ✅ Start a new quiz session
router.post('/start', auth, async (req, res) => {
  try {
    const session = new QuizSession({
      userId: req.userId,
      questions: [
        {
          qId: "q1",
          text: "How are you feeling right now?",
          type: "text",
          options: []
        }
      ]
    });
    await session.save();
    res.json(session);
  } catch (err) {
    console.error("Start quiz error:", err);
    res.status(500).json({ error: "Failed to start quiz" });
  }
});

// ✅ Answer current question and generate next
router.post('/:id/answer', auth, async (req, res) => {
  try {
    const { answer } = req.body;
    const session = await QuizSession.findById(req.params.id);
    if (!session || session.isComplete) {
      return res.status(404).json({ error: "Session not found" });
    }

    // save answer
    session.questions[session.currentStep].answer = answer;
    session.currentStep++;

    // 🚨 Crisis detection
    if (detectCrisis(answer)) {
      session.isComplete = true;
      await session.save();

      return res.json({
        crisis: true,
        message: "⚠️ It looks like you may be in crisis. You're not alone — please reach out immediately.",
        resources: [
          { name: "India: Vandrevala Foundation Helpline", phone: "1860 266 2345 / 1800 233 3330" },
          { name: "India: iCall (TISS)", phone: "+91 9152987821" },
          { name: "Worldwide: Find a helpline", url: "https://findahelpline.com" }
        ],
        wellness: { score: 0, category: "Crisis" },
        session
      });
    }

    // ✅ Check if quiz is complete
    if (session.currentStep >= session.maxSteps) {
      session.isComplete = true;
      await session.save();

      // compute wellness score
      const moodWords = session.questions.map(q => `${q.text}: ${q.answer}`).join("\n");
      const prompt = `Analyze this youth check-in:\n${moodWords}\n\nGive JSON with keys: score (0-100) and category (Low, Medium, High).`;

      let wellness = { score: 50, category: "Medium" };
      try {
        const aiRes = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        });
        wellness = JSON.parse(aiRes.choices[0].message.content);
      } catch (err) {
        console.error("Wellness parse error:", err);
      }

      // ✅ Save quiz result into user history
      try {
        const user = await User.findById(session.userId);
        if (user) {
          user.quizHistory.push({
            date: new Date(),
            score: wellness.score,
            category: wellness.category
          });
          if (user.quizHistory.length > 7) {
            user.quizHistory = user.quizHistory.slice(-7);
          }
          await user.save();
        }
      } catch (err) {
        console.error("Error saving quiz history:", err);
      }

      return res.json({ session, wellness });
    }

    // ✅ Otherwise, generate next supportive question
    const prevAnswers = session.questions
      .map(q => `${q.text}: ${q.answer || ""}`)
      .join("\n");

    const prompt = `Ongoing wellness check-in:\n${prevAnswers}\n\nGenerate the next supportive question (just the text).`;

    let nextQText = "What’s on your mind right now?";
    try {
      const aiRes = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      });
      nextQText = aiRes.choices[0].message.content.trim();
    } catch (err) {
      console.error("AI question gen error:", err);
    }

    const nextQ = {
      qId: "q" + (session.currentStep + 1),
      text: nextQText,
      type: "text",
      options: []
    };

    session.questions.push(nextQ);
    await session.save();

    res.json(session);
  } catch (err) {
    console.error("Answer quiz error:", err);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

module.exports = router;
