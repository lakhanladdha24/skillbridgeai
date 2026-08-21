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

    // Provider 1: Groq
    if (groq) {
        try {
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

            const chatCompletion = await groq.chat.completions.create({
                messages,
                model: "llama-3.3-70b-versatile",
                temperature: 0.5,
                max_tokens: 2048,
                top_p: 1,
                stream: false,
            });

            const reply = chatCompletion.choices[0]?.message?.content || "";
            return res.status(200).json({ reply });
        } catch (error) {
            console.error('Groq Chat Completion Error:', error.message);
            // Fallthrough to Gemini if Groq fails
        }
    }

    // Provider 2: Gemini
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
        reply: `**SkillBridgeAI Assistant (Offline Mode)**\n\nI received your query: "${message}".\n\nTo enable live AI responses, please ensure a valid \`GROQ_API_KEY\` or \`GEMINI_API_KEY\` is configured in your \`.env\` file.`
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

app.listen(PORT, () => console.log(`🚀 SkillBridgeAI Backend running on port ${PORT}`));


