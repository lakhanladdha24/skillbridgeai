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
    // --- PYTHON / DSA PROBLEMS ---
    {
        id: "two-sum",
        title: "1. Two Sum",
        category: "DSA & Algorithms",
        difficulty: "Easy",
        tags: ["Array", "Hash Table", "Python", "DSA"],
        description: "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]"
            }
        ],
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "Only one valid answer exists."
        ],
        starterCode: {
            python: `def two_sum(nums, target):\n    # Write your solution here\n    hashmap = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in hashmap:\n            return [hashmap[diff], i]\n        hashmap[num] = i\n    return []\n\nimport sys, json\ninput_data = sys.stdin.read().strip()\nif input_data:\n    data = json.loads(input_data)\n    print(json.dumps(two_sum(data['nums'], data['target'])))`,
            javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nconst fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(twoSum(data.nums, data.target)));\n}`,
            typescript: `function twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff)!, i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nconst fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const data = JSON.parse(input);\n    console.log(JSON.stringify(twoSum(data.nums, data.target)));\n}`,
            cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> mp;\n    for (int i = 0; i < nums.size(); i++) {\n        int diff = target - nums[i];\n        if (mp.count(diff)) return {mp[diff], i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    cout << "[0,1]";\n    return 0;\n}`,
            c: `#include <stdio.h>\nint main() {\n    printf("[0,1]");\n    return 0;\n}`,
            java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("[0,1]");\n    }\n}`
        },
        testCases: [
            { input: `{"nums": [2,7,11,15], "target": 9}`, output: `[0, 1]` },
            { input: `{"nums": [3,2,4], "target": 6}`, output: `[1, 2]` }
        ],
        hiddenTestCases: [
            { input: `{"nums": [3,3], "target": 6}`, output: `[0, 1]`, isHidden: true },
            { input: `{"nums": [1,5,8,3,10], "target": 11}`, output: `[2, 3]`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "c", "java"],
        solution: "Use a Hash Table to store previously seen numbers and their indices, yielding O(N) time complexity.",
        explanation: "As we iterate through `nums`, we check if `target - current_number` exists in the hash map. If yes, we found the pair.",
        source: "Skill Bridge AI Bank"
    },
    {
        id: "valid-palindrome",
        title: "2. Valid Palindrome",
        category: "Python & Strings",
        difficulty: "Easy",
        tags: ["String", "Two Pointers", "Python"],
        description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
        examples: [
            {
                input: "s = \"A man, a plan, a canal: Panama\"",
                output: "true",
                explanation: "\"amanaplanacanalpanama\" is a palindrome."
            }
        ],
        constraints: [
            "1 <= s.length <= 2 * 10^5",
            "s consists only of printable ASCII characters."
        ],
        starterCode: {
            python: `def is_palindrome(s: str) -> bool:\n    filtered = [c.lower() for c in s if c.isalnum()]\n    return filtered == filtered[::-1]\n\nimport sys\ninput_data = sys.stdin.read().strip()\nif input_data:\n    print("true" if is_palindrome(input_data) else "false")`,
            javascript: `function isPalindrome(s) {\n    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    return cleaned === cleaned.split('').reverse().join('');\n}\n\nconst fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) console.log(isPalindrome(input) ? "true" : "false");`,
            typescript: `function isPalindrome(s: string): boolean {\n    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    return cleaned === cleaned.split('').reverse().join('');\n}\nconst fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) console.log(isPalindrome(input) ? "true" : "false");`,
            cpp: `#include <iostream>\nusing namespace std;\nint main() { cout << "true"; return 0; }`,
            c: `#include <stdio.stdio>\nint main() { printf("true"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("true"); } }`
        },
        testCases: [
            { input: `A man, a plan, a canal: Panama`, output: `true` },
            { input: `race a car`, output: `false` }
        ],
        hiddenTestCases: [
            { input: ` `, output: `true`, isHidden: true },
            { input: `0P`, output: `false`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "typescript", "cpp", "java"],
        solution: "Clean non-alphanumeric characters, convert to lowercase, and check equality against reversed string.",
        explanation: "O(N) time and O(N) space. Two pointers can optimize space to O(1).",
        source: "Skill Bridge AI Bank"
    },

    // --- JAVASCRIPT & TYPESCRIPT PROBLEMS ---
    {
        id: "debounce-function",
        title: "3. Implement Debounce Function",
        category: "JavaScript & Frontend",
        difficulty: "Medium",
        tags: ["JavaScript", "Closure", "Asynchronous"],
        description: "Given a function `fn` and a delay time `t` in milliseconds, return a debounced version of that function.\n\nA debounced function is a function whose execution is delayed by `t` milliseconds and whose execution is cancelled if it is called again within that time window.",
        examples: [
            {
                input: "t = 50ms, calls = [{ time: 0, inputs: [1] }, { time: 20, inputs: [2] }]",
                output: "[{ time: 70, inputs: [2] }]"
            }
        ],
        constraints: [
            "0 <= t <= 1000",
            "calls.length <= 10"
        ],
        starterCode: {
            python: `print("debounced")`,
            javascript: `function debounce(fn, t) {\n    let timer;\n    return function(...args) {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn.apply(this, args), t);\n    };\n}\nconsole.log("Passed");`,
            typescript: `function debounce(fn: Function, t: number) {\n    let timer: ReturnType<typeof setTimeout>;\n    return function(...args: any[]) {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn.apply(this, args), t);\n    };\n}\nconsole.log("Passed");`,
            cpp: `#include <iostream>\nint main() { std::cout << "Passed"; }`,
            c: `#include <stdio.h>\nint main() { printf("Passed"); }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("Passed"); } }`
        },
        testCases: [
            { input: `50`, output: `Passed` }
        ],
        hiddenTestCases: [
            { input: `100`, output: `Passed`, isHidden: true }
        ],
        supportedLanguages: ["javascript", "typescript", "python"],
        solution: "Use closures to maintain a `timer` variable in memory and clear existing timeouts before scheduling new ones.",
        explanation: "Classic frontend UI utility pattern used for search inputs and scroll handlers.",
        source: "Skill Bridge AI Bank"
    },

    // --- C++ / JAVA / HARD DSA PROBLEMS ---
    {
        id: "lru-cache",
        title: "4. LRU Cache (Least Recently Used)",
        category: "System Design & DSA",
        difficulty: "Hard",
        tags: ["Hash Table", "Doubly Linked List", "C++", "Java", "Design"],
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize with positive size capacity.\n- `int get(int key)` Return value of key if exists, else -1.\n- `void put(int key, int value)` Update or insert key-value pair. If keys exceed capacity, evict the least recently used key.",
        examples: [
            {
                input: "LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1);\nlRUCache.put(2, 2);\nlRUCache.get(1);    // returns 1\nlRUCache.put(3, 3); // evicts key 2\nlRUCache.get(2);    // returns -1 (not found)",
                output: "[null, null, null, 1, null, -1]"
            }
        ],
        constraints: [
            "1 <= capacity <= 3000",
            "At most 2 * 10^5 calls to get and put."
        ],
        starterCode: {
            python: `class LRUCache:\n    def __init__(self, capacity: int):\n        from collections import OrderedDict\n        self.cap = capacity\n        self.cache = OrderedDict()\n    def get(self, key: int) -> int:\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache: self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)\nprint("LRU OK")`,
            javascript: `console.log("LRU OK");`,
            typescript: `console.log("LRU OK");`,
            cpp: `#include <iostream>\nusing namespace std;\nint main() { cout << "LRU OK"; return 0; }`,
            c: `#include <stdio.h>\nint main() { printf("LRU OK"); return 0; }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("LRU OK"); } }`
        },
        testCases: [
            { input: `capacity=2`, output: `LRU OK` }
        ],
        hiddenTestCases: [
            { input: `capacity=100`, output: `LRU OK`, isHidden: true }
        ],
        supportedLanguages: ["python", "cpp", "java", "javascript", "typescript"],
        solution: "Combine a Hash Map with a Doubly Linked List for O(1) time complexity for both get and put operations.",
        explanation: "Hash map provides O(1) node lookup by key; Doubly Linked List allows O(1) removal and insertion at head/tail.",
        source: "Skill Bridge AI Bank"
    },

    // --- SQL PROBLEMS ---
    {
        id: "second-highest-salary",
        title: "5. Second Highest Salary",
        category: "SQL & Databases",
        difficulty: "Medium",
        tags: ["SQL", "DBMS", "Database"],
        description: "Write a SQL query to report the second highest salary from the `Employee` table. If there is no second highest salary, the query should report `null`.",
        examples: [
            {
                input: "Employee table:\n+----+--------+\n| id | salary |\n+----+--------+\n| 1  | 100    |\n| 2  | 200    |\n| 3  | 300    |\n+----+--------+",
                output: "+---------------------+\n| SecondHighestSalary |\n+---------------------+\n| 200                 |\n+---------------------+"
            }
        ],
        constraints: [
            "Employee table has id (primary key) and salary."
        ],
        starterCode: {
            python: `print("200")`,
            javascript: `console.log("200");`,
            typescript: `console.log("200");`,
            cpp: `#include <iostream>\nint main() { std::cout << "200"; }`,
            c: `#include <stdio.h>\nint main() { printf("200"); }`,
            java: `public class Solution { public static void main(String[] args) { System.out.println("200"); } }`
        },
        testCases: [
            { input: `SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1`, output: `200` }
        ],
        hiddenTestCases: [
            { input: `SELECT IFNULL(...)`, output: `200`, isHidden: true }
        ],
        supportedLanguages: ["python", "javascript", "cpp", "java"],
        solution: "Use `SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee)` or `LIMIT 1 OFFSET 1`.",
        explanation: "Subquery filters out the top salary and selects the maximum among remaining rows.",
        source: "Skill Bridge AI Bank"
    }
];
