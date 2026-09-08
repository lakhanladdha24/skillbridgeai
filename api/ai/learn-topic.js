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

                try {
                    const completion = await groq.chat.completions.create({
                        messages: [{ role: 'user', content: prompt }],
                        model: 'groq/compound',
                        response_format: { type: 'json_object' },
                        temperature: 0.3
                    });
                    const raw = completion.choices[0]?.message?.content;
                    if (raw) return res.status(200).json(JSON.parse(raw));
                } catch (e) {
                    console.warn("Groq serverless explain error:", e.message);
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

                try {
                    const completion = await groq.chat.completions.create({
                        messages: [{ role: 'user', content: prompt }],
                        model: 'groq/compound',
                        response_format: { type: 'json_object' },
                        temperature: 0.3
                    });
                    const raw = completion.choices[0]?.message?.content;
                    if (raw) return res.status(200).json(JSON.parse(raw));
                } catch (e) {
                    console.warn("Groq serverless quiz error:", e.message);
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

                try {
                    const completion = await groq.chat.completions.create({
                        messages: [{ role: 'user', content: prompt }],
                        model: 'groq/compound',
                        response_format: { type: 'json_object' },
                        temperature: 0.3
                    });
                    const raw = completion.choices[0]?.message?.content;
                    if (raw) return res.status(200).json(JSON.parse(raw));
                } catch (e) {
                    console.warn("Groq serverless project error:", e.message);
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

                try {
                    const completion = await groq.chat.completions.create({
                        messages,
                        model: 'groq/compound',
                        temperature: 0.5
                    });
                    const reply = completion.choices[0]?.message?.content;
                    return res.status(200).json({ reply });
                } catch (e) {
                    console.warn("Groq serverless chat error:", e.message);
                }
            }
        }

        // Fallback
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
