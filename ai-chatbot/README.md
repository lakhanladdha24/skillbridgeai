# SkillBridgeAI Assistant

A production-ready AI chatbot for student career guidance using the Google Gemini API.

## Features
- Career recommendations and learning roadmaps
- Resume building guidance and tips
- Interview preparation with sample questions and answers
- Modern, clean, and responsive UI
- Real-time typing indicator
- Auto-scrolling
- Markdown rendering for structured outputs
- Error handling
- Secure (API keys kept on backend using `.env`)

## Project Structure
- `server.js` - Express backend, integrates with Gemini SDK
- `public/` - Static assets (HTML, CSS, JS)

## Setup and Running Locally

1. **Install dependencies:**
   Make sure you are in the `ai-chatbot` folder, then run:
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Rename `.env.example` to `.env` and add your Google Gemini API Key:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).*

3. **Start the server:**
   ```bash
   npm start
   ```
   For development with auto-restart, you can run: `npm run dev`

4. **Access the Chatbot:**
   Open your browser and navigate to `http://localhost:3000`.

## Deployment Instructions

### Deploy to Render or Render/Heroku/Vercel
1. Upload this folder to a GitHub repository.
2. Sign in to [Render](https://render.com/) (or a similar service like Railway, Heroku).
3. Create a new **Web Service**.
4. Connect your GitHub repository.
5. Set the *Build Command* to `npm install`.
6. Set the *Start Command* to `npm start`.
7. Add Environment Variables in the platform's dashboard:
   - `GEMINI_API_KEY` = your_api_key_here
8. Deploy! The service will provide you with a live URL.

*Note: Frontend is served statically via Express, so backend and frontend will be deployed together as a single Node.js service.*
