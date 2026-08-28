import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    totalQuestions: { type: Number, default: 50 },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    incorrectAnswers: { type: Number, required: true },
    unattempted: { type: Number, required: true },
    timeSpentSeconds: { type: Number, default: 0 },
    
    categoryScores: [{
        category: String,
        score: Number,
        total: Number,
        percentage: Number
    }],
    
    difficultyPerformance: [{
        difficulty: String,
        score: Number,
        total: Number
    }],
    
    skillProfiles: [{
        skill: String,
        percentage: Number,
        level: String
    }],
    
    strongSkills: [String],
    weakSkills: [String],
    missingSkills: [String],
    recommendedSkills: [String]
});

const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);
export default Assessment;
