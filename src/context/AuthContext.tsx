import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the User type
export interface User {
    id: string;
    email: string;
    name: string;
    photoURL?: string;
}

// Define the context state
interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password?: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount, check if there's a saved user in localStorage to "remember" them
    useEffect(() => {
        const savedUser = localStorage.getItem('skillbridge_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("Failed to parse saved user", error);
            }
        }
        setIsLoading(false);
    }, []);

    const signInWithGoogle = async () => {
        setIsLoading(true);
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock Google user data
        const mockGoogleUser: User = {
            id: 'g_' + Math.random().toString(36).substr(2, 9),
            email: 'user@gmail.com',
            name: 'Google User',
            photoURL: 'https://ui-avatars.com/api/?name=Google+User&background=4F46E5&color=fff'
        };

        setUser(mockGoogleUser);
        localStorage.setItem('skillbridge_user', JSON.stringify(mockGoogleUser));
        setIsLoading(false);
    };

    const signInWithEmail = async (email: string) => {
        setIsLoading(true);
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock Email user data
        const namePart = email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        const mockEmailUser: User = {
            id: 'e_' + Math.random().toString(36).substr(2, 9),
            email: email,
            name: formattedName,
            photoURL: `https://ui-avatars.com/api/?name=${formattedName}&background=4F46E5&color=fff`
        };

        setUser(mockEmailUser);
        localStorage.setItem('skillbridge_user', JSON.stringify(mockEmailUser));
        setIsLoading(false);
    };

    const signOut = async () => {
        setIsLoading(true);
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 400));
        setUser(null);
        localStorage.removeItem('skillbridge_user');
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signInWithEmail, signOut, isLoading }}>
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
