import mongoose from 'mongoose';

const ProblemSchema = new mongoose.Schema({
    problemId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    category: { type: String, required: true },
    tags: [String],
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    constraints: [String],
    starterCode: {
        python: String,
        javascript: String,
        typescript: String,
        cpp: String,
        c: String,
        java: String
    },
    testCases: [{
        input: String,
        output: String,
        isHidden: { type: Boolean, default: false }
    }],
    supportedLanguages: [String],
    solution: String,
    explanation: String,
    source: { type: String, default: 'Skill Bridge AI Bank' },
    createdAt: { type: Date, default: Date.now }
});

const Problem = mongoose.models.Problem || mongoose.model('Problem', ProblemSchema);
export default Problem;
