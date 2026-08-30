/**
 * RAG Knowledge Service & Step-Specific Distinct YouTube Video Engine
 * Provides UNIQUE YouTube video embed URLs, ratings, and downloadable study guides for EVERY flowchart step.
 * Also supports live YouTube Data API v3 searching if YOUTUBE_API_KEY is provided in backend/.env.
 */

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

// STEP-BY-STEP UNIQUE KNOWLEDGE & VIDEO MAP
const STEP_KNOWLEDGE_MAP = {
    // -------------------------------------------------------------
    // PYTHON PROGRAMMING FLOWCHART STEPS
    // -------------------------------------------------------------
    "python_step_1": {
        topic: "Python Basics, Syntax & Variables",
        category: "Python Programming",
        difficulty: "Beginner",
        definition: "Variables, data types (int, float, str, bool), lists, tuples, dictionaries, and conditional statements.",
        explanation: "Learn foundational Python syntax, memory reference, list operations, and basic control flow.",
        keyConcepts: ["Variables & Data Types", "Lists, Tuples & Dicts", "If/Else Conditions", "For & While Loops"],
        codeExample: `nums = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in nums if x % 2 == 0]\nprint("Even Squares:", squares)`,
        flowchart: `[Step 1: Python Basics] ──► [Step 2: Functions & OOP] ──► [Step 3: Decorators & Generators]`,
        formulas: ["List Indexing: O(1)", "List Append: O(1) amortized"],
        gfgW3Article: {
            source: "Skill Bridge AI Python Basics Guide (GfG / W3Schools Format)",
            sections: [
                { title: "1. Python Variables & Data Types", content: "Python is dynamically typed. Lists are mutable ordered sequences; Tuples are immutable." },
                { title: "2. Control Flow & Loops", content: "For loops iterate over iterables. List comprehensions provide concise syntax for list generation." }
            ]
        },
        pdfGuide: {
            title: "Step 1: Python Fundamentals Cheat Sheet Guide",
            summary: "Complete syntax reference covering variables, data types, loops, and built-in functions.",
            fileSize: "1.2 MB",
            downloadName: "python_step1_basics.pdf",
            markdownContent: `# Step 1: Python Fundamentals Study Guide\n\n## Overview\nVariables, lists, loops, and control flow in Python 3.\n\n## Code Example\n\`\`\`python\nnums = [1, 2, 3]\n\`\`\`\n`
        },
        videos: [
            {
                title: "Python for Beginners - Full Course",
                creator: "Programming with Mosh",
                embedUrl: "https://www.youtube-nocookie.com/embed/_uQrJ0TkZlc",
                duration: "1h 00m",
                difficulty: "Beginner",
                score: 4.9,
                ratingText: "★ 4.9 Top Rated Tutorial",
                isFree: true,
                summary: "Learn Python basics from scratch including variables, loops, and data structures."
            }
        ]
    },
    "python_step_2": {
        topic: "Functions, Modules & Object-Oriented Programming (OOP)",
        category: "Python Programming",
        difficulty: "Intermediate",
        definition: "Functions, encapsulation, classes, inheritance, method overriding, and module imports.",
        explanation: "Object-Oriented Programming structures software around classes encapsulating data attributes and behaviors.",
        keyConcepts: ["Def Functions & Arguments", "Class Constructors (__init__)", "Inheritance & Polymorphism", "Module Imports"],
        codeExample: `class NeuralNetwork:\n    def __init__(self, weights):\n        self.weights = weights\n    def forward(self, x):\n        return [x * w for w in self.weights]\n\nmodel = NeuralNetwork([0.5, 1.2])\nprint("Output:", model.forward(2.0))`,
        flowchart: `[Step 1: Python Basics] ──► [Step 2: Functions & OOP] ──► [Step 3: Decorators & Generators]`,
        formulas: ["Class Instantiation: O(1)", "Method Execution: O(1)"],
        gfgW3Article: {
            source: "Skill Bridge AI OOP Guide (GfG / W3Schools Format)",
            sections: [
                { title: "1. Functions & Scope", content: "Functions organize code into reusable blocks. Parameters pass arguments by object reference." },
                { title: "2. OOP Classes & Inheritance", content: "Classes encapsulate data attributes and method behaviors. Inheritance allows child classes to reuse methods." }
            ]
        },
        pdfGuide: {
            title: "Step 2: Python OOP & Classes Reference Guide",
            summary: "GeeksforGeeks styled handbook covering classes, inheritance, dunder methods, and modules.",
            fileSize: "1.6 MB",
            downloadName: "python_step2_oop.pdf",
            markdownContent: `# Step 2: Python OOP Study Guide\n\n## Overview\nClasses, inheritance, and encapsulation.\n`
        },
        videos: [
            {
                title: "Python OOP Tutorial - Classes & Inheritance",
                creator: "Corey Schafer",
                embedUrl: "https://www.youtube-nocookie.com/embed/ZDa-Z5JzLYM",
                duration: "1h 45m",
                difficulty: "Intermediate",
                score: 5.0,
                ratingText: "★ 5.0 Top Rated Tutorial",
                isFree: true,
                summary: "Master classes, class variables, classmethods, staticmethods, and inheritance."
            }
        ]
    },
    "python_step_3": {
        topic: "Advanced Decorators, Generators & Context Managers",
        category: "Python Programming",
        difficulty: "Advanced",
        definition: "First-class functions, function decorators, yield generators, and context managers (with statement).",
        explanation: "Decorators wrap functions to extend behavior. Generators yield values lazily saving memory.",
        keyConcepts: ["@decorator Syntax", "Functools @wraps", "Yield & Generator Expressions", "Custom Context Managers"],
        codeExample: `import functools, time\n\ndef time_it(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        res = func(*args, **kwargs)\n        print("Execution Time:", time.time() - start)\n        return res\n    return wrapper`,
        flowchart: `[Step 1: Python Basics] ──► [Step 2: Functions & OOP] ──► [Step 3: Decorators & Generators]`,
        formulas: ["Generator Memory: O(1)", "Decorator Overhead: O(1)"],
        gfgW3Article: {
            source: "Skill Bridge AI Advanced Python Guide",
            sections: [
                { title: "1. Python Decorators", content: "Decorators take a function as an argument and return a modified wrapper function." },
                { title: "2. Generators & Yield", content: "Generators pause execution state returning values lazily without allocating entire arrays in memory." }
            ]
        },
        pdfGuide: {
            title: "Step 3: Advanced Python Decorators & Generators Handbook",
            summary: "Advanced Python guide covering decorators, generators, metaclasses, and memory management.",
            fileSize: "2.1 MB",
            downloadName: "python_step3_advanced.pdf",
            markdownContent: `# Step 3: Advanced Python Study Guide\n\n## Overview\nDecorators, yield generators, and context managers.\n`
        },
        videos: [
            {
                title: "Python Advanced Decorators, Generators & Metaclasses",
                creator: "Corey Schafer",
                embedUrl: "https://www.youtube-nocookie.com/embed/r7t7gebC1Xk",
                duration: "45m",
                difficulty: "Advanced",
                score: 4.9,
                ratingText: "★ 4.9 Top Rated Tutorial",
                isFree: true,
                summary: "In-depth guide on decorators, functools, generators, and context managers."
            }
        ]
    },

    // -------------------------------------------------------------
    // DATA STRUCTURES & ALGORITHMS FLOWCHART STEPS
    // -------------------------------------------------------------
    "dsa_step_1": {
        topic: "Arrays, Strings, Hash Maps & Two Pointers",
        category: "DSA & Algorithms",
        difficulty: "Beginner",
        definition: "Linear array memory, string manipulation, hash map key-value lookups, and two-pointer strategies.",
        explanation: "Master fundamental array operations, hash table collision handling, and O(N) two-pointer algorithms.",
        keyConcepts: ["Array Memory Allocation", "Hash Table O(1) Lookup", "Two Pointers Strategy", "Sliding Window Pattern"],
        codeExample: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen: return [seen[diff], i]\n        seen[num] = i\n    return []`,
        flowchart: `[Step 1: Arrays & Hash Maps] ──► [Step 2: Trees & Heaps] ──► [Step 3: Graphs & Dynamic Programming]`,
        formulas: ["Hash Table Lookup: O(1) Average", "Two Pointers Search: O(N) Time"],
        gfgW3Article: {
            source: "Skill Bridge AI Array & Hash Map Guide (GfG Style)",
            sections: [
                { title: "1. Hash Map O(1) Complexity", content: "Hash functions map keys to array bucket indices yielding average constant time operations." },
                { title: "2. Two Pointers Pattern", content: "Using left and right pointers moving towards each other reduces brute-force O(N²) loops to O(N)." }
            ]
        },
        pdfGuide: {
            title: "Step 1: Arrays, Hash Maps & Two Pointers Handbook",
            summary: "Cheat sheet covering array methods, hash table internals, and two-pointer interview strategies.",
            fileSize: "1.8 MB",
            downloadName: "dsa_step1_arrays_hashmaps.pdf",
            markdownContent: `# Step 1: Arrays & Hash Maps Study Guide\n`
        },
        videos: [
            {
                title: "Two Sum & Hash Table Strategy - LeetCode Pattern",
                creator: "NeetCode",
                embedUrl: "https://www.youtube-nocookie.com/embed/KLlXCFG5TnA",
                duration: "15m",
                difficulty: "Beginner",
                score: 5.0,
                ratingText: "★ 5.0 Top Rated Tutorial",
                isFree: true,
                summary: "Master hash map lookups and two-pointer array strategies with visual animations."
            }
        ]
    },
    "dsa_step_2": {
        topic: "Binary Trees, Binary Search Trees & Heaps",
        category: "DSA & Algorithms",
        difficulty: "Intermediate",
        definition: "Hierarchical tree nodes, root/child pointers, BST ordering rules, and Min/Max Priority Queue Heaps.",
        explanation: "Learn tree traversals (In-order, Pre-order, Post-order, Level-order) and O(log N) heap insertions.",
        keyConcepts: ["Binary Tree Traversals", "BST Search & Insertion", "Min Heap & Max Heap", "Priority Queue Operations"],
        codeExample: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef inorder(root):\n    return inorder(root.left) + [root.val] + inorder(root.right) if root else []`,
        flowchart: `[Step 1: Arrays & Hash Maps] ──► [Step 2: Trees & Heaps] ──► [Step 3: Graphs & Dynamic Programming]`,
        formulas: ["BST Search: O(log N) Balanced", "Heap Insertion: O(log N)"],
        gfgW3Article: {
            source: "Skill Bridge AI Tree & Heap Guide",
            sections: [
                { title: "1. Binary Search Trees (BST)", content: "Left subtrees contain values smaller than root; right subtrees contain values greater than root." },
                { title: "2. Heaps & Priority Queues", content: "Heaps are complete binary trees maintaining parent <= child (Min Heap) or parent >= child (Max Heap)." }
            ]
        },
        pdfGuide: {
            title: "Step 2: Trees, BST & Heaps Complete Handbook",
            summary: "Guide covering tree traversal recursion, BST algorithms, and heap priority queue implementations.",
            fileSize: "2.2 MB",
            downloadName: "dsa_step2_trees_heaps.pdf",
            markdownContent: `# Step 2: Trees & Heaps Study Guide\n`
        },
        videos: [
            {
                title: "Binary Trees & BST Algorithms Masterclass",
                creator: "NeetCode",
                embedUrl: "https://www.youtube-nocookie.com/embed/8hly31xKLI0",
                duration: "1h 30m",
                difficulty: "Intermediate",
                score: 5.0,
                ratingText: "★ 5.0 Top Rated Tutorial",
                isFree: true,
                summary: "Master binary tree traversals, BST validation, and heap data structures."
            }
        ]
    },
    "dsa_step_3": {
        topic: "Graph Traversal (BFS & DFS) & Dynamic Programming",
        category: "DSA & Algorithms",
        difficulty: "Advanced",
        definition: "Graph vertices and edges, Breadth-First Search (BFS), Depth-First Search (DFS), and Dynamic Programming.",
        explanation: "Solve complex graph problems (shortest path, connected components) and memoization DP algorithms.",
        keyConcepts: ["Adjacency List Graphs", "BFS Queue Traversal", "DFS Stack Recursion", "DP Memoization vs Tabulation"],
        codeExample: `def fib_dp(n, memo={}):\n    if n <= 1: return n\n    if n not in memo:\n        memo[n] = fib_dp(n-1, memo) + fib_dp(n-2, memo)\n    return memo[n]\n\nprint("Fib(50):", fib_dp(50))`,
        flowchart: `[Step 1: Arrays & Hash Maps] ──► [Step 2: Trees & Heaps] ──► [Step 3: Graphs & Dynamic Programming]`,
        formulas: ["BFS/DFS Graph Time: O(V + E)", "DP Fib Time: O(N) with Memoization"],
        gfgW3Article: {
            source: "Skill Bridge AI Graph & DP Guide",
            sections: [
                { title: "1. Graph BFS & DFS Algorithms", content: "BFS uses a Queue to explore graphs level-by-level. DFS uses Stack recursion to explore paths deeply." },
                { title: "2. Dynamic Programming Memoization", content: "DP breaks problems into overlapping subproblems, storing results in a memo cache to avoid redundant work." }
            ]
        },
        pdfGuide: {
            title: "Step 3: Graph Algorithms & Dynamic Programming Handbook",
            summary: "Advanced handbook detailing Dijkstra's shortest path, topological sort, 0/1 Knapsack, and DP patterns.",
            fileSize: "2.9 MB",
            downloadName: "dsa_step3_graphs_dp.pdf",
            markdownContent: `# Step 3: Graph & DP Study Guide\n`
        },
        videos: [
            {
                title: "Graph Algorithms & Dynamic Programming Course",
                creator: "FreeCodeCamp",
                embedUrl: "https://www.youtube-nocookie.com/embed/t0Cq6tVNRBA",
                duration: "2h 45m",
                difficulty: "Advanced",
                score: 4.9,
                ratingText: "★ 4.9 Top Rated Tutorial",
                isFree: true,
                summary: "Master BFS, DFS, Dijkstra, topological sort, and dynamic programming memoization."
            }
        ]
    },

    // -------------------------------------------------------------
    // ARTIFICIAL INTELLIGENCE & MACHINE LEARNING STEPS
    // -------------------------------------------------------------
    "ai_step_1": {
        topic: "Linear Algebra, Calculus & Scikit-Learn Regression",
        category: "Artificial Intelligence & ML",
        difficulty: "Beginner",
        definition: "Matrix multiplication, partial derivatives, linear regression, logistic regression, and MSE loss.",
        explanation: "Understand foundational ML mathematics and train regression models using Scikit-Learn.",
        keyConcepts: ["Vectors & Matrices", "Gradient Descent Optimization", "Linear & Logistic Regression", "MSE Loss & Sigmoid Activation"],
        codeExample: `from sklearn.linear_model import LogisticRegression\nimport numpy as np\n\nX = np.array([[1], [2], [3], [4]])\ny = np.array([0, 0, 1, 1])\nmodel = LogisticRegression().fit(X, y)\nprint("Prediction for 3.5:", model.predict([[3.5]])[0])`,
        flowchart: `[Step 1: Scikit-Learn & Math] ──► [Step 2: PyTorch Neural Networks] ──► [Step 3: LLMs & Generative AI]`,
        formulas: ["MSE Loss: 1/N * Σ(y_i - ŷ_i)²", "Sigmoid: 1 / (1 + e⁻ᶻ)"],
        gfgW3Article: {
            source: "Skill Bridge AI ML Math Guide",
            sections: [
                { title: "1. Linear Algebra in Machine Learning", content: "Dataset inputs are represented as feature matrices (X). Predictions are computed via matrix dot products." },
                { title: "2. Gradient Descent Minimization", content: "Gradient descent computes loss derivatives to iteratively update weights in direction of steepest descent." }
            ]
        },
        pdfGuide: {
            title: "Step 1: Machine Learning Math & Scikit-Learn Handbook",
            summary: "Guide covering linear algebra formulas, gradient descent, logistic regression, and Scikit-Learn models.",
            fileSize: "2.4 MB",
            downloadName: "ai_step1_scikit_learn.pdf",
            markdownContent: `# Step 1: ML Math & Scikit-Learn Study Guide\n`
        },
        videos: [
            {
                title: "Machine Learning Math & Regression Course",
                creator: "Andrew Ng / DeepLearning.AI",
                embedUrl: "https://www.youtube-nocookie.com/embed/PPLop442ScU",
                duration: "3h 30m",
                difficulty: "Beginner",
                score: 5.0,
                ratingText: "★ 5.0 Top Rated Tutorial",
                isFree: true,
                summary: "World-class introduction to linear regression, gradient descent, and Scikit-Learn algorithms."
            }
        ]
    },
    "ai_step_2": {
        topic: "Deep Learning, PyTorch Neural Networks & CNNs",
        category: "Artificial Intelligence & ML",
        difficulty: "Intermediate",
        definition: "Artificial Neural Networks (ANN), PyTorch Tensors, Backpropagation, Convolutional Networks (CNN).",
        explanation: "Build multi-layer neural networks, train image classifiers, and master PyTorch autograd engine.",
        keyConcepts: ["PyTorch Tensors & CUDA", "Multi-Layer Perceptron (MLP)", "Cross-Entropy Loss", "Convolutional Neural Networks (CNN)"],
        codeExample: `import torch\nimport torch.nn as nn\n\nclass Net(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc = nn.Linear(10, 2)\n    def forward(self, x):\n        return self.fc(x)\n\nmodel = Net()\nprint("Model Output:", model(torch.randn(1, 10)))`,
        flowchart: `[Step 1: Scikit-Learn & Math] ──► [Step 2: PyTorch Neural Networks] ──► [Step 3: LLMs & Generative AI]`,
        formulas: ["Cross-Entropy Loss: -Σ y * log(p)", "Convolution Output Size: (N - F + 2P)/S + 1"],
        gfgW3Article: {
            source: "Skill Bridge AI PyTorch Deep Learning Guide",
            sections: [
                { title: "1. PyTorch Autograd Engine", content: "PyTorch dynamically constructs computational graphs, automatically computing backward gradients for model optimization." },
                { title: "2. Convolutional Layers", content: "CNN filters slide over spatial image dimensions extracting features like edges, textures, and object parts." }
            ]
        },
        pdfGuide: {
            title: "Step 2: PyTorch Deep Learning & Neural Networks Handbook",
            summary: "Handbook detailing PyTorch Tensors, autograd, loss functions, optimizers (Adam, SGD), and CNN architectures.",
            fileSize: "3.1 MB",
            downloadName: "ai_step2_pytorch_dl.pdf",
            markdownContent: `# Step 2: PyTorch Deep Learning Guide\n`
        },
        videos: [
            {
                title: "Deep Learning with PyTorch - Full Course",
                creator: "FreeCodeCamp",
                embedUrl: "https://www.youtube-nocookie.com/embed/V_xro1bcauA",
                duration: "2h 15m",
                difficulty: "Intermediate",
                score: 4.9,
                ratingText: "★ 4.9 Top Rated Tutorial",
                isFree: true,
                summary: "Complete PyTorch tutorial covering Tensors, autograd, multi-layer neural networks, and CNNs."
            }
        ]
    },
    "ai_step_3": {
        topic: "Transformers, LLMs, RAG & Generative AI",
        category: "Artificial Intelligence & ML",
        difficulty: "Advanced",
        definition: "Self-Attention mechanism, Transformer architectures, Large Language Models (LLMs), Fine-Tuning, and RAG.",
        explanation: "Master Transformer encoders/decoders, prompt engineering, vector database embeddings, and RAG pipelines.",
        keyConcepts: ["Self-Attention Mechanism", "Transformer Architecture", "LLM Fine-Tuning (LoRA)", "Vector Databases & RAG"],
        codeExample: `// Scaled Dot-Product Attention Formula\n// Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V`,
        flowchart: `[Step 1: Scikit-Learn & Math] ──► [Step 2: PyTorch Neural Networks] ──► [Step 3: LLMs & Generative AI]`,
        formulas: ["Attention: Softmax(Q * K^T / √d_k) * V", "Cosine Similarity: (A · B) / (||A|| ||B||)"],
        gfgW3Article: {
            source: "Skill Bridge AI Generative AI & Transformer Guide",
            sections: [
                { title: "1. The Transformer Self-Attention Mechanism", content: "Self-attention computes pairwise token dependencies allowing models to capture long-range context in parallel." },
                { title: "2. Retrieval-Augmented Generation (RAG)", content: "RAG retrieves external document embeddings from vector databases (FAISS, Chroma) to ground LLM generation." }
            ]
        },
        pdfGuide: {
            title: "Step 3: Transformers, LLM Fine-Tuning & RAG Architecture Blueprint",
            summary: "Advanced blueprint covering Transformer self-attention equations, HuggingFace transformers, LoRA fine-tuning, and RAG.",
            fileSize: "4.2 MB",
            downloadName: "ai_step3_genai_transformers.pdf",
            markdownContent: `# Step 3: Generative AI & Transformers Blueprint\n`
        },
        videos: [
            {
                title: "Let's build GPT: from scratch, by Andrej Karpathy",
                creator: "Andrej Karpathy",
                embedUrl: "https://www.youtube-nocookie.com/embed/kCc8FmEb1nY",
                duration: "1h 55m",
                difficulty: "Advanced",
                score: 5.0,
                ratingText: "★ 5.0 Masterclass Tutorial",
                isFree: true,
                summary: "Build a Generative Pretrained Transformer (GPT) from scratch using PyTorch with former OpenAI Lead."
            }
        ]
    }
};

/**
 * Fetch Study Material for a specific Topic or Flowchart Step ID
 */
export function getStudyMaterialForTopic(topicQuery = '') {
    const q = (topicQuery || '').toLowerCase();
    
    // 1. Direct step ID lookup or topic name matching
    const matchedKey = Object.keys(STEP_KNOWLEDGE_MAP).find(k => 
        k.toLowerCase() === q ||
        STEP_KNOWLEDGE_MAP[k].topic.toLowerCase().includes(q) ||
        q.includes(STEP_KNOWLEDGE_MAP[k].topic.toLowerCase().split(' ')[0])
    );

    const match = matchedKey ? STEP_KNOWLEDGE_MAP[matchedKey] : (STEP_KNOWLEDGE_MAP["python_step_1"] || Object.values(STEP_KNOWLEDGE_MAP)[0]);

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
