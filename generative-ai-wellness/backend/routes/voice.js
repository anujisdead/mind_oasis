const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const { transcribeAudio, analyzeTextMood } = require('../services/openaiService');
const VoiceSample = require('../models/VoiceSample');
const { computeWellnessForUser } = require('../utils/wellness');

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.ensureDirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const t = Date.now();
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, `${t}_${safe}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

async function getUserId(req) {
  if (req.headers['x-user-id']) return req.headers['x-user-id'];
  return null;
}

router.post('/upload', upload.single('voice'), async (req, res) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      // remove uploaded file
      if (req.file && req.file.path) await fs.remove(req.file.path);
      return res.status(401).json({ error: "missing user id header x-user-id for MVP" });
    }
    if (!req.file) return res.status(400).json({ error: "no file uploaded. send form field 'voice'." });

    const filepath = req.file.path;
    // Transcribe
    let transcript = "";
    try {
      transcript = await transcribeAudio(filepath);
    } catch (err) {
      console.error("transcription failed:", err);
      transcript = "";
    }

    // Analyze transcript for mood
    let mood = { label: "neutral", confidence: 0.5, rationale: "" };
    if (transcript && transcript.length > 0) {
      try {
        mood = await analyzeTextMood(transcript);
      } catch (err) {
        console.warn("analyzeTextMood failed:", err);
      }
    }

    // Save sample
    const sample = await VoiceSample.create({
      userId,
      filename: path.basename(filepath),
      s3Url: null,
      durationSec: null,
      transcript,
      inferredLabel: mood.label,
      inferenceConfidence: Number(mood.confidence) || 0.5,
      inferenceDetails: { rationale: mood.rationale }
    });

    // Recompute wellness
    const wellness = await computeWellnessForUser(userId);

    res.json({ sample, wellness });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "voice upload failed" });
  }
});

module.exports = router;
