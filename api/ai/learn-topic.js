import Groq from 'groq-sdk';

const groqKey = process.env.GROQ_API_KEY || process.env.CHATBOT_API_KEY;
const groq = groqKey ? new Groq({ apiKey: groqKey }) : null;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { topicTitle, roadmapGoal, mode, userQuestion, history } = req.body || {};
        const topic = (topicTitle || 'Software Engineering Core').trim();
        const goal = (roadmapGoal || 'Software Development').trim();
        const selectedMode = mode || 'explain';

        const groqCandidateModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'allam-2-7b', 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

        if (groq) {
            // Mode 1: EXPLAIN
            if (selectedMode === 'explain') {
                const prompt = `You are a world-class computer science educator from roadmap.sh.
Explain the topic: "${topic}" in the context of "${goal}".
Return strict JSON with this exact schema:
{
  "topic": "${topic}",
  "eli5": "Simple real-life metaphor that explains the concept to a beginner in 2-3 clear sentences.",
  "technical": "In-depth technical explanation covering underlying mechanics, runtime behavior, and memory/data flow.",
  "architecture": "How production systems and top companies implement and scale this concept.",
  "codeSnippet": "// Production code example showcasing ${topic}\\nfunction example() { ... }",
  "bestPractices": [
    "Rule 1 for high performance or reliability",
    "Rule 2 for maintainability",
    "Common pitfall to avoid"
  ]
}
Return ONLY pure JSON without markdown backticks.`;

                for (const model of groqCandidateModels) {
                    try {
                        const completion = await groq.chat.completions.create({
                            messages: [{ role: 'user', content: prompt }],
                            model,
                            response_format: { type: 'json_object' },
                            temperature: 0.3
                        });
                        const raw = completion.choices[0]?.message?.content;
                        if (raw) return res.status(200).json(JSON.parse(raw));
                    } catch (e) {
                        console.warn(`Groq serverless explain [${model}] error:`, e.message);
                        if (e.status === 401) break;
                    }
                }
            }

            // Mode 2: QUIZ
            if (selectedMode === 'quiz') {
                const prompt = `You are an expert technical interviewer from roadmap.sh.
Generate 3 challenging multiple-choice questions testing comprehension of: "${topic}".
Return strict JSON with this schema:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": 1,
      "question": "Question text testing practical understanding?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct based on CS fundamentals."
    },
    {
      "id": 2,
      "question": "Second practical scenario question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Clear explanation of the correct option."
    },
    {
      "id": 3,
      "question": "Third question on performance or edge cases?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 2,
      "explanation": "Clear explanation of the correct option."
    }
  ]
}
Return ONLY pure JSON without markdown backticks.`;

                for (const model of groqCandidateModels) {
                    try {
                        const completion = await groq.chat.completions.create({
                            messages: [{ role: 'user', content: prompt }],
                            model,
                            response_format: { type: 'json_object' },
                            temperature: 0.3
                        });
                        const raw = completion.choices[0]?.message?.content;
                        if (raw) return res.status(200).json(JSON.parse(raw));
                    } catch (e) {
                        console.warn(`Groq serverless quiz [${model}] error:`, e.message);
                        if (e.status === 401) break;
                    }
                }
            }

            // Mode 3: PROJECT CHALLENGE
            if (selectedMode === 'project') {
                const prompt = `Generate a realistic hands-on engineering project challenge for topic: "${topic}".
Return strict JSON with schema:
{
  "title": "Project Title",
  "difficulty": "Intermediate",
  "estimatedTime": "3-5 Hours",
  "objective": "Clear description of what to build.",
  "userStories": ["User can do X", "System handles Y", "Data is persisted to Z"],
  "starterFiles": ["index.js", "README.md"],
  "bonusChallenge": "Stretch goal for advanced learners"
}
Return pure JSON only.`;

                for (const model of groqCandidateModels) {
                    try {
                        const completion = await groq.chat.completions.create({
                            messages: [{ role: 'user', content: prompt }],
                            model,
                            response_format: { type: 'json_object' },
                            temperature: 0.3
                        });
                        const raw = completion.choices[0]?.message?.content;
                        if (raw) return res.status(200).json(JSON.parse(raw));
                    } catch (e) {
                        console.warn(`Groq serverless project [${model}] error:`, e.message);
                        if (e.status === 401) break;
                    }
                }
            }

            // Mode 4: CHAT
            if (selectedMode === 'chat') {
                const userMsg = userQuestion || 'Can you summarize the most important parts of this topic?';
                const messages = [
                    { role: 'system', content: `You are the expert AI Tutor from roadmap.sh helping a developer learn "${topic}" in "${goal}". Format nicely in Markdown with code snippets where helpful.` },
                    ...(Array.isArray(history) ? history.slice(-4) : []),
                    { role: 'user', content: userMsg }
                ];

                for (const model of groqCandidateModels) {
                    try {
                        const completion = await groq.chat.completions.create({
                            messages,
                            model,
                            temperature: 0.5
                        });
                        const reply = completion.choices[0]?.message?.content;
                        if (reply) return res.status(200).json({ reply });
                    } catch (e) {
                        console.warn(`Groq serverless chat [${model}] error:`, e.message);
                        if (e.status === 401) break;
                    }
                }

                return res.status(200).json({
                    reply: `### AI Tutor: ${topic}\n\nHere is a practical breakdown for **${topic}** in **${goal}**:\n\n1. **Core Concept**: ${topic} is fundamental to building scalable, reliable applications in ${goal}.\n2. **Best Practices**: Focus on separation of concerns, writing clean modular functions, and handling edge cases explicitly.\n3. **Practical Tip**: Implement small, focused test cases and explore concrete examples in the coding lab.\n\n*Feel free to ask more specific questions or request a code snippet!*`
                });
            }
        }

        // Fallback for chat if groq is missing
        if (selectedMode === 'chat') {
            return res.status(200).json({
                reply: `### AI Tutor: ${topic}\n\nHere is a practical breakdown for **${topic}** in **${goal}**:\n\n1. **Core Concept**: ${topic} is fundamental to building scalable, reliable applications in ${goal}.\n2. **Best Practices**: Focus on modular design, clean contracts, and explicit error handling.\n3. **Practical Tip**: Test your concepts with small code snippets in the coding lab.\n\n*Feel free to ask more specific questions or request a code snippet!*`
            });
        }

        // Fallback for other modes
        return res.status(200).json({
            topic,
            eli5: `Think of ${topic} like the foundation and plumbing of a house: essential for everything above it to function reliably.`,
            technical: `${topic} encapsulates core architectural abstractions, ensuring state transitions and predictable time/space complexity.`,
            architecture: `High-scale production systems isolate ${topic} behind clean, decoupled interfaces to allow independent scaling.`,
            codeSnippet: `// Production Pattern for ${topic}\nfunction executeTask() {\n    return { success: true, topic: "${topic}" };\n}`,
            bestPractices: [
                `Validate inputs and handle edge cases explicitly.`,
                `Adhere to the Single Responsibility Principle.`,
                `Add automated tests for critical execution branches.`
            ]
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
