const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check root route
app.get('/', (req, res) => {
  res.send("✅ Generative AI Wellness Backend is running!");
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quizzes', require('./routes/quiz'));
app.use('/api/checkins', require('./routes/checkin'));
app.use('/api/voice', require('./routes/voice'));

// DB connect
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${process.env.PORT}`);
  });
}).catch(err => console.error("MongoDB Error:", err));
