import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code, Book, Rocket, ChevronRight, Check } from 'lucide-react';

const Onboarding: React.FC = () => {
    const { updateSkills } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedSkills, setSelectedSkills] = useState<{ name: string; level: string }[]>([]);

    const skillOptions = [
        "React", "Node.js", "Python", "TypeScript", "Machine Learning", 
        "Data Science", "AWS", "Docker", "UI/UX Design", "SQL"
    ];

    const handleSkillToggle = (skill: string) => {
        if (selectedSkills.find(s => s.name === skill)) {
            setSelectedSkills(selectedSkills.filter(s => s.name !== skill));
        } else {
            setSelectedSkills([...selectedSkills, { name: skill, level: 'Beginner' }]);
        }
    };

    const handleLevelChange = (skill: string, level: string) => {
        setSelectedSkills(selectedSkills.map(s => 
            s.name === skill ? { ...s, level } : s
        ));
    };

    const handleFinish = async () => {
        await updateSkills(selectedSkills);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-20 font-sans">
            <div className="max-w-2xl w-full">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card p-10 rounded-3xl border border-white/10 text-center"
                        >
                            <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 text-primary">
                                <Rocket size={40} />
                            </div>
                            <h1 className="text-4xl font-bold mb-4 text-white">Welcome to SkillBridge AI!</h1>
                            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                                To personalize your career roadmap and dashboard, we need to know your current technical stack.
                            </p>
                            <button 
                                onClick={() => setStep(2)}
                                className="w-full py-4 bg-primary text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-lg"
                            >
                                Let's get started <ChevronRight size={20} />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card p-10 rounded-3xl border border-white/10"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                                    <Code size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Select your skills</h2>
                                    <p className="text-gray-400 text-sm">Choose the technologies you already know.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
                                {skillOptions.map(skill => {
                                    const isSelected = selectedSkills.find(s => s.name === skill);
                                    return (
                                        <button
                                            key={skill}
                                            onClick={() => handleSkillToggle(skill)}
                                            className={`p-3 rounded-xl border transition-all text-sm font-semibold flex items-center justify-center gap-2 ${isSelected ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/5' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'}`}
                                        >
                                            {isSelected && <Check size={14} />}
                                            {skill}
                                        </button>
                                    );
                                })}
                            </div>

                            <button 
                                onClick={() => setStep(3)}
                                disabled={selectedSkills.length === 0}
                                className="w-full py-4 bg-primary text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                Next Step
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card p-10 rounded-3xl border border-white/10"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                    <Book size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Refine your levels</h2>
                                    <p className="text-gray-400 text-sm">How proficient are you in these?</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {selectedSkills.map(skill => (
                                    <div key={skill.name} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-white">{skill.name}</span>
                                            <span className="text-xs text-primary font-mono uppercase tracking-widest">{skill.level}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                                                <button
                                                    key={l}
                                                    onClick={() => handleLevelChange(skill.name, l)}
                                                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${skill.level === l ? 'bg-primary text-black border-primary' : 'bg-white/5 text-gray-400 border-white/10'}`}
                                                >
                                                    {l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={handleFinish}
                                className="w-full py-4 bg-primary text-black font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all text-lg"
                            >
                                Complete My Profile
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Onboarding;

