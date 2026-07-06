# BolEnglish - Learn English from Hindi (हिन्दी से अंग्रेजी सीखें)

BolEnglish is a modern, lightweight, mobile-first, and desktop-friendly single-page web application built with **React, Vite, and Vanilla CSS** to help Hindi-speaking learners analyze their English proficiency and learn English for free.

## Features

1. **Bilingual Onboarding**: Greeting, name, and goal selection customized in Hindi and English.
2. **Proficiency Analyzer (Diagnostic Quiz)**: A 10-question evaluation covering Vocabulary, Grammar, Listening Comprehension, and Speech Pronunciation. It recommends a placement tier: **Beginner (बुनियादी)**, **Intermediate (मध्यम)**, or **Advanced (उच्च)**.
3. **Structured Lessons**: Curated conversational cards with English audio pronunciation, Hindi meanings, and practical grammar details explained in easy Hindi.
4. **Gamified Streaks & XP**: Saves progress, streaks, and experience points (XP) in the browser's local storage and syncs to the cloud.
5. **Interactive Voice Practice**: Uses browser-native Web Speech API for text-to-speech listening and microphone speaking checks, all 100% free with zero backend server dependencies.
6. **Cloud Progress Sync**: Google Sign-In paired with Vercel Serverless Functions and a lifetime-free MongoDB Atlas database to back up and sync learning progress across all devices.

---

## Local Development Setup

To run the application locally on your computer:

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

## Environment Configuration

To set up Google Sign-In and cloud saving, configure the following environment variables:

### 1. Frontend Environment Variables (Local `.env` file or Vercel)
Create a `.env` file in the root directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```
*Note: If `VITE_GOOGLE_CLIENT_ID` is empty or omitted, the application runs in **Developer Test Mode**. On the onboarding screen, a link called "ईमेल से डेटा रीस्टोर करें (Atlas Sync)" will appear. This lets you enter any email address to test the database sync and fetch routes instantly without setting up Google OAuth credentials first!*

### 2. Backend Environment Variables (Vercel Dashboard)
In your Vercel Project Settings under **Environment Variables**, add:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
*(Get this connection string from your free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).)*

---

## Deployment & Hosting Guide (100% Free)

Since BolEnglish uses Vercel Serverless Functions, deploying to **Vercel** is the easiest way to get the frontend and backend running together for free in one click.

### Step 1: Upload to GitHub

1. Initialize git and commit your files (already configured in the project):
   ```bash
   git init
   git add .
   git commit -m "Initialize BolEnglish English learning project"
   ```
2. Create a new **public** repository on [GitHub](https://github.com).
3. Connect your local repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New** -> **Project**.
3. Import your `BolEnglish` repository.
4. Expand the **Environment Variables** section and add `MONGODB_URI`.
5. Click **Deploy**. Vercel will automatically host the React app on a `vercel.app` domain and deploy the serverless functions in the `/api` directory.

---

## Web Speech API Support Notes

- **Listening (Text-to-Speech)**: Universally supported on modern mobile and desktop browsers (iOS Safari, Android Chrome, Edge, etc.).
- **Speaking (Voice Recognition)**: Uses the browser's built-in recognition engine.
  - **Android/Chrome/Edge/Desktop**: Highly supported and functions immediately.
  - **iOS/Safari**: Requires HTTPS (default on Vercel), and safari security rules require direct user interaction (such as tapping the mic button) to grant permissions, which this app handles. A fallback "Skip" button is provided for other browsers.
