const dotenv = require('dotenv');
dotenv.config(); // load .env before anything else

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get('/', (req, res) => res.send("✅ Mind Oasis Backend v2 running!"));

// routes
app.use('/api/auth', require('./routes/auth'));         // signup/login
app.use('/api/quizzes', require('./routes/quiz'));      // daily quiz (dynamic)
app.use('/api/checkins', require('./routes/checkin'));  // check-ins
app.use('/api/voice', require('./routes/voice'));       // voice uploads
app.use('/api/journal', require('./routes/journal'));   // journaling
app.use('/api/dashboard', require('./routes/dashboard'));// wellness + login streak
app.use("/api/community", require("./routes/community"));


// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error("MongoDB Error:", err));
