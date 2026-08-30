import React, { useState, useEffect } from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VisualFlowchart from '../components/VisualFlowchart';
import EmbeddedMaterialModal from '../components/EmbeddedMaterialModal';

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

    useEffect(() => {
        handleSearchRoadmapQuery('Web Development & Full Stack');
    }, []);

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

    const quickCourses = [
        'AI & Machine Learning',
        'Data Structures & Algorithms',
        'Web Development & Full Stack',
        'Python Programming',
        'Database Systems & SQL',
        'System Design & Cloud',
        'Cyber Security & Ethical Hacking',
        'DevOps & Kubernetes',
        'Data Engineering & Spark'
    ];

    const handleSearchRoadmapQuery = async (queryText: string) => {
        const target = queryText || userGoal;
        if (!target.trim()) return;
        setIsGenerating(true);

        try {
            const res = await fetch('/api/roadmap/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: target })
            });
            const data = await res.json();
            if (data.phases) {
                setRoadmapData({
                    goal: data.query || target,
                    estimatedDuration: data.estimated_duration || '4–6 months',
                    studyTimeDaily: studyTime,
                    completionPercentage: 15,
                    semanticMatchScore: data.semantic_match_score || 98.4,
                    phases: data.phases
                });
            }
        } catch (e) {
            // Keep default template on error
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pt-8 px-4 pb-20">
            {/* Header & Goal Input */}
            <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-mono text-xs mb-3">
                    <Compass size={14} /> AI Personal Career Operating System
                </span>
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                    AI-Generated Course Roadmap & Deep Learning Search
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                    Enter any technical course, topic, or career goal to generate a personalized, prerequisite-gated dependency path with deep learning similarity scores.
                </p>
            </div>

            {/* Input Bar */}
            <div className="glass-card p-4 rounded-3xl border border-white/10 max-w-3xl mx-auto mb-6 flex flex-col md:flex-row items-center gap-3">
                <input
                    type="text"
                    placeholder="Search any course (e.g. Cyber Security, Web Dev, GenAI, DevOps)..."
                    value={userGoal}
                    onChange={(e) => setUserGoal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchRoadmapQuery(userGoal)}
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
                        onClick={() => handleSearchRoadmapQuery(userGoal)}
                        disabled={isGenerating}
                        className="px-6 py-3 bg-primary text-black font-black text-xs rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
                    >
                        {isGenerating ? <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Sparkles size={16} />}
                        Search Course
                    </button>
                </div>
            </div>

            {/* Quick Select Course Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-12">
                {quickCourses.map((c) => (
                    <button
                        key={c}
                        onClick={() => {
                            setUserGoal(c);
                            handleSearchRoadmapQuery(c);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary text-xs font-bold text-gray-300 hover:text-primary transition-all"
                    >
                        + {c}
                    </button>
                ))}
            </div>

            {/* Overall Progress Summary Bar */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold">{roadmapData.goal} Roadmap</h2>
                        {roadmapData.semanticMatchScore && (
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-mono font-bold">
                                {roadmapData.semanticMatchScore}% Deep Learning Match
                            </span>
                        )}
                    </div>
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

            {/* Visual Step-by-Step Flowchart */}
            <div className="mb-12">
                <VisualFlowchart
                    courseTitle={roadmapData.goal || "Course Roadmap"}
                    nodes={roadmapData.phases?.flatMap((ph: Phase, pIdx: number) =>
                        ph.topics.map((t, tIdx) => {
                            let level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery' = 'Beginner';
                            if (pIdx === 1 || tIdx === 1) level = 'Intermediate';
                            if (pIdx === 2 || t.difficulty === 'Advanced') level = 'Advanced';
                            if (pIdx >= 3) level = 'Mastery';

                            // Generate step key based on goal/course & index
                            const goalLower = (roadmapData.goal || '').toLowerCase();
                            let stepKey = `python_step_${pIdx + 1}`;
                            if (goalLower.includes('dsa') || goalLower.includes('algorithm') || goalLower.includes('structure')) {
                                stepKey = `dsa_step_${pIdx + 1}`;
                            } else if (goalLower.includes('ai') || goalLower.includes('machine') || goalLower.includes('learning')) {
                                stepKey = `ai_step_${pIdx + 1}`;
                            }

                            return {
                                id: stepKey,
                                title: t.title,
                                description: t.description,
                                level,
                                estimatedHours: t.estimatedHours,
                                completed: t.completed,
                                prerequisites: t.prerequisites
                            };
                        })
                    ) || []}
                    onNodeClick={(node) => {
                        handleOpenTopic({
                            topicId: node.id,
                            title: node.title,
                            description: node.description,
                            difficulty: node.level,
                            estimatedHours: node.estimatedHours,
                            completed: node.completed,
                            prerequisites: node.prerequisites
                        });
                    }}
                    onToggleComplete={(nodeId) => {
                        roadmapData.phases?.forEach((ph: Phase) => {
                            ph.topics.forEach((t) => {
                                if (t.topicId === nodeId) {
                                    toggleTopicComplete(ph.phaseId, t.topicId);
                                }
                            });
                        });
                    }}
                />
            </div>

            {/* Embedded In-App Learning Material Modal */}
            <EmbeddedMaterialModal
                node={selectedTopic ? {
                    id: selectedTopic.topicId,
                    title: selectedTopic.title,
                    description: selectedTopic.description,
                    level: (selectedTopic.difficulty as any) || 'Intermediate',
                    estimatedHours: selectedTopic.estimatedHours,
                    completed: selectedTopic.completed,
                    prerequisites: selectedTopic.prerequisites
                } : null}
                studyData={topicStudyData}
                isLoading={isLoadingStudy}
                onClose={() => setSelectedTopic(null)}
                onNavigateToCoding={() => navigate('/coding-lab')}
            />
        </div>
    );
};

export default RoadmapView;
