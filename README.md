# 🌿 Mind Oasis

A modern, AI-powered mental wellness platform designed for students and young adults. Mind Oasis provides personalized wellness checks, adaptive daily quizzes, journaling tools, voice analysis, and community features—all powered by generative AI for intelligent, supportive insights.



---

## 🎯 Overview

Mind Oasis is a full-stack web application that combines daily wellness monitoring with AI-driven personalization. The platform helps users track their mental health through interactive check-ins, adaptive quizzes, voice recordings, and journaling—while providing real-time crisis detection and supportive interventions.

### Key Highlights
- **AI-Powered Personalization**: OpenAI GPT-4o-mini generates adaptive quiz questions based on user responses
- **Multi-Modal Wellness Tracking**: Check-ins, quizzes, voice samples, and journaling
- **Crisis Detection**: Real-time keyword detection for crisis situations with immediate resources
- **Login Streak Tracking**: Gamification to encourage daily engagement
- **Community Features**: Anonymous sharing and peer support
- **Sentiment Analysis**: NLP-based mood detection from text responses
- **Wellness Dashboard**: Real-time wellness scores and trends

---

## 📊 Tech Stack

### Backend (Node.js/Express)
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI/ML**: OpenAI API (GPT-4o-mini)
- **Security**: bcryptjs, CORS
- **File Handling**: Multer, fs-extra
- **Environment**: dotenv

### Frontend (React + Vite)
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.6
- **Styling**: Tailwind CSS 4.1.13
- **Linting**: ESLint with React plugins

### Language Composition
- **JavaScript**: 52.1%
- **HTML**: 45.3%
- **CSS**: 2.6%

---

## 🚀 Features

### 1. **User Authentication & Profiles**
- Sign-up and login with JWT-based authentication
- Password encryption with bcryptjs
- User preferences (daily reminder time, anonymized data sharing)
- Login streak tracking

### 2. **Daily Wellness Check-Ins**
- Quick mood scale input (1-5)
- Optional text-based mood descriptions
- Automatic sentiment analysis via OpenAI
- Tag-based mood tracking
- Real-time wellness score computation

### 3. **Adaptive Daily Quizzes**
- AI-generated quiz questions tailored to user context
- Multiple question types:
  - Multiple choice (MCQ)
  - Scale-based (1-5)
  - Open-ended text
- Branching logic: Questions adapt based on previous answers
- Maximum 6 questions per quiz flow
- Quiz history tracking

### 4. **Crisis Detection & Resources**
- Real-time detection of crisis-related keywords
- Immediate intervention with crisis resources:
  - India: Vandrevala Foundation, iCall (TISS)
  - Global helpline directory
- Sensitive, supportive messaging

### 5. **Voice & Journaling**
- Voice sample uploads with transcription
- Mood-tagged journaling
- VoiceSample model with inference details
- Journal history and retrieval

### 6. **Wellness Dashboard**
- Aggregate wellness scores across all data types
- Mood trends and patterns
- Login streak display
- Personalized recommendations

### 7. **Community Features**
- Anonymous data sharing opt-in
- Community insights and support
- Peer engagement

---

## 📁 Project Structure

```
mind_oasis/
├── README.md
├── generative-ai-wellness/
│   ├── backend/
│   │   ├── server.js                 # Express server entry point
│   │   ├── package.json
│   │   ├── .env.example
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js              # User schema with preferences
│   │   │   ├── Quiz.js              # Quiz template schema
│   │   │   ├── QuizSession.js       # Active quiz session tracking
│   │   │   ├── QuizResult.js        # Quiz result storage
│   │   │   ├── DailyCheckin.js      # Daily wellness check-ins
│   │   │   ├── Journal.js           # Journal entries
│   │   │   ├── VoiceSample.js       # Voice recording data
│   │   │   └── CommunityPost.js     # Community sharing
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication endpoints
│   │   │   ├── quiz.js              # Quiz management & answering
│   │   │   ├── checkin.js           # Daily check-in endpoints
│   │   │   ├── voice.js             # Voice upload & analysis
│   │   │   ├── journal.js           # Journaling endpoints
│   │   │   ├── dashboard.js         # Wellness dashboard
│   │   │   └── community.js         # Community features
│   │   └── services/
│   │       ├── quizGenerator.js     # AI-powered quiz generation
│   │       └── openaiService.js     # OpenAI API integration
│   │
│   └── frontend/
│       ├── src/
│       │   ├── App.jsx              # Main app component
│       │   ├── main.jsx             # Entry point
│       │   ├── components/
│       │   │   ├── Checkin.jsx      # Daily check-in UI
│       │   │   ├── Quiz.jsx         # Quiz interface
│       │   │   ├── Journal.jsx      # Journaling UI
│       │   │   ├── VoiceInput.jsx   # Voice recording UI
│       │   │   ├── Dashboard.jsx    # Wellness dashboard
│       │   │   └── Community.jsx    # Community features
│       │   └── assets/
│       ├── package.json
│       ├── vite.config.js
│       └── eslint.config.js
```

---

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** (v16+)
- **npm** or **yarn**
- **MongoDB** (local or cloud connection string)
- **OpenAI API Key**

### Backend Setup

```bash
cd generative-ai-wellness/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
# MONGO_URI=your_mongodb_connection_string
# OPENAI_API_KEY=your_openai_api_key
# JWT_SECRET=your_secret_key
# PORT=5000

# Start development server
npm run dev

# Or start production server
npm start
```

### Frontend Setup

```bash
cd generative-ai-wellness/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Check-ins
- `POST /api/checkins` - Create daily wellness check-in
- `GET /api/checkins/score` - Get current wellness score

### Quizzes
- `POST /api/quizzes/start` - Start new quiz session
- `POST /api/quizzes/:id/answer` - Submit quiz answer
- `GET /api/quizzes/:id` - Get quiz details

### Journaling
- `POST /api/journal` - Create journal entry
- `GET /api/journal/:id` - Get journal entry
- `GET /api/journal/user/:userId` - Get user's journal history

### Voice
- `POST /api/voice/upload` - Upload voice sample
- `GET /api/voice/:id` - Get voice analysis

### Dashboard
- `GET /api/dashboard/wellness` - Get overall wellness stats
- `GET /api/dashboard/trends` - Get wellness trends

### Community
- `POST /api/community/share` - Share anonymized data
- `GET /api/community/insights` - Get community insights

---

## 🤖 AI Features

### Quiz Generation
- Dynamically generates adaptive wellness questions
- Conversational, non-clinical tone
- Branching logic based on user responses
- Maximum 6 questions per session

**Model**: GPT-4o-mini  
**Temperature**: 0.7 (balanced creativity & consistency)

### Sentiment Analysis
- Analyzes user text responses
- Returns sentiment label and confidence score
- Integrates with mood tracking

### Crisis Detection
- Keyword-based crisis detection
- Triggers immediate resource display
- Crisis-level intervention messaging

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS enabled for safe cross-origin requests
- Environment variable protection
- Input validation on all routes
- User data isolation

---

## 📈 Data Models

### User
```javascript
{
  email: String (unique),
  name: String,
  passwordHash: String,
  preferences: {
    dailyReminderTime: String,
    shareAnonymized: Boolean
  },
  lastLoginAt: Date,
  streakCount: Number,
  quizHistory: Array<{date, score, category}>,
  createdAt: Date
}
```

### DailyCheckin
```javascript
{
  userId: String,
  moodScale: Number (1-5),
  text: String,
  tags: Array,
  sentimentLabel: String,
  sentimentScore: Number,
  createdAt: Date
}
```

### QuizSession
```javascript
{
  userId: String,
  questions: Array<{qId, text, type, options, answer}>,
  currentStep: Number,
  maxSteps: Number,
  isComplete: Boolean,
  wellness: {score, category},
  createdAt: Date
}
```

---

## 🧪 Testing & Quality

```bash
# Frontend linting
cd frontend
npm run lint

# Build check
npm run build
```

---

## 🌐 Deployment

### Frontend
Deployed on Vercel (see live demo link above)

### Backend
Configure with your hosting provider (Heroku, Railway, Render, etc.)

**Environment Variables Required:**
- `MONGO_URI` - MongoDB connection string
- `OPENAI_API_KEY` - OpenAI API key
- `JWT_SECRET` - Secret key for JWT
- `PORT` - Server port (default: 5000)

---

## 🛣️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced mood trend analytics
- [ ] Meditation & breathing exercise integration
- [ ] Therapist dashboard (admin features)
- [ ] Multi-language support
- [ ] Real-time crisis hotline integration
- [ ] Social features (peer support groups)
- [ ] Data export & privacy controls

---

## 📝 Environment Variables

Create a `.env` file in `generative-ai-wellness/backend/`:

```
MONGO_URI=mongodb://localhost:27017/wellness
OPENAI_API_KEY=sk-...
JWT_SECRET=your_secret_key_here
PORT=5000
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 💡 Crisis Resources

If you or someone you know is struggling, please reach out:

- **India**: Vandrevala Foundation (1860 266 2345 / 1800 233 3330)
- **India**: iCall TISS (+91 9152987821)
- **Global**: [Find a helpline](https://findahelpline.com)

Mental health matters. You are not alone. 💙

---

## 📄 License

ISC License - See LICENSE file for details

---

## 👨‍💻 Author

**Anuj** - [GitHub Profile](https://github.com/anujisdead)

---

## 📞 Support

For issues, feature requests, or questions:
- Open an [GitHub Issue](https://github.com/anujisdead/mind_oasis/issues)
- Visit the [GitHub Repository](https://github.com/anujisdead/mind_oasis)

---

**Built with ❤️ for mental wellness**
