import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, Compass, CheckCircle2, Circle, ArrowRight, BookOpen, 
    Layers, Video, FileText, Code2, ExternalLink, X, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopicNode {
    topicId: string;
    title: string;
    description: string;
    difficulty: string;
    estimatedHours: number;
    completed: boolean;
    prerequisites: string[];
}

interface Phase {
    phaseId: string;
    title: string;
    description: string;
    topics: TopicNode[];
}

const RoadmapView: React.FC = () => {
    const navigate = useNavigate();

    const [userGoal, setUserGoal] = useState<string>('Machine Learning Engineer');
    const [studyTime, setStudyTime] = useState<string>('2 hours/day');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    // Active Generated Roadmap
    const [roadmapData, setRoadmapData] = useState<any>({
        goal: 'Machine Learning Engineer',
        estimatedDuration: '4–6 months',
        studyTimeDaily: '2 hours/day',
        completionPercentage: 25,
        phases: [
            {
                phaseId: 'p1',
                title: 'Phase 1 — Foundations & Programming',
                description: 'Master core Python, OOP, and data structures essential for AI software engineering.',
                topics: [
                    {
                        topicId: 't1',
                        title: 'Python Fundamentals & OOP',
                        description: 'Variables, loops, functions, OOP classes, decorators, and memory management.',
                        difficulty: 'Beginner',
                        estimatedHours: 15,
                        completed: true,
                        prerequisites: []
                    },
                    {
                        topicId: 't2',
                        title: 'Data Structures & Algorithms (DSA)',
                        description: 'Arrays, Hash Tables, Trees, Graphs, and Algorithmic time complexity.',
                        difficulty: 'Intermediate',
                        estimatedHours: 25,
                        completed: false,
                        prerequisites: ['t1']
                    }
                ]
            },
            {
                phaseId: 'p2',
                title: 'Phase 2 — Core Machine Learning & Math',
                description: 'Linear algebra, probability, calculus, and classical ML algorithms with Scikit-Learn.',
                topics: [
                    {
                        topicId: 't3',
                        title: 'Machine Learning & AI Foundations',
                        description: 'Supervised & Unsupervised Learning, Regression, Gradient Descent, and Cross-Validation.',
                        difficulty: 'Intermediate',
                        estimatedHours: 30,
                        completed: false,
                        prerequisites: ['t2']
                    }
                ]
            },
            {
                phaseId: 'p3',
                title: 'Phase 3 — Deep Learning & Generative AI',
                description: 'Neural networks, PyTorch, Transformers, LLM fine-tuning, and RAG architectures.',
                topics: [
                    {
                        topicId: 't4',
                        title: 'Generative AI & LLM Engineering',
                        description: 'Self-Attention, Transformer models, Prompt Engineering, and Vector Databases.',
                        difficulty: 'Advanced',
                        estimatedHours: 40,
                        completed: false,
                        prerequisites: ['t3']
                    }
                ]
            }
        ]
    });

    // Topic Detail Modal Drawer State
    const [selectedTopic, setSelectedTopic] = useState<TopicNode | null>(null);
    const [topicStudyData, setTopicStudyData] = useState<any>(null);
    const [isLoadingStudy, setIsLoadingStudy] = useState<boolean>(false);

    const handleGenerateRoadmap = async () => {
        if (!userGoal.trim()) return;
        setIsGenerating(true);

        try {
            const res = await fetch('/api/roadmap/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    goal: userGoal,
                    studyTimeDaily: studyTime
                })
            });
            const data = await res.json();
            if (data.phases) {
                setRoadmapData(data);
            }
        } catch (e) {
            // Keep default template on error
        } finally {
            setIsGenerating(false);
        }
    };

    const handleOpenTopic = async (topic: TopicNode) => {
        setSelectedTopic(topic);
        setIsLoadingStudy(true);

        try {
            const [studyRes, videoRes] = await Promise.all([
                fetch(`/api/study/topic?q=${encodeURIComponent(topic.title)}`),
                fetch(`/api/videos/recommend?q=${encodeURIComponent(topic.title)}`)
            ]);
            const studyJson = await studyRes.json();
            const videoJson = await videoRes.json();

            setTopicStudyData({
                ...studyJson,
                videos: videoJson.videos || studyJson.videos
            });
        } catch (e) {
            setTopicStudyData(null);
        } finally {
            setIsLoadingStudy(false);
        }
    };

    const toggleTopicComplete = (phaseId: string, topicId: string) => {
        setRoadmapData((prev: any) => {
            let total = 0;
            let done = 0;

            const updatedPhases = prev.phases.map((ph: Phase) => {
                const updatedTopics = ph.topics.map((t) => {
                    const isTarget = ph.phaseId === phaseId && t.topicId === topicId;
                    const newStatus = isTarget ? !t.completed : t.completed;
                    total += 1;
                    if (newStatus) done += 1;
                    return { ...t, completed: newStatus };
                });
                return { ...ph, topics: updatedTopics };
            });

            return {
                ...prev,
                completionPercentage: Math.round((done / Math.max(total, 1)) * 100),
                phases: updatedPhases
            };
        });
    };

    return (
        <div className="max-w-6xl mx-auto pt-8 px-4 pb-20">
            {/* Header & Goal Input */}
            <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-mono text-xs mb-3">
                    <Compass size={14} /> AI Personal Career Operating System
                </span>
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                    AI-Generated Career Roadmap
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                    Enter any technical career goal or skill topic to build a personalized, prerequisite-gated dependency path.
                </p>
            </div>

            {/* Input Bar */}
            <div className="glass-card p-4 rounded-3xl border border-white/10 max-w-3xl mx-auto mb-12 flex flex-col md:flex-row items-center gap-3">
                <input
                    type="text"
                    placeholder="e.g. I want to become a Machine Learning Engineer..."
                    value={userGoal}
                    onChange={(e) => setUserGoal(e.target.value)}
                    className="bg-transparent text-white placeholder-gray-500 text-sm font-semibold px-4 py-2 w-full focus:outline-none"
                />
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                        value={studyTime}
                        onChange={(e) => setStudyTime(e.target.value)}
                        className="bg-white/10 text-xs font-bold text-white px-3 py-3 rounded-2xl border border-white/10 focus:outline-none cursor-pointer"
                    >
                        <option value="1 hour/day" className="bg-gray-900">1 hr/day</option>
                        <option value="2 hours/day" className="bg-gray-900">2 hrs/day</option>
                        <option value="4 hours/day" className="bg-gray-900">4 hrs/day</option>
                    </select>

                    <button
                        onClick={handleGenerateRoadmap}
                        disabled={isGenerating}
                        className="px-6 py-3 bg-primary text-black font-black text-xs rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
                    >
                        {isGenerating ? <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Sparkles size={16} />}
                        Generate Roadmap
                    </button>
                </div>
            </div>

            {/* Overall Progress Summary Bar */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-bold mb-1">{roadmapData.goal} Roadmap</h2>
                    <p className="text-xs text-gray-400">Paced for {roadmapData.studyTimeDaily} • Estimated completion: {roadmapData.estimatedDuration}</p>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="flex-1 md:w-48 bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="bg-gradient-to-r from-primary via-secondary to-accent h-full transition-all duration-500"
                            style={{ width: `${roadmapData.completionPercentage}%` }}
                        />
                    </div>
                    <span className="text-xl font-black text-primary font-mono">{roadmapData.completionPercentage}%</span>
                </div>
            </div>

            {/* Phases Timeline Graph */}
            <div className="space-y-8 relative">
                {/* Vertical connecting bar */}
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-white/10 hidden md:block" />

                {roadmapData.phases?.map((phase: Phase, idx: number) => (
                    <div key={phase.phaseId} className="relative pl-0 md:pl-16 space-y-4">
                        {/* Phase Badge */}
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-black font-mono text-sm z-10">
                                {idx + 1}
                            </span>
                            <div>
                                <h3 className="text-lg font-black text-white">{phase.title}</h3>
                                <p className="text-xs text-gray-400">{phase.description}</p>
                            </div>
                        </div>

                        {/* Topic Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {phase.topics.map((t) => (
                                <motion.div
                                    key={t.topicId}
                                    whileHover={{ scale: 1.01 }}
                                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                                        t.completed
                                            ? 'bg-green-500/10 border-green-500/30'
                                            : 'glass-card border-white/10 hover:border-primary/50'
                                    }`}
                                    onClick={() => handleOpenTopic(t)}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-400 font-mono">{t.estimatedHours} Hours</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleTopicComplete(phase.phaseId, t.topicId);
                                                }}
                                                className="text-gray-400 hover:text-green-400 transition-colors"
                                            >
                                                {t.completed ? <CheckCircle2 className="text-green-400" size={20} /> : <Circle size={20} />}
                                            </button>
                                        </div>

                                        <h4 className="text-base font-bold text-white mb-1">{t.title}</h4>
                                        <p className="text-xs text-gray-400 line-clamp-2">{t.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                                        <span className="text-primary font-bold flex items-center gap-1">
                                            <BookOpen size={12} /> Study Notes & Videos
                                        </span>
                                        <span className="text-gray-400 flex items-center gap-1 font-mono">
                                            Open Drawer <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* TOPIC STUDY MATERIAL DRAWER MODAL */}
            <AnimatePresence>
                {selectedTopic && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end"
                        onClick={() => setSelectedTopic(null)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-2xl bg-gray-950 border-l border-white/10 h-full p-6 md:p-8 overflow-y-auto flex flex-col justify-between"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div>
                                {/* Modal Header */}
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                                    <div>
                                        <span className="text-xs text-primary font-mono font-bold uppercase tracking-widest">Skill Bridge Study Hub</span>
                                        <h2 className="text-2xl font-black text-white">{selectedTopic.title}</h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTopic(null)}
                                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {isLoadingStudy ? (
                                    <div className="p-12 text-center text-primary font-semibold animate-pulse">
                                        Loading grounded study notes & recommended videos...
                                    </div>
                                ) : topicStudyData ? (
                                    <div className="space-y-6">
                                        {/* Definition & Concept */}
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                                                <FileText size={16} /> Overview & Key Concepts
                                            </h4>
                                            <p className="text-xs text-gray-300 leading-relaxed">{topicStudyData.studyNotes?.definition}</p>
                                            <p className="text-xs text-gray-400 leading-relaxed">{topicStudyData.studyNotes?.explanation}</p>
                                        </div>

                                        {/* Visual Flowchart ASCII */}
                                        {topicStudyData.studyNotes?.flowchart && (
                                            <div className="p-4 bg-gray-900 rounded-2xl border border-white/10 space-y-2 font-mono text-xs">
                                                <h4 className="text-xs font-bold text-secondary flex items-center gap-2 font-sans">
                                                    <Layers size={14} /> Visual Process Flowchart
                                                </h4>
                                                <pre className="text-green-400 overflow-x-auto p-2 bg-black/40 rounded-xl leading-snug">
                                                    {topicStudyData.studyNotes.flowchart}
                                                </pre>
                                            </div>
                                        )}

                                        {/* Code Example */}
                                        {topicStudyData.studyNotes?.codeExample && (
                                            <div className="p-4 bg-gray-900 rounded-2xl border border-white/10 space-y-2 font-mono text-xs">
                                                <h4 className="text-xs font-bold text-accent flex items-center gap-2 font-sans">
                                                    <Code2 size={14} /> Code Example
                                                </h4>
                                                <pre className="text-gray-200 overflow-x-auto p-3 bg-black/50 rounded-xl">
                                                    {topicStudyData.studyNotes.codeExample}
                                                </pre>
                                            </div>
                                        )}

                                        {/* Ranked YouTube Educational Videos */}
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                <Video size={16} className="text-red-400" /> Ranked Video Tutorials
                                            </h4>

                                            {topicStudyData.videos?.map((vid: any, i: number) => (
                                                <a
                                                    key={i}
                                                    href={vid.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all block space-y-2 group"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-xs font-bold text-white group-hover:text-primary transition-colors flex items-center gap-1">
                                                            {vid.title} <ExternalLink size={12} />
                                                        </span>
                                                        <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-mono font-bold">
                                                            {vid.isFree ? 'FREE' : 'RESOURCE'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400">{vid.summary}</p>
                                                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                                                        <span>Creator: {vid.creator}</span>
                                                        <span className="flex items-center gap-1 text-yellow-400 font-bold">
                                                            <Star size={12} fill="currentColor" /> {vid.score}
                                                        </span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-400">Study material unavailable for this topic.</div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-6 border-t border-white/10 flex gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedTopic(null);
                                        navigate('/coding-lab');
                                    }}
                                    className="w-full py-3 bg-primary text-black font-black text-xs rounded-xl shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                >
                                    <Code2 size={16} /> Practice Coding Problems
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoadmapView;
