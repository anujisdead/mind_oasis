const mongoose = require('mongoose');

const VoiceSampleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: String,
  s3Url: String, // optional later if you store in S3
  durationSec: Number,
  transcript: String,
  inferredLabel: String,
  inferenceConfidence: Number,
  inferenceDetails: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VoiceSample', VoiceSampleSchema);
