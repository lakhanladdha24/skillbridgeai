/**
 * RAG Knowledge Service & Deep Learning Video Ranking Engine
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
    },
    {
        topic: "Web Development & Full Stack",
        category: "Web Development",
        definition: "Web Development encompasses frontend UI creation, backend REST APIs, component-driven state architecture, and web security.",
        explanation: "Covers Modern HTML5/CSS3, ES6+ JavaScript, React component lifecycle, Node.js server setup, API protocols (REST, GraphQL, WebSockets), and DOM performance.",
        keyConcepts: ["Virtual DOM & React Hooks", "Asynchronous Event Loop", "RESTful API Design", "Authentication & JWT", "CSS Flexbox & Grid Layouts"],
        codeExample: `const express = require('express');\nconst app = express();\napp.use(express.json());\napp.get('/api/health', (req, res) => res.json({ status: 'ok' }));\napp.listen(3000);`,
        flowchart: `[Client Browser Request]\n      │\n      ▼\n[HTTP GET /api/data]\n      │\n      ▼\n[Node.js Express Controller]\n      │\n      ▼\n[MongoDB Database Query]\n      │\n      ▼\n[JSON Response]`,
        formulas: ["TTFB: Time To First Byte", "LCP: Largest Contentful Paint < 2.5s"],
        videos: [
            {
                title: "Full Stack Web Development Course 2026",
                creator: "Traversy Media",
                url: "https://www.youtube.com/watch?v=nu_pCVPKzTk",
                duration: "4h 15m",
                difficulty: "Beginner to Advanced",
                score: 4.9,
                isFree: true,
                summary: "Complete full stack roadmap from modern JavaScript to React and Node.js microservices."
            }
        ]
    },
    {
        topic: "Database Systems & SQL",
        category: "Database & SQL",
        definition: "Databases manage structured, semi-structured, and unstructured data with ACID transactional guarantees.",
        explanation: "Covers SQL Queries, Joins (INNER, LEFT, RIGHT), Indexing (B-Tree), Normalization (1NF, 2NF, 3NF), and NoSQL document stores like MongoDB.",
        keyConcepts: ["ACID Principles", "SQL Joins & Grouping", "B-Tree Index Optimization", "3rd Normal Form (3NF)", "Transactions & Locks"],
        codeExample: `SELECT d.name, COUNT(e.id) AS emp_count\nFROM Department d\nJOIN Employee e ON d.id = e.department_id\nGROUP BY d.name\nHAVING COUNT(e.id) > 5;`,
        flowchart: `[SQL Query Input]\n      │\n      ▼\n[Parser & Lexical Analysis]\n      │\n      ▼\n[Query Optimizer & Execution Plan]\n      │\n      ▼\n[B-Tree Index Lookup]\n      │\n      ▼\n[Result Set]`,
        formulas: ["Selectivity: Distinct Values / Total Rows", "Index Lookup Time: O(log N)"],
        videos: [
            {
                title: "SQL Database Masterclass - Zero to Hero",
                creator: "Fireship",
                url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                duration: "1h 10m",
                difficulty: "Intermediate",
                score: 4.8,
                isFree: true,
                summary: "Master relational algebra, indexes, query optimizations, and database design."
            }
        ]
    },
    {
        topic: "System Design & Distributed Cloud",
        category: "System Design & Cloud",
        definition: "System Design specifies high-level architecture, scalability patterns, fault tolerance, and cloud infrastructure for large-scale applications.",
        explanation: "Covers Load Balancing, Microservices, Caching (Redis), Database Sharding, Asynchronous Message Queues (Kafka), and CDN distribution.",
        keyConcepts: ["CAP Theorem (Consistency, Availability, Partition Tolerance)", "Load Balancing & Rate Limiting", "Consistent Hashing", "Database Sharding & Replication", "Event-Driven Microservices"],
        codeExample: `// Consistent Hashing Token Ring Concept\nfunction getNearestServer(keyHash, serverRing) {\n    serverRing.sort((a, b) => a - b);\n    return serverRing.find(s => s >= keyHash) || serverRing[0];\n}`,
        flowchart: `[Global User Traffic]\n      │\n      ▼\n[Cloudflare CDN / Edge]\n      │\n      ▼\n[Nginx Load Balancer]\n ┌────┴────┐\nApp1     App2\n ▼         ▼\n[Redis Cache] ──► [Sharded Database]`,
        formulas: ["Availability (Nines): 99.99% = 52.6 mins downtime/yr", "Throughput: Requests / Second"],
        videos: [
            {
                title: "System Design Primer for Technical Interviews",
                creator: "ByteByteGo",
                url: "https://www.youtube.com/watch?v=m8Icp_Cid5o",
                duration: "2h 45m",
                difficulty: "Advanced",
                score: 5.0,
                isFree: true,
                summary: "Complete system design blueprint covering load balancers, caching, DB sharding, and Kafka."
            }
        ]
    }
];

export function getStudyMaterialForTopic(topicQuery = '') {
    const q = (topicQuery || '').toLowerCase();
    const match = KNOWLEDGE_BASE.find(k => 
        k.topic.toLowerCase().includes(q) || 
        k.category.toLowerCase().includes(q) ||
        q.includes(k.topic.toLowerCase().split(' ')[0])
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
