import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { fetchAIResponse } from '../lib/api';

interface Message {
    role: 'user' | 'model';
    content: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: "Hello! I'm SkillBridgeAI, your personal career mentor. How can I help you today with your career, resume, or interview preparation?",
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Handle external chat triggers
    useEffect(() => {
        const handleOpenChat = (event: any) => {
            setIsOpen(true);
            if (event.detail?.message) {
                const triggerMsg = event.detail.message;
                setMessages(prev => {
                    const newMessages = [...prev, { role: 'user' as const, content: triggerMsg }];
                    processAIResponse(triggerMsg, prev); // Use prev as history
                    return newMessages;
                });
            }
        };

        window.addEventListener('openChat', handleOpenChat);
        return () => window.removeEventListener('openChat', handleOpenChat);
    }, []); // Only once on mount

    const processAIResponse = async (msg: string, currentHistory: Message[]) => {
        setIsLoading(true);
        try {
            const data = await fetchAIResponse(msg, currentHistory);
            setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
        } catch (error: any) {
            console.error('Chat error:', error);
            setMessages((prev) => [...prev, { role: 'model', content: error.message || 'Sorry, I am facing an issue.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: inputMessage.trim() };
        const historyCopy = [...messages];
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        processAIResponse(userMessage.content, historyCopy);
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 p-4 rounded-full bg-primary text-white shadow-xl hover:bg-primary/90 transition-colors z-50 flex items-center justify-center"
                >
                    <Bot size={28} />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-white flex items-center justify-between shadow-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg leading-tight">SkillBridgeAI</h3>
                                    <span className="text-xs text-white/80 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                title="Close chat"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4 text-black">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-br-sm'
                                            : 'bg-white border text-black rounded-bl-sm shadow-sm'
                                            }`}
                                    >
                                        {msg.role === 'model' ? (
                                            <div className="text-sm markdown-body font-sans text-black">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="text-sm">{msg.content}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border p-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={handleSendMessage}
                            className="p-3 bg-white border-t flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-black bg-white placeholder-gray-500"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isLoading}
                                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shrink-0"
                            >
                                <Send size={18} className="translate-x-[1px]" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
