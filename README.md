# SkillBridgeAI 🚀

SkillBridgeAI is a next-generation career growth platform that uses AI to bridge the gap between skills and careers. It features personalized roadmaps, skill tracking, and a built-in AI mentor powered by Google Gemini.

## ✨ Features

- **AI Career Mentor**: Chat with an AI trained to provide technical roadmaps, resume tips, and interview preparation.
- **Dynamic Roadmaps**: Personalized learning paths with resources from **CampusX**, **Stanford University**, and more.
- **Persistent Progress**: Local database system to save your skills, levels, and completed milestones.
- **Responsive Dashboard**: Track your learning hours, certifications, and recommended skills.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **AI Backend**: Vercel Serverless Functions + Google Generative AI (Gemini 1.5 Flash)

## 🚀 Deployment on Vercel

1. **Push to GitHub**:
   ```bash
   git remote add origin <your-repository-url>
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com) and import your repository.
   - **Important**: Add the following Environment Variable in Vercel Settings:
     - `GEMINI_API_KEY`: Your Google Gemini API key.

3. **Deploy**:
   - Vercel will automatically detect the Vite project and the serverless functions in the `api/` folder.

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file and add your `GEMINI_API_KEY`.
3. Run the development server:
   ```bash
   npm run dev
   ```

## 📄 License
MIT
