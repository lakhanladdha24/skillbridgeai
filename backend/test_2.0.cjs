const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = 'models/gemini-2.0-flash';
    
    console.log(`Testing model: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log("Success! Response:", result.response.text());
    } catch (err) {
        console.error("Failed:", err.message);
    }
}

test();
