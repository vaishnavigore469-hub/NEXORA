# NEXORA — AI-Powered C++ Mock Interview Platform

> **Think. Answer. Evolve.**

NEXORA is a next-generation AI-powered C++ technical mock interview platform that helps students and software engineers prepare for rigorous technical interviews through intelligent question generation, real-time evaluation, adaptive difficulty, and comprehensive performance reports.

---

## ✨ Features

### 🤖 Real AI Interviewer
- Powered by **Google Gemini API** for live generative question creation and evaluation
- Falls back to a **verified local C++ technical evaluation engine** when Gemini is not configured (Demo Mode)
- Evaluates answers written in natural, conversational English — not just verbatim textbook phrases
- Distinguishes between technical answers, hint requests, clarification requests, repeat requests, skip requests, and end-interview requests without counting non-answers as incorrect

### 🎯 Complete C++ Coverage (40 Topics)
- Introduction to C++ through Modern C++20 concepts
- **Exception Handling** (try-catch, multiple catch, nested try, catch-all, custom exceptions) — *College Activity Priority Module*
- **Templates & Generic Programming** (function templates, class templates, non-type parameters, template specialization) — *College Activity Priority Module*
- Classes, OOP, Inheritance, Polymorphism, Virtual Functions, VTABLE/VPTR, Diamond Problem
- Pointers, References, Smart Pointers, Move Semantics
- STL Containers (vector, list, map, unordered_map, stack, queue), Iterators, Algorithms
- File I/O, Dynamic Memory, Namespaces, Lambdas

### 📊 Adaptive Intelligence
- **Adaptive Difficulty Mode**: AI increases question complexity when you answer well, simplifies when you struggle
- **Structured Evaluation**: Correct / Partially Correct / Incorrect with marks out of 10 per question
- **Follow-up Questions**: Probes deeper on strong answers, explores gaps on weak ones

### 📈 Persistent Interview History
- SQLite-backed persistent storage — no data lost on restart
- Full session history with scores, timestamps, and topic details
- Detailed Question Review: your answer vs reference answer vs AI critique

### 🎨 Premium UI
- Futuristic glassmorphism dark theme
- Animated AI Orb with 4 visual states (Idle, Thinking, Responding, Evaluating)
- Fully responsive (desktop, tablet, mobile)
- Google Fonts: Inter & Space Grotesk

---

## 🛠 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 + TypeScript |
| Styling | Tailwind CSS v4 |
| UI Animations | CSS Keyframes + Framer Motion ready |
| Icons | Lucide React |
| Backend | Node.js 24 + Express.js |
| AI Engine | Google Gemini API (`@google/genai` v2.32) |
| Database | Native Node.js `node:sqlite` (built-in, zero install) |
| Server Runtime | TSX (TypeScript execution without compilation) |

---

## 📁 Folder Structure

```
nexora/
├── client/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # AiOrb, Navbar, Footer, ApiKeyModal
│   │   ├── pages/           # Landing, Dashboard, Setup, Interview, Report, History, Topics
│   │   ├── services/        # api.ts - Backend HTTP client
│   │   ├── types/           # TypeScript interface definitions
│   │   ├── App.tsx          # Root App with navigation state
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Tailwind + AI Orb animations
│   ├── index.html           # HTML entry with SEO metadata
│   └── vite.config.ts       # Vite + Tailwind + proxy config
│
├── server/                  # Express.js Backend
│   ├── src/
│   │   ├── config/          # Centralized configuration
│   │   ├── data/            # C++ syllabus topics + question bank
│   │   ├── database/        # SQLite initialization and schema
│   │   ├── routes/          # interview, topics, settings REST endpoints
│   │   ├── services/        # geminiService, evaluatorService, sessionService, reportService
│   │   ├── types/           # Shared TypeScript types
│   │   └── index.ts         # Express server entry
│   ├── .env                 # Your local environment file (not committed)
│   ├── .env.example         # Template showing all required variables
│   └── nexora.db            # Auto-created SQLite database
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js 24+** (required for native `node:sqlite` module)  
  Download: https://nodejs.org/
- **npm 11+** (included with Node.js)

### Step 1: Clone / Navigate to the project

```powershell
cd C:\Users\user5\.gemini\antigravity-ide\scratch\nexora
```

### Step 2: Install Backend Dependencies

```powershell
cd server
npm install
```

### Step 3: Install Frontend Dependencies

```powershell
cd ..\client
npm install
```

### Step 4: Configure Environment Variables

Copy the example environment file and edit it:

```powershell
cd ..\server
copy .env.example .env
```

Open `server\.env` and configure:

```env
PORT=5000
NODE_ENV=development

# Google Gemini API Key (optional but recommended)
# Get a free key from: https://aistudio.google.com/
GEMINI_API_KEY=your_api_key_here

# Gemini model (default is gemini-3.8-flash)
GEMINI_MODEL=gemini-3.8-flash

# SQLite database file path
DATABASE_FILE=./nexora.db
```

> **Without an API key:** NEXORA runs in **DEMO MODE** using the built-in verified C++ technical evaluation engine. All core functionality works — interviews, scoring, reports, and history.

---

## 🔑 Getting a Free Gemini API Key

1. Go to **https://aistudio.google.com/**
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API Key"**
4. Copy the key (starts with `AIzaSy...`)
5. Paste it in `server\.env` as `GEMINI_API_KEY=AIzaSy...`

Alternatively, you can set the key from inside the running application without restarting: click the **AI Engine status pill** in the navbar → paste your key in the settings modal.

---

## ▶️ Running the Application

### Start the Backend Server

```powershell
cd server
npm run dev
```

Expected output:
```
Database initialized successfully at ./nexora.db
====================================================
  NEXORA Server running on http://localhost:5000
  AI Engine: Live Google Gemini (gemini-3.8-flash)
====================================================
```

### Start the Frontend Dev Server (new terminal window)

```powershell
cd client
npm run dev
```

Expected output:
```
  VITE v8.3.5  ready in 478ms

  ➜  Local:   http://localhost:3000/
```

### Open in Browser

Navigate to: **http://localhost:3000**

---

## 📱 Pages Overview

| Page | URL State | Description |
|------|-----------|-------------|
| Landing Page | Home | Hero, features, college activity modules, CTA |
| Dashboard | Dashboard tab | Stats, recent sessions, quick topic launch |
| Interview Setup | Setup tab | Topic, difficulty & length selection |
| AI Interview Room | Interview tab | Live conversational interview with AI Orb |
| Final Report | Report tab | Score/100, breakdown, strengths, review |
| History | History tab | Persistent interview records with report links |
| Syllabus Explorer | Topics tab | All 40 C++ topics with subtopics |

---

## 🧩 AI Interview Interactions

The AI interviewer understands natural language commands:

| What you say | What happens |
|---|---|
| Your technical answer | Evaluated against expected key points; marks awarded |
| "Can you give me a hint?" | AI provides a guiding non-spoiler hint (no mark deduction) |
| "Please explain the question" | AI rephrases the question in simpler terms |
| "Can you give me an example?" | AI provides an illustrative example |
| "Can you repeat the question?" | AI shows the question again |
| "Skip this question" | Question marked as skipped; moves to next |
| "End my interview" | Confirms end, then generates report |

---

## 🗄️ Database Setup

The SQLite database is created **automatically** when the server starts for the first time. No manual setup is needed.

Database file location: `server/nexora.db`

Tables created:
- `sessions` — interview session metadata
- `questions` — questions asked per session
- `interactions` — all student inputs and AI evaluations
- `settings` — persistent key-value config (e.g., API key)

---

## 🔧 Common Errors & Solutions

| Error | Cause | Solution |
|---|---|---|
| `Cannot find module 'node:sqlite'` | Node.js version too old | Upgrade to Node.js 24+ |
| `GEMINI_API_KEY invalid` | Wrong or expired key | Get a new key from aistudio.google.com |
| Port 5000 already in use | Another process on port 5000 | Change `PORT=5001` in `.env` |
| Port 3000 already in use | Another process on port 3000 | Vite will auto-suggest next port |
| White screen on startup | API proxy error | Ensure server is running before opening client |
| Database locked error | Multiple server instances | Kill other server processes and restart |

---

## 🏗️ Available npm Scripts

### Server
| Command | Description |
|---|---|
| `npm run dev` | Start with hot-reload via tsx watch |
| `npm run start` | Single run without watch |
| `npm run build` | Compile TypeScript to dist/ |

### Client
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to dist/ |
| `npm run preview` | Preview production build |

---

## 🎓 College Activity Modules

NEXORA includes special dedicated interview modules for required academic activities:

### Exception Handling
- try, throw, and catch mechanism (Beginner)
- Multiple catch blocks and derived-before-base ordering (Intermediate)
- catch-all `catch(...)` block (Intermediate)
- Nested try blocks, `throw;` re-throwing, and stack unwinding (Advanced)
- Custom exception classes inheriting from `std::exception` (Advanced)

### Templates & Generic Programming
- Function templates and automatic type deduction (Beginner)
- Class templates and generic container instantiation (Intermediate)
- Non-type template parameters: `template<typename T, int Size>` (Intermediate)
- Full and partial template specialization (Advanced)
- Why template definitions live in header files (Advanced)

---

## 🔒 Security

- Gemini API key stored in `server/.env` — **never** sent to the browser
- API key persisted encrypted in SQLite settings table
- Input sanitization on all user text
- Duplicate submission prevention
- Request size limits on all API endpoints
- Server-side score calculation — client cannot forge marks

---

## 📝 Notes

- The application works fully offline in **Demo Mode** with the built-in C++ technical evaluation engine
- Interview sessions survive page refreshes via `localStorage` + URL query parameters
- The SQLite database persists all data between server restarts
- The AI engine distinguishes clarification requests from actual answers with zero false positives
