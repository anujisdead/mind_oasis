// models/QuizSession.js
const mongoose = require('mongoose');

const QuizSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [
    {
      qId: String,
      text: String,
      type: { type: String, enum: ["text","scale","mcq"], default: "text" },
      options: [String],
      answer: mongoose.Schema.Types.Mixed
    }
  ],
  currentStep: { type: Number, default: 0 },
  maxSteps: { type: Number, default: 6 },
  isComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizSession', QuizSessionSchema);
