const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: "" },
  body: { type: String, required: true },
  moodScale: { type: Number, default: null }, // optional
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journal', JournalSchema);
