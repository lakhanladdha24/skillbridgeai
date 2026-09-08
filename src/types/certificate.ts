export interface Certificate {
    certificateId: string;
    userId: string;
    courseId: string;
    courseName: string;
    userName: string;
    issuedAt: string;
    completionDate: string;
    verificationToken?: string;
    certificateFileUrl?: string;
    status: 'VALID' | 'REVOKED' | 'EXPIRED';
}

export interface VideoProgress {
    userId: string;
    courseId: string;
    topicId: string;
    videoId: string;
    videoTitle?: string;
    watchProgress: number; // 0 to 100
    durationSeconds?: number;
    completed: boolean;
    lastWatchedAt?: string;
}

export interface VideoResource {
    videoId: string;
    title: string;
    creator: string;
    embedUrl: string;
    url: string;
    duration?: string;
    score?: string;
    ratingText?: string;
    isFree?: boolean;
    summary?: string;
    thumbnail?: string;
}
