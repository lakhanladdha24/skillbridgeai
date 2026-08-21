import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.NVIDIA_API_KEY || process.env.GROQ_API_KEY || process.env.CHATBOT_API_KEY;

if (!apiKey) {
    console.error('❌ NVIDIA_API_KEY, GROQ_API_KEY, or CHATBOT_API_KEY not found in .env');
    process.exit(1);
}

const models = [
    'meta/llama-3.3-70b-instruct',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'meta/llama3-70b-instruct',
    'mistralai/mixtral-8x7b-instruct-v0.1'
];

async function testNvidia() {
    for (const model of models) {
        try {
            console.log(`Testing NVIDIA API with key [${apiKey.slice(0, 8)}...] and model [${model}]...`);
            const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: 'user', content: 'Hello! Are you powered by NVIDIA AI?' }],
                    temperature: 0.5,
                    max_tokens: 1024
                })
            });

            const data = await response.json();
            if (!response.ok) {
                console.error(`❌ Model [${model}] Error:`, data.detail || data.message || JSON.stringify(data));
                continue;
            }

            console.log(`✅ NVIDIA Success with [${model}]:`);
            console.log(data.choices[0]?.message?.content);
            return;
        } catch (error) {
            console.error(`❌ Error testing ${model}:`, error.message);
        }
    }
}

testNvidia();
