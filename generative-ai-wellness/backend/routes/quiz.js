const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const { computeWellnessForUser } = require('../utils/wellness');

// middleware to mock auth for MVP: expects `x-user-id` header OR JWT in Authorization
async function getUserId(req) {
  if (req.headers['x-user-id']) return req.headers['x-user-id'];
  // if you later wire JWT, decode it here
  return null;
}

router.get('/', async (req, res) => {
  try {
    let quizzes = await Quiz.find({});
    // seed a sample quiz if none
    if (!quizzes || quizzes.length === 0) {
      const sample = await Quiz.create({
        title: "Mood Check (MVP)",
        description: "Short mood quiz",
        questions: [
          { qId: "q1", text: "How often have you felt down recently?", type: "scale", maxScore: 5 },
          { qId: "q2", text: "Have you been sleeping well?", type: "scale", maxScore: 5 },
          { qId: "q3", text: "Choose the statement that fits best", type: "mcq", options: ["I feel fine", "Somewhat off", "Very low"], maxScore: 5 }
        ]
      });
      quizzes = [sample];
    }
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to load quizzes" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "not found" });
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed" });
  }
});

/**
 * Submit quiz answers
 * Expects { answers: [{ qId, score }] }
 */
router.post('/:id/submit', async (req, res) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ error: "missing user id header x-user-id for MVP" });

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "quiz not found" });
    const answers = req.body.answers || [];

    // compute total & maxTotal by question weights
    let total = 0, maxTotal = 0;
    quiz.questions.forEach(q => {
      const a = answers.find(x => x.qId === q.qId);
      const s = a && typeof a.score === 'number' ? a.score : 0;
      total += s * (q.weight || 1);
      maxTotal += (q.maxScore || 5) * (q.weight || 1);
    });

    const normalized = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 50;
    const result = await QuizResult.create({
      userId, quizId: quiz._id, answers, totalScore: normalized
    });

    const wellness = await computeWellnessForUser(userId);
    res.json({ quizScore: normalized, quizResultId: result._id, wellness });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "submit failed" });
  }
});

module.exports = router;
