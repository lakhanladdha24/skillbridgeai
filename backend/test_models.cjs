const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './ai-chatbot/.env' });

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const models = await genAI.listModels();
        console.log('Available Models:');
        models.models.forEach(m => {
            console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods})`);
        });
    } catch (error) {
        console.error('Error listing models:', error.message);
    }
}

listModels();
