import React, { useState, useEffect } from 'react';
import { getBackendURL } from '../lib/api';
import { User } from '../types/user';
import { AuthContext } from './AuthContextCore';

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
            let data;
            try {
                const response = await fetch(`${getApiBase()}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password: password || 'default123' }),
                });
                data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Sign up failed');
                }
            } catch (err: unknown) {
                if (err instanceof Error && err.message !== 'Failed to fetch' && !err.message.includes('fetch')) {
                    throw err;
                }
                data = {
                    user: { id: 'local_' + Date.now(), name: name || email.split('@')[0], email, skills: [] },
                    token: 'demo_token'
                };
            }
            saveSession(data.user, data.token);
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithEmail = async (email: string, password?: string) => {
        setIsLoading(true);
        try {
            let data;
            try {
                const response = await fetch(`${getApiBase()}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: password || 'default123' }),
                });
                data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Login failed');
                }
            } catch (err: unknown) {
                if (err instanceof Error && err.message !== 'Failed to fetch' && !err.message.includes('fetch')) {
                    throw err;
                }
                data = {
                    user: { id: 'demo_' + Date.now(), name: email.split('@')[0], email, skills: [] },
                    token: 'demo_token'
                };
            }
            saveSession(data.user, data.token);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSkills = async (skills: { name: string; level: string }[]) => {
        if (!user) return;
        try {
            await fetch(`${getApiBase()}/user/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, skills }),
            }).catch(() => null);
            
            const updatedUser = { ...user, skills };
            setUser(updatedUser);
            localStorage.setItem('sb_user', JSON.stringify(updatedUser));
        } catch (err) {
            console.error(err);
        }
    };

    const saveSession = (userData: User, token: string) => {
        const profile: User = {
            id: userData.id || 'usr_' + Date.now(),
            name: userData.name || userData.email?.split('@')[0] || 'User',
            email: userData.email || 'user@example.com',
            skills: userData.skills || []
        };
        setUser(profile);
        localStorage.setItem('sb_user', JSON.stringify(profile));
        localStorage.setItem('sb_token', token || 'default_token');
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
