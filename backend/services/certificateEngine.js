import crypto from 'crypto';
import mongoose from 'mongoose';
import Certificate from '../models/Certificate.js';
import VideoProgress from '../models/VideoProgress.js';

// In-memory Fallback Store for offline DB mode
const memoryCertificates = new Map();
const memoryProgress = new Map();

/**
 * Unique Certificate ID Generator
 * Format: SBAI-{COURSE_CODE}-{8_CHAR_HEX}
 * Example: SBAI-ML-7F4A92D1
 */
export function generateCertificateId(courseName = 'Skill') {
    const cleanCode = courseName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 4) || 'SKILL';
    
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `SBAI-${cleanCode}-${randomHex}`;
}

/**
 * Check Course Completion Server-Side
 * Prevents false completion claims by calculating true watch progress & topic status.
 */
export async function checkCourseCompletion(userId, courseId, totalTopics = 5) {
    const isDbConnected = mongoose.connection.readyState === 1;

    let completedVideosCount = 0;
    let completedTopicsCount = 0;

    if (isDbConnected && userId && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
        try {
            const records = await VideoProgress.find({ userId, courseId });
            completedVideosCount = records.filter(r => r.completed || r.watchProgress >= 90).length;
            
            // Distinct topic completion count
            const completedTopicIds = new Set(records.filter(r => r.completed || r.watchProgress >= 90).map(r => r.topicId));
            completedTopicsCount = completedTopicIds.size;
        } catch (e) {
            console.error('Error fetching VideoProgress from DB:', e.message);
        }
    } else {
        // Fallback to local memory progress
        const userProgress = memoryProgress.get(`${userId}_${courseId}`) || [];
        completedVideosCount = userProgress.filter(p => p.completed || p.watchProgress >= 90).length;
        const completedTopicIds = new Set(userProgress.filter(p => p.completed || p.watchProgress >= 90).map(p => p.topicId));
        completedTopicsCount = completedTopicIds.size;
    }

    const calculatedProgress = Math.min(100, Math.round((completedTopicsCount / Math.max(totalTopics, 1)) * 100));
    const isCompleted = calculatedProgress >= 100 || (completedTopicsCount >= totalTopics && totalTopics > 0);

    return {
        userId,
        courseId,
        completedTopicsCount,
        totalTopics,
        completedVideosCount,
        progressPercentage: calculatedProgress,
        courseCompleted: isCompleted
    };
}

/**
 * Save Video Watch Progress
 */
export async function updateVideoProgress({ userId, courseId, topicId, videoId, videoTitle = '', watchProgress = 0, durationSeconds = 0 }) {
    const completionThreshold = 90; // Configurable threshold (90%)
    const isCompleted = watchProgress >= completionThreshold;

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && userId && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
        try {
            const updated = await VideoProgress.findOneAndUpdate(
                { userId, courseId, topicId, videoId },
                {
                    $set: {
                        videoTitle,
                        watchProgress: Math.min(100, Math.max(0, watchProgress)),
                        durationSeconds,
                        lastWatchedAt: new Date()
                    },
                    $setOnInsert: { startedAt: new Date() },
                    ...(isCompleted ? { completed: true, completedAt: new Date() } : {})
                },
                { upsert: true, new: true }
            );
            return updated;
        } catch (e) {
            console.error('Error saving VideoProgress to DB:', e.message);
        }
    }

    // Local Fallback Storage
    const key = `${userId}_${courseId}`;
    const list = memoryProgress.get(key) || [];
    const idx = list.findIndex(p => p.topicId === topicId && p.videoId === videoId);

    const record = {
        userId,
        courseId,
        topicId,
        videoId,
        videoTitle,
        watchProgress: Math.min(100, Math.max(0, watchProgress)),
        durationSeconds,
        completed: isCompleted,
        lastWatchedAt: new Date().toISOString()
    };

    if (idx >= 0) {
        list[idx] = { ...list[idx], ...record };
    } else {
        list.push(record);
    }
    memoryProgress.set(key, list);
    return record;
}

/**
 * Get Video Progress for Course
 */
export async function getCourseProgress(userId, courseId) {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && userId && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
        try {
            return await VideoProgress.find({ userId, courseId });
        } catch (e) {
            console.error('Error fetching progress:', e.message);
        }
    }

    return memoryProgress.get(`${userId}_${courseId}`) || [];
}

/**
 * Generate Certificate (Idempotent)
 */
export async function generateCertificateForUser({ userId, userName, courseId, courseName }) {
    if (!userId || !courseId || !courseName) {
        throw new Error('userId, courseId, and courseName are required');
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    // 1. Check if Certificate already exists (IDEMPOTENCY CHECK)
    if (isDbConnected && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
        try {
            const existing = await Certificate.findOne({ userId, courseId });
            if (existing) {
                return existing;
            }
        } catch (e) {
            console.error('Error checking existing certificate in DB:', e.message);
        }
    } else {
        const memKey = `${userId}_${courseId}`;
        if (memoryCertificates.has(memKey)) {
            return memoryCertificates.get(memKey);
        }
    }

    // 2. Generate New Certificate Data
    const certId = generateCertificateId(courseName);
    const issueDateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const verificationToken = crypto.randomBytes(16).toString('hex');

    const certData = {
        certificateId: certId,
        userId,
        userName: userName || 'Skill Bridge AI Graduate',
        courseId,
        courseName,
        issuedAt: new Date(),
        completionDate: issueDateStr,
        verificationToken,
        certificateFileUrl: `/verify/${certId}`,
        status: 'VALID',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    // 3. Save to DB or Memory
    if (isDbConnected && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
        try {
            const doc = new Certificate(certData);
            await doc.save();
            return doc;
        } catch (e) {
            console.error('Error saving Certificate to DB:', e.message);
        }
    }

    // Memory Store Fallback
    const memKey = `${userId}_${courseId}`;
    memoryCertificates.set(memKey, certData);
    memoryCertificates.set(certId, certData); // index by certId as well
    return certData;
}

/**
 * Verify Certificate by certificateId (Public API)
 */
export async function getCertificateById(certificateId) {
    if (!certificateId) return null;

    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
        try {
            const cert = await Certificate.findOne({ certificateId });
            if (cert) return cert;
        } catch (e) {
            console.error('Error fetching certificate:', e.message);
        }
    }

    // Memory Fallback Search
    if (memoryCertificates.has(certificateId)) {
        return memoryCertificates.get(certificateId);
    }

    for (const cert of memoryCertificates.values()) {
        if (cert.certificateId === certificateId) return cert;
    }

    return null;
}

/**
 * Fetch All Certificates for User
 */
export async function getUserCertificates(userId) {
    if (!userId) return [];

    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
        try {
            return await Certificate.find({ userId }).sort({ issuedAt: -1 });
        } catch (e) {
            console.error('Error fetching user certificates:', e.message);
        }
    }

    const certs = [];
    for (const cert of memoryCertificates.values()) {
        if (cert.userId === userId) {
            certs.push(cert);
        }
    }
    return certs;
}
