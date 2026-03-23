const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Groq = require('groq-sdk');

const apiKey = process.env.GROQ_API_KEY || process.env.CHATBOT_API_KEY;

if (!apiKey) {
    console.error('❌ GROQ_API_KEY or CHATBOT_API_KEY not found in .env');
    process.exit(1);
}

const groq = new Groq({ apiKey });

async function testGroq() {
    try {
        console.log('Testing Groq with llama-3.3-70b-versatile...');
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'user', content: 'Hello! Are you working with Groq?' }
            ],
            model: 'llama-3.3-70b-versatile',
        });

        console.log('✅ Groq Response:');
        console.log(chatCompletion.choices[0]?.message?.content);
    } catch (error) {
        console.error('❌ Groq Error:', error.message);
    }
}

testGroq();
