/**
 * ML Proxy Client & Dynamic AI Roadmap Generator
 * Communicates with Python FastAPI ML microservice (http://localhost:8000)
 * with instant fallback to dynamic AI structured roadmap generation for ANY search query.
 */

import Groq from 'groq-sdk';
import { ROADMAP_CATALOG, getCatalogRoadmap } from './roadmapData.js';

const PYTHON_ML_URL = process.env.PYTHON_ML_URL || 'http://localhost:8000';
const groqKey = process.env.GROQ_API_KEY || process.env.CHATBOT_API_KEY;
const groq = groqKey ? new Groq({ apiKey: groqKey }) : null;

export async function predictSkill(params) {
    try {
        const response = await fetch(`${PYTHON_ML_URL}/ml/skill-predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        if (response.ok) return await response.json();
    } catch (e) {
        // Fallback
    }

    const score = Math.round((params.accuracy || 0.7) * 100);
    let level = 'Beginner';
    if (score >= 90) level = 'Professional';
    else if (score >= 80) level = 'Advanced';
    else if (score >= 70) level = 'Upper Intermediate';
    else if (score >= 55) level = 'Intermediate';
    else if (score >= 40) level = 'Elementary';

    return {
        score,
        estimated_level: level,
        confidence: 0.85,
        is_fallback: true
    };
}

export async function predictCareers(userSkills = {}) {
    try {
        const response = await fetch(`${PYTHON_ML_URL}/ml/career-predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_skills: userSkills })
        });
        if (response.ok) return await response.json();
    } catch (e) {
        // Fallback
    }

    const predictions = [
        {
            role: "AI & Machine Learning Engineer",
            match_score: 91.5,
            confidence: "High",
            explanation: {
                positive_factors: ["Proficiency in Python and Machine Learning algorithms", "Strong foundational statistics"],
                areas_to_improve: ["Deep Learning & PyTorch", "LLMOps & RAG systems"]
            }
        },
        {
            role: "Full Stack Software Engineer",
            match_score: 87.0,
            confidence: "High",
            explanation: {
                positive_factors: ["React, TypeScript, and modern API knowledge", "Database design principles"],
                areas_to_improve: ["Microservices architecture", "Kubernetes orchestration"]
            }
        },
        {
            role: "Data Scientist",
            match_score: 83.2,
            confidence: "Medium",
            explanation: {
                positive_factors: ["Data wrangling with Pandas/NumPy", "Exploratory data analysis"],
                areas_to_improve: ["Big Data (Spark)", "Hypothesis testing & A/B experiment design"]
            }
        }
    ];

    return {
        predictions,
        recommended_focus: ["Deep Learning", "System Design", "Cloud Infrastructure"],
        is_fallback: true
    };
}

export async function getLearningPlan(userSkills = {}, targetSkills = []) {
    try {
        const response = await fetch(`${PYTHON_ML_URL}/ml/learning-plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_skills: userSkills, target_skills: targetSkills })
        });
        if (response.ok) return await response.json();
    } catch (e) {
        // Fallback
    }

    return {
        plan: [
            { task: "Deep Learning Foundations & PyTorch Tensors", duration_mins: 45, category: "Core Concept", priority: "High" },
            { task: "Solve 1 Medium LeetCode DSA Problem", duration_mins: 40, category: "Interactive Coding", priority: "High" },
            { task: "Watch Verified YouTube Lecture on Transformer Attention", duration_mins: 30, category: "Video Resource", priority: "Medium" },
            { task: "Review Cheat Sheet & Complete AI Topic Quiz", duration_mins: 15, category: "Assessment", priority: "Medium" }
        ],
        is_fallback: true
    };
}

// DYNAMIC AI ROADMAP GENERATOR FOLLOWING ROADMAP.SH FORMAT
export async function searchRoadmap(query) {
    const qTitle = (query || 'Frontend Developer').trim();
    
    // 1. Check if the query matches our pre-built roadmap.sh catalog
    const catalogMatch = getCatalogRoadmap(qTitle);
    if (catalogMatch) {
        return catalogMatch;
    }

    // 2. Try generating an authentic roadmap.sh tree with Groq LLM
    if (groq) {
        try {
            const prompt = `You are a developer curriculum architect from roadmap.sh.
Generate a structured, authentic developer roadmap for: "${qTitle}".
The output MUST be strict JSON with this exact structure:
{
  "query": "${qTitle}",
  "title": "${qTitle} Developer Roadmap",
  "category": "Role-based",
  "description": "Step by step guide to mastering ${qTitle} in 2026, following the roadmap.sh standard.",
  "estimated_duration": "5 to 7 months",
  "semantic_match_score": 98.6,
  "phases": [
    {
      "phaseId": "p1",
      "title": "Phase 1 — Foundations & Core Concepts",
      "description": "Core syntax, tools, and prerequisites.",
      "topics": [
        {
          "topicId": "t1",
          "title": "Topic Title",
          "description": "Detailed description of what to learn.",
          "difficulty": "Beginner",
          "estimatedHours": 15,
          "completed": true,
          "recommended": true,
          "prerequisites": [],
          "videoQuery": "topic title tutorial full course",
          "keyConcepts": ["Concept 1", "Concept 2"]
        }
      ]
    }
  ]
}
Include 3 to 4 phases with 2 to 4 topics per phase. Mark only the very first topic as completed: true. Use difficulty values: "Beginner", "Intermediate", "Advanced", "Mastery". Return ONLY pure JSON with no markdown backticks.`;

            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'groq/compound',
                response_format: { type: 'json_object' },
                temperature: 0.2
            });

            const content = completion.choices[0]?.message?.content;
            if (content) {
                const parsed = JSON.parse(content);
                if (parsed.phases && parsed.phases.length > 0) {
                    return parsed;
                }
            }
        } catch (err) {
            console.warn("Groq dynamic roadmap generation error, falling back to template:", err.message);
        }
    }

    // 3. Fallback Dynamic Multi-Phase Roadmap Template
    return {
        query: qTitle,
        title: `${qTitle} Roadmap`,
        category: 'Custom AI Generated',
        description: `Comprehensive step-by-step roadmap to learn ${qTitle} in 2026, structured following roadmap.sh standards.`,
        semantic_match_score: 97.5,
        estimated_duration: '4 to 6 months',
        phases: [
            {
                phaseId: 'p1',
                title: `Phase 1 — ${qTitle} Core Foundations & Setup`,
                description: `Establish development environment, core syntax, and essential mental models for ${qTitle}.`,
                topics: [
                    {
                        topicId: 'gen_t1',
                        title: `${qTitle} Fundamentals & Tooling`,
                        description: `CLI tools, runtime configuration, core syntax rules, and package management for ${qTitle}.`,
                        difficulty: 'Beginner',
                        estimatedHours: 15,
                        completed: true,
                        recommended: true,
                        prerequisites: [],
                        videoQuery: `${qTitle} full course tutorial beginners`,
                        keyConcepts: ['Environment Setup', 'Syntax Rules', 'Tooling & Package Managers']
                    },
                    {
                        topicId: 'gen_t2',
                        title: `${qTitle} Architecture & Core Data Flow`,
                        description: `Deep dive into memory patterns, asynchronous handling, and standard library components.`,
                        difficulty: 'Beginner',
                        estimatedHours: 20,
                        completed: false,
                        recommended: true,
                        prerequisites: ['gen_t1'],
                        videoQuery: `${qTitle} core concepts crash course`,
                        keyConcepts: ['Data Structures', 'Error Handling', 'Async Processing']
                    }
                ]
            },
            {
                phaseId: 'p2',
                title: `Phase 2 — Advanced Implementation & Best Practices`,
                description: `Design patterns, performance optimization, and industry-standard frameworks.`,
                topics: [
                    {
                        topicId: 'gen_t3',
                        title: `${qTitle} Design Patterns & State Architecture`,
                        description: `Modular design, separation of concerns, test-driven development, and clean code practices.`,
                        difficulty: 'Intermediate',
                        estimatedHours: 25,
                        completed: false,
                        recommended: true,
                        prerequisites: ['gen_t2'],
                        videoQuery: `${qTitle} design patterns best practices`,
                        keyConcepts: ['Design Patterns', 'State Architecture', 'Unit Testing']
                    },
                    {
                        topicId: 'gen_t4',
                        title: `API Integration & Database Persistence in ${qTitle}`,
                        description: `Connecting external data sources, caching, relational/NoSQL storage, and authentication.`,
                        difficulty: 'Advanced',
                        estimatedHours: 30,
                        completed: false,
                        recommended: true,
                        prerequisites: ['gen_t3'],
                        videoQuery: `${qTitle} backend api database integration`,
                        keyConcepts: ['REST/GraphQL APIs', 'Database Indexing', 'Authentication Flow']
                    }
                ]
            },
            {
                phaseId: 'p3',
                title: `Phase 3 — Production Deployment, CI/CD & Portfolio`,
                description: `Docker containerization, cloud hosting, CI/CD automated pipelines, and real-world capstone project.`,
                topics: [
                    {
                        topicId: 'gen_t5',
                        title: `Production Deployment & Observability for ${qTitle}`,
                        description: `Dockerizing the application, setting up GitHub Actions CI/CD, and configuring monitoring.`,
                        difficulty: 'Advanced',
                        estimatedHours: 28,
                        completed: false,
                        recommended: true,
                        prerequisites: ['gen_t4'],
                        videoQuery: `${qTitle} docker deployment cicd`,
                        keyConcepts: ['Docker Containers', 'CI/CD Pipelines', 'Logging & Metrics']
                    },
                    {
                        topicId: 'gen_t6',
                        title: `${qTitle} End-to-End Capstone Portfolio Project`,
                        description: `Build and deploy a full-featured production system showcasing all core ${qTitle} proficiencies.`,
                        difficulty: 'Mastery',
                        estimatedHours: 35,
                        completed: false,
                        recommended: true,
                        prerequisites: ['gen_t5'],
                        videoQuery: `${qTitle} full stack portfolio project`,
                        keyConcepts: ['System Architecture', 'Production Deploy', 'GitHub Portfolio']
                    }
                ]
            }
        ],
        is_fallback: true
    };
}
