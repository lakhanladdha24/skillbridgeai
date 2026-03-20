import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                navigate('/sign-in');
            } else if (!user.skills || user.skills.length === 0) {
                navigate('/onboarding');
            }
        }
    }, [user, isLoading, navigate]);

    if (isLoading || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Default levels for visual representation
    const levelProgress: { [key: string]: number } = {
        'Beginner': 25,
        'Intermediate': 60,
        'Advanced': 95
    };

    return (
        <div className="max-w-7xl mx-auto pt-20 px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-900 to-black border-4 border-primary/20 flex items-center justify-center overflow-hidden">
                        {user.photoURL ? <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" /> : <UserIcon size={64} className="text-gray-700" />}
                    </div>
                </div>

                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-bold mb-2 tracking-tight">Hi, {user.name.split(' ')[0]}! 👋</h1>
                    <p className="text-gray-400 mb-6 font-medium">Tracking your AI-powered career growth</p>
                    
                    <button 
                        onClick={() => {
                            const userDesc = user.skills?.map(s => `${s.name} (${s.level})`).join(', ');
                            const event = new CustomEvent('openChat', { 
                                detail: { 
                                    message: `I have skills in: ${userDesc}. Generate a complete, step-by-step career growth roadmap for me. Please include learning resources from CampusX and Stanford University.` 
                                } 
                             });
                            window.dispatchEvent(event);
                        }}
                        className="px-8 py-3 bg-primary text-black font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                    >
                        <Zap size={18} fill="currentColor" />
                        Generate Expert Roadmap
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-white">
                        <TrendingUp className="text-primary" />
                        My Skill Matrix
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.skills && user.skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card p-6 rounded-2xl border border-white/5"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-white text-lg">{skill.name}</span>
                                    <span className="text-primary text-xs font-mono font-bold tracking-widest">{skill.level}</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${levelProgress[skill.level] || 0}%` }}
                                        className="h-full bg-primary shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-white">
                        <Sparkles className="text-secondary" />
                        Nex Step
                    </h2>
                    <div className="p-6 glass-card rounded-2xl border border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Based on your profile, we recommend taking a **Skill Assessment** to verify your "Advanced" status.
                        </p>
                        <button 
                            onClick={() => navigate('/skill-test')}
                            className="w-full py-3 bg-white/10 text-white rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all font-bold"
                        >
                            Take Assessment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
