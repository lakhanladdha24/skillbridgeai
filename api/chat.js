import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, history } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const cleanHistory = (history || []).filter(
        msg => msg.content && !msg.content.startsWith('AI Error') && !msg.content.startsWith('Groq Error') && !msg.content.startsWith('Sorry,')
    );
    
    // Priority 1: Groq
    const groqKey = process.env.GROQ_API_KEY || process.env.CHATBOT_API_KEY;
    if (groqKey) {
        const groq = new Groq({ apiKey: groqKey });
        const groqModels = ['groq/compound', 'openai/gpt-oss-120b', 'groq/compound-mini', 'qwen/qwen3.6-27b', 'llama-3.3-70b-versatile'];
        const messages = [
            { role: "system", content: "You are SkillBridgeAI, a premium AI career mentor. Always use markdown. Focus on professional growth." },
            ...cleanHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: "user", content: message }
        ];

        for (const modelName of groqModels) {
            try {
                const completion = await groq.chat.completions.create({
                    messages,
                    model: modelName,
                    temperature: 0.5,
                });
                return res.status(200).json({ reply: completion.choices[0]?.message?.content || "" });
            } catch (error) {
                console.error(`Groq Model [${modelName}] Error:`, error.message);
                if (error.message.includes('429')) break;
            }
        }
    }

    // Priority 2: Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
        const modelCandidates = [
            'gemini-1.5-flash',
            'gemini-2.0-flash-exp',
            'gemini-pro'
        ];

        let lastError = null;
        for (const modelName of modelCandidates) {
            try {
                const genAI = new GoogleGenerativeAI(geminiKey);
                const model = genAI.getGenerativeModel({ model: modelName });
                
                const formattedHistory = cleanHistory
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
                return res.status(200).json({ reply: result.response.text() });
            } catch (error) {
                lastError = error;
                if (error.message.includes('429')) break;
                continue;
            }
        }
    }

    return res.status(200).json({ 
        reply: `**SkillBridgeAI Assistant (Offline Mode)**\n\nI received your query: "${message}".\n\nTo enable live AI responses, please ensure a valid \`GROQ_API_KEY\` or \`GEMINI_API_KEY\` is configured in environment variables.` 
    });
}

