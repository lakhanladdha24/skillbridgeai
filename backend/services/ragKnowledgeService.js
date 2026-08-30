/**
 * RAG Knowledge Service & Embedded In-App Learning Engine
 * Provides structured GfG/W3Schools style articles, embedded YouTube video URLs,
 * visual flowcharts, code examples, practice questions, and PDF cheat sheets.
 */

const KNOWLEDGE_BASE = [
    {
        topic: "Python Fundamentals & OOP",
        category: "Python Programming",
        difficulty: "Beginner",
        definition: "Python is an interpreted, high-level, general-purpose programming language emphasizing code readability and dynamic typing.",
        explanation: "In this GeeksforGeeks / W3Schools style module, you will learn Python data types (integers, strings, lists, tuples, dicts), control flow (if/else, loops), function definitions, and Object-Oriented Programming (OOP) principles including Classes, Inheritance, Encapsulation, and Polymorphism.",
        keyConcepts: ["Variables & Data Types", "Control Structures (If/Else, Loops)", "Functions & Lambda Expressions", "Classes, Objects & Dunder Methods", "Decorators & Generators"],
        codeExample: `class NeuralNetwork:\n    """A simple Object-Oriented Neural Network layer model."""\n    def __init__(self, layers):\n        self.layers = layers\n\n    def forward(self, input_val):\n        return [input_val * weight for weight in self.layers]\n\nmodel = NeuralNetwork([0.5, 1.2, 0.8])\nprint("Output Tensor:", model.forward(2.0))`,
        flowchart: `[Beginner: Python Variables & Data Types]\n                 │\n                 ▼\n[Intermediate: Functions & OOP Classes]\n                 │\n                 ▼\n[Advanced: Decorators, Generators & Metaclasses]\n                 │\n                 ▼\n[Mastery: Production Python Engineering]`,
        formulas: ["Time Complexity: O(1) list lookup by index", "Space Complexity: O(N) memory allocation"],
        gfgW3Article: {
            source: "Skill Bridge AI Knowledge Base (GfG / W3Schools Certified Format)",
            sections: [
                {
                    title: "1. Python Data Types & Syntax Overview",
                    content: "Python supports multiple data structures out of the box. Variables do not require explicit type declaration (dynamic typing). Lists are mutable ordered sequences, whereas Tuples are immutable."
                },
                {
                    title: "2. Object-Oriented Programming (OOP)",
                    content: "Classes encapsulate data attributes and method behaviors. The __init__ method acts as the class constructor. Inheritance allows child classes to inherit methods from parent classes."
                }
            ]
        },
        pdfGuide: {
            title: "Python 3 & OOP Complete Cheat Sheet Guide",
            summary: "Comprehensive PDF reference covering syntax, built-in functions, data structures, and OOP design patterns.",
            fileSize: "1.4 MB",
            downloadName: "python_cheat_sheet_v3.pdf"
        },
        videos: [
            {
                title: "Python OOP Full Course - Object Oriented Programming",
                creator: "FreeCodeCamp",
                embedUrl: "https://www.youtube-nocookie.com/embed/Ej_02ICOIgs",
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
        category: "DSA & Algorithms",
        difficulty: "Intermediate",
        definition: "Data Structures define efficient memory organization, while Algorithms provide step-by-step procedures for computational problem solving.",
        explanation: "Mastering Arrays, Hash Tables, Linked Lists, Trees, Graphs, Dynamic Programming, and Sorting algorithms enables building ultra-fast software applications.",
        keyConcepts: ["Big-O Complexity Analysis", "Hash Table Collision Handling", "Binary Search Trees & Heaps", "Graph Traversal (BFS & DFS)", "Dynamic Programming (Memoization vs Tabulation)"],
        codeExample: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1\n\nprint("Target Index:", binary_search([10, 20, 30, 40, 50], 40))`,
        flowchart: `[Beginner: Arrays & Strings & Two Pointers]\n                 │\n                 ▼\n[Intermediate: Hash Maps & Stack/Queue & Trees]\n                 │\n                 ▼\n[Advanced: Graphs, BFS/DFS & Dynamic Programming]\n                 │\n                 ▼\n[Mastery: Advanced System Algorithms & Hard LeetCode]`,
        formulas: ["Binary Search: O(log N) Time Complexity", "Quick Sort Average: O(N log N) Time Complexity"],
        gfgW3Article: {
            source: "Skill Bridge AI Knowledge Base (GeeksforGeeks / W3Schools Style)",
            sections: [
                {
                    title: "1. Introduction to Time & Space Complexity",
                    content: "Big-O notation quantifies algorithm performance as input size N grows. O(1) denotes constant time, O(log N) logarithmic time, and O(N) linear time."
                },
                {
                    title: "2. Hash Tables & Binary Search Trees",
                    content: "Hash tables offer average O(1) insertion, deletion, and lookup by key. Binary Search Trees maintain sorted order allowing O(log N) balanced tree traversals."
                }
            ]
        },
        pdfGuide: {
            title: "Data Structures & Algorithms Formula & Pattern Handbook",
            summary: "GeeksforGeeks styled reference handbook with code snippets, time complexities, and 14 essential LeetCode coding patterns.",
            fileSize: "2.8 MB",
            downloadName: "dsa_master_handbook.pdf"
        },
        videos: [
            {
                title: "Data Structures and Algorithms for Beginners",
                creator: "NeetCode",
                embedUrl: "https://www.youtube-nocookie.com/embed/8hly31xKLI0",
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
        category: "Artificial Intelligence & ML",
        difficulty: "Intermediate",
        definition: "Machine Learning develops statistical models and algorithms that enable computers to learn patterns from data and make intelligent predictions.",
        explanation: "Covers Supervised Learning (Linear/Logistic Regression, Decision Trees), Unsupervised Learning (K-Means, PCA), Neural Networks, Model Evaluation (MSE, F1-Score), and Feature Scaling.",
        keyConcepts: ["Supervised vs Unsupervised Learning", "Gradient Descent & Loss Minimization", "Bias-Variance Tradeoff", "Random Forests & XGBoost", "Neural Networks & Backpropagation"],
        codeExample: `from sklearn.linear_model import LogisticRegression\nimport numpy as np\n\nX = np.array([[1], [2], [3], [4]])\ny = np.array([0, 0, 1, 1])\nmodel = LogisticRegression()\nmodel.fit(X, y)\nprint("Predicted Class for x=3.5:", model.predict([[3.5]])[0])`,
        flowchart: `[Beginner: Linear Algebra, Calculus & Python Datasets]\n                 │\n                 ▼\n[Intermediate: Scikit-Learn Regression & Classification]\n                 │\n                 ▼\n[Advanced: PyTorch Neural Networks & Deep Learning]\n                 │\n                 ▼\n[Mastery: Transformers, LLM Fine-Tuning & Generative AI]`,
        formulas: ["MSE Loss: 1/N * Σ(y_i - ŷ_i)²", "Sigmoid Activation: 1 / (1 + e⁻ᶻ)"],
        gfgW3Article: {
            source: "Skill Bridge AI AI/ML Knowledge Base",
            sections: [
                {
                    title: "1. Supervised Learning Pipeline",
                    content: "Supervised learning algorithms are trained on labeled datasets. Features (X) are mapped to targets (y) by minimizing a loss function via Gradient Descent."
                },
                {
                    title: "2. Model Evaluation & Overfitting Prevention",
                    content: "Cross-validation splits dataset into folds. L1 (Lasso) and L2 (Ridge) regularization penalize large weights to prevent model overfitting."
                }
            ]
        },
        pdfGuide: {
            title: "Machine Learning & Deep Learning Core Reference Guide",
            summary: "Comprehensive guide containing formulas, Scikit-Learn cheat sheet, PyTorch tensor operations, and model evaluation metrics.",
            fileSize: "3.2 MB",
            downloadName: "ml_dl_master_guide.pdf"
        },
        videos: [
            {
                title: "Machine Learning Course for Beginners",
                creator: "Andrew Ng / DeepLearning.AI",
                embedUrl: "https://www.youtube-nocookie.com/embed/PPLop442ScU",
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
        difficulty: "Beginner",
        definition: "Web Development spans frontend user interface design, backend RESTful/GraphQL APIs, component state management, and cloud web server deployment.",
        explanation: "Learn HTML5 semantic markup, CSS3 Flexbox/Grid layouts, modern ES6+ JavaScript, React component state/hooks, Node.js Express server routing, and database integration.",
        keyConcepts: ["Semantic HTML5 & Responsive CSS3", "Modern JavaScript (ES6+ & Async/Await)", "React Component Lifecycle & Virtual DOM", "Node.js Express RESTful APIs", "Authentication, CORS & Web Security"],
        codeExample: `const express = require('express');\nconst app = express();\napp.use(express.json());\n\napp.get('/api/users', (req, res) => {\n    res.json([{ id: 1, name: 'Alice', role: 'Developer' }]);\n});\n\napp.listen(3000, () => console.log('Server running on port 3000'));`,
        flowchart: `[Beginner: HTML5, CSS3 & JavaScript DOM]\n                 │\n                 ▼\n[Intermediate: React.js Component Architecture & Hooks]\n                 │\n                 ▼\n[Advanced: Node.js Express Backend & MongoDB/SQL]\n                 │\n                 ▼\n[Mastery: Microservices, Docker & Production Cloud Deployment]`,
        formulas: ["Lighthouse Performance Score > 90", "Largest Contentful Paint LCP < 2.5s"],
        gfgW3Article: {
            source: "Skill Bridge AI Web Dev Knowledge Base (W3Schools Style)",
            sections: [
                {
                    title: "1. HTML5 & CSS3 Responsive Layouts",
                    content: "Modern responsive web development relies on CSS Flexbox and Grid layouts. Media queries dynamically re-arrange interface elements for mobile devices."
                },
                {
                    title: "2. React Component State & Virtual DOM",
                    content: "React uses a virtual DOM representation to optimize browser re-renders. Hooks like useState and useEffect manage local state and side-effects."
                }
            ]
        },
        pdfGuide: {
            title: "Full Stack Web Development (MERN) Complete Handbook",
            summary: "W3Schools styled handbook covering HTML, CSS, JavaScript, React Hooks, Node.js REST APIs, and MongoDB schema design.",
            fileSize: "2.1 MB",
            downloadName: "fullstack_mern_handbook.pdf"
        },
        videos: [
            {
                title: "Full Stack Web Development Course 2026",
                creator: "Traversy Media",
                embedUrl: "https://www.youtube-nocookie.com/embed/nu_pCVPKzTk",
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
        difficulty: "Intermediate",
        definition: "Database Systems organize structured and unstructured data with ACID transactional guarantees, index optimization, and relational query capabilities.",
        explanation: "Covers SQL Queries, Joins (INNER, LEFT, RIGHT, FULL), Subqueries, Indexing (B-Tree), Normalization (1NF to 3NF), and NoSQL document models (MongoDB).",
        keyConcepts: ["Relational Model & Primary/Foreign Keys", "SQL Joins & Aggregations (GROUP BY)", "B-Tree Indexing & Query Plans", "ACID Transaction Guarantees", "Database Normalization (3NF)"],
        codeExample: `SELECT d.name AS department, COUNT(e.id) AS total_employees, AVG(e.salary) AS avg_salary\nFROM Department d\nJOIN Employee e ON d.id = e.department_id\nGROUP BY d.name\nHAVING AVG(e.salary) > 60000\nORDER BY avg_salary DESC;`,
        flowchart: `[Beginner: Basic SELECT, WHERE & ORDER BY Queries]\n                 │\n                 ▼\n[Intermediate: Joins, Aggregations & Subqueries]\n                 │\n                 ▼\n[Advanced: B-Tree Indexing, Transactions & Window Functions]\n                 │\n                 ▼\n[Mastery: Database Sharding, Replication & High Availability]`,
        formulas: ["Selectivity = Distinct Keys / Total Records", "Index B-Tree Depth: O(log_B N)"],
        gfgW3Article: {
            source: "Skill Bridge AI SQL & Database Knowledge Base",
            sections: [
                {
                    title: "1. Relational Algebra & SQL Joins",
                    content: "SQL Joins combine rows from multiple tables based on related columns. INNER JOIN returns matching rows in both tables; LEFT JOIN returns all rows from the left table."
                },
                {
                    title: "2. Indexing & Performance Tuning",
                    content: "B-Tree indexes speed up SELECT query lookup times from O(N) full table scans to O(log N) tree traversals. Indexes should be added to columns used frequently in WHERE and JOIN clauses."
                }
            ]
        },
        pdfGuide: {
            title: "SQL Query Masterclass & Database Design Cheat Sheet",
            summary: "Comprehensive SQL reference covering SELECT queries, JOINS, window functions, B-Tree index optimization, and database normalization.",
            fileSize: "1.9 MB",
            downloadName: "sql_database_cheat_sheet.pdf"
        },
        videos: [
            {
                title: "SQL Database Masterclass - Zero to Hero",
                creator: "Fireship",
                embedUrl: "https://www.youtube-nocookie.com/embed/HXV3zeQKqGY",
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
        difficulty: "Advanced",
        definition: "System Design specifies software architecture, component trade-offs, scalability patterns, fault tolerance, and cloud infrastructure for million-user applications.",
        explanation: "Covers Load Balancing, Microservices, Caching (Redis), Database Sharding, Asynchronous Message Queues (Kafka), CDN edge delivery, and High Availability.",
        keyConcepts: ["CAP Theorem (Consistency, Availability, Partition Tolerance)", "Load Balancing (Round Robin, Least Connections)", "Consistent Hashing & Token Rings", "Caching Strategies (Cache-Aside, Write-Through)", "Message Queues & Event-Driven Architecture"],
        codeExample: `// Consistent Hashing Server Ring Router\nfunction routeRequestToServer(keyHash, serverRing) {\n    serverRing.sort((a, b) => a - b);\n    const targetServer = serverRing.find(server => server >= keyHash);\n    return targetServer !== undefined ? targetServer : serverRing[0];\n}\n\nconsole.log("Routed Server:", routeRequestToServer(42, [10, 50, 80]));`,
        flowchart: `[Beginner: Single Server & Monolithic Architecture]\n                 │\n                 ▼\n[Intermediate: Load Balancers, Redis Cache & Read Replicas]\n                 │\n                 ▼\n[Advanced: Microservices, Kafka Queues & DB Sharding]\n                 │\n                 ▼\n[Mastery: Globally Distributed Multi-Region Cloud Architecture]`,
        formulas: ["Availability 99.999% = 5.26 minutes downtime per year", "Little's Law: L = λ * W"],
        gfgW3Article: {
            source: "Skill Bridge AI System Design Knowledge Base",
            sections: [
                {
                    title: "1. The CAP Theorem in Distributed Systems",
                    content: "CAP Theorem states that a distributed system can simultaneously provide at most two out of three guarantees: Consistency, Availability, and Partition Tolerance."
                },
                {
                    title: "2. Caching & Database Sharding",
                    content: "Redis and Memcached provide ultra-low latency sub-millisecond memory caching. Sharding horizontally partitions database rows across distinct database instances."
                }
            ]
        },
        pdfGuide: {
            title: "System Design Interview Blueprint & Architecture Handbook",
            summary: "GeeksforGeeks styled blueprint detailing load balancing, rate limiting, caching, database sharding, and real-time Kafka streaming architectures.",
            fileSize: "4.5 MB",
            downloadName: "system_design_blueprint.pdf"
        },
        videos: [
            {
                title: "System Design Primer for Technical Interviews",
                creator: "ByteByteGo",
                embedUrl: "https://www.youtube-nocookie.com/embed/m8Icp_Cid5o",
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
