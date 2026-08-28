import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from './db.js';
import User from './models/User.js';
import { logLearningEvent, getUserEvents } from './services/eventLogger.js';
import { predictSkill, predictCareers, getLearningPlan } from './services/mlClient.js';
import Roadmap from './models/Roadmap.js';
import { analyzeAssessmentResult } from './services/assessmentEngine.js';
import { executeCode } from './services/codeExecutor.js';
import { getStudyMaterialForTopic, rankVideoResources } from './services/ragKnowledgeService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillbridgeai_secret_123_abc';

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

// Initialize Groq
const groqKey = process.env.GROQ_API_KEY || process.env.CHATBOT_API_KEY;
const groq = groqKey ? new Groq({ apiKey: groqKey }) : null;

// Initialize Gemini fallback
const geminiKey = process.env.GEMINI_API_KEY;
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// In-memory fallback user store for when MongoDB is disconnected
const localUsers = new Map();

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !name) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const isDbConnected = mongoose.connection.readyState === 1;

        if (isDbConnected) {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ error: 'User already exists' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password || 'default123', salt);

            user = new User({ name, email, password: hashedPassword, technicalSkills: [] });
            await user.save();

            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({ token, user: { id: user._id, name: user.name, email: user.email, skills: [] } });
        } else {
            // Local fallback session
            if (localUsers.has(email)) {
                return res.status(400).json({ error: 'User already exists (local mode)' });
            }
            const localUser = { id: 'local_' + Date.now(), name, email, password, skills: [] };
            localUsers.set(email, localUser);
            const token = jwt.sign({ id: localUser.id }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({ token, user: { id: localUser.id, name: localUser.name, email: localUser.email, skills: [] } });
        }
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ error: err.message || 'Signup failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const isDbConnected = mongoose.connection.readyState === 1;

        if (isDbConnected) {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: 'Invalid Credentials' });

            const isMatch = await bcrypt.compare(password || 'default123', user.password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid Credentials' });

            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({ token, user: { id: user._id, name: user.name, email: user.email, skills: user.technicalSkills || [] } });
        } else {
            // Local fallback login check
            const localUser = localUsers.get(email);
            if (localUser) {
                const token = jwt.sign({ id: localUser.id }, JWT_SECRET, { expiresIn: '1d' });
                return res.json({ token, user: { id: localUser.id, name: localUser.name, email: localUser.email, skills: localUser.skills || [] } });
            }
            
            // Allow instant demo session when DB is offline
            const demoUser = { id: 'demo_' + Date.now(), name: email.split('@')[0], email, skills: [] };
            const token = jwt.sign({ id: demoUser.id }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({ token, user: demoUser });
        }
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: err.message || 'Login failed' });
    }
});

// Update Profile (for Onboarding)
app.put('/api/user/profile', async (req, res) => {
    try {
        const { userId, skills } = req.body;
        const isDbConnected = mongoose.connection.readyState === 1;

        if (isDbConnected && userId && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
            await User.findByIdAndUpdate(userId, { technicalSkills: skills });
        }
        res.json({ success: true, message: 'Profile updated with skills!', skills });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CHAT LOGIC ---
const SYSTEM_PROMPT = `You are SkillBridgeAI, a premium AI career mentor. 
Always use markdown. Focus on professional growth.
If you know the user's skills, tailor your advice to their level (Beginner/Intermediate/Advanced).`;

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Provider 1: NVIDIA AI (NVIDIA NIM API)
    const nvidiaKey = process.env.NVIDIA_API_KEY || (process.env.GROQ_API_KEY?.startsWith('nvapi-') ? process.env.GROQ_API_KEY : null) || (process.env.CHATBOT_API_KEY?.startsWith('nvapi-') ? process.env.CHATBOT_API_KEY : null);
    if (nvidiaKey) {
        const nvidiaModels = ['meta/llama-3.3-70b-instruct', 'nvidia/llama-3.1-nemotron-70b-instruct', 'meta/llama3-70b-instruct'];
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...(history || [])
                .filter(msg => msg.content && !msg.content.startsWith('AI Error') && !msg.content.startsWith('Sorry,'))
                .map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
            { role: "user", content: message }
        ];

        for (const model of nvidiaModels) {
            try {
                const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${nvidiaKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model,
                        messages,
                        temperature: 0.5,
                        max_tokens: 2048
                    })
                });

                const data = await response.json();
                if (response.ok && data.choices && data.choices[0]?.message?.content) {
                    return res.status(200).json({ reply: data.choices[0].message.content });
                }
            } catch (error) {
                console.error(`NVIDIA API [${model}] Error:`, error.message);
            }
        }
    }

    // Provider 2: Groq
    if (groq) {
        const groqModels = ['groq/compound', 'openai/gpt-oss-120b', 'groq/compound-mini', 'qwen/qwen3.6-27b', 'llama-3.3-70b-versatile'];
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...(history || [])
                .filter(msg => msg.content && !msg.content.startsWith('AI Error') && !msg.content.startsWith('Groq Error') && !msg.content.startsWith('Sorry,'))
                .map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
            { role: "user", content: message }
        ];

        for (const modelName of groqModels) {
            try {
                const chatCompletion = await groq.chat.completions.create({
                    messages,
                    model: modelName,
                    temperature: 0.5,
                    max_tokens: 2048,
                    top_p: 1,
                    stream: false,
                });

                const reply = chatCompletion.choices[0]?.message?.content || "";
                return res.status(200).json({ reply });
            } catch (error) {
                console.error(`Groq Model [${modelName}] Error:`, error.message);
                if (error.message.includes('429')) break;
            }
        }
    }

    // Provider 3: Gemini
    if (genAI) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const promptWithContext = `${SYSTEM_PROMPT}\n\nUser Question: ${message}`;
            const result = await model.generateContent(promptWithContext);
            const response = await result.response;
            return res.status(200).json({ reply: response.text() });
        } catch (error) {
            console.error('Gemini Chat Completion Error:', error.message);
        }
    }

    // Fallback: Informative response if AI keys aren't operational
    return res.status(200).json({
        reply: `**SkillBridgeAI Assistant (Offline Mode)**\n\nI received your query: "${message}".\n\nTo enable live AI responses, please ensure a valid \`NVIDIA_API_KEY\`, \`GROQ_API_KEY\`, or \`GEMINI_API_KEY\` is configured in your \`.env\` file.`
    });
});

app.get('/api/debug-env', (req, res) => {
    res.json({
        has_groq_key: !!groqKey,
        has_gemini_key: !!geminiKey,
        has_mongodb_uri: !!process.env.MONGODB_URI,
        db_status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        node_version: process.version
    });
});

app.get('/api/health', (req, res) => res.json({
    status: 'ok',
    db: mongoose.connection && mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));

// --- ASSESSMENT ANALYSIS API ---
app.post('/api/assessment/submit', async (req, res) => {
    try {
        const { userId, answers, questions, timeSpentSeconds } = req.body;
        const analysis = analyzeAssessmentResult(answers, questions, timeSpentSeconds);

        const isDbConnected = mongoose.connection.readyState === 1;
        if (isDbConnected && userId && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
            const doc = new Assessment({
                userId,
                ...analysis
            });
            await doc.save();

            // Update user skills profile
            const updatedSkills = analysis.skillProfiles.map(s => ({
                name: s.skill,
                level: s.level,
                score: s.percentage
            }));
            await User.findByIdAndUpdate(userId, { technicalSkills: updatedSkills });
        }

        res.json({ success: true, analysis });
    } catch (err) {
        console.error('Assessment Submit Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- CODE EXECUTION API (RUN VS SUBMIT) ---
app.post('/api/code/run', async (req, res) => {
    try {
        const { language, code, testCases, customInput } = req.body;
        const result = await executeCode({ language, code, testCases: testCases || [], customInput: customInput ?? null });
        res.json(result);
    } catch (err) {
        res.status(500).json({ status: 'Runtime Error', message: err.message, results: [] });
    }
});

app.post('/api/code/submit', async (req, res) => {
    try {
        const { userId, problemId, language, code, testCases, hiddenTestCases } = req.body;
        const allCases = [...(testCases || []), ...(hiddenTestCases || [])];
        const result = await executeCode({ language, code, testCases: allCases, customInput: null });

        const isDbConnected = mongoose.connection.readyState === 1;
        if (result.status === 'Accepted' && isDbConnected && userId && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { 'codingStats.solvedProblems': problemId, 'codingStats.languagesUsed': language },
                $inc: { 'codingStats.currentStreak': 1 }
            });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ status: 'Runtime Error', message: err.message, results: [] });
    }
});

// --- RAG KNOWLEDGE & STUDY MATERIAL API ---
app.get('/api/study/topic', (req, res) => {
    const { q } = req.query;
    const material = getStudyMaterialForTopic(q || '');
    res.json(material);
});

app.get('/api/videos/recommend', (req, res) => {
    const { q } = req.query;
    const videos = rankVideoResources(q || '');
    res.json({ videos });
});

// --- ROADMAP AI GENERATOR API ---
app.post('/api/roadmap/generate', async (req, res) => {
    try {
        const { goal, currentSkills, studyTimeDaily } = req.body;
        
        // AI Roadmap generation prompt or fallback template
        const phases = [
            {
                phaseId: 'p1',
                title: 'Phase 1 — Foundations & Core Concepts',
                description: `Master fundamental building blocks for ${goal || 'your career goal'}.`,
                topics: [
                    {
                        topicId: 't1',
                        title: 'Python Fundamentals & OOP',
                        description: 'Variables, loops, functions, OOP classes and memory management.',
                        difficulty: 'Beginner',
                        estimatedHours: 15,
                        completed: false,
                        prerequisites: []
                    },
                    {
                        topicId: 't2',
                        title: 'Data Structures & Algorithms (DSA)',
                        description: 'Arrays, Hash Tables, Trees, Graphs, and Algorithmic complexity.',
                        difficulty: 'Intermediate',
                        estimatedHours: 25,
                        completed: false,
                        prerequisites: ['t1']
                    }
                ]
            },
            {
                phaseId: 'p2',
                title: 'Phase 2 — Core Specialization & ML Foundations',
                description: 'Deep dive into specialized math, statistics, and machine learning pipelines.',
                topics: [
                    {
                        topicId: 't3',
                        title: 'Machine Learning & AI Foundations',
                        description: 'Supervised vs Unsupervised learning, Scikit-Learn, and evaluation metrics.',
                        difficulty: 'Intermediate',
                        estimatedHours: 30,
                        completed: false,
                        prerequisites: ['t2']
                    }
                ]
            },
            {
                phaseId: 'p3',
                title: 'Phase 3 — Professional Projects & Interview Readiness',
                description: 'Build real-world production projects and hone interview problem solving.',
                topics: [
                    {
                        topicId: 't4',
                        title: 'Generative AI & LLM Engineering',
                        description: 'Transformers, RAG pipelines, Prompt Engineering, and model deployment.',
                        difficulty: 'Advanced',
                        estimatedHours: 40,
                        completed: false,
                        prerequisites: ['t3']
                    }
                ]
            }
        ];

        res.json({
            goal: goal || 'Machine Learning Engineer',
            estimatedDuration: '4 to 6 months',
            studyTimeDaily: studyTimeDaily || '2 hours/day',
            completionPercentage: 0,
            phases
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- V3 ML INTELLIGENCE & TELEMETRY ENDPOINTS ---
app.post('/api/events/log', (req, res) => {
    const { userId, eventType, eventData } = req.body;
    const evt = logLearningEvent(userId, eventType, eventData);
    res.json({ success: true, event: evt });
});

app.post('/api/ml/career-predict', async (req, res) => {
    try {
        const { userSkills } = req.body;
        const result = await predictCareers(userSkills || {});
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/ml/intelligence-summary', async (req, res) => {
    try {
        const defaultSkills = { "Python": 85, "Machine Learning": 70, "DSA": 64, "Statistics": 48 };
        const [careerData, planData] = await Promise.all([
            predictCareers(defaultSkills),
            getLearningPlan(defaultSkills, ["Statistics", "Deep Learning"])
        ]);

        res.json({
            overallProficiency: 76.5,
            careerPredictions: careerData.predictions || [],
            dailyPlan: planData.plan || [],
            knowledgeDecayAlerts: [
                { skill: "SQL Joins & Indexing", decayPercent: 18, lastPracticedDaysAgo: 14, action: "Revision Recommended" },
                { skill: "Computer Networks (OSI Layers)", decayPercent: 12, lastPracticedDaysAgo: 9, action: "Quick Quiz" }
            ],
            learningMetrics: {
                totalEvents: 142,
                streakDays: 5,
                estimatedGrowth: "+14%"
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`🚀 SkillBridgeAI Backend running on port ${PORT}`));


