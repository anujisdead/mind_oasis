const express = require('express');
const router = express.Router();
const DailyCheckin = require('../models/DailyCheckin');
const { analyzeTextMood } = require('../services/openaiService');
const { computeWellnessForUser } = require('../utils/wellness');

async function getUserId(req) {
  if (req.headers['x-user-id']) return req.headers['x-user-id'];
  return null;
}

router.post('/', async (req, res) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ error: "missing user id header x-user-id for MVP" });

    const { moodScale = 5, text = "", tags = [] } = req.body;
    let sentimentLabel = null;
    let sentimentScore = null;
    if (text && text.trim().length > 2) {
      try {
        const analysis = await analyzeTextMood(text);
        sentimentLabel = analysis.label;
        sentimentScore = Number(analysis.confidence) || 0.5;
      } catch (err) {
        console.warn("OpenAI analyze failed:", err);
      }
    }

    const checkin = await DailyCheckin.create({
      userId, moodScale, text, tags, sentimentLabel, sentimentScore
    });

    const wellness = await computeWellnessForUser(userId);
    res.json({ checkin, wellness });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to save checkin" });
  }
});

router.get('/score', async (req, res) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ error: "missing user id header x-user-id for MVP" });
    const wellness = await computeWellnessForUser(userId);
    res.json(wellness);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to compute score" });
  }
});

module.exports = router;
