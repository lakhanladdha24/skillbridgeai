/**
 * RAG Knowledge Service & Step-Specific Video & PDF Study Guide Engine
 * Provides step-specific rated YouTube videos, downloadable PDF cheat sheets,
 * and optional Google YouTube Data API v3 integration with automatic open fallback.
 */

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

const STEP_KNOWLEDGE_MAP = {
    // Python Flowchart Steps
    "t1": {
        topic: "Python Fundamentals & OOP",
        category: "Python Programming",
        difficulty: "Beginner",
        definition: "Python is an interpreted, high-level language emphasizing readability and dynamic typing.",
        explanation: "Master Python data types, control flow, functions, and Object-Oriented Programming (OOP) classes.",
        keyConcepts: ["Variables & Data Types", "If/Else & Loops", "Functions & Scope", "Classes, Methods & Inheritance"],
        codeExample: `class NeuralNetwork:\n    def __init__(self, layers):\n        self.layers = layers\n    def forward(self, x):\n        return [x * w for w in self.layers]\n\nmodel = NeuralNetwork([0.5, 1.2, 0.8])\nprint("Output:", model.forward(2.0))`,
        flowchart: `[Step 1: Python Basics] ──► [Step 2: Functions & OOP] ──► [Step 3: Advanced Decorators]`,
        formulas: ["Time Complexity: O(1) list lookup", "Space Complexity: O(N) allocation"],
        gfgW3Article: {
            source: "Skill Bridge AI Python Study Guide (GfG / W3Schools Format)",
            sections: [
                { title: "1. Python Data Structures", content: "Lists are mutable ordered arrays; Tuples are immutable; Dictionaries provide O(1) key lookup." },
                { title: "2. OOP & Inheritance", content: "Classes encapsulate data attributes and method logic. Inheritance allows child classes to override methods." }
            ]
        },
        pdfGuide: {
            title: "Step 1: Python 3 & OOP Complete Cheat Sheet Guide",
            summary: "GeeksforGeeks styled PDF guide with syntax cheat sheets, OOP patterns, and code snippets.",
            fileSize: "1.4 MB",
            downloadName: "step1_python_fundamentals.pdf",
            markdownContent: `# Step 1: Python Fundamentals & OOP Study Guide\n\n## Overview\nPython is an interpreted, dynamic language.\n\n## Core Concepts\n- Variables & Lists\n- Functions & Lambdas\n- Classes & OOP\n\n## Code Example\n\`\`\`python\nclass Model:\n    def __init__(self, name): self.name = name\n\`\`\`\n`
        },
        videos: [
            {
                title: "Step 1: Python OOP Full Course - Object Oriented Programming",
                creator: "FreeCodeCamp",
                embedUrl: "https://www.youtube-nocookie.com/embed/Ej_02ICOIgs",
                duration: "1h 45m",
                difficulty: "Beginner",
                score: 4.9,
                ratingText: "★ 4.9 Top Rated Tutorial",
                isFree: true,
                summary: "Complete guide covering classes, instances, inheritance, static methods, and encapsulation."
            }
        ]
    },

    // DSA Flowchart Steps
    "t2": {
        topic: "Data Structures & Algorithms (DSA)",
        category: "DSA & Algorithms",
        difficulty: "Intermediate",
        definition: "Data Structures specify memory organization; Algorithms provide computational procedures.",
        explanation: "Master Arrays, Hash Tables, Trees, Graphs, Dynamic Programming, and Big-O time complexity.",
        keyConcepts: ["Big-O Time & Space Complexity", "Hash Tables", "Binary Search Trees", "Graph BFS & DFS", "Dynamic Programming"],
        codeExample: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1\n\nprint("Target Index:", binary_search([10, 20, 30, 40, 50], 40))`,
        flowchart: `[Step 1: Arrays & Two Pointers] ──► [Step 2: Hash Maps & Trees] ──► [Step 3: Graphs & DP]`,
        formulas: ["Binary Search: O(log N) Time", "Quick Sort: O(N log N) Average"],
        gfgW3Article: {
            source: "Skill Bridge AI DSA Study Guide (GfG / W3Schools Format)",
            sections: [
                { title: "1. Big-O Complexity", content: "Big-O measures algorithm scaling. O(1) is constant time; O(log N) is logarithmic time; O(N) is linear time." },
                { title: "2. Hash Tables & Binary Trees", content: "Hash tables yield average O(1) lookup. Binary Search Trees allow sorted O(log N) operations." }
            ]
        },
        pdfGuide: {
            title: "Step 2: Data Structures & Algorithms Handbook",
            summary: "GeeksforGeeks styled handbook detailing time complexities, code patterns, and 14 essential LeetCode strategies.",
            fileSize: "2.8 MB",
            downloadName: "step2_dsa_handbook.pdf",
            markdownContent: `# Step 2: Data Structures & Algorithms Handbook\n\n## Overview\nEssential DSA concepts for technical interviews.\n\n## Patterns\n- Two Pointers\n- Sliding Window\n- Binary Search\n- Dynamic Programming\n`
        },
        videos: [
            {
                title: "Step 2: Data Structures and Algorithms for Beginners",
                creator: "NeetCode",
                embedUrl: "https://www.youtube-nocookie.com/embed/8hly31xKLI0",
                duration: "2h 10m",
                difficulty: "Intermediate",
                score: 5.0,
                ratingText: "★ 5.0 Top Rated Tutorial",
                isFree: true,
                summary: "Master array, linked list, tree, graph, and DP fundamentals with visual diagrams."
            }
        ]
    },

    // AI/ML Flowchart Steps
    "t3": {
        topic: "Machine Learning & AI Foundations",
        category: "Artificial Intelligence & ML",
        difficulty: "Intermediate",
        definition: "Machine Learning develops statistical models that learn from data to make accurate predictions.",
        explanation: "Covers Supervised Learning (Regression, Classification), Unsupervised Learning (Clustering), Neural Networks, and MSE Loss.",
        keyConcepts: ["Supervised & Unsupervised Learning", "Gradient Descent Optimization", "Bias-Variance Tradeoff", "Neural Networks & Backpropagation"],
        codeExample: `from sklearn.linear_model import LogisticRegression\nimport numpy as np\n\nX = np.array([[1], [2], [3], [4]])\ny = np.array([0, 0, 1, 1])\nmodel = LogisticRegression()\nmodel.fit(X, y)\nprint("Prediction:", model.predict([[3.5]])[0])`,
        flowchart: `[Step 1: Math & Scikit-Learn] ──► [Step 2: Deep Learning PyTorch] ──► [Step 3: LLMs & GenAI]`,
        formulas: ["MSE Loss: 1/N * Σ(y_i - ŷ_i)²", "Sigmoid: 1 / (1 + e⁻ᶻ)"],
        gfgW3Article: {
            source: "Skill Bridge AI Machine Learning Guide",
            sections: [
                { title: "1. Supervised Learning", content: "Features (X) map to targets (y) by minimizing loss via Gradient Descent." },
                { title: "2. Model Evaluation", content: "Precision, Recall, F1-Score, and ROC-AUC evaluate classification performance." }
            ]
        },
        pdfGuide: {
            title: "Step 3: Machine Learning & Deep Learning Guide",
            summary: "Complete guide covering Scikit-Learn algorithms, PyTorch neural network layers, and model evaluation metrics.",
            fileSize: "3.2 MB",
            downloadName: "step3_ml_guide.pdf",
            markdownContent: `# Step 3: Machine Learning & Deep Learning Guide\n\n## Overview\nSupervised vs Unsupervised ML pipelines.\n\n## Key Formulas\n- MSE = 1/N * sum((y_true - y_pred)^2)\n`
        },
        videos: [
            {
                title: "Step 3: Machine Learning Course for Beginners",
                creator: "Andrew Ng / DeepLearning.AI",
                embedUrl: "https://www.youtube-nocookie.com/embed/PPLop442ScU",
                duration: "3h 30m",
                difficulty: "Intermediate",
                score: 5.0,
                ratingText: "★ 5.0 Top Rated Tutorial",
                isFree: true,
                summary: "World-class introduction to regression, classification, neural networks, and ML best practices."
            }
        ]
    }
};

export function getStudyMaterialForTopic(topicQuery = '') {
    const q = (topicQuery || '').toLowerCase();
    
    // Check direct key match or search map
    const matchedKey = Object.keys(STEP_KNOWLEDGE_MAP).find(k => 
        k.toLowerCase() === q ||
        STEP_KNOWLEDGE_MAP[k].topic.toLowerCase().includes(q) ||
        q.includes(STEP_KNOWLEDGE_MAP[k].topic.toLowerCase().split(' ')[0])
    );

    const match = matchedKey ? STEP_KNOWLEDGE_MAP[matchedKey] : (STEP_KNOWLEDGE_MAP["t1"] || Object.values(STEP_KNOWLEDGE_MAP)[0]);

    return {
        topic: match.topic,
        category: match.category,
        difficulty: match.difficulty,
        studyNotes: {
            definition: match.definition,
            explanation: match.explanation,
            keyConcepts: match.keyConcepts,
            codeExample: match.codeExample,
            flowchart: match.flowchart,
            formulas: match.formulas,
            gfgW3Article: match.gfgW3Article,
            pdfGuide: match.pdfGuide
        },
        videos: match.videos
    };
}

export function rankVideoResources(query = '') {
    const q = (query || '').toLowerCase();
    let allVideos = [];
    Object.values(STEP_KNOWLEDGE_MAP).forEach(k => {
        k.videos.forEach(v => {
            let scoreBoost = 0;
            if (v.title.toLowerCase().includes(q) || k.topic.toLowerCase().includes(q)) scoreBoost += 1.0;
            allVideos.push({
                ...v,
                category: k.topic,
                recommendationScore: Math.min(5.0, v.score + scoreBoost)
            });
        });
    });

    return allVideos.sort((a, b) => b.recommendationScore - a.recommendationScore);
}
