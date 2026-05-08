# 🌿 Mind Oasis

**AI-Powered Mental Wellness Companion for Youth**

Mind Oasis is a full-stack web application designed to provide gentle, supportive mental wellness tools for young people. It leverages **OpenAI's GPT-4o-mini and Whisper** models to deliver adaptive quizzes, mood analysis, voice-based check-ins, private journaling, and a supportive community feed — all wrapped in a clean, modern UI.

> _"Kind, gentle mental wellness for youth."_

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Running Both Servers](#4-running-both-servers)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [AI / ML Integration](#-ai--ml-integration)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🧠 AI-Powered Adaptive Daily Quiz
- Starts with an open-ended question: _"How are you feeling right now?"_
- Uses **GPT-4o-mini** to dynamically generate the next question based on previous answers
- Supports up to 6 adaptive questions per session
- Computes a **Wellness Score (0–100)** with categories: `Low`, `Medium`, `High`
- Stores quiz history per user (last 7 results)

### 🚨 Real-Time Crisis Detection
- Keyword-based safety net that detects crisis language (e.g., _"suicide"_, _"end my life"_)
- Immediately halts the quiz and surfaces **emergency helpline resources** (India + Worldwide)
- Returns a crisis flag to the frontend for safe UI handling

### 📓 Private Journaling
- Write private journal entries with optional mood scale and title
- Entries are stored securely per user and sorted by date
- View past entries in reverse chronological order (last 20)

### 🎙️ Voice-Based "Speak Out" Check-In
- Record audio directly in the browser using the Web Audio API
- Audio is uploaded and transcribed using **OpenAI Whisper**
- The transcript is analyzed by GPT-4o-mini to generate a short, empathetic **wellness suggestion**
- Temporary audio files are auto-cleaned from the server after processing

### 🌐 Anonymous Community Feed
- Post supportive messages or ask questions
- React to posts with ❤️ Likes, 🔼 Upvotes, and 🔽 Downvotes
- All posts display the user's name (or "Anonymous") with relative timestamps
- Feed is sorted by most recent posts

### 📊 Wellness Dashboard
- Aggregated **Wellness Score** computed from 4 sources:
  - Quiz results (35% weight)
  - Text sentiment from check-ins (25% weight)
  - Voice sentiment analysis (25% weight)
  - Engagement frequency over last 14 days (15% weight)
- Score is categorized as `Low`, `Medium`, or `High`
- Displays the current **login streak** with daily streak tracking

### 🔥 Daily Login Streak
- Automatic streak tracking on each login
- Consecutive daily logins increment the streak counter
- Missing a day resets the streak to 1
- Streak displayed prominently on the dashboard

### 🔐 JWT Authentication
- Email + Password signup/login with **bcrypt** password hashing
- JWT tokens (7-day expiry) for stateless authentication
- All protected routes use Bearer token middleware
- Token stored in `localStorage` on the frontend

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library (loaded via CDN in `index.html`) |
| **Tailwind CSS** | Utility-first CSS framework (CDN) |
| **DaisyUI** | Component library for Tailwind |
| **Babel Standalone** | In-browser JSX transpilation |
| **Vite** | Dev server & build tool (scaffolded but primary UI is in `index.html`) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | HTTP server & REST API framework |
| **MongoDB** | NoSQL database (via Mongoose ODM) |
| **Mongoose** | MongoDB object modeling |
| **OpenAI API** | GPT-4o-mini (text analysis, quiz generation) + Whisper (audio transcription) |
| **JWT** | JSON Web Token authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling (voice recordings) |
| **fs-extra** | Enhanced file system operations |
| **Nodemon** | Auto-restart dev server on file changes |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Browser)                    │
│  React 18 + Tailwind CSS + DaisyUI                      │
│  ┌──────────┬──────────┬──────────┬──────────┬────────┐ │
│  │Dashboard │ Journal  │  Quiz    │Voice/    │Community│ │
│  │          │          │(Adaptive)│Speak Out │  Feed   │ │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┴───┬────┘ │
│       │          │          │          │         │       │
│       └──────────┴──────────┴──────────┴─────────┘       │
│                         │ REST API (fetch)                │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                BACKEND (Express.js)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Middleware: CORS · JSON Parser · JWT Auth        │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌────────┬────────┬────────┬────────┬────────┬──────┐  │
│  │  Auth  │ Quiz   │Check-in│ Voice  │Journal │Comm. │  │
│  │ Routes │ Routes │ Routes │ Routes │ Routes │Routes│  │
│  └───┬────┴───┬────┴───┬────┴───┬────┴───┬────┴──┬───┘  │
│      │        │        │        │        │       │       │
│  ┌───┴────────┴────────┴────────┴────────┴───────┴───┐  │
│  │           Services Layer                           │  │
│  │  OpenAI Service · Quiz Generator · Wellness Calc   │  │
│  └───────────────────────┬───────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────┴───────────────────────────┐  │
│  │              MongoDB (Mongoose ODM)                │  │
│  │  Users · Quizzes · Sessions · Journals · Posts     │  │
│  │  Check-ins · Voice Samples · Quiz Results          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │    OpenAI API         │
              │  GPT-4o-mini · Whisper│
              └───────────────────────┘
```

---

## 📁 Project Structure

```
mind_oasis/
├── README.md                          # This file
└── generative-ai-wellness/            # Main application directory
    ├── .gitignore
    ├── scripts/
    │   └── setup.sh                   # Setup script (placeholder)
    │
    ├── backend/                       # Express.js REST API
    │   ├── server.js                  # Entry point — Express app + MongoDB connection
    │   ├── package.json               # Backend dependencies
    │   ├── .env.example               # Environment variable template
    │   │
    │   ├── config/
    │   │   └── db.js                  # Database configuration (placeholder)
    │   │
    │   ├── middleware/
    │   │   └── auth.js                # JWT authentication middleware
    │   │
    │   ├── models/                    # Mongoose schemas
    │   │   ├── User.js                # User profile, streak, quiz history
    │   │   ├── Quiz.js                # Quiz template with weighted questions
    │   │   ├── QuizSession.js         # Active quiz session (adaptive, 6 steps)
    │   │   ├── QuizResult.js          # Completed quiz score per user
    │   │   ├── Journal.js             # Private journal entries
    │   │   ├── DailyCheckin.js        # Mood check-ins with NLP sentiment
    │   │   ├── VoiceSample.js         # Voice recording metadata + transcripts
    │   │   └── CommunityPost.js       # Community posts with reactions + comments
    │   │
    │   ├── routes/                    # Express route handlers
    │   │   ├── auth.js                # POST /signup, POST /login
    │   │   ├── quiz.js                # POST /start, POST /:id/answer (adaptive)
    │   │   ├── checkin.js             # POST / (create), GET /score
    │   │   ├── voice.js               # POST /speak (upload + transcribe)
    │   │   ├── journal.js             # POST / (create), GET / (list)
    │   │   ├── dashboard.js           # GET / (wellness + streak), POST /mark-login
    │   │   └── community.js           # GET / (feed), POST / (create), POST /:id/react
    │   │
    │   ├── services/                  # Business logic & AI integration
    │   │   ├── openaiService.js       # Whisper transcription, mood analysis, quiz & suggestion gen
    │   │   └── quizGenerator.js       # Adaptive branching quiz generation via GPT
    │   │
    │   ├── utils/
    │   │   └── wellness.js            # Weighted wellness score computation engine
    │   │
    │   └── uploads/                   # Temporary voice file storage (auto-cleaned)
    │
    └── frontend/                      # React + Vite frontend
        ├── index.html                 # ⭐ PRIMARY UI — Full single-page app with all components
        ├── package.json               # Frontend dependencies
        ├── vite.config.js             # Vite configuration
        ├── eslint.config.js           # ESLint rules
        ├── .gitignore
        │
        ├── public/
        │   └── vite.svg               # Vite logo asset
        │
        └── src/
            ├── main.jsx               # Vite entry point
            ├── App.jsx                # Vite default app (Vite scaffold)
            ├── App.js                 # Alternate app with Checkin component
            ├── App.css                # App-level styles
            ├── index.css              # Global CSS reset
            │
            ├── components/
            │   ├── Checkin.jsx         # Daily check-in form with mood slider
            │   ├── Dashboard.jsx       # Dashboard view (placeholder)
            │   ├── Quiz.jsx            # Quiz component (placeholder)
            │   └── VoiceRecorder.jsx   # Voice recorder component (placeholder)
            │
            ├── services/
            │   └── api.js             # API utility (placeholder)
            │
            └── assets/
                └── react.svg          # React logo
```

> **Note:** The primary frontend UI lives in `frontend/index.html` as a self-contained React SPA using CDN-loaded React, Tailwind, and Babel. The Vite-based `src/` directory contains an earlier scaffold with component stubs.

---

## 📋 Prerequisites

Before setting up the project, make sure you have the following installed:

| Tool | Minimum Version | Installation |
|---|---|---|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org/) |
| **npm** | v9+ | Comes with Node.js |
| **MongoDB** | v6+ | [mongodb.com/try/download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud) |
| **OpenAI API Key** | — | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **Git** | v2+ | [git-scm.com](https://git-scm.com/) |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/anujisdead/mind_oasis.git
cd mind_oasis/generative-ai-wellness
```

---

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create your environment file from the template
cp .env.example .env
```

Now edit the `.env` file with your actual values:

```env
# MongoDB connection string
# Local: mongodb://localhost:27017/wellness
# Atlas: mongodb+srv://<user>:<pass>@cluster.mongodb.net/wellness
MONGO_URI=mongodb://localhost:27017/wellness

# OpenAI API Key (required for quizzes, voice, mood analysis)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Secret for JWT token signing
JWT_SECRET=your-secure-random-secret-here

# Port for the backend server
PORT=5000
```

Start the backend server:

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# OR Production mode
npm start
```

You should see:
```
🚀 Backend running on http://localhost:5000
```

Verify the server is running:
```bash
curl http://localhost:5000
# Expected: ✅ Mind Oasis Backend v2 running!
```

---

### 3. Frontend Setup

The primary UI is in `frontend/index.html` and uses CDN-loaded libraries. There are two ways to run it:

#### Option A: Using Vite Dev Server (Recommended)

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

The Vite server will start at `http://localhost:5173`. However, the primary UI is the standalone `index.html`, so you can also open it directly:

#### Option B: Open `index.html` Directly

Simply open `frontend/index.html` in your browser. It connects to the deployed backend at `https://mind-oasis.onrender.com/api` by default.

#### Changing the API Base URL

If you're running the backend locally, update the `API` constant in `frontend/index.html` (line ~114):

```javascript
// Change from:
const API = "https://mind-oasis.onrender.com/api";

// To:
const API = "http://localhost:5000/api";
```

---

### 4. Running Both Servers

For local development, you need **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd generative-ai-wellness/backend
npm run dev
# → Backend running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd generative-ai-wellness/frontend
npm run dev
# → Frontend running on http://localhost:5173
```

Or simply open `frontend/index.html` in a browser after starting the backend.

---

## 🔐 Environment Variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string | `mongodb://localhost:27017/wellness` |
| `OPENAI_API_KEY` | ✅ | OpenAI API key for GPT-4o-mini & Whisper | `sk-proj-...` |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens | `my_super_secret_key_123` |
| `PORT` | ✅ | Port for the Express server | `5000` |

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | Create a new account |
| `POST` | `/api/auth/login` | ❌ | Log in and receive JWT token |

**Signup/Login Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"          // signup only
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": { "id": "...", "name": "John Doe", "email": "user@example.com" }
}
```

---

### Adaptive Quiz

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/quizzes/start` | ✅ | Start a new 6-question adaptive session |
| `POST` | `/api/quizzes/:id/answer` | ✅ | Submit answer to current question |

**Answer Body:**
```json
{ "answer": "I'm feeling okay today, a bit stressed about exams." }
```

**Response (intermediate):** Updated session object with the next AI-generated question.

**Response (complete):**
```json
{
  "session": { "isComplete": true, "questions": [...] },
  "wellness": { "score": 72, "category": "Medium" }
}
```

**Response (crisis detected):**
```json
{
  "crisis": true,
  "message": "⚠️ It looks like you may be in crisis...",
  "resources": [
    { "name": "India: Vandrevala Foundation Helpline", "phone": "1860 266 2345" },
    { "name": "Worldwide: Find a helpline", "url": "https://findahelpline.com" }
  ]
}
```

---

### Journal

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/journal` | ✅ | Create a new journal entry |
| `GET` | `/api/journal` | ✅ | List last 20 journal entries |

**Create Body:**
```json
{
  "title": "My day",           // optional
  "body": "Today was good...", // required
  "moodScale": 7              // optional, 0-10
}
```

---

### Voice / Speak Out

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/voice/speak` | ✅ | Upload voice recording for transcription + suggestion |

- Content-Type: `multipart/form-data`
- Field name: `voice`
- Max file size: 10MB
- Supported format: `audio/webm`

**Response:**
```json
{
  "transcript": "I've been feeling really tired today...",
  "suggestion": "Try taking a short 5-minute walk outside. Fresh air can do wonders for your energy levels."
}
```

---

### Check-ins

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/checkins` | ❌* | Create a mood check-in (requires `x-user-id` header) |
| `GET` | `/api/checkins/score` | ❌* | Get computed wellness score |

*Uses `x-user-id` header instead of JWT (MVP implementation).

**Create Body:**
```json
{
  "moodScale": 7,                    // 0-10
  "text": "Feeling better today",    // analyzed by GPT for sentiment
  "tags": ["exercise", "sleep"]      // optional tags
}
```

---

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dashboard` | ✅ | Get wellness score, streak, and login status |
| `POST` | `/api/dashboard/mark-login` | ✅ | Mark daily login (updates streak) |

---

### Community

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/community` | ✅ | Get latest 50 community posts |
| `POST` | `/api/community` | ✅ | Create a new post |
| `POST` | `/api/community/:id/react` | ✅ | React to a post |

**Create Post Body:**
```json
{ "text": "Sharing something that helped me today..." }
```

**React Body:**
```json
{ "reaction": "like" }
```
Supported reactions: `like`, `love`, `support`, `insightful`

---

## 🗃 Database Models

### User
| Field | Type | Description |
|---|---|---|
| `email` | String (unique) | User's email |
| `name` | String | Display name |
| `passwordHash` | String | bcrypt-hashed password |
| `preferences` | Object | Daily reminder time, share preferences |
| `lastLoginAt` | Date | Timestamp of last login |
| `streakCount` | Number | Consecutive login days |
| `quizHistory` | Array | Last 7 quiz results `{date, score, category}` |

### QuizSession
| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId → User | Owner |
| `questions` | Array | `{qId, text, type, options, answer}` |
| `currentStep` | Number | Current question index (0-based) |
| `maxSteps` | Number | Total questions (default: 6) |
| `isComplete` | Boolean | Whether the session is finished |

### Journal
| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId → User | Owner |
| `title` | String | Optional title |
| `body` | String | Journal content (required) |
| `moodScale` | Number | Optional mood (0–10) |

### CommunityPost
| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId → User | Author |
| `userName` | String | Author's display name |
| `text` | String | Post content |
| `reactions` | Object | `{likes, upvotes, downvotes}` counters |

### DailyCheckin
| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId → User | Owner |
| `moodScale` | Number | Mood (0–10) |
| `text` | String | Free-form text |
| `sentimentLabel` | String | AI-detected emotion (happy/sad/anxious/etc.) |
| `sentimentScore` | Number | Confidence (0–1) |
| `tags` | Array\<String\> | User-provided tags |

### VoiceSample
| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId → User | Owner |
| `filename` | String | Original filename |
| `transcript` | String | Whisper-generated transcript |
| `inferredLabel` | String | AI emotion label |
| `inferenceConfidence` | Number | Confidence score |

---

## 🤖 AI / ML Integration

Mind Oasis integrates with the **OpenAI API** through two models:

### GPT-4o-mini
Used for:
1. **Adaptive Quiz Question Generation** — Generates supportive follow-up questions based on previous answers
2. **Wellness Score Computation** — Analyzes quiz responses and returns a score (0–100) with category
3. **Text Mood Analysis** — Classifies check-in text into emotion labels (`happy`, `sad`, `anxious`, `neutral`, `angry`, `stressed`, `depressed`) with confidence scores
4. **Daily Suggestions** — Generates empathetic, actionable wellness suggestions from voice transcripts
5. **Branching Quiz Generation** — Creates adaptive quiz templates with conditional question flows

### Whisper (whisper-1)
Used for:
- **Audio Transcription** — Converts uploaded voice recordings (`.webm`) to text for further analysis

### Wellness Score Algorithm
The composite wellness score is computed as a weighted average:

```
Score = 0.35 × QuizScore + 0.25 × TextSentiment + 0.25 × VoiceSentiment + 0.15 × Engagement
```

Where:
- **QuizScore**: Latest quiz result (0–100)
- **TextSentiment**: Mapped from emotion labels (happy → 90, neutral → 60, sad → 30, etc.)
- **VoiceSentiment**: Same mapping from voice analysis
- **Engagement**: Percentage of days with check-ins in the last 14 days

---

## 🖼 Screenshots

> _Coming soon — run the app locally and explore the UI!_

The app features:
- 🏠 **Dashboard** with wellness score card, streak counter, quick actions sidebar
- 📓 **Journal** page with entry composer and chronological history
- 🧠 **Quiz** page with progress bar, question history, and adaptive questioning
- 🎙️ **Speak Out** page with live audio recording, transcript display, and AI suggestion
- 🌐 **Community** feed with post composer, reaction buttons, and user avatars
- 🔐 **Login/Signup** page with clean card design

---

## 🌍 Deployment

### Backend (Render)
The backend is currently deployed on **Render** at:
```
https://mind-oasis.onrender.com
```

To deploy your own:
1. Push the `backend/` directory to a Git repo
2. Create a **Web Service** on [Render](https://render.com)
3. Set the build command: `npm install`
4. Set the start command: `node server.js`
5. Add all environment variables (`MONGO_URI`, `OPENAI_API_KEY`, `JWT_SECRET`, `PORT`)
6. Use **MongoDB Atlas** for the cloud database

### Frontend
The frontend (`index.html`) is a static file and can be hosted on:
- **GitHub Pages**
- **Vercel** (as a static site)
- **Netlify**
- **Render** (as a static site)

Simply update the `API` constant to point to your deployed backend URL.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m "Add my feature"`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

### Development Tips
- Run `npm run dev` in the backend for auto-reloading with Nodemon
- The primary UI is in `frontend/index.html` — edit there for UI changes
- Test API endpoints with `curl` or [Postman](https://www.postman.com/)
- MongoDB Compass is useful for inspecting database state

---

## 📄 License

This project is open source. See the repository for license details.

---

<p align="center">
  Made with ❤️ for youth mental wellness
</p>
