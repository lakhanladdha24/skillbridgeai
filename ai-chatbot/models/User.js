const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photoURL: String,
    
    // User Skills (Self-assessed during onboarding)
    technicalSkills: [{
        name: String,
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' }
    }],
    
    // Progress for Career Path
    selectedCareerPath: String,
    completedMilestones: [String],
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
