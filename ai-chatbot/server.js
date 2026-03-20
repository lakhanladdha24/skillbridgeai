const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const connectDB = require('./db');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillbridgeai_secret_123_abc';

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

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
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

    const modelCandidates = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'models/gemini-1.5-flash', 'models/gemini-1.5-pro', 'gemini-pro'];
    let lastError = null;

    for (const modelName of modelCandidates) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: SYSTEM_PROMPT,
                generationConfig: { temperature: 0.5 }
            });

            let formattedHistory = (history || [])
                .filter(msg => msg.content && msg.content.trim() !== '')
                .map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }));

            if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') formattedHistory.shift();

            const chat = model.startChat({ history: formattedHistory });
            const result = await chat.sendMessage(message);
            const responseText = result.response.text();

            return res.status(200).json({ reply: responseText });
        } catch (error) {
            console.warn(`Model ${modelName} failed on Local/Render:`, error.message);
            lastError = error;
            if (error.message.includes('429')) break;
            continue;
        }
    }
    res.status(500).json({ error: `AI Failed: ${lastError?.message}` });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

app.listen(PORT, () => console.log(`🚀 SkillBridgeAI Backend running on port ${PORT}`));

