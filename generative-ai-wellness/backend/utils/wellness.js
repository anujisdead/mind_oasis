const QuizResult = require('../models/QuizResult');
const DailyCheckin = require('../models/DailyCheckin');
const VoiceSample = require('../models/VoiceSample');

/**
 * Map label/confidence into 0..100 number.
 */
function mapLabelToScore(label, confidence = 0.5) {
  // higher is better (positive wellness)
  label = (label || "neutral").toLowerCase();
  let base;
  if (label === "happy") base = 0.9;
  else if (label === "neutral") base = 0.6;
  else if (label === "sad") base = 0.3;
  else if (label === "anxious" || label === "stressed") base = 0.35;
  else if (label === "depressed" || label === "angry") base = 0.2;
  else base = 0.5;
  return Math.round(base * 100 * Number(confidence || 0.5));
}

/**
 * Compute wellness profile for a user.
 * Aggregates:
 * - last quiz (most recent) normalized 0..100
 * - last checkin (NLP sentiment) mapped 0..100
 * - last voice sample mapped 0..100
 * - engagement: fraction of days with check-ins in last 14 days -> 0..100
 */
async function computeWellnessForUser(userId) {
  // Fetch latest quiz result
  const latestQuiz = await QuizResult.findOne({ userId }).sort({ createdAt: -1 });
  const quizScore = latestQuiz ? Number(latestQuiz.totalScore || 50) : 50;

  // Fetch latest checkin
  const latestCheckin = await DailyCheckin.findOne({ userId }).sort({ createdAt: -1 });
  let textScore = 50;
  if (latestCheckin) {
    textScore = mapLabelToScore(latestCheckin.sentimentLabel, latestCheckin.sentimentScore);
  }

  // Voice
  const latestVoice = await VoiceSample.findOne({ userId }).sort({ createdAt: -1 });
  let voiceScore = 50;
  if (latestVoice) {
    voiceScore = mapLabelToScore(latestVoice.inferredLabel, latestVoice.inferenceConfidence);
  }

  // Engagement: last 14 days checkins:
  const since = new Date(Date.now() - 14 * 24 * 3600 * 1000);
  const recentCount = await DailyCheckin.countDocuments({ userId, createdAt: { $gte: since } });
  const engagement = Math.min(100, Math.round((recentCount / 14) * 100)); // 0..100

  // weights
  const w_quiz = 0.35, w_text = 0.25, w_voice = 0.25, w_eng = 0.15;
  const raw = w_quiz * quizScore + w_text * textScore + w_voice * voiceScore + w_eng * engagement;
  const normalized = Math.round(raw / (w_quiz + w_text + w_voice + w_eng));

  let category = "Low";
  if (normalized < 40) category = "High";
  else if (normalized < 65) category = "Medium";

  return {
    score: normalized,
    category,
    components: {
      quizScore,
      textScore,
      voiceScore,
      engagement
    },
    computedAt: new Date()
  };
}

module.exports = { computeWellnessForUser, mapLabelToScore };
