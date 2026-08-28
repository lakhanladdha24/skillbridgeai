import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photoURL: String,
    
    // User Skills & Assessment Profile
    technicalSkills: [{
        name: String,
        level: { type: String, enum: ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Professional'], default: 'Beginner' },
        score: { type: Number, default: 0 }
    }],
    
    // Progress for Career Path & Roadmaps
    selectedCareerPath: String,
    completedMilestones: [String],
    activeRoadmapId: String,
    
    // Coding Platform Stats
    codingStats: {
        solvedProblems: [String], // Array of problem IDs solved
        easyCount: { type: Number, default: 0 },
        mediumCount: { type: Number, default: 0 },
        hardCount: { type: Number, default: 0 },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastSubmissionDate: Date,
        languagesUsed: [String]
    },
    
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
