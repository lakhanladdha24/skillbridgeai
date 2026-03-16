export interface UserProfile {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    level: number;
    skills: string[];
    completedMilestones: string[];
    targetRole?: string;
    progress: Record<string, number>; // skillId -> percentage
}

const STORAGE_KEY = 'skillbridge_db';

class Database {
    private data: {
        users: Record<string, UserProfile>;
    } = { users: {} };

    constructor() {
        this.load();
    }

    private load() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                this.data = JSON.parse(saved);
            } catch (e) {
                console.error("Failed to load DB", e);
            }
        }
    }

    private save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }

    getUser(id: string): UserProfile | null {
        return this.data.users[id] || null;
    }

    saveUser(user: UserProfile) {
        this.data.users[user.id] = user;
        this.save();
    }

    updateUser(id: string, updates: Partial<UserProfile>) {
        if (this.data.users[id]) {
            this.data.users[id] = { ...this.data.users[id], ...updates };
            this.save();
        }
    }

    addSkill(userId: string, skillId: string) {
        const user = this.getUser(userId);
        if (user && !user.skills.includes(skillId)) {
            user.skills.push(skillId);
            this.save();
        }
    }

    completeMilestone(userId: string, milestoneId: string) {
        const user = this.getUser(userId);
        if (user && !user.completedMilestones.includes(milestoneId)) {
            user.completedMilestones.push(milestoneId);
            this.save();
        }
    }
}

export const db = new Database();
