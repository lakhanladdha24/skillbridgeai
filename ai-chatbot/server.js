const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Key verification
if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ WARNING: GEMINI_API_KEY is not defined in the environment or .env file.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const SYSTEM_PROMPT = `You are SkillBridgeAI, a professional AI career mentor. 
You provide structured, accurate, and practical answers.
Always organize answers using bullet points or numbered format.
Be clear, concise, and professional.
If unsure, say you are not fully certain instead of guessing.
Focus on helping students grow.

Special guidelines based on user topic:
- If the question is about careers, provide: Career overview, Required skills, Salary range (approximate), Learning roadmap, Suggested certifications.
- If the question is about resume: Give structured resume bullet suggestions, Provide improvement tips.
- If the question is about interview: Provide sample questions, Provide sample answers, Provide tips.`;

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }

    const modelCandidates = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    let lastError = null;

    for (const modelName of modelCandidates) {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: SYSTEM_PROMPT,
                generationConfig: { temperature: 0.4 }
            });

            let formattedHistory = (history || [])
                .filter(msg => msg.content && msg.content.trim() !== '')
                .map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }));

            if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
                formattedHistory.shift();
            }

            const chat = model.startChat({ history: formattedHistory });
            const result = await chat.sendMessage(message);
            const responseText = result.response.text();

            return res.status(200).json({ reply: responseText });
        } catch (error) {
            console.warn(`Model ${modelName} failed:`, error.message);
            lastError = error;
            if (error.message.includes('429')) break;
            continue;
        }
    }

    res.status(500).json({ error: `All models failed. Last Error: ${lastError?.message}` });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
