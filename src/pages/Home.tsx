import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Globe, BookOpen, Target, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
    const { user } = useAuth();
    const [stars] = useState(() =>
        [...Array(20)].map(() => ({
            x: Math.random() * 100, // percentage for better responsiveness
            y: Math.random() * 100,
            scale: Math.random() * 0.5 + 0.5,
            moveY: Math.random() * -10,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5,
            size: Math.random() * 4 + 2 + 'px'
        }))
    );

    return (
        <div className="relative min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-5xl mx-auto text-center space-y-8"
                >
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-primary mb-4 backdrop-blur-sm"
                    >
                        <Sparkles size={16} className="text-secondary" />
                        <span className="font-semibold tracking-wide">Public AI-Powered Career Platform</span>
                    </motion.div>

                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-6">
                        Skill <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-text">Bridge</span>
                        <br />
                        <span className="text-3xl sm:text-5xl lg:text-6xl text-gray-500 font-medium mt-4 block">
                            Scale your Tech Career with AI
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
                        The world's first AI-driven skill mapping platform. Get personalized roadmaps, real-time tracking, and expert resources from YouTube and top universities—all for free by just using your email.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 px-4">
                        {user ? (
                            <Link to="/dashboard" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:px-10 py-4 rounded-2xl bg-primary text-black font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all"
                                >
                                    Go to Dashboard
                                    <ArrowRight size={20} />
                                </motion.button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/sign-in" className="w-full sm:w-auto">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full sm:px-10 py-4 rounded-2xl bg-primary text-black font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all"
                                    >
                                        <Zap size={20} fill="currentColor" />
                                        Get Started Free
                                    </motion.button>
                                </Link>
                                <Link to="/skills" className="w-full sm:w-auto">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full sm:px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md"
                                    >
                                        <Globe size={20} />
                                        Explore Skills
                                    </motion.button>
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Background stars */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {stars.map((star, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white/20 rounded-full"
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: star.size,
                                height: star.size,
                            }}
                            animate={{
                                y: [0, star.moveY],
                                opacity: [0, 0.4, 0]
                            }}
                            transition={{
                                duration: star.duration,
                                repeat: Infinity,
                                ease: "linear",
                                delay: star.delay
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 px-6 md:px-12 bg-[#050505] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Why SkillBridge AI?</h2>
                        <p className="text-gray-400">Everything you need to go from Zero to Hero in Tech.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: BookOpen,
                                title: "Integrated Lectures",
                                desc: "Get curated YouTube lectures and academic notes specifically for every skill you want to master.",
                                color: "text-blue-500"
                            },
                            {
                                icon: Target,
                                title: "Smart Roadmaps",
                                desc: "Our AI analyzes your current level and builds a personalized path tailored to your goals.",
                                color: "text-primary"
                            },
                            {
                                icon: Award,
                                title: "Global Access",
                                desc: "Sync your progress across any device. All you need is your email address to get started.",
                                color: "text-secondary"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:bg-white/[0.07] group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-6 border border-${feature.color}/20 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={28} className={feature.color} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!user && (
                <div className="py-20 px-6">
                    <motion.div 
                        whileInView={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        className="max-w-4xl mx-auto rounded-[3rem] p-10 md:p-20 bg-gradient-to-br from-primary/20 via-background to-secondary/20 border border-white/10 text-center relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to Bridge the Gap?</h2>
                            <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">Join thousands of developers using SkillBridge AI to accelerate their careers. Sign up now with your email.</p>
                            <Link to="/sign-in">
                                <button className="px-10 py-5 bg-white text-black font-black text-xl rounded-2xl hover:bg-primary transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                    Get Started for Free
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Home;

