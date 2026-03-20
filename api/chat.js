import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('CRITICAL ERROR: GEMINI_API_KEY is not defined in Vercel Environment Variables.');
        return res.status(500).json({ 
            error: 'Backend Configuration Error: API Key missing in Vercel settings. Please go to Vercel > Settings > Environment Variables and add GEMINI_API_KEY.' 
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.4,
            }
        });

        let formattedHistory = (history || [])
            .filter(msg => msg.content && msg.content.trim() !== '') // Clean empty messages
            .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

        // History fix for Gemini API
        if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift();
        }

        const chat = model.startChat({
            history: formattedHistory,
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        return res.status(200).json({ reply: responseText });
    } catch (error) {
        console.error('Gemini API Error details:', error);
        const errorMsg = error.message || 'Error occurred while contacting Google AI. Check your API key or usage limits.';
        return res.status(500).json({ error: errorMsg });
    }
}
