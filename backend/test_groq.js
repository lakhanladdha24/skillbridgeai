import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.GROQ_API_KEY || process.env.CHATBOT_API_KEY;

if (!apiKey) {
    console.error('❌ GROQ_API_KEY or CHATBOT_API_KEY not found in .env');
    process.exit(1);
}

const groq = new Groq({ apiKey });

async function testGroq() {
    const modelCandidates = ['groq/compound', 'openai/gpt-oss-120b', 'groq/compound-mini', 'qwen/qwen3.6-27b'];
    for (const model of modelCandidates) {
        try {
            console.log(`Testing Groq with model: ${model}...`);
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'user', content: 'Hello! Are you working with Groq?' }
                ],
                model,
            });

            console.log(`✅ Groq Success with [${model}]:`);
            console.log(chatCompletion.choices[0]?.message?.content);
            return;
        } catch (error) {
            console.error(`❌ Model [${model}] Error:`, error.message);
        }
    }
}

testGroq();
