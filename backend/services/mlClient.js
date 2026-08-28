/**
 * ML Proxy Client & Fallback Engine
 * Communicates with Python FastAPI ML microservice (http://localhost:8000)
 * with instant fallback to deterministic rule-based ML when offline.
 */

const PYTHON_ML_URL = process.env.PYTHON_ML_URL || 'http://localhost:8000';

export async function predictSkill(params) {
    try {
        const response = await fetch(`${PYTHON_ML_URL}/ml/skill-predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        if (response.ok) return await response.json();
    } catch (e) {
        // Fallback to local JS logic
    }

    // Local JS Fallback Algorithm
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
        // Fallback to local JS logic
    }

    // Local JS Fallback
    const predictions = [
        {
            role: "AI Engineer",
            match_score: Math.min(96, Math.max(30, ((userSkills["Python"] || 75) * 0.4 + (userSkills["Machine Learning"] || 65) * 0.4 + (userSkills["DSA"] || 60) * 0.2))),
            confidence: "High",
            explanation: {
                positive_factors: ["Strong Python", "Good Machine Learning foundations"],
                areas_to_improve: ["Requires Deep Learning", "Requires MLOps"]
            }
        },
        {
            role: "ML Engineer",
            match_score: Math.min(94, Math.max(25, ((userSkills["Python"] || 75) * 0.4 + (userSkills["Machine Learning"] || 65) * 0.3 + (userSkills["Statistics"] || 50) * 0.3))),
            confidence: "High",
            explanation: {
                positive_factors: ["Strong Python", "Machine Learning concepts"],
                areas_to_improve: ["Requires Advanced Statistics"]
            }
        },
        {
            role: "Data Scientist",
            match_score: Math.min(90, Math.max(20, ((userSkills["Python"] || 75) * 0.3 + (userSkills["Statistics"] || 50) * 0.4 + (userSkills["SQL"] || 70) * 0.3))),
            confidence: "Medium",
            explanation: {
                positive_factors: ["Strong Python", "SQL proficiency"],
                areas_to_improve: ["Requires Deep Learning"]
            }
        }
    ];

    return { predictions, is_fallback: true };
}

export async function getLearningPlan(userSkills = {}, weakSkills = []) {
    try {
        const response = await fetch(`${PYTHON_ML_URL}/ml/learning-plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_skills: userSkills, weak_skills: weakSkills, time_available_mins: 120 })
        });
        if (response.ok) return await response.json();
    } catch (e) {
        // Fallback
    }

    return {
        total_duration_mins: 120,
        plan: [
            { task: weakSkills.length > 0 ? `Revision: ${weakSkills[0]}` : "Core Topic Review: Python OOP", duration_mins: 35, category: "Study Notes & Quiz", priority: "High" },
            { task: "Coding Practice: LeetCode Medium Problem", duration_mins: 45, category: "Hands-on Coding", priority: "High" },
            { task: "Ranked Video Tutorial Session", duration_mins: 25, category: "Video Resource", priority: "Medium" },
            { task: "Spaced Repetition Flash Quiz", duration_mins: 15, category: "Adaptive Assessment", priority: "High" }
        ],
        is_fallback: true
    };
}
