import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, UserProfile } from '../lib/database';

// Define the User type
export interface User extends UserProfile {}

// Define the context state
interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password?: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
    updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount, check if there's a saved user in localStorage to "remember" them
    useEffect(() => {
        const savedUserId = localStorage.getItem('skillbridge_user_id');
        if (savedUserId) {
            const profile = db.getUser(savedUserId);
            if (profile) {
                setUser(profile);
            }
        }
        setIsLoading(false);
    }, []);

    const signInWithGoogle = async () => {
        setIsLoading(true);
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const userId = 'g_default_user'; // For demo, use a fixed ID or generate one
        let profile = db.getUser(userId);
        
        if (!profile) {
            profile = {
                id: userId,
                email: 'user@gmail.com',
                name: 'Google User',
                level: 5,
                skills: ['1', '2'],
                completedMilestones: [],
                progress: { '1': 85, '2': 70 }
            };
            db.saveUser(profile);
        }

        setUser(profile);
        localStorage.setItem('skillbridge_user_id', profile.id);
        setIsLoading(false);
    };

    const signInWithEmail = async (email: string) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const namePart = email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const userId = 'e_' + namePart;

        let profile = db.getUser(userId);

        if (!profile) {
            profile = {
                id: userId,
                email: email,
                name: formattedName,
                level: 1,
                skills: [],
                completedMilestones: [],
                progress: {}
            };
            db.saveUser(profile);
        }

        setUser(profile);
        localStorage.setItem('skillbridge_user_id', profile.id);
        setIsLoading(false);
    };

    const signOut = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 400));
        setUser(null);
        localStorage.removeItem('skillbridge_user_id');
        setIsLoading(false);
    };

    const updateProfile = (updates: Partial<UserProfile>) => {
        if (user) {
            const newProfile = { ...user, ...updates };
            setUser(newProfile);
            db.updateUser(user.id, updates);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signInWithEmail, signOut, isLoading, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
