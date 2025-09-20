const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String },
  passwordHash: { type: String },
  preferences: {
    dailyReminderTime: { type: String, default: "09:00" },
    shareAnonymized: { type: Boolean, default: true }
  },
  lastLoginAt: { type: Date, default: null },
  streakCount: { type: Number, default: 0 },
  quizHistory: [   // ✅ NEW
    {
      date: { type: Date, default: Date.now },
      score: Number,
      category: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
