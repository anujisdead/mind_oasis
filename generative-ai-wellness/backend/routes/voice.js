const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const { transcribeAudio, generateDailySuggestion } = require('../services/openaiService');

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

router.post('/speak', upload.single('voice'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filepath = req.file.path;

    // 1. Transcribe voice
    let transcript = "";
    try {
      transcript = await transcribeAudio(filepath);
    } catch (err) {
      console.error("Transcription failed:", err);
    }

    // 2. Generate supportive suggestion
    let suggestion = "";
    if (transcript && transcript.length > 0) {
      try {
        suggestion = await generateDailySuggestion(transcript);
      } catch (err) {
        console.error("Suggestion generation failed:", err);
        suggestion = "Take a short break and do something kind for yourself.";
      }
    }

    // 3. Cleanup temp file
    await fs.remove(filepath);

    res.json({ transcript, suggestion });
  } catch (err) {
    console.error("Speak Out failed:", err);
    res.status(500).json({ error: "Speak Out failed" });
  }
});

module.exports = router;
