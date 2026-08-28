import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, TrendingUp, Sparkles, Code2, Award, Compass, BookOpen, Flame, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AIIntelligenceWidget from '../components/AIIntelligenceWidget';

const Dashboard: React.FC = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/sign-in');
        }
    }, [user, isLoading, navigate]);

    if (isLoading || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const userSkills = user?.skills || [];
    const defaultSkills = userSkills.length > 0 ? userSkills : [
        { name: 'Python', level: 'Advanced', score: 82 },
        { name: 'DSA & Algorithms', level: 'Intermediate', score: 64 },
        { name: 'Machine Learning', level: 'Elementary', score: 48 },
        { name: 'Quantitative Aptitude', level: 'Upper Intermediate', score: 76 }
    ];

    return (
        <div className="max-w-7xl mx-auto pt-10 px-4 md:px-8 pb-20">
            {/* Top User Profile Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 p-8 glass-card rounded-3xl border border-white/10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1">
                        <div className="w-full h-full rounded-full bg-gray-950 flex items-center justify-center overflow-hidden">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.name || 'User'} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={44} className="text-gray-400" />
                            )}
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-black mb-1">
                            Welcome back, {(user.name || user.email || 'Developer').split(' ')[0]}! 👋
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                            AI-Powered Learning & Career Operating System
                        </p>
                    </div>
                </div>

                {/* Top Quick Actions */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => navigate('/skill-test')}
                        className="px-5 py-2.5 bg-primary text-black font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Award size={16} /> 50-Q Assessment
                    </button>
                    <button
                        onClick={() => navigate('/coding-lab')}
                        className="px-5 py-2.5 bg-secondary text-black font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Code2 size={16} /> Coding Platform
                    </button>
                    <button
                        onClick={() => navigate('/career-path')}
                        className="px-5 py-2.5 bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                        <Compass size={16} /> Dynamic Roadmap
                    </button>
                </div>
            </div>

            {/* V2 Analytics Overview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
                    <div className="text-3xl font-black text-primary mb-1">78%</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Overall Skill Index</div>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
                    <div className="text-3xl font-black text-green-400 mb-1 flex items-center justify-center gap-1">
                        <CheckCircle size={24} /> 14
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Problems Solved</div>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
                    <div className="text-3xl font-black text-orange-400 mb-1 flex items-center justify-center gap-1">
                        <Flame size={24} /> 5 Days
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Learning Streak</div>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
                    <div className="text-3xl font-black text-secondary mb-1">65%</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Roadmap Progress</div>
                </div>
            </div>

            {/* V3 AI/ML Intelligence Layer */}
            <div className="mb-12">
                <AIIntelligenceWidget />
            </div>

            {/* Matrix & Next Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Skill Matrix (2 Cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                        <TrendingUp className="text-primary" /> Skill Breakdown & Classifications
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {defaultSkills.map((sk: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card p-6 rounded-2xl border border-white/5 space-y-3"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-white text-base">{sk.name}</span>
                                    <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                                        {sk.level || 'Intermediate'}
                                    </span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                        style={{ width: `${sk.score || 65}%` }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column: AI Recommendations */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                        <Sparkles className="text-secondary" /> Next Action Steps
                    </h2>

                    <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
                        <h3 className="text-lg font-bold text-white">Recommended for Machine Learning</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Your assessment showed high Python mastery but weak performance in Dynamic Programming and Statistics.
                        </p>
                        <button
                            onClick={() => navigate('/learning-hub')}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 font-bold text-xs transition-all flex items-center justify-center gap-2"
                        >
                            <BookOpen size={16} /> Explore Study Material Hub
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
