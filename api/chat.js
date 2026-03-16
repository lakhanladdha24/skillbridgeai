import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
                temperature: 0.4,
            }
        });

        let formattedHistory = (history || []).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift();
        }

        const chat = model.startChat({
            history: formattedHistory,
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        res.status(200).json({ reply: responseText });
    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ error: 'Sorry, I am facing an issue at the moment. Please try again later.' });
    }
}
