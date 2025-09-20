const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  qId: String,
  text: String,
  type: { type: String, enum: ['mcq', 'scale', 'text'], default: 'scale' },
  options: [String],
  weight: { type: Number, default: 1 },
  maxScore: { type: Number, default: 5 } // used to normalize
});

const QuizSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [QuestionSchema],
  createdBy: { type: String, default: "system" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
