# BolEnglish - Learn English from Hindi (हिन्दी से अंग्रेजी सीखें)

BolEnglish is a modern, lightweight, mobile-first, and desktop-friendly web application built with **React Router, Context API, and Vanilla CSS** to help Hindi-speaking learners analyze their English proficiency and learn English for free.

---

## 🚀 Key Improvements in the Rebuilt Version

1. **Modular Architecture**: Rebuilt from a monolithic single-screen manager into clean, maintainable routes (`Onboarding`, `Assessment`, `Dashboard`, `Lesson`, `Profile`) using **React Router (v7)**.
2. **Context API State Management**: Replaces prop drilling by consolidating profile, learning progress, and sync actions in a global `AppContext`.
3. **Bilingual Email-Based Cloud Sync**: Dropped heavy Google OAuth configurations in favor of a direct, friction-free email-based sync. Progress, XP, streaks, and accuracy stats are backed up dynamically to a free MongoDB Atlas instance.
4. **Deduplicated Quiz Engine**: Unified written and speaking questions into a singular `<QuestionBody />` layout parser (covering MCQ, reordering, listening, and speaking modules).
5. **Speech hook (`useSpeech`)**: Consolidated native Web Speech API Text-to-Speech (TTS) and Speech-to-Text (STT) into a reusable hook. Audio is warm-started on mount and only plays on explicit clicks (no intrusive auto-play).
6. **Refined Modern Design System**: A clean, light theme utilizing custom CSS tokens. High-contrast slate text colors resolve old white-on-white visibility issues. Fully responsive, lightweight layout with beautiful colored ambient backdrop blobs.
7. **Accuracy Tracking**: Wired up an accuracy tracking mechanism (`trackAnswer`) to persist correct-to-total question statistics.
8. **Toast & Modal Dialogs**: Custom, accessible `<Toast />` and `<Modal />` overlays replace native browser alerts and confirms.

---

## 📂 Project Structure

```
src/
├── main.jsx                 # Entry point setting up routes
├── App.jsx                  # Main router and state providers setup
├── context/
│   ├── AppContext.jsx       # Unified profile, progress, and database sync state
│   └── ToastContext.jsx     # Global notification toast queues
├── hooks/
│   └── useSpeech.js         # Unified STT and TTS speech controller
├── routes/
│   ├── OnboardingRoute.jsx  # Greeting, name, avatar, and email restore portal
│   ├── AssessmentRoute.jsx  # 10-question placement analyzer
│   ├── DashboardRoute.jsx   # Tabbed syllabus of 15 interactive lessons
│   ├── LessonRoute.jsx      # Slide player (vocab → grammar → practice → reward)
│   └── ProfileRoute.jsx     # Stats panel, cloud sync control, reset safety
├── components/
│   ├── layout/
│   │   ├── AppHeader.jsx    # Sticky header with streak & XP stats
│   │   ├── BottomNav.jsx    # Bottom persistent navigation bar
│   │   └── RouteGuard.jsx   # Client router redirects for guest/onboarded states
│   ├── ui/                  # Tailored design system primitives
│   │   └── Button.jsx, Card.jsx, ProgressBar.jsx, Badge.jsx, Modal.jsx, StatChip.jsx
│   ├── quiz/                # Deduplicated interactive modules
│   │   └── McqQuestion.jsx, ReorderQuestion.jsx, ListeningQuestion.jsx, SpeechQuestion.jsx
│   └── SyncSheet.jsx        # Connecting email slide-up card
├── styles/                  # CSS layout system
│   ├── tokens.css           # Theme colors, borders, and margins
│   ├── base.css, components.css, utilities.css
│   └── index.css            # Imports all style layers
├── data/
│   └── curriculum.js        # 15 course lessons and 10 assessment questions
└── services/
    ├── storage.js           # Client localStorage state adapters
    ├── sync.js              # Serverless API cloud adapter
    └── speech.js            # Voice synthesis and recognition engine
```

---

## 🛠️ Local Development Setup

To run the application locally on your machine:

1. **Install Node.js** (v18 or higher recommended).
2. Open your terminal in the project directory and install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open the link displayed in your terminal (typically `http://localhost:5173`) in your browser.

---

## ☁️ Environment Configuration

To set up cloud sync and back up user progress, configure the database connection:

### Backend Environment Variables (Vercel Settings)
In your Vercel Project Dashboard under **Settings → Environment Variables**, add:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
*(Get this connection string from your free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).)*

---

## 🚀 Deployment (100% Free)

Since BolEnglish utilizes Vercel Serverless Functions for database API operations, deploying directly to **Vercel** is the easiest way to host the frontend and serverless API together:

1. Initialize git and commit your files:
   ```bash
   git init
   ```
2. Make a new **public** repository on [GitHub](https://github.com).
3. Connect your local directory and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
4. Link Vercel to your GitHub, import this repository, supply the `MONGODB_URI` environment variable, and hit **Deploy**.

---

## 🎙️ Web Speech API Support Notes

- **Listening (Text-to-Speech)**: Universally supported on mobile and desktop browsers (iOS Safari, Android Chrome, Edge, etc.).
- **Speaking (Voice Recognition)**:
  - **Android/Chrome/Edge/Desktop**: Highly supported and works instantly.
  - **iOS/Safari**: Requires HTTPS (default on Vercel) and user interaction to prompt mic permissions. A fallback "Skip" button is provided for non-supported browsers.
