import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from './db.js';
import User from './models/User.js';
import { logLearningEvent, getUserEvents } from './services/eventLogger.js';
import { predictSkill, predictCareers, getLearningPlan, searchRoadmap } from './services/mlClient.js';
import Roadmap from './models/Roadmap.js';
import { analyzeAssessmentResult } from './services/assessmentEngine.js';
import { executeCode } from './services/codeExecutor.js';
import { getStudyMaterialForTopic, rankVideoResources } from './services/ragKnowledgeService.js';
import { searchYouTubeCourseVideos } from './services/youtubeEngine.js';
import { checkCourseCompletion, updateVideoProgress, getCourseProgress, generateCertificateForUser, getCertificateById, getUserCertificates } from './services/certificateEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillbridgeai_secret_123_abc';

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

// Initialize Groq
const groqKey = process.env.GROQ_API_KEY || process.env.CHATBOT_API_KEY;
const groq = groqKey ? new Groq({ apiKey: groqKey }) : null;

// Initialize Gemini fallback
const geminiKey = process.env.GEMINI_API_KEY;
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// In-memory fallback user store for when MongoDB is disconnected
const localUsers = new Map();

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !name) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const isDbConnected = mongoose.connection.readyState === 1;

        if (isDbConnected) {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ error: 'User already exists' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password || 'default123', salt);

            user = new User({ name, email, password: hashedPassword, technicalSkills: [] });
            await user.save();

            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({ token, user: { id: user._id, name: user.name, email: user.email, skills: [] } });
        } else {
            // Local fallback session
            if (localUsers.has(email)) {
                return res.status(400).json({ error: 'User already exists (local mode)' });
            }
            const localUser = { id: 'local_' + Date.now(), name, email, password, skills: [] };
            localUsers.set(email, localUser);
            const token = jwt.sign({ id: localUser.id }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({ token, user: { id: localUser.id, name: localUser.name, email: localUser.email, skills: [] } });
        }
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ error: err.message || 'Signup failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const isDbConnected = mongoose.connection.readyState === 1;

        if (isDbConnected) {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: 'Invalid Credentials' });

            const isMatch = await bcrypt.compare(password || 'default123', user.password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid Credentials' });

            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({ token, user: { id: user._id, name: user.name, email: user.email, skills: user.technicalSkills || [] } });
        } else {
            // Local fallback login check
            const localUser = localUsers.get(email);
            if (localUser) {
                const token = jwt.sign({ id: localUser.id }, JWT_SECRET, { expiresIn: '1d' });
                return res.json({ token, user: { id: localUser.id, name: localUser.name, email: localUser.email, skills: localUser.skills || [] } });
            }
            
            // Allow instant demo session when DB is offline
            const demoUser = { id: 'demo_' + Date.now(), name: email.split('@')[0], email, skills: [] };
            const token = jwt.sign({ id: demoUser.id }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({ token, user: demoUser });
        }
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: err.message || 'Login failed' });
    }
});

// Update Profile (for Onboarding)
app.put('/api/user/profile', async (req, res) => {
    try {
        const { userId, skills } = req.body;
        const isDbConnected = mongoose.connection.readyState === 1;

        if (isDbConnected && userId && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
            await User.findByIdAndUpdate(userId, { technicalSkills: skills });
        }
        res.json({ success: true, message: 'Profile updated with skills!', skills });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CHAT LOGIC ---
const SYSTEM_PROMPT = `You are SkillBridgeAI, a premium AI career mentor. 
Always use markdown. Focus on professional growth.
If you know the user's skills, tailor your advice to their level (Beginner/Intermediate/Advanced).`;

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Provider 1: NVIDIA AI (NVIDIA NIM API)
    const nvidiaKey = process.env.NVIDIA_API_KEY || (process.env.GROQ_API_KEY?.startsWith('nvapi-') ? process.env.GROQ_API_KEY : null) || (process.env.CHATBOT_API_KEY?.startsWith('nvapi-') ? process.env.CHATBOT_API_KEY : null);
    if (nvidiaKey) {
        const nvidiaModels = ['meta/llama-3.3-70b-instruct', 'nvidia/llama-3.1-nemotron-70b-instruct', 'meta/llama3-70b-instruct'];
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...(history || [])
                .filter(msg => msg.content && !msg.content.startsWith('AI Error') && !msg.content.startsWith('Sorry,'))
                .map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
            { role: "user", content: message }
        ];

        for (const model of nvidiaModels) {
            try {
                const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${nvidiaKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model,
                        messages,
                        temperature: 0.5,
                        max_tokens: 2048
                    })
                });

                const data = await response.json();
                if (response.ok && data.choices && data.choices[0]?.message?.content) {
                    return res.status(200).json({ reply: data.choices[0].message.content });
                }
            } catch (error) {
                console.error(`NVIDIA API [${model}] Error:`, error.message);
            }
        }
    }

    // Provider 2: Groq
    if (groq) {
        const groqModels = ['groq/compound', 'openai/gpt-oss-120b', 'groq/compound-mini', 'qwen/qwen3.6-27b', 'llama-3.3-70b-versatile'];
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...(history || [])
                .filter(msg => msg.content && !msg.content.startsWith('AI Error') && !msg.content.startsWith('Groq Error') && !msg.content.startsWith('Sorry,'))
                .map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
            { role: "user", content: message }
        ];

        for (const modelName of groqModels) {
            try {
                const chatCompletion = await groq.chat.completions.create({
                    messages,
                    model: modelName,
                    temperature: 0.5,
                    max_tokens: 2048,
                    top_p: 1,
                    stream: false,
                });

                const reply = chatCompletion.choices[0]?.message?.content || "";
                return res.status(200).json({ reply });
            } catch (error) {
                console.error(`Groq Model [${modelName}] Error:`, error.message);
                if (error.message.includes('429')) break;
            }
        }
    }

    // Provider 3: Gemini
    if (genAI) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const promptWithContext = `${SYSTEM_PROMPT}\n\nUser Question: ${message}`;
            const result = await model.generateContent(promptWithContext);
            const response = await result.response;
            return res.status(200).json({ reply: response.text() });
        } catch (error) {
            console.error('Gemini Chat Completion Error:', error.message);
        }
    }

    // Fallback: Informative response if AI keys aren't operational
    return res.status(200).json({
        reply: `**SkillBridgeAI Assistant (Offline Mode)**\n\nI received your query: "${message}".\n\nTo enable live AI responses, please ensure a valid \`NVIDIA_API_KEY\`, \`GROQ_API_KEY\`, or \`GEMINI_API_KEY\` is configured in your \`.env\` file.`
    });
});

app.get('/api/debug-env', (req, res) => {
    res.json({
        has_groq_key: !!groqKey,
        has_gemini_key: !!geminiKey,
        has_mongodb_uri: !!process.env.MONGODB_URI,
        db_status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        node_version: process.version
    });
});

app.get('/api/health', (req, res) => res.json({
    status: 'ok',
    db: mongoose.connection && mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));

// --- ASSESSMENT ANALYSIS API ---
app.post('/api/assessment/submit', async (req, res) => {
    try {
        const { userId, answers, questions, timeSpentSeconds } = req.body;
        const analysis = analyzeAssessmentResult(answers, questions, timeSpentSeconds);

        const isDbConnected = mongoose.connection.readyState === 1;
        if (isDbConnected && userId && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
            const doc = new Assessment({
                userId,
                ...analysis
            });
            await doc.save();

            // Update user skills profile
            const updatedSkills = analysis.skillProfiles.map(s => ({
                name: s.skill,
                level: s.level,
                score: s.percentage
            }));
            await User.findByIdAndUpdate(userId, { technicalSkills: updatedSkills });
        }

        res.json({ success: true, analysis });
    } catch (err) {
        console.error('Assessment Submit Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- CODE EXECUTION API (RUN VS SUBMIT) ---
app.post('/api/code/run', async (req, res) => {
    try {
        const { language, code, testCases, customInput } = req.body;
        const result = await executeCode({ language, code, testCases: testCases || [], customInput: customInput ?? null });
        res.json(result);
    } catch (err) {
        res.status(500).json({ status: 'Runtime Error', message: err.message, results: [] });
    }
});

app.post('/api/code/submit', async (req, res) => {
    try {
        const { userId, problemId, language, code, testCases, hiddenTestCases } = req.body;
        const allCases = [...(testCases || []), ...(hiddenTestCases || [])];
        const result = await executeCode({ language, code, testCases: allCases, customInput: null });

        const isDbConnected = mongoose.connection.readyState === 1;
        if (result.status === 'Accepted' && isDbConnected && userId && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { 'codingStats.solvedProblems': problemId, 'codingStats.languagesUsed': language },
                $inc: { 'codingStats.currentStreak': 1 }
            });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ status: 'Runtime Error', message: err.message, results: [] });
    }
});

// --- RAG KNOWLEDGE & STUDY MATERIAL API ---
app.get('/api/study/topic', async (req, res) => {
    try {
        const { q } = req.query;
        const material = await getStudyMaterialForTopic(q || '');
        res.json(material);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/videos/recommend', async (req, res) => {
    try {
        const { q } = req.query;
        const videos = await rankVideoResources(q || '');
        res.json({ videos });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ROADMAP AI GENERATOR API ---
app.post('/api/roadmap/search', async (req, res) => {
    try {
        const { query } = req.body;
        const result = await searchRoadmap(query || 'Frontend Developer');
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/roadmap/generate', async (req, res) => {
    try {
        const { goal, currentSkills, studyTimeDaily } = req.body;
        const target = goal || 'Frontend Developer';
        const result = await searchRoadmap(target);
        if (studyTimeDaily) {
            result.studyTimeDaily = studyTimeDaily;
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LEARN WITH AI (ROADMAP.SH AI TUTOR API) ---
app.post('/api/ai/learn-topic', async (req, res) => {
    try {
        const { topicTitle, roadmapGoal, mode, userQuestion, history } = req.body;
        const topic = (topicTitle || 'Software Engineering Core').trim();
        const goal = (roadmapGoal || 'Software Development').trim();
        const selectedMode = mode || 'explain';

        if (groq) {
            // Mode 1: EXPLAIN (ELI5, Technical, Architecture, Code)
            if (selectedMode === 'explain') {
                const prompt = `You are a world-class computer science educator like roadmap.sh.
Explain the topic: "${topic}" in the context of "${goal}".
Return strict JSON with this exact schema:
{
  "topic": "${topic}",
  "eli5": "Simple real-life metaphor or analogy that explains the concept to a beginner in 2-3 clear sentences.",
  "technical": "In-depth technical explanation covering underlying mechanics, runtime behavior, and memory/data flow.",
  "architecture": "How production systems and top companies (Google, Meta, Netflix) implement and scale this concept.",
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
                    if (raw) {
                        return res.json(JSON.parse(raw));
                    }
                } catch (e) {
                    console.warn("Groq explain error:", e.message);
                }
            }

            // Mode 2: QUIZ (3 interactive multiple-choice questions)
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
                    if (raw) {
                        return res.json(JSON.parse(raw));
                    }
                } catch (e) {
                    console.warn("Groq quiz error:", e.message);
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
                    if (raw) {
                        return res.json(JSON.parse(raw));
                    }
                } catch (e) {
                    console.warn("Groq project error:", e.message);
                }
            }

            // Mode 4: INTERACTIVE CHAT / DOUBT SOLVING
            if (selectedMode === 'chat') {
                const userMsg = userQuestion || 'Can you summarize the most important parts of this topic?';
                const systemPrompt = `You are the friendly, expert AI Tutor from roadmap.sh helping a developer learn "${topic}" in the "${goal}" roadmap. Be concise, practical, and provide concrete code snippets where applicable. Format nicely in Markdown.`;

                const messages = [
                    { role: 'system', content: systemPrompt },
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
                    return res.json({ reply });
                } catch (e) {
                    console.warn("Groq chat error:", e.message);
                }
            }
        }

        // Offline / Fallback Responses
        if (selectedMode === 'quiz') {
            return res.json({
                topic,
                questions: [
                    {
                        id: 1,
                        question: `What is the primary role of ${topic} in production applications?`,
                        options: [
                            `Establishing scalable baseline patterns and predictable execution`,
                            `Replacing all database operations`,
                            `Decreasing network bandwidth to zero`,
                            `Automating hardware manufacturing`
                        ],
                        correctIndex: 0,
                        explanation: `${topic} provides the computational structures and contracts required to build predictable, maintainable software.`
                    },
                    {
                        id: 2,
                        question: `Which of the following is considered a best practice when working with ${topic}?`,
                        options: [
                            `Ignoring error states and uncaught exceptions`,
                            `Modular design, separation of concerns, and clear contracts`,
                            `Hardcoding sensitive credentials in source code`,
                            `Avoiding automated unit tests`
                        ],
                        correctIndex: 1,
                        explanation: `Separation of concerns and modularity are foundational best practices.`
                    },
                    {
                        id: 3,
                        question: `How does mastering ${topic} improve overall system reliability?`,
                        options: [
                            `By eliminating the need for server operating systems`,
                            `By reducing cognitive overhead, catching edge cases, and adhering to standard patterns`,
                            `By converting all code directly into quantum circuits`,
                            `It has no effect on reliability`
                        ],
                        correctIndex: 1,
                        explanation: `Adhering to proven industry patterns prevents regressions and unhandled edge cases.`
                    }
                ]
            });
        }

        if (selectedMode === 'project') {
            return res.json({
                title: `${topic} Production Showcase Module`,
                difficulty: "Intermediate",
                estimatedTime: "4 Hours",
                objective: `Build a production-grade module or service implementing core ${topic} features.`,
                userStories: [
                    `User can configure and run ${topic} operations with validation`,
                    `System logs operations and gracefully catches input anomalies`,
                    `Code includes unit tests verifying both happy and error paths`
                ],
                starterFiles: ["app.js", "service.js", "tests.test.js"],
                bonusChallenge: "Add benchmark metrics or persistent caching"
            });
        }

        return res.json({
            topic,
            eli5: `Think of ${topic} like the foundation and plumbing of a house: you might not see it every day, but without it, nothing in the building can function reliably.`,
            technical: `${topic} encapsulates core architectural abstractions and protocols. It manages state transitions, ensures data integrity, and adheres to strict time/space complexity guarantees.`,
            architecture: `In high-scale enterprise systems, ${topic} is isolated behind clean interfaces to ensure decoupled scalability, predictable failovers, and seamless testing.`,
            codeSnippet: `// Production Code Pattern for ${topic}\nclass ${topic.replace(/[^a-zA-Z0-9]/g, '')}Handler {\n    constructor(options = {}) {\n        this.options = options;\n    }\n    \n    async execute(payload) {\n        if (!payload) throw new Error("Payload is required");\n        return { success: true, processedAt: Date.now() };\n    }\n}`,
            bestPractices: [
                `Always validate inputs and handle edge cases explicitly.`,
                `Keep modules focused and single-purpose (Single Responsibility Principle).`,
                `Write integration tests for critical business paths.`
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- V3 ML INTELLIGENCE & TELEMETRY ENDPOINTS ---
app.post('/api/events/log', (req, res) => {
    const { userId, eventType, eventData } = req.body;
    const evt = logLearningEvent(userId, eventType, eventData);
    res.json({ success: true, event: evt });
});

app.post('/api/ml/career-predict', async (req, res) => {
    try {
        const { userSkills } = req.body;
        const result = await predictCareers(userSkills || {});
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/ml/intelligence-summary', async (req, res) => {
    try {
        const defaultSkills = { "Python": 85, "Machine Learning": 70, "DSA": 64, "Statistics": 48 };
        const [careerData, planData] = await Promise.all([
            predictCareers(defaultSkills),
            getLearningPlan(defaultSkills, ["Statistics", "Deep Learning"])
        ]);

        res.json({
            overallProficiency: 76.5,
            careerPredictions: careerData.predictions || [],
            dailyPlan: planData.plan || [],
            knowledgeDecayAlerts: [
                { skill: "SQL Joins & Indexing", decayPercent: 18, lastPracticedDaysAgo: 14, action: "Revision Recommended" },
                { skill: "Computer Networks (OSI Layers)", decayPercent: 12, lastPracticedDaysAgo: 9, action: "Quick Quiz" }
            ],
            learningMetrics: {
                totalEvents: 142,
                streakDays: 5,
                estimatedGrowth: "+14%"
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- YOUTUBE COURSE SEARCH & RESOURCE INTELLIGENCE ---
app.get('/api/youtube/search', async (req, res) => {
    try {
        const { courseName, topicTitle, level } = req.query;
        const videos = await searchYouTubeCourseVideos({ courseName, topicTitle, level });
        res.json({ success: true, videos });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- VIDEO WATCH PROGRESS ENGINE ---
app.post('/api/videos/progress', async (req, res) => {
    try {
        const { userId, courseId, topicId, videoId, videoTitle, watchProgress, durationSeconds } = req.body;
        const record = await updateVideoProgress({ userId, courseId, topicId, videoId, videoTitle, watchProgress, durationSeconds });
        res.json({ success: true, record });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/videos/progress', async (req, res) => {
    try {
        const { userId, courseId } = req.query;
        const progressList = await getCourseProgress(userId, courseId);
        res.json({ success: true, progress: progressList });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- COURSE COMPLETION ENGINE ---
app.post('/api/courses/completion', async (req, res) => {
    try {
        const { userId, courseId, totalTopics } = req.body;
        const completionStatus = await checkCourseCompletion(userId, courseId, totalTopics);
        res.json({ success: true, ...completionStatus });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- AUTOMATIC CERTIFICATE GENERATION & VERIFICATION ---
app.post('/api/certificates/generate', async (req, res) => {
    try {
        const { userId, userName, courseId, courseName } = req.body;
        const certificate = await generateCertificateForUser({ userId, userName, courseId, courseName });
        res.json({ success: true, certificate });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/certificates', async (req, res) => {
    try {
        const { userId } = req.query;
        const certificates = await getUserCertificates(userId);
        res.json({ success: true, certificates });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/certificates/:certificateId', async (req, res) => {
    try {
        const { certificateId } = req.params;
        const certificate = await getCertificateById(certificateId);
        if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
        res.json({ success: true, certificate });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/certificates/verify/:certificateId', async (req, res) => {
    try {
        const { certificateId } = req.params;
        const certificate = await getCertificateById(certificateId);
        if (!certificate) {
            return res.status(404).json({ valid: false, error: 'Certificate ID not found' });
        }
        res.json({ valid: true, certificate });
    } catch (err) {
        res.status(500).json({ valid: false, error: err.message });
    }
});

app.listen(PORT, () => console.log(`🚀 SkillBridgeAI Backend running on port ${PORT}`));


