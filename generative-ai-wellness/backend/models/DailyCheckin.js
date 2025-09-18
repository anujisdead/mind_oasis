const mongoose = require('mongoose');

const DailyCheckinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moodScale: { type: Number, default: 5 }, // 0..10
  text: { type: String, default: "" },
  sentimentLabel: { type: String }, // e.g., positive/negative/neutral/anxious
  sentimentScore: { type: Number }, // 0..1 confidence
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DailyCheckin', DailyCheckinSchema);
