const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const auth = require('../middleware/auth');

// Create journal entry
router.post('/', auth, async (req, res) => {
  try {
    const { title = "", body, moodScale = null } = req.body;

    // 🔒 Validation
    if (!body || body.trim().length === 0) {
      return res.status(400).json({ error: "Journal body is required" });
    }

    // ✅ Create entry in DB
    const entry = await Journal.create({
      userId: req.userId,   // comes from auth middleware
      title,
      body,
      moodScale,
    });

    return res.json({ success: true, entry });
  } catch (err) {
    console.error("Journal save failed:", err); // 🔍 Log full error for debugging
    return res.status(500).json({
      error: "Failed to save journal",
      details: err.message, // send reason back to frontend
    });
  }
});

// List last N journals
router.get('/', auth, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(journals);
  } catch (err) {
    console.error("Journal load failed:", err);
    return res.status(500).json({
      error: "Failed to load journals",
      details: err.message,
    });
  }
});

module.exports = router;
