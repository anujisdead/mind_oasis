const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { computeWellnessForUser } = require('../utils/wellness');

// GET dashboard info
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    const wellness = await computeWellnessForUser(req.userId);

    let loggedToday = false;
    if (user?.lastLoginAt) {
      const last = new Date(user.lastLoginAt);
      const today = new Date();
      loggedToday = last.toDateString() === today.toDateString();
    }

    res.json({ wellness, loggedToday, streakCount: user?.streakCount || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "dashboard fetch failed" });
  }
});

// POST mark login
router.post('/mark-login', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (user.lastLoginAt && user.lastLoginAt.toDateString() === yesterday.toDateString()) {
      user.streakCount += 1; // continued streak
    } else if (!user.lastLoginAt || user.lastLoginAt.toDateString() !== now.toDateString()) {
      user.streakCount = 1; // reset streak
    }
    user.lastLoginAt = now;
    await user.save();

    const wellness = await computeWellnessForUser(req.userId);
    res.json({ ok: true, wellness, streakCount: user.streakCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to mark login" });
  }
});

module.exports = router;
