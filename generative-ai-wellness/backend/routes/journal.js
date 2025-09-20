const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const auth = require('../middleware/auth');

// Create journal entry
router.post('/', auth, async (req, res) => {
  try {
    const { title = "", body, moodScale = null } = req.body;
    if (!body || body.trim().length === 0) return res.status(400).json({ error: "body required" });
    const entry = await Journal.create({ userId: req.userId, title, body, moodScale });
    res.json({ entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to save journal" });
  }
});

// List last N journals
router.get('/', auth, async (req, res) => {
  try {
    const q = await Journal.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(20);
    res.json(q);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to load journals" });
  }
});

module.exports = router;
