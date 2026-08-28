/**
 * RAG Knowledge Service & Video Ranking Engine
 * Provides structured educational study notes, visual flowcharts/ASCII diagrams,
 * code examples, practice questions, and YouTube video recommendations with ranking scores.
 */

const KNOWLEDGE_BASE = [
    {
        topic: "Python Fundamentals & OOP",
        category: "Programming",
        definition: "Python is a high-level, interpreted programming language emphasizing readability and dynamic typing. OOP allows structuring software around data objects.",
        explanation: "Python provides built-in data structures like lists, dictionaries, tuples, and sets. Object-Oriented Programming (OOP) uses classes to encapsulate data (attributes) and behavior (methods), enabling Inheritance, Polymorphism, Encapsulation, and Abstraction.",
        keyConcepts: ["Mutable vs Immutable Types", "Classes & Dunder Methods", "List Comprehensions", "Decorators & Generators", "Memory Management & Garbage Collection"],
        codeExample: `class NeuralNetwork:\n    def __init__(self, layers):\n        self.layers = layers\n\n    def forward(self, x):\n        return [x * 0.5 for x in self.layers]\n\nmodel = NeuralNetwork([1, 2, 3])\nprint(model.forward(2))`,
        flowchart: `[User Request]\n      │\n      ▼\n[Python Script Interpreter]\n      │\n      ▼\n[Bytecode Compilation .pyc]\n      │\n      ▼\n[Python Virtual Machine PVM]`,
        formulas: ["Time Complexity: O(1) list lookup by index", "Space Complexity: O(N) list storage"],
        videos: [
            {
                title: "Python OOP Full Course - Object Oriented Programming in Python",
                creator: "FreeCodeCamp",
                url: "https://www.youtube.com/watch?v=Ej_02ICOIgs",
                duration: "1h 45m",
                difficulty: "Beginner to Intermediate",
                score: 4.9,
                isFree: true,
                summary: "Complete guide covering classes, instances, inheritance, static methods, and encapsulation."
            },
            {
                title: "Python Advanced Tutorial - Decorators, Generators & Metaclasses",
                creator: "Corey Schafer",
                url: "https://www.youtube.com/watch?v=r7t7gebC1Xk",
                duration: "42m",
                difficulty: "Advanced",
                score: 4.8,
                isFree: true,
                summary: "In-depth walkthrough on Python internal mechanics and clean production practices."
            }
        ]
    },
    {
        topic: "Data Structures & Algorithms (DSA)",
        category: "Computer Science",
        definition: "Data Structures specify efficient memory organization, while Algorithms provide step-by-step procedures to solve computational problems.",
        explanation: "Understanding Array manipulation, Hash Tables, Trees, Graphs, Dynamic Programming, and Sorting algorithms forms the bedrock of computer science problem solving.",
        keyConcepts: ["Big-O Time & Space Complexity", "Hash Table Collision Resolution", "Binary Search Trees & Heap", "Breadth-First Search (BFS) vs Depth-First Search (DFS)", "Dynamic Programming (Memoization vs Tabulation)"],
        codeExample: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1`,
        flowchart: `[Array Input]\n      │\n      ▼\n[Pointers: Low=0, High=N-1]\n      │\n      ▼\n[Compute Mid Point]\n ┌────┴────┐\nTarget?   Compare\n ▼         ▼\nFound    Adjust Pointer`,
        formulas: ["Binary Search Time: O(log N)", "Quick Sort Average: O(N log N)"],
        videos: [
            {
                title: "Data Structures and Algorithms for Beginners",
                creator: "NeetCode",
                url: "https://www.youtube.com/watch?v=8hly31xKLI0",
                duration: "2h 10m",
                difficulty: "Beginner",
                score: 5.0,
                isFree: true,
                summary: "Master array, linked list, tree, graph, and DP fundamentals with visual diagrams."
            }
        ]
    },
    {
        topic: "Machine Learning & AI Foundations",
        category: "AI / Data",
        definition: "Machine Learning focuses on algorithms that learn from data to make predictions or decisions without explicit rule programming.",
        explanation: "Covers Supervised Learning (Regression, Classification), Unsupervised Learning (Clustering, Dimensionality Reduction), Model Evaluation (MSE, F1-score, ROC-AUC), and Feature Engineering.",
        keyConcepts: ["Train/Validation/Test Split", "Bias-Variance Tradeoff", "Gradient Descent Optimization", "Random Forests & Gradient Boosting", "Overfitting Prevention & Regularization (L1/L2)"],
        codeExample: `from sklearn.linear_model import LogisticRegression\nimport numpy as np\n\nX = np.array([[1], [2], [3], [4]])\ny = np.array([0, 0, 1, 1])\nmodel = LogisticRegression()\nmodel.fit(X, y)\nprint("Prediction for 3.5:", model.predict([[3.5]]))`,
        flowchart: `[Raw Data Collection]\n      │\n      ▼\n[Data Preprocessing & Cleaning]\n      │\n      ▼\n[Feature Extraction]\n      │\n      ▼\n[Model Training & Loss Minimization]\n      │\n      ▼\n[Evaluation Metrics (Accuracy / F1)]`,
        formulas: ["Loss Function (MSE): 1/N * Σ(y_i - ŷ_i)²", "Sigmoid Activation: 1 / (1 + e⁻ᶻ)"],
        videos: [
            {
                title: "Machine Learning Course for Beginners",
                creator: "Andrew Ng / DeepLearning.AI",
                url: "https://www.youtube.com/watch?v=PPLop442ScU",
                duration: "3h 30m",
                difficulty: "Beginner to Intermediate",
                score: 5.0,
                isFree: true,
                summary: "World-class introduction to regression, classification, neural networks, and ML best practices."
            }
        ]
    }
];

export function getStudyMaterialForTopic(topicQuery = '') {
    const q = (topicQuery || '').toLowerCase();
    const match = KNOWLEDGE_BASE.find(k => 
        k.topic.toLowerCase().includes(q) || 
        k.category.toLowerCase().includes(q) ||
        q.includes(k.topic.toLowerCase())
    ) || KNOWLEDGE_BASE[0];

    return {
        topic: match.topic,
        category: match.category,
        studyNotes: {
            definition: match.definition,
            explanation: match.explanation,
            keyConcepts: match.keyConcepts,
            codeExample: match.codeExample,
            flowchart: match.flowchart,
            formulas: match.formulas
        },
        videos: match.videos
    };
}

export function rankVideoResources(query = '') {
    // Collect all videos across KB matching query
    const q = (query || '').toLowerCase();
    let allVideos = [];
    KNOWLEDGE_BASE.forEach(k => {
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
