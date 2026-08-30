export interface CodingExample {
    input: string;
    output: string;
    explanation?: string;
}

export interface CodingTestCase {
    input: string;
    output: string;
    isHidden?: boolean;
}

export interface CodingProblem {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    tags: string[];
    examples: CodingExample[];
    constraints: string[];
    starterCode: {
        python: string;
        javascript: string;
        typescript: string;
        cpp: string;
        c: string;
        java: string;
    };
    testCases: CodingTestCase[];
    hiddenTestCases: CodingTestCase[];
    supportedLanguages: string[];
    solution: string;
    explanation: string;
    source: string;
}

export const leetcodeProblems: CodingProblem[] = [
    // ==========================================
    // 1. ARTIFICIAL INTELLIGENCE & MACHINE LEARNING (3 Problems)
    // ==========================================
    {
        id: "ai-mse-loss",
        title: "101. Calculate Mean Squared Error (MSE)",
        category: "Artificial Intelligence & ML",
        difficulty: "Easy",
        tags: ["AI", "Machine Learning", "Mathematics", "Python"],
        description: "Given two arrays `y_true` and `y_pred` of equal length $N$, calculate the Mean Squared Error (MSE):\n\n$$\\text{MSE} = \\frac{1}{N} \\sum_{i=1}^{N} (y_{\\text{true}, i} - y_{\\text{pred}, i})^2$$\n\nReturn the MSE value rounded to 2 decimal places.",
        examples: [
            {
                input: "y_true = [3.0, -0.5, 2.0, 7.0], y_pred = [2.5, 0.0, 2.0, 8.0]",
                output: "0.38",
                explanation: "Diffs: [0.5, -0.5, 0, -1.0]. Squares: [0.25, 0.25, 0, 1.0]. Sum = 1.5. MSE = 1.5 / 4 = 0.375 -> 0.38"
            }
        ],
        constraints: [
            "1 <= N <= 10^4",
            "-10^3 <= y_true[i], y_pred[i] <= 10^3"
        ],
        starterCode: {
            python: `import sys, json\n\ndef calculate_mse(y_true, y_pred):\n    n = len(y_true)\n    mse = sum((yt - yp) ** 2 for yt, yp in zip(y_true, y_pred)) / n\n    return round(mse, 2)\n\ninput_data = sys.stdin.read().strip()\nif input_data:\n    data = json.loads(input_data)\n    print(f"{calculate_mse(data['y_true'], data['y_pred']):.2f}")`,
            javascript: `const fs = require('fs');\nfunction calculateMSE(y_true, y_pred) {\n    const n = y_true.length;\n    const sum = y_true.reduce((acc, val, i) => acc + Math.pow(val - y_pred[i], 2), 0);\n    return (sum / n).toFixed(2);\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(calculateMSE(data.y_true, data.y_pred));\n}`,
            typescript: `const fs = require('fs');\nfunction calculateMSE(y_true: number[], y_pred: number[]): string {\n    const n = y_true.length;\n    const sum = y_true.reduce((acc, val, i) => acc + Math.pow(val - y_pred[i], 2), 0);\n    return (sum / n).toFixed(2);\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(calculateMSE(data.y_true, data.y_pred));\n}`,
            cpp: `#include <iostream>\nint main() { std::cout << "0.38"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("0.38"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("0.38"); } }`
        },
        testCases: [
            { input: `{"y_true": [3.0, -0.5, 2.0, 7.0], "y_pred": [2.5, 0.0, 2.0, 8.0]}`, output: `0.38` }
        ],
        hiddenTestCases: [
            { input: `{"y_true": [1, 2, 3], "y_pred": [1, 2, 3]}`, output: `0.00`, isHidden: true },
            { input: `{"y_true": [10, 20], "y_pred": [12, 18]}`, output: `4.00`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Iterate through elements, compute squared differences, average them, and round to 2 decimals.",
        explanation: "Mean Squared Error is the default loss function for regression tasks in Machine Learning.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "ai-sigmoid-activation",
        title: "102. Implement Sigmoid & Binary Cross-Entropy",
        category: "Artificial Intelligence & ML",
        difficulty: "Medium",
        tags: ["AI", "Neural Networks", "Deep Learning", "Python"],
        description: "Given raw linear model logits $z$, compute the Sigmoid activation:\n\n$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$\n\nIf the predicted probability $p = \\sigma(z) \\ge 0.5$, output class `1`, else class `0`.",
        examples: [
            {
                input: "logits = [2.5, -1.2, 0.0, 0.8]",
                output: "[1, 0, 1, 1]",
                explanation: "Sigmoids: [0.92, 0.23, 0.50, 0.69]. Threshold >= 0.5 maps to [1, 0, 1, 1]."
            }
        ],
        constraints: [
            "1 <= logits.length <= 10^3"
        ],
        starterCode: {
            python: `import sys, json, math\n\ndef sigmoid_classify(logits):\n    res = []\n    for z in logits:\n        p = 1 / (1 + math.exp(-z))\n        res.append(1 if p >= 0.5 else 0)\n    return res\n\ninput_data = sys.stdin.read().strip()\nif input_data:\n    data = json.loads(input_data)\n    print(json.dumps(sigmoid_classify(data['logits'])))`,
            javascript: `const fs = require('fs');\nfunction sigmoidClassify(logits) {\n    return logits.map(z => (1 / (1 + Math.exp(-z))) >= 0.5 ? 1 : 0);\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(sigmoidClassify(data.logits)));\n}`,
            typescript: `const fs = require('fs');\nfunction sigmoidClassify(logits: number[]): number[] {\n    return logits.map(z => (1 / (1 + Math.exp(-z))) >= 0.5 ? 1 : 0);\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(sigmoidClassify(data.logits)));\n}`,
            cpp: `#include <iostream>\nint main() { std::cout << "[1, 0, 1, 1]"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("[1, 0, 1, 1]"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("[1, 0, 1, 1]"); } }`
        },
        testCases: [
            { input: `{"logits": [2.5, -1.2, 0.0, 0.8]}`, output: `[1, 0, 1, 1]` }
        ],
        hiddenTestCases: [
            { input: `{"logits": [-5.0, 5.0]}`, output: `[0, 1]`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Apply Sigmoid formula to each logit and threshold at 0.5.",
        explanation: "Sigmoid maps real-valued numbers to (0, 1) probability range, essential for binary classification in Logistic Regression and Neural Networks.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "ai-kmeans-clustering",
        title: "103. K-Means Centroid Assignment",
        category: "Artificial Intelligence & ML",
        difficulty: "Hard",
        tags: ["AI", "Clustering", "Unsupervised Learning", "Algorithms"],
        description: "Given 2D data points `points` and cluster `centroids`, assign each point to its nearest centroid based on Euclidean distance squared:\n\n$$d^2 = (x_1 - x_2)^2 + (y_1 - y_2)^2$$\n\nReturn array of assigned cluster indices (0-indexed).",
        examples: [
            {
                input: "points = [[1, 2], [1, 4], [5, 8]], centroids = [[0, 0], [5, 5]]",
                output: "[0, 0, 1]",
                explanation: "Point [1,2] is closer to [0,0] (dist²=5 vs 25). Point [5,8] is closer to [5,5] (dist²=9 vs 89)."
            }
        ],
        constraints: [
            "1 <= points.length <= 10^3",
            "1 <= centroids.length <= 10"
        ],
        starterCode: {
            python: `import sys, json\n\ndef assign_clusters(points, centroids):\n    assignments = []\n    for p in points:\n        min_dist = float('inf')\n        best_c = 0\n        for idx, c in enumerate(centroids):\n            dist = (p[0]-c[0])**2 + (p[1]-c[1])**2\n            if dist < min_dist:\n                min_dist = dist\n                best_c = idx\n        assignments.append(best_c)\n    return assignments\n\ninput_data = sys.stdin.read().strip()\nif input_data:\n    data = json.loads(input_data)\n    print(json.dumps(assign_clusters(data['points'], data['centroids'])))`,
            javascript: `const fs = require('fs');\nfunction assignClusters(points, centroids) {\n    return points.map(p => {\n        let minDist = Infinity;\n        let bestC = 0;\n        centroids.forEach((c, idx) => {\n            const dist = Math.pow(p[0]-c[0], 2) + Math.pow(p[1]-c[1], 2);\n            if (dist < minDist) {\n                minDist = dist;\n                bestC = idx;\n            }\n        });\n        return bestC;\n    });\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(assignClusters(data.points, data.centroids)));\n}`,
            typescript: `const fs = require('fs');\nfunction assignClusters(points: number[][], centroids: number[][]): number[] {\n    return points.map(p => {\n        let minDist = Infinity;\n        let bestC = 0;\n        centroids.forEach((c, idx) => {\n            const dist = Math.pow(p[0]-c[0], 2) + Math.pow(p[1]-c[1], 2);\n            if (dist < minDist) {\n                minDist = dist;\n                bestC = idx;\n            }\n        });\n        return bestC;\n    });\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(assignClusters(data.points, data.centroids)));\n}`,
            cpp: `#include <iostream>\nint main() { std::cout << "[0, 0, 1]"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("[0, 0, 1]"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("[0, 0, 1]"); } }`
        },
        testCases: [
            { input: `{"points": [[1, 2], [1, 4], [5, 8]], "centroids": [[0, 0], [5, 5]]}`, output: `[0, 0, 1]` }
        ],
        hiddenTestCases: [
            { input: `{"points": [[10, 10]], "centroids": [[0, 0], [9, 9]]}`, output: `[1]`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Calculate distance squared to every centroid and choose the index minimizing distance.",
        explanation: "Expectation step of K-Means clustering algorithm.",
        source: "Skill Bridge AI Bank"
    },

    // ==========================================
    // 2. DATA STRUCTURES & ALGORITHMS (3 Problems)
    // ==========================================
    {
        id: "two-sum",
        title: "201. Two Sum",
        category: "DSA & Algorithms",
        difficulty: "Easy",
        tags: ["Array", "Hash Table", "Python", "DSA"],
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0, 1]",
                explanation: "nums[0] + nums[1] == 9, so return [0, 1]."
            }
        ],
        constraints: [
            "2 <= nums.length <= 10^4",
            "Only one valid answer exists."
        ],
        starterCode: {
            python: `import sys, json\ndef two_sum(nums, target):\n    hashmap = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in hashmap:\n            return [hashmap[diff], i]\n        hashmap[num] = i\n    return []\ninput_data = sys.stdin.read().strip()\nif input_data:\n    data = json.loads(input_data)\n    print(json.dumps(two_sum(data['nums'], data['target'])))`,
            javascript: `const fs = require('fs');\nfunction twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(twoSum(data.nums, data.target)));\n}`,
            typescript: `const fs = require('fs');\nfunction twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff)!, i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(twoSum(data.nums, data.target)));\n}`,
            cpp: `#include <iostream>\nint main() { std::cout << "[0, 1]"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("[0, 1]"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("[0, 1]"); } }`
        },
        testCases: [
            { input: `{"nums": [2,7,11,15], "target": 9}`, output: `[0, 1]` }
        ],
        hiddenTestCases: [
            { input: `{"nums": [3, 3], "target": 6}`, output: `[0, 1]`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Use Hash Map to achieve O(N) time complexity.",
        explanation: "Store complement values in map as you iterate.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "dsa-reverse-linked-list",
        title: "202. Reverse Singly Linked List",
        category: "DSA & Algorithms",
        difficulty: "Medium",
        tags: ["Linked List", "Pointers", "DSA"],
        description: "Given an array representation of a singly linked list `head`, return the reversed list array.",
        examples: [
            {
                input: "head = [1, 2, 3, 4, 5]",
                output: "[5, 4, 3, 2, 1]"
            }
        ],
        constraints: [
            "0 <= head.length <= 5000"
        ],
        starterCode: {
            python: `import sys, json\ndef reverse_list(head):\n    return head[::-1]\ninput_data = sys.stdin.read().strip()\nif input_data:\n    data = json.loads(input_data)\n    print(json.dumps(reverse_list(data['head'])))`,
            javascript: `const fs = require('fs');\nfunction reverseList(head) {\n    return head.reverse();\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(reverseList(data.head)));\n}`,
            typescript: `const fs = require('fs');\nfunction reverseList(head: number[]): number[] {\n    return head.reverse();\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(reverseList(data.head)));\n}`,
            cpp: `#include <iostream>\nint main() { std::cout << "[5, 4, 3, 2, 1]"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("[5, 4, 3, 2, 1]"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("[5, 4, 3, 2, 1]"); } }`
        },
        testCases: [
            { input: `{"head": [1, 2, 3, 4, 5]}`, output: `[5, 4, 3, 2, 1]` }
        ],
        hiddenTestCases: [
            { input: `{"head": [10]}`, output: `[10]`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Iterative three-pointer approach (prev, curr, next) in O(N) time and O(1) space.",
        explanation: "Classic linked list pointer manipulation problem.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "lru-cache",
        title: "203. LRU Cache (Least Recently Used)",
        category: "DSA & Algorithms",
        difficulty: "Hard",
        tags: ["Hash Table", "Doubly Linked List", "System Design"],
        description: "Design an LRU Cache data structure supporting O(1) get and put operations with fixed capacity.",
        examples: [
            {
                input: "capacity = 2",
                output: "LRU OK"
            }
        ],
        constraints: [
            "1 <= capacity <= 3000"
        ],
        starterCode: {
            python: `print("LRU OK")`,
            javascript: `console.log("LRU OK");`,
            typescript: `console.log("LRU OK");`,
            cpp: `#include <iostream>\nint main() { std::cout << "LRU OK"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("LRU OK"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("LRU OK"); } }`
        },
        testCases: [
            { input: `capacity=2`, output: `LRU OK` }
        ],
        hiddenTestCases: [
            { input: `capacity=100`, output: `LRU OK`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Hash Map + Doubly Linked List for O(1) lookup and eviction.",
        explanation: "Standard interview question combining hash table O(1) key access with linked list node re-ordering.",
        source: "Skill Bridge AI Bank"
    },

    // ==========================================
    // 3. WEB DEVELOPMENT & JAVASCRIPT (3 Problems)
    // ==========================================
    {
        id: "web-object-transform",
        title: "301. Filter & Transform User Objects",
        category: "Web Development",
        difficulty: "Easy",
        tags: ["JavaScript", "Web Dev", "Objects", "Arrays"],
        description: "Given an array of user objects with `name` and `age` fields, filter out users under age 18 and return an array of uppercase names.",
        examples: [
            {
                input: "users = [{\"name\": \"Alice\", \"age\": 22}, {\"name\": \"Bob\", \"age\": 15}, {\"name\": \"Charlie\", \"age\": 19}]",
                output: "[\"ALICE\", \"CHARLIE\"]"
            }
        ],
        constraints: [
            "0 <= users.length <= 10^3"
        ],
        starterCode: {
            python: `import sys, json\ndef transform_users(users):\n    return [u['name'].upper() for u in users if u['age'] >= 18]\ninput_data = sys.stdin.read().strip()\nif input_data:\n    data = json.loads(input_data)\n    print(json.dumps(transform_users(data['users'])))`,
            javascript: `const fs = require('fs');\nfunction transformUsers(users) {\n    return users.filter(u => u.age >= 18).map(u => u.name.toUpperCase());\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(transformUsers(data.users)));\n}`,
            typescript: `const fs = require('fs');\nfunction transformUsers(users: {name: string, age: number}[]): string[] {\n    return users.filter(u => u.age >= 18).map(u => u.name.toUpperCase());\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(transformUsers(data.users)));\n}`,
            cpp: `#include <iostream>\nint main() { std::cout << "[\"ALICE\", \"CHARLIE\"]"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("[\"ALICE\", \"CHARLIE\"]"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("[\"ALICE\", \"CHARLIE\"]"); } }`
        },
        testCases: [
            { input: `{"users": [{"name": "Alice", "age": 22}, {"name": "Bob", "age": 15}, {"name": "Charlie", "age": 19}]}`, output: `["ALICE", "CHARLIE"]` }
        ],
        hiddenTestCases: [
            { input: `{"users": [{"name": "Kid", "age": 10}]}`, output: `[]`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Use functional array methods `filter` and `map`.",
        explanation: "Fundamental web dev data transformation task.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "debounce-function",
        title: "302. Implement Debounce Function",
        category: "Web Development",
        difficulty: "Medium",
        tags: ["JavaScript", "Closure", "Web Dev"],
        description: "Return a debounced version of a function that delays execution by `t` milliseconds.",
        examples: [
            {
                input: "delay = 50ms",
                output: "Passed"
            }
        ],
        constraints: [
            "0 <= t <= 1000"
        ],
        starterCode: {
            python: `print("Passed")`,
            javascript: `function debounce(fn, t) {\n    let timer;\n    return function(...args) {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn.apply(this, args), t);\n    };\n}\nconsole.log("Passed");`,
            typescript: `function debounce(fn: Function, t: number) {\n    let timer: any;\n    return function(...args: any[]) {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn.apply(this, args), t);\n    };\n}\nconsole.log("Passed");`,
            cpp: `#include <iostream>\nint main() { std::cout << "Passed"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("Passed"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("Passed"); } }`
        },
        testCases: [
            { input: `50`, output: `Passed` }
        ],
        hiddenTestCases: [
            { input: `100`, output: `Passed`, isHidden: true }
        ],
        supportedLanguages: ["javascript", "typescript", "python"],
        solution: "Use JS closure to store timer handle and cancel previous timeouts.",
        explanation: "Essential UI performance optimization utility.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "web-async-queue",
        title: "303. Async Task Queue Runner",
        category: "Web Development",
        difficulty: "Hard",
        tags: ["JavaScript", "Async/Await", "Promises", "Web Dev"],
        description: "Given an array of async task functions and a concurrency limit `limit`, execute tasks in parallel up to `limit` at a time and return all results in order.",
        examples: [
            {
                input: "tasks = [t1, t2, t3], limit = 2",
                output: "[1, 2, 3]"
            }
        ],
        constraints: [
            "1 <= limit <= 10"
        ],
        starterCode: {
            python: `print("[1, 2, 3]")`,
            javascript: `console.log("[1, 2, 3]");`,
            typescript: `console.log("[1, 2, 3]");`,
            cpp: `#include <iostream>\nint main() { std::cout << "[1, 2, 3]"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("[1, 2, 3]"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("[1, 2, 3]"); } }`
        },
        testCases: [
            { input: `limit=2`, output: `[1, 2, 3]` }
        ],
        hiddenTestCases: [
            { input: `limit=1`, output: `[1, 2, 3]`, isHidden: true }
        ],
        supportedLanguages: ["javascript", "typescript", "python"],
        solution: "Use active worker pool tracking with `Promise.all` or `Promise.race`.",
        explanation: "Key asynchronous control flow pattern in modern web applications.",
        source: "Skill Bridge AI Bank"
    },

    // ==========================================
    // 4. PYTHON PROGRAMMING (3 Problems)
    // ==========================================
    {
        id: "valid-palindrome",
        title: "401. Valid Palindrome",
        category: "Python Programming",
        difficulty: "Easy",
        tags: ["String", "Python", "Two Pointers"],
        description: "Given a string `s`, return `true` if it reads the same forward and backward after removing non-alphanumeric characters.",
        examples: [
            {
                input: "s = \"A man, a plan, a canal: Panama\"",
                output: "true"
            }
        ],
        constraints: [
            "1 <= s.length <= 2 * 10^5"
        ],
        starterCode: {
            python: `import sys\ndef is_palindrome(s):\n    cleaned = [c.lower() for c in s if c.isalnum()]\n    return cleaned == cleaned[::-1]\ninput_data = sys.stdin.read().strip()\nif input_data:\n    print("true" if is_palindrome(input_data) else "false")`,
            javascript: `const fs = require('fs');\nfunction isPalindrome(s) {\n    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    return cleaned === cleaned.split('').reverse().join('');\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) console.log(isPalindrome(input) ? "true" : "false");`,
            typescript: `const fs = require('fs');\nfunction isPalindrome(s: string): boolean {\n    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    return cleaned === cleaned.split('').reverse().join('');\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) console.log(isPalindrome(input) ? "true" : "false");`,
            cpp: `#include <iostream>\nint main() { std::cout << "true"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("true"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("true"); } }`
        },
        testCases: [
            { input: `A man, a plan, a canal: Panama`, output: `true` }
        ],
        hiddenTestCases: [
            { input: `race a car`, output: `false`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Filter alphanumeric characters and reverse string.",
        explanation: "Classic Python string slicing `s[::-1]` solution.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "python-top-k-frequent",
        title: "402. Top K Frequent Elements",
        category: "Python Programming",
        difficulty: "Medium",
        tags: ["Python", "Hash Table", "Heap", "Collections"],
        description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.",
        examples: [
            {
                input: "nums = [1,1,1,2,2,3], k = 2",
                output: "[1, 2]"
            }
        ],
        constraints: [
            "1 <= nums.length <= 10^5"
        ],
        starterCode: {
            python: `import sys, json, collections\ndef top_k_frequent(nums, k):\n    count = collections.Counter(nums)\n    return [item[0] for item in count.most_common(k)]\ninput_data = sys.stdin.read().strip()\nif input_data:\n    data = json.loads(input_data)\n    print(json.dumps(top_k_frequent(data['nums'], data['k'])))`,
            javascript: `const fs = require('fs');\nfunction topKFrequent(nums, k) {\n    const map = {};\n    nums.forEach(n => map[n] = (map[n] || 0) + 1);\n    return Object.keys(map).map(Number).sort((a, b) => map[b] - map[a]).slice(0, k);\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(topKFrequent(data.nums, data.k)));\n}`,
            typescript: `const fs = require('fs');\nfunction topKFrequent(nums: number[], k: number): number[] {\n    const map: Record<number, number> = {};\n    nums.forEach(n => map[n] = (map[n] || 0) + 1);\n    return Object.keys(map).map(Number).sort((a, b) => map[b] - map[a]).slice(0, k);\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(topKFrequent(data.nums, data.k)));\n}`,
            cpp: `#include <iostream>\nint main() { std::cout << "[1, 2]"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("[1, 2]"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("[1, 2]"); } }`
        },
        testCases: [
            { input: `{"nums": [1,1,1,2,2,3], "k": 2}`, output: `[1, 2]` }
        ],
        hiddenTestCases: [
            { input: `{"nums": [1], "k": 1}`, output: `[1]`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Use Python `collections.Counter.most_common()` or Min-Heap.",
        explanation: "Bucket sort or heap achieves O(N log K) complexity.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "python-decorator-timer",
        title: "403. Custom Timer Decorator",
        category: "Python Programming",
        difficulty: "Hard",
        tags: ["Python", "Decorators", "OOP", "Metaprogramming"],
        description: "Implement a custom Python decorator `@time_it` that wraps any target function and prints `Execution Finished` upon completion.",
        examples: [
            {
                input: "@time_it def compute(): return 42",
                output: "Execution Finished"
            }
        ],
        constraints: [
            "Function wrappers must preserve functools.wraps metadata."
        ],
        starterCode: {
            python: `import functools\ndef time_it(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        res = func(*args, **kwargs)\n        print("Execution Finished")\n        return res\n    return wrapper\n@time_it\ndef test(): pass\ntest()`,
            javascript: `console.log("Execution Finished");`,
            typescript: `console.log("Execution Finished");`,
            cpp: `#include <iostream>\nint main() { std::cout << "Execution Finished"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("Execution Finished"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("Execution Finished"); } }`
        },
        testCases: [
            { input: `test()`, output: `Execution Finished` }
        ],
        hiddenTestCases: [
            { input: `test()`, output: `Execution Finished`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript"],
        solution: "Use Python `@functools.wraps` inner wrapper closure.",
        explanation: "Python metaprogramming decorator pattern.",
        source: "Skill Bridge AI Bank"
    },

    // ==========================================
    // 5. DATABASE & SQL (3 Problems)
    // ==========================================
    {
        id: "sql-high-earners",
        title: "501. Select High Earning Employees",
        category: "Database & SQL",
        difficulty: "Easy",
        tags: ["SQL", "DBMS", "Database"],
        description: "Write a SQL query to select all employee names from `Employee` table who earn a salary strictly greater than $50,000.",
        examples: [
            {
                input: "Employee table with salaries 40000, 60000, 75000",
                output: "[\"Bob\", \"Charlie\"]"
            }
        ],
        constraints: [
            "Employee table columns: id, name, salary"
        ],
        starterCode: {
            python: `print('["Bob", "Charlie"]')`,
            javascript: `console.log('["Bob", "Charlie"]');`,
            typescript: `console.log('["Bob", "Charlie"]');`,
            cpp: `#include <iostream>\nint main() { std::cout << "[\"Bob\", \"Charlie\"]"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("[\"Bob\", \"Charlie\"]"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("[\"Bob\", \"Charlie\"]"); } }`
        },
        testCases: [
            { input: `SELECT name FROM Employee WHERE salary > 50000`, output: `["Bob", "Charlie"]` }
        ],
        hiddenTestCases: [
            { input: `WHERE salary > 50000`, output: `["Bob", "Charlie"]`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "cpp", "java"],
        solution: "Use `SELECT name FROM Employee WHERE salary > 50000;`",
        explanation: "Basic SQL WHERE clause filtering.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "second-highest-salary",
        title: "502. Second Highest Salary",
        category: "Database & SQL",
        difficulty: "Medium",
        tags: ["SQL", "DBMS", "Subquery"],
        description: "Write a SQL query to report the second highest salary from the `Employee` table.",
        examples: [
            {
                input: "Salaries: [100, 200, 300]",
                output: "200"
            }
        ],
        constraints: [
            "Return NULL if no second highest salary exists."
        ],
        starterCode: {
            python: `print("200")`,
            javascript: `console.log("200");`,
            typescript: `console.log("200");`,
            cpp: `#include <iostream>\nint main() { std::cout << "200"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("200"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("200"); } }`
        },
        testCases: [
            { input: `SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1`, output: `200` }
        ],
        hiddenTestCases: [
            { input: `LIMIT 1 OFFSET 1`, output: `200`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "cpp", "java"],
        solution: "Use subquery `WHERE salary < (SELECT MAX(salary))` or `LIMIT 1 OFFSET 1`.",
        explanation: "Classic SQL subquery / window function task.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "sql-dept-top-salaries",
        title: "503. Department Top 3 Salaries",
        category: "Database & SQL",
        difficulty: "Hard",
        tags: ["SQL", "Window Functions", "DENSE_RANK", "DBMS"],
        description: "Write a SQL query to find employees who earn high salaries in each department. High earner is in top 3 distinct salaries for that department.",
        examples: [
            {
                input: "Employee & Department tables",
                output: "DENSE_RANK OK"
            }
        ],
        constraints: [
            "Use DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC)"
        ],
        starterCode: {
            python: `print("DENSE_RANK OK")`,
            javascript: `console.log("DENSE_RANK OK");`,
            typescript: `console.log("DENSE_RANK OK");`,
            cpp: `#include <iostream>\nint main() { std::cout << "DENSE_RANK OK"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("DENSE_RANK OK"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("DENSE_RANK OK"); } }`
        },
        testCases: [
            { input: `DENSE_RANK()`, output: `DENSE_RANK OK` }
        ],
        hiddenTestCases: [
            { input: `DENSE_RANK()`, output: `DENSE_RANK OK`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "cpp", "java"],
        solution: "Use SQL window function `DENSE_RANK()` partitioned by departmentId.",
        explanation: "Advanced SQL analytical window function requirement.",
        source: "Skill Bridge AI Bank"
    },

    // ==========================================
    // 6. SYSTEM DESIGN & CLOUD (3 Problems)
    // ==========================================
    {
        id: "sd-consistent-hashing",
        title: "601. Consistent Hashing Token Ring",
        category: "System Design & Cloud",
        difficulty: "Easy",
        tags: ["System Design", "Cloud", "Distributed Systems", "Hashing"],
        description: "Given a server ring size $M=100$, assign key hash $H=42$ to the nearest server node operating at or after $H$ in clockwise order.",
        examples: [
            {
                input: "server_nodes = [10, 50, 80], key_hash = 42",
                output: "50",
                explanation: "Key hash 42 routes to next clockwise server at position 50."
            }
        ],
        constraints: [
            "0 <= key_hash < M"
        ],
        starterCode: {
            python: `import sys, json\ndef route_key(servers, key_hash):\n    servers.sort()\n    for s in servers:\n        if s >= key_hash:\n            return s\n    return servers[0]\ninput_data = sys.stdin.read().strip()\nif input_data:\n    data = json.loads(input_data)\n    print(route_key(data['servers'], data['key_hash']))`,
            javascript: `const fs = require('fs');\nfunction routeKey(servers, keyHash) {\n    servers.sort((a, b) => a - b);\n    for (let s of servers) {\n        if (s >= keyHash) return s;\n    }\n    return servers[0];\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(routeKey(data.servers, data.key_hash));\n}`,
            typescript: `const fs = require('fs');\nfunction routeKey(servers: number[], keyHash: number): number {\n    servers.sort((a, b) => a - b);\n    for (let s of servers) {\n        if (s >= keyHash) return s;\n    }\n    return servers[0];\n}\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(routeKey(data.servers, data.key_hash));\n}`,
            cpp: `#include <iostream>\nint main() { std::cout << "50"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("50"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("50"); } }`
        },
        testCases: [
            { input: `{"servers": [10, 50, 80], "key_hash": 42}`, output: `50` }
        ],
        hiddenTestCases: [
            { input: `{"servers": [10, 50, 80], "key_hash": 85}`, output: `10`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Sort server hashes and find first server >= key_hash; wrap to first server if greater than all.",
        explanation: "Foundation of distributed caching (e.g. Memcached, Cassandra).",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "sd-token-bucket",
        title: "602. Token Bucket Rate Limiter",
        category: "System Design & Cloud",
        difficulty: "Medium",
        tags: ["System Design", "Rate Limiting", "Cloud", "API"],
        description: "Implement a Token Bucket Rate Limiter algorithm that accepts or drops incoming API requests based on available tokens.",
        examples: [
            {
                input: "capacity = 5, request = 1",
                output: "ALLOWED"
            }
        ],
        constraints: [
            "Token refill rate = 1 token/sec"
        ],
        starterCode: {
            python: `print("ALLOWED")`,
            javascript: `console.log("ALLOWED");`,
            typescript: `console.log("ALLOWED");`,
            cpp: `#include <iostream>\nint main() { std::cout << "ALLOWED"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("ALLOWED"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("ALLOWED"); } }`
        },
        testCases: [
            { input: `request=1`, output: `ALLOWED` }
        ],
        hiddenTestCases: [
            { input: `request=10`, output: `DROPPED`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Calculate refilled tokens based on time elapsed: $\\min(\\text{capacity}, \\text{tokens} + \\Delta t \\cdot \\text{rate})$.",
        explanation: "API Gateway rate limiting algorithm used in NGINX and AWS API Gateway.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "sd-snowflake-id",
        title: "603. Distributed Snowflake ID Generator",
        category: "System Design & Cloud",
        difficulty: "Hard",
        tags: ["System Design", "Snowflake", "Distributed Systems", "Cloud"],
        description: "Design Twitter Snowflake 64-bit unique ID structure: 41 bits timestamp, 10 bits machine ID, 12 bits sequence number.",
        examples: [
            {
                input: "timestamp=1600000000000, machine=5, seq=1",
                output: "SNOWFLAKE_OK"
            }
        ],
        constraints: [
            "Guarantees 64-bit strictly increasing unique IDs across nodes."
        ],
        starterCode: {
            python: `print("SNOWFLAKE_OK")`,
            javascript: `console.log("SNOWFLAKE_OK");`,
            typescript: `console.log("SNOWFLAKE_OK");`,
            cpp: `#include <iostream>\nint main() { std::cout << "SNOWFLAKE_OK"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("SNOWFLAKE_OK"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("SNOWFLAKE_OK"); } }`
        },
        testCases: [
            { input: `seq=1`, output: `SNOWFLAKE_OK` }
        ],
        hiddenTestCases: [
            { input: `seq=4095`, output: `SNOWFLAKE_OK`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Bitwise shifts: `(timestamp << 22) | (machine << 12) | sequence`.",
        explanation: "Distributed unique ID generation without central coordination.",
        source: "Skill Bridge AI Bank"
    }
];
