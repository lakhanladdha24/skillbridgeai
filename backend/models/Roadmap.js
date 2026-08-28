import mongoose from 'mongoose';

const RoadmapSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    goal: { type: String, required: true },
    targetRole: String,
    estimatedDuration: String,
    studyTimeDaily: String,
    completionPercentage: { type: Number, default: 0 },
    phases: [{
        phaseId: String,
        title: String,
        description: String,
        topics: [{
            topicId: String,
            title: String,
            description: String,
            difficulty: String,
            estimatedHours: Number,
            completed: { type: Boolean, default: false },
            prerequisites: [String],
            studyNotes: {
                definition: String,
                explanation: String,
                keyConcepts: [String],
                codeExample: String,
                flowchart: String,
                formulas: [String]
            },
            videos: [{
                title: String,
                creator: String,
                url: String,
                duration: String,
                difficulty: String,
                score: Number,
                isFree: { type: Boolean, default: true },
                summary: String
            }],
            practiceQuestions: [{
                question: String,
                options: [String],
                correctAnswer: String,
                explanation: String
            }],
            codingProblemId: String
        }]
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);
export default Roadmap;
