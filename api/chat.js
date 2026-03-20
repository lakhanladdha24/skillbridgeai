import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key missing on Vercel Dashboard.' });
    }

    const modelCandidates = [
        'gemini-1.5-flash-latest', 
        'gemini-1.5-flash', 
        'models/gemini-1.5-flash', 
        'models/gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'models/gemini-1.5-pro',
        'gemini-pro',
        'models/gemini-pro'
    ];
    let lastError = null;

    for (const modelName of modelCandidates) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: modelName,
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
            // If it's a 429 (rate limit), don't keep trying others, just error out
            if (error.message.includes('429')) break;
            continue; // Try next model
        }
    }

    // If all models failed
    return res.status(500).json({ 
        error: `AI Error: All models failed. Last Error: ${lastError?.message || 'Unknown'}. Please check if your API key restricts access to specific models.` 
    });
}
