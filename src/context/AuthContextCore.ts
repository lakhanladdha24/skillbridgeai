import { createContext } from 'react';
import { User } from '../types/user';

export interface AuthContextType {
    user: User | null;
    signInWithEmail: (email: string, password?: string) => Promise<void>;
    signUp: (name: string, email: string, password?: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
    updateSkills: (skills: { name: string; level: string }[]) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
