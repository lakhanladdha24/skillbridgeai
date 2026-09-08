/**
 * Comprehensive Catalog of roadmap.sh formatted Developer Roadmaps (Client-side & Offline Safe)
 * Contains complete stages, interconnected topics, prerequisites,
 * difficulty levels, recommendation badges, verified YouTube video queries, and docs.
 */

export interface TopicNode {
    topicId: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
    estimatedHours: number;
    completed: boolean;
    recommended?: boolean;
    alternative?: boolean;
    prerequisites?: string[];
    videoQuery?: string;
    docUrl?: string;
    keyConcepts?: string[];
}

export interface Phase {
    phaseId: string;
    title: string;
    description: string;
    topics: TopicNode[];
}

export interface RoadmapItem {
    id: string;
    title: string;
    category: string;
    description: string;
    estimated_duration: string;
    semantic_match_score: number;
    phases: Phase[];
}

export const CLIENT_ROADMAP_CATALOG: Record<string, RoadmapItem> = {
    'frontend': {
        id: 'frontend',
        title: 'Frontend Developer Roadmap',
        category: 'Role-based',
        description: 'Step by step guide to becoming a modern frontend developer in 2026, following the official roadmap.sh standard.',
        estimated_duration: '5–6 months',
        semantic_match_score: 99.4,
        phases: [
            {
                phaseId: 'fe_p1',
                title: 'Phase 1 — Internet & Web Fundamentals',
                description: 'Understand how the web works, DNS, hosting, HTTP/HTTPS, and browser rendering engines.',
                topics: [
                    {
                        topicId: 'fe_t1',
                        title: 'How does the Internet Work?',
                        description: 'Packets, routing, TCP/IP, IP addressing, DNS lookups, and how browsers fetch resources.',
                        difficulty: 'Beginner',
                        estimatedHours: 8,
                        completed: true,
                        recommended: true,
                        prerequisites: [],
                        docUrl: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work',
                        videoQuery: 'how the internet works networking crash course',
                        keyConcepts: ['DNS Resolution', 'TCP/IP Handshake', 'HTTP/HTTPS Requests', 'Client-Server Architecture']
                    },
                    {
                        topicId: 'fe_t2',
                        title: 'HTML5 Semantic Structure & Forms',
                        description: 'Semantic tags (article, section, nav), SEO metadata, accessible forms, audio/video elements.',
                        difficulty: 'Beginner',
                        estimatedHours: 12,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fe_t1'],
                        docUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                        videoQuery: 'HTML5 full course crash course',
                        keyConcepts: ['Semantic Markup', 'Form Validation', 'Accessibility (ARIA)', 'SEO Meta Tags']
                    },
                    {
                        topicId: 'fe_t3',
                        title: 'CSS3 Core, Flexbox & CSS Grid',
                        description: 'Selectors, Box Model, Responsive Web Design, Flexbox axis alignment, and 2D Grid layouts.',
                        difficulty: 'Beginner',
                        estimatedHours: 20,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fe_t2'],
                        docUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
                        videoQuery: 'CSS Flexbox and CSS Grid full tutorial',
                        keyConcepts: ['Box Model', 'Flexbox Container & Items', 'CSS Grid Template Areas', 'Media Queries']
                    }
                ]
            },
            {
                phaseId: 'fe_p2',
                title: 'Phase 2 — Modern JavaScript & Version Control',
                description: 'Core programming logic, ES6+ features, DOM manipulation, asynchronous programming, and Git.',
                topics: [
                    {
                        topicId: 'fe_t4',
                        title: 'Git & GitHub Version Control',
                        description: 'Branching strategies, commits, pull requests, merge conflicts, rebasing, and GitHub collaboration.',
                        difficulty: 'Beginner',
                        estimatedHours: 10,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fe_t3'],
                        docUrl: 'https://git-scm.com/doc',
                        videoQuery: 'git and github for beginners full course',
                        keyConcepts: ['git add & commit', 'Branching & Merging', 'Rebasing vs Merge', 'Pull Requests']
                    },
                    {
                        topicId: 'fe_t5',
                        title: 'JavaScript ES6+ Syntax & Scope',
                        description: 'Variables (let/const), Arrow functions, Destructuring, Closures, Scopes, and Prototype chain.',
                        difficulty: 'Intermediate',
                        estimatedHours: 25,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fe_t4'],
                        docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
                        videoQuery: 'javascript modern es6 full course',
                        keyConcepts: ['Lexical Scoping & Closures', 'Prototypes & Inheritance', 'ES6 Modules', 'Array Methods (map/filter/reduce)']
                    },
                    {
                        topicId: 'fe_t6',
                        title: 'Asynchronous JavaScript, Fetch & DOM APIs',
                        description: 'Event Loop, Callbacks, Promises, async/await, Fetch API, DOM manipulation, and Event Delegation.',
                        difficulty: 'Intermediate',
                        estimatedHours: 22,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fe_t5'],
                        docUrl: 'https://javascript.info/async',
                        videoQuery: 'javascript event loop promises async await tutorial',
                        keyConcepts: ['Event Loop & Microtasks', 'Promises & Async/Await', 'Fetch API & REST requests', 'DOM Event Bubbling']
                    }
                ]
            },
            {
                phaseId: 'fe_p3',
                title: 'Phase 3 — Component Frameworks & State Management',
                description: 'Component architecture, Virtual DOM, React 19 ecosystem, Tailwind CSS, and global state.',
                topics: [
                    {
                        topicId: 'fe_t7',
                        title: 'React.js Core: Components, Props & State',
                        description: 'JSX syntax, Functional Components, Props drilling, useState, useEffect, and Lifecycle management.',
                        difficulty: 'Intermediate',
                        estimatedHours: 30,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fe_t6'],
                        docUrl: 'https://react.dev/learn',
                        videoQuery: 'react js full course 2025 beginners',
                        keyConcepts: ['JSX & Virtual DOM', 'useState & useEffect', 'Conditional Rendering', 'Controlled Components']
                    },
                    {
                        topicId: 'fe_t8',
                        title: 'Tailwind CSS & Modern Styling',
                        description: 'Utility-first CSS framework, responsive modifiers, themes, component composition, and dark mode.',
                        difficulty: 'Intermediate',
                        estimatedHours: 12,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fe_t7'],
                        docUrl: 'https://tailwindcss.com/docs',
                        videoQuery: 'tailwind css full course tutorial',
                        keyConcepts: ['Utility Classes', 'Flexbox & Grid Utilities', 'Responsive Breakpoints', 'Arbitrary Values']
                    },
                    {
                        topicId: 'fe_t9',
                        title: 'TypeScript for Frontend Developers',
                        description: 'Static typing, Interfaces, Generics, Enums, Union types, and Type-safe React components.',
                        difficulty: 'Advanced',
                        estimatedHours: 20,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fe_t7'],
                        docUrl: 'https://www.typescriptlang.org/docs/',
                        videoQuery: 'typescript full course for beginners',
                        keyConcepts: ['Type Inference & Annotations', 'Interfaces vs Type Aliases', 'Generics', 'React Component Types']
                    },
                    {
                        topicId: 'fe_t10',
                        title: 'Global State Management (Zustand / Redux)',
                        description: 'Managing shared state across deep component trees, store slices, actions, and selectors.',
                        difficulty: 'Advanced',
                        estimatedHours: 15,
                        completed: false,
                        recommended: false,
                        alternative: true,
                        prerequisites: ['fe_t9'],
                        docUrl: 'https://zustand-demo.pmnd.rs/',
                        videoQuery: 'zustand react state management tutorial',
                        keyConcepts: ['Single Source of Truth', 'Store & Subscriptions', 'Immutability', 'Selectors']
                    }
                ]
            },
            {
                phaseId: 'fe_p4',
                title: 'Phase 4 — Production, SSR & Next.js Architecture',
                description: 'Server-Side Rendering, Static Generation, App Router, Performance Optimization, and Testing.',
                topics: [
                    {
                        topicId: 'fe_t11',
                        title: 'Next.js App Router, SSR & SSG',
                        description: 'Server Components, Client Components, dynamic routes, layout patterns, and server actions.',
                        difficulty: 'Advanced',
                        estimatedHours: 35,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fe_t9'],
                        docUrl: 'https://nextjs.org/docs',
                        videoQuery: 'next js 15 full course tutorial app router',
                        keyConcepts: ['React Server Components', 'App Router & Layouts', 'Server Actions', 'SSR & ISR']
                    },
                    {
                        topicId: 'fe_t12',
                        title: 'Web Performance & Core Web Vitals',
                        description: 'LCP, FID/INP, CLS, image optimization, code splitting, lazy loading, and bundle analysis.',
                        difficulty: 'Mastery',
                        estimatedHours: 15,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fe_t11'],
                        docUrl: 'https://web.dev/vitals/',
                        videoQuery: 'web performance optimization core web vitals',
                        keyConcepts: ['Largest Contentful Paint', 'Cumulative Layout Shift', 'Tree Shaking', 'Lazy Loading']
                    }
                ]
            }
        ]
    },

    'backend': {
        id: 'backend',
        title: 'Backend Developer Roadmap',
        category: 'Role-based',
        description: 'Complete roadmap to becoming a modern backend developer in 2026, following roadmap.sh architecture standards.',
        estimated_duration: '6–8 months',
        semantic_match_score: 99.1,
        phases: [
            {
                phaseId: 'be_p1',
                title: 'Phase 1 — OS & Terminal Basics',
                description: 'Master Linux CLI, process management, memory allocation, permissions, and network sockets.',
                topics: [
                    {
                        topicId: 'be_t1',
                        title: 'Linux Fundamentals & Shell Scripting',
                        description: 'File navigation, bash scripting, grep, curl, systemd service management, and cron jobs.',
                        difficulty: 'Beginner',
                        estimatedHours: 15,
                        completed: true,
                        recommended: true,
                        prerequisites: [],
                        docUrl: 'https://www.kernel.org/doc/html/latest/',
                        videoQuery: 'linux command line tutorial full course bash',
                        keyConcepts: ['File Permissions (chmod/chown)', 'Process Management (ps/kill)', 'Piping & Redirection', 'Systemd Services']
                    },
                    {
                        topicId: 'be_t2',
                        title: 'Networking Protocols: HTTP, HTTPS, TCP, UDP',
                        description: 'Socket connections, TLS handshakes, HTTP request-response cycles, status codes, and headers.',
                        difficulty: 'Beginner',
                        estimatedHours: 14,
                        completed: false,
                        recommended: true,
                        prerequisites: ['be_t1'],
                        docUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
                        videoQuery: 'computer networking full course http tcp udp',
                        keyConcepts: ['OSI 7-Layer Model', 'TCP Handshake', 'TLS/SSL Encryption', 'HTTP/2 & HTTP/3']
                    }
                ]
            },
            {
                phaseId: 'be_p2',
                title: 'Phase 2 — Backend Languages & REST APIs',
                description: 'Pick a backend language (Python, Node.js, or Go), build RESTful APIs, handle validation and middleware.',
                topics: [
                    {
                        topicId: 'be_t3',
                        title: 'Python (FastAPI) or Node.js (Express)',
                        description: 'Server runtime, asynchronous I/O, routing, middleware pipeline, and JSON schema validation.',
                        difficulty: 'Intermediate',
                        estimatedHours: 30,
                        completed: false,
                        recommended: true,
                        prerequisites: ['be_t2'],
                        docUrl: 'https://fastapi.tiangolo.com/',
                        videoQuery: 'python fastapi full course api development',
                        keyConcepts: ['Async Request Handling', 'Middleware Architecture', 'Pydantic Models', 'CORS & Security Headers']
                    },
                    {
                        topicId: 'be_t4',
                        title: 'RESTful API Design & OpenAPI Specs',
                        description: 'Resource naming conventions, idempotency, HTTP methods, pagination, and Swagger documentation.',
                        difficulty: 'Intermediate',
                        estimatedHours: 16,
                        completed: false,
                        recommended: true,
                        prerequisites: ['be_t3'],
                        docUrl: 'https://swagger.io/specification/',
                        videoQuery: 'rest api design best practices tutorial',
                        keyConcepts: ['HTTP Verbs & Status Codes', 'Stateless Architecture', 'Filtering & Pagination', 'OpenAPI/Swagger']
                    }
                ]
            },
            {
                phaseId: 'be_p3',
                title: 'Phase 3 — Database Systems & Caching',
                description: 'Relational databases (PostgreSQL), NoSQL (MongoDB), indexing strategies, transactions, and Redis caching.',
                topics: [
                    {
                        topicId: 'be_t5',
                        title: 'Relational Databases & PostgreSQL',
                        description: 'Schema design, normalization, complex JOINs, foreign keys, ACID transactions, and indexing.',
                        difficulty: 'Intermediate',
                        estimatedHours: 25,
                        completed: false,
                        recommended: true,
                        prerequisites: ['be_t4'],
                        docUrl: 'https://www.postgresql.org/docs/',
                        videoQuery: 'postgresql database full course tutorial',
                        keyConcepts: ['B-Tree Indexes', 'ACID Transactions', 'Foreign Keys & Constraints', 'Query Explain Plans']
                    },
                    {
                        topicId: 'be_t6',
                        title: 'Redis In-Memory Caching & Session Store',
                        description: 'Key-value caching, TTL expiration, cache invalidation strategies, rate limiting, and Redis Pub/Sub.',
                        difficulty: 'Intermediate',
                        estimatedHours: 15,
                        completed: false,
                        recommended: true,
                        prerequisites: ['be_t5'],
                        docUrl: 'https://redis.io/docs/',
                        videoQuery: 'redis crash course full tutorial',
                        keyConcepts: ['Cache-Aside Pattern', 'Cache Invalidation', 'Rate Limiting Algorithms', 'Data Structures (Hashes, Sets)']
                    }
                ]
            },
            {
                phaseId: 'be_p4',
                title: 'Phase 4 — Auth, Message Queues & System Design',
                description: 'Authentication (JWT, OAuth2), asynchronous task workers, Docker containers, and scalable architecture.',
                topics: [
                    {
                        topicId: 'be_t7',
                        title: 'Authentication, JWT & OAuth2 Security',
                        description: 'Password hashing with bcrypt, JWT access/refresh tokens, session storage, RBAC, and OAuth2 flow.',
                        difficulty: 'Advanced',
                        estimatedHours: 20,
                        completed: false,
                        recommended: true,
                        prerequisites: ['be_t5'],
                        docUrl: 'https://jwt.io/introduction',
                        videoQuery: 'authentication jwt oauth2 full course security',
                        keyConcepts: ['Salt & Hash with Bcrypt', 'JWT Signing & Expiration', 'Refresh Token Rotation', 'Role-Based Access Control']
                    },
                    {
                        topicId: 'be_t8',
                        title: 'Message Queues & Background Workers (Kafka / RabbitMQ)',
                        description: 'Event-driven architecture, producer-consumer pattern, message persistence, and task queues (Celery/BullMQ).',
                        difficulty: 'Advanced',
                        estimatedHours: 28,
                        completed: false,
                        recommended: true,
                        prerequisites: ['be_t6'],
                        docUrl: 'https://kafka.apache.org/documentation/',
                        videoQuery: 'apache kafka rabbitmq event driven architecture',
                        keyConcepts: ['Publish-Subscribe', 'Consumer Groups', 'Dead Letter Queues', 'At-Least-Once Delivery']
                    },
                    {
                        topicId: 'be_t9',
                        title: 'Docker Containers & Microservices',
                        description: 'Containerization, Dockerfiles, multi-stage builds, Docker Compose, service networking, and volumes.',
                        difficulty: 'Advanced',
                        estimatedHours: 25,
                        completed: false,
                        recommended: true,
                        prerequisites: ['be_t7'],
                        docUrl: 'https://docs.docker.com/',
                        videoQuery: 'docker tutorial for beginners full course',
                        keyConcepts: ['Images vs Containers', 'Dockerfile Best Practices', 'Docker Compose Orchestration', 'Volume Persistence']
                    }
                ]
            }
        ]
    },

    'machine-learning': {
        id: 'machine-learning',
        title: 'AI & Machine Learning Roadmap',
        category: 'Role-based',
        description: 'Comprehensive roadmap for mastering Machine Learning, Neural Networks, PyTorch, LLMs, and RAG architectures.',
        estimated_duration: '6–9 months',
        semantic_match_score: 99.5,
        phases: [
            {
                phaseId: 'ml_p1',
                title: 'Phase 1 — Math & Scientific Python',
                description: 'Essential linear algebra, multivariable calculus, probability, NumPy, and Pandas manipulation.',
                topics: [
                    {
                        topicId: 'ml_t1',
                        title: 'Linear Algebra & Multivariable Calculus',
                        description: 'Vector spaces, matrix dot products, eigenvalues, partial derivatives, and gradient vectors.',
                        difficulty: 'Beginner',
                        estimatedHours: 20,
                        completed: true,
                        recommended: true,
                        prerequisites: [],
                        docUrl: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
                        videoQuery: 'linear algebra for machine learning 3blue1brown',
                        keyConcepts: ['Matrix Transformations', 'Dot Products & Norms', 'Gradient Vectors', 'Eigenvalues & Eigenvectors']
                    },
                    {
                        topicId: 'ml_t2',
                        title: 'NumPy & Pandas for Data Manipulation',
                        description: 'Vectorized operations, broadcasting, DataFrame filtering, grouping, merging, and missing data imputation.',
                        difficulty: 'Beginner',
                        estimatedHours: 22,
                        completed: false,
                        recommended: true,
                        prerequisites: ['ml_t1'],
                        docUrl: 'https://pandas.pydata.org/docs/',
                        videoQuery: 'pandas numpy data science python full course',
                        keyConcepts: ['Array Broadcasting', 'DataFrames & Series', 'GroupBy Aggregations', 'Pivot Tables & Merging']
                    }
                ]
            },
            {
                phaseId: 'ml_p2',
                title: 'Phase 2 — Classical ML & Scikit-Learn',
                description: 'Supervised vs Unsupervised models, feature engineering, loss functions, and evaluation metrics.',
                topics: [
                    {
                        topicId: 'ml_t3',
                        title: 'Supervised Learning: Regression & Classification',
                        description: 'Linear/Logistic regression, cost functions, Gradient Descent, Decision Trees, Random Forests, and XGBoost.',
                        difficulty: 'Intermediate',
                        estimatedHours: 35,
                        completed: false,
                        recommended: true,
                        prerequisites: ['ml_t2'],
                        docUrl: 'https://scikit-learn.org/stable/',
                        videoQuery: 'machine learning course andrew ng scikit learn',
                        keyConcepts: ['Gradient Descent Optimization', 'Overfitting vs Underfitting', 'Ensemble Trees (Random Forest, XGBoost)', 'ROC-AUC & F1 Score']
                    },
                    {
                        topicId: 'ml_t4',
                        title: 'Unsupervised Learning & Feature Engineering',
                        description: 'K-Means clustering, PCA dimensionality reduction, StandardScaling, One-Hot Encoding, and Cross-Validation.',
                        difficulty: 'Intermediate',
                        estimatedHours: 25,
                        completed: false,
                        recommended: true,
                        prerequisites: ['ml_t3'],
                        docUrl: 'https://scikit-learn.org/stable/modules/clustering.html',
                        videoQuery: 'unsupervised learning k means pca tutorial',
                        keyConcepts: ['K-Means Clustering', 'Principal Component Analysis', 'K-Fold Cross Validation', 'Feature Scaling Pipelines']
                    }
                ]
            },
            {
                phaseId: 'ml_p3',
                title: 'Phase 3 — Deep Learning & PyTorch',
                description: 'Artificial Neural Networks, backpropagation, Convolutional Neural Networks (CNNs), and PyTorch tensors.',
                topics: [
                    {
                        topicId: 'ml_t5',
                        title: 'Neural Networks & PyTorch Fundamentals',
                        description: 'Tensors, Autograd, activation functions (ReLU, Sigmoid), multi-layer perceptrons, and training loops.',
                        difficulty: 'Advanced',
                        estimatedHours: 40,
                        completed: false,
                        recommended: true,
                        prerequisites: ['ml_t4'],
                        docUrl: 'https://pytorch.org/tutorials/',
                        videoQuery: 'pytorch deep learning full course for beginners',
                        keyConcepts: ['Autograd & Backprop', 'Loss Functions (CrossEntropy)', 'Stochastic Gradient Descent (Adam)', 'Custom Dataset Loaders']
                    },
                    {
                        topicId: 'ml_t6',
                        title: 'Transformer Architecture & Attention Mechanisms',
                        description: 'Self-attention, Positional encodings, Multi-head attention, Encoders, Decoders, and BERT/GPT foundations.',
                        difficulty: 'Advanced',
                        estimatedHours: 35,
                        completed: false,
                        recommended: true,
                        prerequisites: ['ml_t5'],
                        docUrl: 'https://huggingface.co/docs/transformers/index',
                        videoQuery: 'transformers attention is all you need visual explanation',
                        keyConcepts: ['Scaled Dot-Product Attention', 'Multi-Head Attention', 'Positional Embeddings', 'Encoder vs Decoder Blocks']
                    }
                ]
            },
            {
                phaseId: 'ml_p4',
                title: 'Phase 4 — Generative AI, RAG & LLMOps',
                description: 'Prompt engineering, Retrieval-Augmented Generation (RAG), Vector Databases, LangChain, and Model Deployment.',
                topics: [
                    {
                        topicId: 'ml_t7',
                        title: 'RAG Pipelines & Vector Databases (Chroma / Pinecone)',
                        description: 'Text chunking, embedding generation, cosine similarity, vector indexing, and hybrid retrieval.',
                        difficulty: 'Mastery',
                        estimatedHours: 30,
                        completed: false,
                        recommended: true,
                        prerequisites: ['ml_t6'],
                        docUrl: 'https://docs.langchain.com/',
                        videoQuery: 'retrieval augmented generation rag full tutorial langchain',
                        keyConcepts: ['Dense Vector Embeddings', 'Cosine Similarity Search', 'Context Window Injection', 'Re-ranking Algorithms']
                    },
                    {
                        topicId: 'ml_t8',
                        title: 'LLMOps & Model Serving (FastAPI / vLLM)',
                        description: 'Deploying ML models as scalable APIs, Dockerizing PyTorch services, latency optimization, and quantization.',
                        difficulty: 'Mastery',
                        estimatedHours: 30,
                        completed: false,
                        recommended: true,
                        prerequisites: ['ml_t7'],
                        docUrl: 'https://vllm.ai/',
                        videoQuery: 'machine learning model deployment fastapi docker',
                        keyConcepts: ['Model Quantization (INT8/FP16)', 'Serving Latency & Throughput', 'Batch Inference', 'GPU Memory Management']
                    }
                ]
            }
        ]
    },

    'python': {
        id: 'python',
        title: 'Python Developer Roadmap',
        category: 'Skill-based',
        description: 'Complete roadmap to becoming a modern Python professional, mastering core language internals, OOP, typing, and frameworks.',
        estimated_duration: '4–5 months',
        semantic_match_score: 99.0,
        phases: [
            {
                phaseId: 'py_p1',
                title: 'Phase 1 — Core Language Syntax & Data Structures',
                description: 'Variables, built-in types, lists, tuples, sets, dictionaries, comprehensions, and control flow.',
                topics: [
                    {
                        topicId: 'py_t1',
                        title: 'Python Syntax, Control Flow & Functions',
                        description: 'Conditionals, loops (for/while), functions (*args, **kwargs), lambda expressions, and scope (LEGB rule).',
                        difficulty: 'Beginner',
                        estimatedHours: 15,
                        completed: true,
                        recommended: true,
                        prerequisites: [],
                        docUrl: 'https://docs.python.org/3/tutorial/',
                        videoQuery: 'python for beginners full course programming with mosh',
                        keyConcepts: ['List & Dict Comprehensions', 'Variable Scoping (LEGB)', '*args and **kwargs', 'Lambda Functions']
                    },
                    {
                        topicId: 'py_t2',
                        title: 'Python Data Structures & HashMaps',
                        description: 'Lists, Dictionaries (hashmaps), Tuples, Sets, collections module (deque, Counter, defaultdict).',
                        difficulty: 'Beginner',
                        estimatedHours: 18,
                        completed: false,
                        recommended: true,
                        prerequisites: ['py_t1'],
                        docUrl: 'https://docs.python.org/3/tutorial/datastructures.html',
                        videoQuery: 'python data structures collections tutorial',
                        keyConcepts: ['Dictionary Hashing O(1)', 'Set Operations', 'Collections.defaultdict', 'Deque vs List Performance']
                    }
                ]
            },
            {
                phaseId: 'py_p2',
                title: 'Phase 2 — OOP, Dunder Methods & Modules',
                description: 'Classes, inheritance, magic (dunder) methods, decorators, context managers, and virtual environments.',
                topics: [
                    {
                        topicId: 'py_t3',
                        title: 'Object-Oriented Programming & Dunder Methods',
                        description: '__init__, __str__, __repr__, inheritance, polymorphism, encapsulation, @property, and classmethods.',
                        difficulty: 'Intermediate',
                        estimatedHours: 25,
                        completed: false,
                        recommended: true,
                        prerequisites: ['py_t2'],
                        docUrl: 'https://docs.python.org/3/reference/datamodel.html',
                        videoQuery: 'python oop object oriented programming corey schafer',
                        keyConcepts: ['Dunder Methods (__getitem__, __len__)', '@property Decorators', 'Multiple Inheritance & MRO', 'Class vs Static Methods']
                    },
                    {
                        topicId: 'py_t4',
                        title: 'Decorators, Generators & Context Managers',
                        description: 'Writing custom decorators, yield keyword, memory-efficient generators, and `with` context managers.',
                        difficulty: 'Intermediate',
                        estimatedHours: 20,
                        completed: false,
                        recommended: true,
                        prerequisites: ['py_t3'],
                        docUrl: 'https://docs.python.org/3/howto/functional.html',
                        videoQuery: 'python decorators and generators deep dive',
                        keyConcepts: ['Closure-based Decorators', 'Generator Expressions & Yield', 'Contextlib contextmanager', 'Iterator Protocol']
                    }
                ]
            },
            {
                phaseId: 'py_p3',
                title: 'Phase 3 — Concurrency, Packaging & Testing',
                description: 'Virtual environments (uv, poetry), typing system, threading, multiprocessing, asyncio, and pytest.',
                topics: [
                    {
                        topicId: 'py_t5',
                        title: 'Asynchronous Programming with Asyncio',
                        description: 'Event loop, async/await, coroutines, asyncio.gather, tasks, and concurrent I/O.',
                        difficulty: 'Advanced',
                        estimatedHours: 24,
                        completed: false,
                        recommended: true,
                        prerequisites: ['py_t4'],
                        docUrl: 'https://docs.python.org/3/library/asyncio.html',
                        videoQuery: 'python asyncio event loop async await tutorial',
                        keyConcepts: ['Event Loop Execution', 'Coroutines vs Threads', 'asyncio.gather Tasks', 'Non-blocking I/O']
                    },
                    {
                        topicId: 'py_t6',
                        title: 'Automated Testing with PyTest',
                        description: 'Writing unit tests, fixtures, mocking with unittest.mock, parameterization, and coverage reports.',
                        difficulty: 'Intermediate',
                        estimatedHours: 15,
                        completed: false,
                        recommended: true,
                        prerequisites: ['py_t5'],
                        docUrl: 'https://docs.pytest.org/',
                        videoQuery: 'pytest python testing tutorial for beginners',
                        keyConcepts: ['PyTest Fixtures', 'Parametrize Decorator', 'Mocking API Calls', 'Test Coverage Analysis']
                    }
                ]
            }
        ]
    },

    'fullstack': {
        id: 'fullstack',
        title: 'Full Stack Developer Roadmap',
        category: 'Role-based',
        description: 'End-to-end roadmap connecting modern React frontend architecture with resilient backend APIs, databases, and deployment.',
        estimated_duration: '7–10 months',
        semantic_match_score: 99.3,
        phases: [
            {
                phaseId: 'fs_p1',
                title: 'Phase 1 — Frontend Foundations (HTML, CSS, JS, React)',
                description: 'Master UI layout, responsive styling, modern JavaScript ES6+, and React component architecture.',
                topics: [
                    {
                        topicId: 'fs_t1',
                        title: 'Responsive Web Design & Tailwind CSS',
                        description: 'Semantic HTML5, CSS Grid/Flexbox, Tailwind CSS utility architecture, and mobile-first layouts.',
                        difficulty: 'Beginner',
                        estimatedHours: 20,
                        completed: true,
                        recommended: true,
                        prerequisites: [],
                        docUrl: 'https://tailwindcss.com/docs',
                        videoQuery: 'responsive web design full course tailwind',
                        keyConcepts: ['Mobile-first Design', 'Flexbox & CSS Grid', 'CSS Variables', 'Tailwind Utilities']
                    },
                    {
                        topicId: 'fs_t2',
                        title: 'React.js & TypeScript Architecture',
                        description: 'Component lifecycle, custom hooks, typing props/state, form handling with validation, and UI state.',
                        difficulty: 'Intermediate',
                        estimatedHours: 35,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fs_t1'],
                        docUrl: 'https://react.dev/',
                        videoQuery: 'react typescript full project course',
                        keyConcepts: ['Custom Hooks', 'Type-Safe Components', 'Zustand State Store', 'Optimistic UI Updates']
                    }
                ]
            },
            {
                phaseId: 'fs_p2',
                title: 'Phase 2 — Backend APIs & Database Engineering',
                description: 'RESTful API servers, relational databases, query optimization, and secure user authentication.',
                topics: [
                    {
                        topicId: 'fs_t3',
                        title: 'Node.js / Express & REST API Architecture',
                        description: 'Express routing, error handling middleware, JWT authentication, CORS, and request sanitization.',
                        difficulty: 'Intermediate',
                        estimatedHours: 30,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fs_t2'],
                        docUrl: 'https://expressjs.com/',
                        videoQuery: 'nodejs express rest api full course tutorial',
                        keyConcepts: ['Middleware Chains', 'JWT Access Tokens', 'Rate Limiting', 'Error Handling Pattern']
                    },
                    {
                        topicId: 'fs_t4',
                        title: 'PostgreSQL & Prisma ORM',
                        description: 'Database schema modeling, migrations, relationships (1-to-many, many-to-many), and indexed queries.',
                        difficulty: 'Intermediate',
                        estimatedHours: 25,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fs_t3'],
                        docUrl: 'https://www.prisma.io/docs',
                        videoQuery: 'prisma orm postgresql full tutorial',
                        keyConcepts: ['Schema Migrations', 'Foreign Key Relations', 'Prisma Client Queries', 'Transaction Isolation']
                    }
                ]
            },
            {
                phaseId: 'fs_p3',
                title: 'Phase 3 — Full Stack Integration & Cloud Deployment',
                description: 'Next.js full stack, Docker containers, CI/CD pipelines, and cloud hosting on Vercel/AWS.',
                topics: [
                    {
                        topicId: 'fs_t5',
                        title: 'Full Stack Next.js & Server Actions',
                        description: 'Combining frontend and backend with Server Actions, optimistic mutations, and streaming SSR.',
                        difficulty: 'Advanced',
                        estimatedHours: 35,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fs_t4'],
                        docUrl: 'https://nextjs.org/docs',
                        videoQuery: 'nextjs full stack project tutorial 2025',
                        keyConcepts: ['Server Actions', 'Streaming & Suspense', 'Route Handlers', 'NextAuth / Auth.js']
                    },
                    {
                        topicId: 'fs_t6',
                        title: 'Docker, CI/CD & Cloud Deployment',
                        description: 'Containerizing full stack apps, GitHub Actions workflows, automated testing, and cloud deployment.',
                        difficulty: 'Mastery',
                        estimatedHours: 25,
                        completed: false,
                        recommended: true,
                        prerequisites: ['fs_t5'],
                        docUrl: 'https://docs.github.com/en/actions',
                        videoQuery: 'docker github actions cicd deployment full course',
                        keyConcepts: ['Multi-Stage Dockerfile', 'GitHub Actions Pipeline', 'Environment Variables Management', 'Vercel & Cloud Deploy']
                    }
                ]
            }
        ]
    },

    'devops': {
        id: 'devops',
        title: 'DevOps & Cloud Engineer Roadmap',
        category: 'Role-based',
        description: 'Master continuous integration, infrastructure as code, Kubernetes orchestration, and cloud observability.',
        estimated_duration: '6–8 months',
        semantic_match_score: 99.0,
        phases: [
            {
                phaseId: 'dev_p1',
                title: 'Phase 1 — Linux, Shell & Networking',
                description: 'Linux systems administration, networking, bash scripting, SSH keys, and system diagnostics.',
                topics: [
                    {
                        topicId: 'dev_t1',
                        title: 'Linux Systems Administration & Bash',
                        description: 'Systemd, disk management, process tracing (top, htop), network commands (netstat, ss), and bash automation.',
                        difficulty: 'Beginner',
                        estimatedHours: 20,
                        completed: true,
                        recommended: true,
                        prerequisites: [],
                        docUrl: 'https://ubuntu.com/server/docs',
                        videoQuery: 'linux administration tutorial devops full course',
                        keyConcepts: ['Systemd Units', 'Crontab Scheduling', 'SSH Key Authentication', 'Network Port Diagnostics']
                    }
                ]
            },
            {
                phaseId: 'dev_p2',
                title: 'Phase 2 — Containers & Kubernetes Orchestration',
                description: 'Docker containerization, image optimization, Kubernetes pods, deployments, services, and ingress controllers.',
                topics: [
                    {
                        topicId: 'dev_t2',
                        title: 'Docker Containerization & Multi-Stage Builds',
                        description: 'Docker engine architecture, layers, caching, multi-stage builds, and container security best practices.',
                        difficulty: 'Intermediate',
                        estimatedHours: 25,
                        completed: false,
                        recommended: true,
                        prerequisites: ['dev_t1'],
                        docUrl: 'https://docs.docker.com/',
                        videoQuery: 'docker full course for devops engineers',
                        keyConcepts: ['Layer Caching', 'Distroless Images', 'Docker Network Bridges', 'Volume Mounts']
                    },
                    {
                        topicId: 'dev_t3',
                        title: 'Kubernetes Cluster Architecture & Orchestration',
                        description: 'Control plane, Kubelet, Pods, ReplicaSets, Deployments, Services (ClusterIP, NodePort), and Ingress.',
                        difficulty: 'Advanced',
                        estimatedHours: 40,
                        completed: false,
                        recommended: true,
                        prerequisites: ['dev_t2'],
                        docUrl: 'https://kubernetes.io/docs/',
                        videoQuery: 'kubernetes full course nana devops',
                        keyConcepts: ['Control Plane vs Worker Nodes', 'Declarative YAML Manifests', 'Ingress & Load Balancing', 'ConfigMaps & Secrets']
                    }
                ]
            },
            {
                phaseId: 'dev_p3',
                title: 'Phase 3 — CI/CD, Infrastructure as Code & Cloud',
                description: 'GitHub Actions, Terraform IaC, AWS infrastructure, and Prometheus/Grafana monitoring.',
                topics: [
                    {
                        topicId: 'dev_t4',
                        title: 'Infrastructure as Code with Terraform',
                        description: 'HCL syntax, providers, state management, remote backends (S3), modules, and drift detection.',
                        difficulty: 'Advanced',
                        estimatedHours: 30,
                        completed: false,
                        recommended: true,
                        prerequisites: ['dev_t3'],
                        docUrl: 'https://developer.hashicorp.com/terraform/docs',
                        videoQuery: 'terraform tutorial for beginners full course',
                        keyConcepts: ['Terraform State & Locks', 'Variables & Outputs', 'Reusable Modules', 'Plan vs Apply Cycle']
                    },
                    {
                        topicId: 'dev_t5',
                        title: 'Observability: Prometheus & Grafana Monitoring',
                        description: 'Metrics collection, Prometheus scraping, PromQL queries, Grafana dashboards, and alerting rules.',
                        difficulty: 'Mastery',
                        estimatedHours: 22,
                        completed: false,
                        recommended: true,
                        prerequisites: ['dev_t4'],
                        docUrl: 'https://prometheus.io/docs/',
                        videoQuery: 'prometheus and grafana monitoring full course',
                        keyConcepts: ['PromQL Syntax', 'Exporters (Node Exporter)', 'Dashboard Visualizations', 'Alertmanager Integration']
                    }
                ]
            }
        ]
    }
};

export function getClientCatalogRoadmap(slugOrQuery: string): RoadmapItem {
    if (!slugOrQuery) return CLIENT_ROADMAP_CATALOG['frontend'];
    const q = slugOrQuery.toLowerCase().trim();

    if (q.includes('front') || q.includes('html') || q.includes('css') || q.includes('js')) return CLIENT_ROADMAP_CATALOG['frontend'];
    if (q.includes('back') || q.includes('api') || q.includes('server') || q.includes('node') || q.includes('express')) return CLIENT_ROADMAP_CATALOG['backend'];
    if (q.includes('machine') || q.includes('ai') || q.includes('deep') || q.includes('ml') || q.includes('pytorch')) return CLIENT_ROADMAP_CATALOG['machine-learning'];
    if (q.includes('python')) return CLIENT_ROADMAP_CATALOG['python'];
    if (q.includes('full') || q.includes('stack') || q.includes('web')) return CLIENT_ROADMAP_CATALOG['fullstack'];
    if (q.includes('devops') || q.includes('cloud') || q.includes('k8s') || q.includes('kubernetes') || q.includes('docker')) return CLIENT_ROADMAP_CATALOG['devops'];

    // Generate clean dynamic fallback for any other query
    return {
        id: q.replace(/[^a-z0-9]/g, '_'),
        title: `${slugOrQuery} Roadmap`,
        category: 'Custom Technology',
        description: `Step-by-step roadmap to master ${slugOrQuery} in 2026, structured following roadmap.sh standards.`,
        estimated_duration: '4 to 6 months',
        semantic_match_score: 98.2,
        phases: [
            {
                phaseId: 'dyn_p1',
                title: `Phase 1 — ${slugOrQuery} Core Foundations & Tooling`,
                description: `Setup, core runtime mechanics, essential syntax, and prerequisite knowledge for ${slugOrQuery}.`,
                topics: [
                    {
                        topicId: 'dyn_t1',
                        title: `${slugOrQuery} Fundamentals & Setup`,
                        description: `Environment configuration, package setup, and core mental model for ${slugOrQuery}.`,
                        difficulty: 'Beginner',
                        estimatedHours: 15,
                        completed: true,
                        recommended: true,
                        prerequisites: [],
                        videoQuery: `${slugOrQuery} full course beginners`,
                        keyConcepts: ['Environment Setup', 'Core Syntax', 'CLI Tooling']
                    },
                    {
                        topicId: 'dyn_t2',
                        title: `${slugOrQuery} Architecture & Data Flow`,
                        description: `Data structures, execution flow, memory rules, and asynchronous processing.`,
                        difficulty: 'Intermediate',
                        estimatedHours: 20,
                        completed: false,
                        recommended: true,
                        prerequisites: ['dyn_t1'],
                        videoQuery: `${slugOrQuery} architecture tutorial`,
                        keyConcepts: ['Data Flow', 'State Management', 'Error Handling']
                    }
                ]
            },
            {
                phaseId: 'dyn_p2',
                title: `Phase 2 — Advanced Patterns & Production Engineering`,
                description: `Design patterns, database integrations, testing, and production deployment for ${slugOrQuery}.`,
                topics: [
                    {
                        topicId: 'dyn_t3',
                        title: `Advanced ${slugOrQuery} Frameworks & Best Practices`,
                        description: `Modular design, performance optimization, and testing practices.`,
                        difficulty: 'Advanced',
                        estimatedHours: 25,
                        completed: false,
                        recommended: true,
                        prerequisites: ['dyn_t2'],
                        videoQuery: `${slugOrQuery} advanced best practices`,
                        keyConcepts: ['Clean Architecture', 'Optimization', 'Unit Testing']
                    },
                    {
                        topicId: 'dyn_t4',
                        title: `${slugOrQuery} Production Capstone Project`,
                        description: `Build and deploy an end-to-end production portfolio project utilizing ${slugOrQuery}.`,
                        difficulty: 'Mastery',
                        estimatedHours: 35,
                        completed: false,
                        recommended: true,
                        prerequisites: ['dyn_t3'],
                        videoQuery: `${slugOrQuery} portfolio project full stack`,
                        keyConcepts: ['System Design', 'CI/CD Deployment', 'Portfolio']
                    }
                ]
            }
        ]
    };
}
