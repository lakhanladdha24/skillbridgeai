const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Groq = require('groq-sdk');
const connectDB = require('./db');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillbridgeai_secret_123_abc';

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || process.env.CHATBOT_API_KEY
});

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name, email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, skills: user.technicalSkills } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Profile (for Onboarding)
app.put('/api/user/profile', async (req, res) => {
    try {
        const { userId, skills } = req.body;
        await User.findByIdAndUpdate(userId, { technicalSkills: skills });
        res.json({ success: true, message: 'Profile updated with skills!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CHAT LOGIC ---
const SYSTEM_PROMPT = `You are SkillBridgeAI, a premium AI career mentor. 
Always use markdown. Focus on professional growth.
If you know the user's skills, tailor your advice to their level (Beginner/Intermediate/Advanced).`;

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        const apiKey = process.env.GROQ_API_KEY || process.env.CHATBOT_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'GROQ_API_KEY or CHATBOT_API_KEY not configured' });
        }

        const messages = [
            {
                role: "system",
                content: SYSTEM_PROMPT
            },
            ...(history || []).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            {
                role: "user",
                content: message
            }
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
        res.status(200).json({ reply });
    } catch (error) {
        console.error('Groq Chat Completion Error:', error.message);
        res.status(500).json({ error: `AI Powered by Groq Failed: ${error.message}` });
    }
});

app.get('/api/debug-env', (req, res) => {
    res.json({
        has_groq_key: !!(process.env.GROQ_API_KEY || process.env.CHATBOT_API_KEY),
        has_mongodb_uri: !!process.env.MONGODB_URI,
        node_version: process.version
    });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

app.listen(PORT, () => console.log(`🚀 SkillBridgeAI Backend running on port ${PORT}`));

