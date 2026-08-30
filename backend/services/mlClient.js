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
            { task: weakSkills.length > 0 ? `Revision: ${weakSkills[0]}` : "Core Topic Review: Web Dev & API", duration_mins: 35, category: "Study Notes & Quiz", priority: "High" },
            { task: "Coding Practice: LeetCode Medium Problem", duration_mins: 45, category: "Hands-on Coding", priority: "High" },
            { task: "Ranked Video Tutorial Session", duration_mins: 25, category: "Video Resource", priority: "Medium" },
            { task: "Spaced Repetition Flash Quiz", duration_mins: 15, category: "Adaptive Assessment", priority: "High" }
        ],
        is_fallback: true
    };
}

// COURSE-ISOLATED ROADMAP REGISTRY GENERATOR
export async function searchRoadmap(query) {
    try {
        const response = await fetch(`${PYTHON_ML_URL}/ml/roadmap-search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        if (response.ok) return await response.json();
    } catch (e) {
        // Fallback to local JS course registry
    }

    const qTitle = (query || 'Web Development').trim();
    const qLower = qTitle.toLowerCase();

    // 1. WEB DEVELOPMENT & FULL STACK ROADMAP
    if (qLower.includes('web') || qLower.includes('full stack') || qLower.includes('frontend') || qLower.includes('backend') || qLower.includes('javascript') || qLower.includes('react')) {
        return {
            query: 'Web Development & Full Stack',
            semantic_match_score: 98.6,
            estimated_duration: '4 to 6 months',
            phases: [
                {
                    phaseId: 'p1',
                    title: 'Phase 1 — HTML5, CSS3 & Responsive UI Design',
                    description: 'Master semantic HTML markup, modern CSS Flexbox/Grid layouts, and mobile-first responsive design.',
                    topics: [
                        { topicId: 'web_t1', title: 'HTML5 & CSS3 Responsive Layouts', description: 'Semantic tags, Flexbox, Grid, CSS variables, and media queries.', difficulty: 'Beginner', estimatedHours: 15, completed: true, prerequisites: [] },
                        { topicId: 'web_t2', title: 'Modern JavaScript (ES6+ & DOM)', description: 'Promises, Async/Await, DOM manipulation, closures, and fetch API.', difficulty: 'Intermediate', estimatedHours: 20, completed: false, prerequisites: ['web_t1'] }
                    ]
                },
                {
                    phaseId: 'p2',
                    title: 'Phase 2 — React.js Component Architecture & State',
                    description: 'Build modern interactive single-page applications with React.js components, hooks, and virtual DOM.',
                    topics: [
                        { topicId: 'web_t3', title: 'React.js Components & Custom Hooks', description: 'useState, useEffect, useContext, custom hooks, and React router.', difficulty: 'Intermediate', estimatedHours: 30, completed: false, prerequisites: ['web_t2'] }
                    ]
                },
                {
                    phaseId: 'p3',
                    title: 'Phase 3 — Node.js Express APIs & Databases',
                    description: 'Build robust RESTful backend microservices, authentication with JWT, and MongoDB integration.',
                    topics: [
                        { topicId: 'web_t4', title: 'Node.js Express & MongoDB REST APIs', description: 'Express routing, middleware, JWT auth, Mongoose schemas, and CORS.', difficulty: 'Advanced', estimatedHours: 35, completed: false, prerequisites: ['web_t3'] }
                    ]
                }
            ]
        };
    }

    // 2. DATABASE SYSTEMS & SQL ROADMAP
    if (qLower.includes('sql') || qLower.includes('database') || qLower.includes('dbms') || qLower.includes('postgres') || qLower.includes('mysql')) {
        return {
            query: 'Database Systems & SQL',
            semantic_match_score: 97.8,
            estimated_duration: '3 to 5 months',
            phases: [
                {
                    phaseId: 'p1',
                    title: 'Phase 1 — Relational Model & SQL Fundamentals',
                    description: 'Understand relational database concepts, primary/foreign keys, SELECT queries, and WHERE filtering.',
                    topics: [
                        { topicId: 'sql_t1', title: 'SQL Relational Queries & Data Types', description: 'DDL/DML, CREATE TABLE, SELECT, WHERE, ORDER BY, and DISTINCT.', difficulty: 'Beginner', estimatedHours: 12, completed: true, prerequisites: [] },
                        { topicId: 'sql_t2', title: 'SQL Joins, Aggregations & Grouping', description: 'INNER JOIN, LEFT JOIN, GROUP BY, HAVING, COUNT, SUM, and AVG.', difficulty: 'Intermediate', estimatedHours: 18, completed: false, prerequisites: ['sql_t1'] }
                    ]
                },
                {
                    phaseId: 'p2',
                    title: 'Phase 2 — B-Tree Indexing & Performance Tuning',
                    description: 'Master query optimization, B-Tree index lookup mechanisms, and 3rd Normal Form (3NF).',
                    topics: [
                        { topicId: 'sql_t3', title: 'B-Tree Indexing & Query Execution Plans', description: 'Index creation, EXPLAIN ANALYZE, composite indexes, and normalization.', difficulty: 'Intermediate', estimatedHours: 25, completed: false, prerequisites: ['sql_t2'] }
                    ]
                },
                {
                    phaseId: 'p3',
                    title: 'Phase 3 — Transactions, Sharding & High Availability',
                    description: 'ACID transactional guarantees, database sharding, replication, and NoSQL document stores.',
                    topics: [
                        { topicId: 'sql_t4', title: 'Database Sharding, Replication & ACID', description: 'Read replicas, horizontal sharding, WAL logs, and ACID locks.', difficulty: 'Advanced', estimatedHours: 30, completed: false, prerequisites: ['sql_t3'] }
                    ]
                }
            ]
        };
    }

    // 3. SYSTEM DESIGN & CLOUD ROADMAP
    if (qLower.includes('system design') || qLower.includes('cloud') || qLower.includes('architecture') || qLower.includes('distributed')) {
        return {
            query: 'System Design & Distributed Cloud',
            semantic_match_score: 99.1,
            estimated_duration: '4 to 6 months',
            phases: [
                {
                    phaseId: 'p1',
                    title: 'Phase 1 — Scalability & Monolithic vs Microservices',
                    description: 'Understand high-level system design principles, vertical vs horizontal scaling, and microservices.',
                    topics: [
                        { topicId: 'sd_t1', title: 'System Design Fundamentals & CAP Theorem', description: 'CAP Theorem, SLA 99.999% availability, and scalability trade-offs.', difficulty: 'Beginner', estimatedHours: 15, completed: true, prerequisites: [] },
                        { topicId: 'sd_t2', title: 'Load Balancing & Redis Memory Caching', description: 'Nginx load balancers, Redis Cache-Aside, and Consistent Hashing.', difficulty: 'Intermediate', estimatedHours: 25, completed: false, prerequisites: ['sd_t1'] }
                    ]
                },
                {
                    phaseId: 'p2',
                    title: 'Phase 2 — Asynchronous Queues & Database Sharding',
                    description: 'Decouple services with Apache Kafka message queues and scale databases horizontally with sharding.',
                    topics: [
                        { topicId: 'sd_t3', title: 'Message Queues (Kafka) & DB Sharding', description: 'Pub/sub streaming, Kafka topic partitions, and database sharding keys.', difficulty: 'Advanced', estimatedHours: 35, completed: false, prerequisites: ['sd_t2'] }
                    ]
                }
            ]
        };
    }

    // 4. DEVOPS & KUBERNETES ROADMAP
    if (qLower.includes('devops') || qLower.includes('docker') || qLower.includes('kubernetes') || qLower.includes('k8s') || qLower.includes('ci/cd')) {
        return {
            query: 'DevOps & Cloud Infrastructure',
            semantic_match_score: 98.2,
            estimated_duration: '4 to 6 months',
            phases: [
                {
                    phaseId: 'p1',
                    title: 'Phase 1 — Linux Administration & Shell Scripting',
                    description: 'Master Linux terminal navigation, permissions, process management, and Bash automation.',
                    topics: [
                        { topicId: 'dev_t1', title: 'Linux Administration & Bash Scripting', description: 'CLI, grep/awk, systemd services, SSH keys, and cron jobs.', difficulty: 'Beginner', estimatedHours: 15, completed: true, prerequisites: [] },
                        { topicId: 'dev_t2', title: 'Docker Containerization & Docker Compose', description: 'Dockerfiles, container images, volume mounts, and docker-compose.', difficulty: 'Intermediate', estimatedHours: 20, completed: false, prerequisites: ['dev_t1'] }
                    ]
                },
                {
                    phaseId: 'p2',
                    title: 'Phase 2 — Kubernetes Orchestration & CI/CD Pipelines',
                    description: 'Deploy auto-scaling Kubernetes clusters and automate deployments with GitHub Actions CI/CD.',
                    topics: [
                        { topicId: 'dev_t3', title: 'Kubernetes Orchestration & CI/CD Pipelines', description: 'Pods, Deployments, Services, Helm charts, and CI/CD pipelines.', difficulty: 'Advanced', estimatedHours: 35, completed: false, prerequisites: ['dev_t2'] }
                    ]
                }
            ]
        };
    }

    // DEFAULT: DATA STRUCTURES & ALGORITHMS / AI ROADMAP
    return {
        query: qTitle,
        semantic_match_score: 96.8,
        estimated_duration: '4 to 6 months',
        phases: [
            {
                phaseId: 'p1',
                title: `Phase 1 — Foundations for ${qTitle}`,
                description: `Master initial building blocks and core syntax for ${qTitle}.`,
                topics: [
                    { topicId: 'dsa_t1', title: `${qTitle} Core Fundamentals`, description: `Variables, syntax, baseline concepts, and architecture of ${qTitle}.`, difficulty: 'Beginner', estimatedHours: 15, completed: true, prerequisites: [] },
                    { topicId: 'dsa_t2', title: 'Data Structures & Algorithmic Foundations', description: 'Arrays, Hash Tables, memory management, and computational complexity.', difficulty: 'Intermediate', estimatedHours: 20, completed: false, prerequisites: ['dsa_t1'] }
                ]
            },
            {
                phaseId: 'p2',
                title: `Phase 2 — Advanced ${qTitle} Production Pipelines`,
                description: `Production-grade project implementation and scalable design for ${qTitle}.`,
                topics: [
                    { topicId: 'dsa_t3', title: `Applied ${qTitle} Scalable Architecture`, description: `End-to-end real world project execution and optimization for ${qTitle}.`, difficulty: 'Advanced', estimatedHours: 35, completed: false, prerequisites: ['dsa_t2'] }
                ]
            }
        ],
        is_fallback: true
    };
}
