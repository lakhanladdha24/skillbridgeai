# SkillBridgeAI 🚀

SkillBridgeAI is a next-generation career growth platform that uses AI to bridge the gap between skills and careers. It features personalized roadmaps, skill tracking, and a built-in AI mentor powered by **Groq (Llama 3)** or **Google Gemini**.

## ✨ Features

- **AI Career Mentor**: Chat with an AI trained to provide technical roadmaps, resume tips, and interview preparation.
- **Dynamic Roadmaps**: Personalized learning paths with resources from world-class creators and universities.
- **Persistent Progress**: MongoDB database system to save your skills, levels, and completed milestones.
- **Hands-on Coding Assessment**: Real-time AI evaluation of your code directly in the browser.
- **Responsive Dashboard**: Track your learning hours and certificates.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js (Express) for local use, Vercel Serverless Functions for production.
- **Database**: MongoDB (Atlas)
- **AI Providers**: 
  - **Groq**: Fastest inference using Llama 3 models (Primary local).
  - **Google Gemini**: Robust backup/production model.

## 🚀 Deployment on Vercel

1. **Push to GitHub**.
2. **Connect to Vercel**: Import your repository.
3. **Environment Variables**: Add these in Vercel Settings:
   - `GROQ_API_KEY`: (Recommended) Get from [Groq Console](https://console.groq.com).
   - `GEMINI_API_KEY`: (Fallback) Get from [Google AI Studio](https://aistudio.google.com).
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure string for auth.

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment**:
   - Create a `.env` file in the root and in `backend/` directory.
   - Add your API keys (GROQ or GEMINI) and MONGODB_URI.
3. **Run the full app (Frontend + Backend)**:
   ```bash
   npm run start
   ```

---
*Developed with ❤️ for the future of skill building.*

