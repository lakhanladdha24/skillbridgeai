export interface CodingQuestion {
    id: string;
    title: string;
    description: string;
    category: 'AI' | 'Web Development' | 'Python' | 'DSA';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    initialCode: Record<string, string>; // language -> code
    testCases: { input: string; expected: string }[];
    solutionGuide: string;
}

export const codingQuestions: CodingQuestion[] = [
    {
        id: 'ai_1',
        title: 'Linear Regression Prediction',
        description: 'Implement the linear regression formula y = mx + b. Given the slope (m), intercept (b), and input (x), return the predicted value y.',
        category: 'AI',
        difficulty: 'Easy',
        initialCode: {
            javascript: "function predict(m, b, x) {\n  // your code here\n}",
            python: "def predict(m, b, x):\n    # your code here\n    pass"
        },
        testCases: [
            { input: "m=2, b=1, x=5", expected: "11" },
            { input: "m=3, b=2, x=10", expected: "32" }
        ],
        solutionGuide: "Multiply m by x and add b."
    },
    {
        id: 'ai_2',
        title: 'Sigmoid Function',
        description: 'Compute the sigmoid activation function: 1 / (1 + e^-x).',
        category: 'AI',
        difficulty: 'Medium',
        initialCode: {
            javascript: "function sigmoid(x) {\n  // Use Math.exp()\n}",
            python: "import math\ndef sigmoid(x):\n    # Use math.exp()\n    pass"
        },
        testCases: [
            { input: "x=0", expected: "0.5" }
        ],
        solutionGuide: "Use the exponential function to calculate the denominator."
    },
    {
        id: 'web_1',
        title: 'Reverse String',
        description: 'Write a function that takes a string and returns it reversed.',
        category: 'Web Development',
        difficulty: 'Easy',
        initialCode: {
            javascript: "function reverseString(str) {\n  // your code here\n}",
            python: "def reverse_string(s):\n    # your code here\n    pass"
        },
        testCases: [
            { input: "'Hello'", expected: "'olleH'" }
        ],
        solutionGuide: "In JS, you can split, reverse, and join."
    },
    {
        id: 'dsa_1',
        title: 'Reverse Array',
        description: 'Reverse the elements of an array in place or return a new reversed array.',
        category: 'DSA',
        difficulty: 'Easy',
        initialCode: {
            javascript: "function reverseArray(arr) {\n  // your code here\n}",
            python: "def reverse_array(arr):\n    # your code here\n    pass"
        },
        testCases: [
            { input: "[1,2,3]", expected: "[3,2,1]" }
        ],
        solutionGuide: "Swap elements from both ends or use built-in reverse functions."
    },
    {
        id: 'py_1',
        title: 'Factorial calculation',
        description: 'Find the factorial of a given number n.',
        category: 'Python',
        difficulty: 'Easy',
        initialCode: {
            javascript: "function factorial(n) {\n  // your code here\n}",
            python: "def factorial(n):\n    # your code here\n    pass"
        },
        testCases: [
            { input: "5", expected: "120" }
        ],
        solutionGuide: "Use recursion or a loop."
    },
    {
        id: 'dsa_2',
        title: 'Sum of Digits',
        description: 'Calculate the sum of the digits of a positive number n.',
        category: 'DSA',
        difficulty: 'Easy',
        initialCode: {
            javascript: "function sumDigits(n) {\n  // your code here\n}",
            python: "def sum_digits(n):\n    # your code here\n    pass"
        },
        testCases: [{ input: "123", expected: "6" }],
        solutionGuide: "Iterate through digits or use mathematical operators (/ and %)."
    },
    {
        id: 'web_2',
        title: 'Count Vowels',
        description: 'Count the number of vowels (a, e, i, o, u) in a given string.',
        category: 'Web Development',
        difficulty: 'Easy',
        initialCode: {
            javascript: "function countVowels(str) {\n  // your code here\n}",
            python: "def count_vowels(s):\n    # your code here\n    pass"
        },
        testCases: [{ input: "'SkillBridge'", expected: "3" }],
        solutionGuide: "Use regex or a simple loop to check each character."
    },
    {
        id: 'py_2',
        title: 'Even or Odd Checker',
        description: 'Given an integer n, return "Even" or "Odd".',
        category: 'Python',
        difficulty: 'Easy',
        initialCode: {
            javascript: "function checkEvenOdd(n) {\n  // your code here\n}",
            python: "def check_even_odd(n):\n    # your code here\n    pass"
        },
        testCases: [{ input: "7", expected: "Odd" }],
        solutionGuide: "Use the modulo (%) operator."
    }
];
