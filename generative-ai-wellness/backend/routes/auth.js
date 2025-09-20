const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// --- Signup ---
router.post('/signup', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email & password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "user exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash: hash });

    // ✅ include id, name, and email in JWT payload
    const payload = { id: user._id, name: user.name, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "signup failed" });
  }
});

// --- Login ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email & password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    // ✅ include id, name, and email in JWT payload
    const payload = { id: user._id, name: user.name, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "login failed" });
  }
});

module.exports = router;
