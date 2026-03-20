/**
 * Centralize all AI Fetching logic and handle different environments (Local, Vercel, Render)
 */

export const getBackendURL = () => {
    // If you have a custom Render URL, set it in your .env as VITE_API_URL
    // Example: VITE_API_URL=https://skillbridge-ai.onrender.com
    const customURL = import.meta.env.VITE_API_URL;
    
    if (customURL) {
        return `${customURL.replace(/\/$/, '')}/api/chat`;
    }
    
    // Default to relative path for Vercel Serverless Functions
    return '/api/chat';
};

export const fetchAIResponse = async (message: string, history: any[] = []) => {
    const url = getBackendURL();
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch AI response');
    }
    
    return data;
};
