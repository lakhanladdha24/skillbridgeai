import mongoose from 'mongoose';

const VideoProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    topicId: { type: String, required: true },
    videoId: { type: String, required: true },
    videoTitle: { type: String },
    watchProgress: { type: Number, default: 0 }, // 0 to 100
    durationSeconds: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    lastWatchedAt: { type: Date, default: Date.now }
});

VideoProgressSchema.index({ userId: 1, courseId: 1, topicId: 1, videoId: 1 }, { unique: true });

const VideoProgress = mongoose.models.VideoProgress || mongoose.model('VideoProgress', VideoProgressSchema);
export default VideoProgress;
