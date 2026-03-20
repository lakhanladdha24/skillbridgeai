import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBackendURL } from '../lib/api';

export interface User {
    id: string;
    email: string;
    name: string;
    skills?: { name: string; level: string }[];
    photoURL?: string;
}

interface AuthContextType {
    user: User | null;
    signInWithEmail: (email: string, password?: string) => Promise<void>;
    signUp: (name: string, email: string, password?: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
    updateSkills: (skills: { name: string; level: string }[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('sb_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const getApiBase = () => {
        const url = getBackendURL();
        return url.replace('/api/chat', '/api');
    };

    const signUp = async (name: string, email: string, password?: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${getApiBase()}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password: password || 'default123' }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            
            saveSession(data.user, data.token);
        } catch (err: any) {
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithEmail = async (email: string, password?: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${getApiBase()}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: password || 'default123' }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            
            saveSession(data.user, data.token);
        } catch (err: any) {
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateSkills = async (skills: { name: string; level: string }[]) => {
        if (!user) return;
        try {
            const response = await fetch(`${getApiBase()}/user/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, skills }),
            });
            if (!response.ok) throw new Error('Failed to update skills');
            
            const updatedUser = { ...user, skills };
            setUser(updatedUser);
            localStorage.setItem('sb_user', JSON.stringify(updatedUser));
        } catch (err) {
            console.error(err);
        }
    };

    const saveSession = (userData: any, token: string) => {
        const profile = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            skills: userData.skills || []
        };
        setUser(profile);
        localStorage.setItem('sb_user', JSON.stringify(profile));
        localStorage.setItem('sb_token', token);
    };

    const signOut = async () => {
        setUser(null);
        localStorage.removeItem('sb_user');
        localStorage.removeItem('sb_token');
    };

    return (
        <AuthContext.Provider value={{ user, signInWithEmail, signUp, signOut, isLoading, updateSkills }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
