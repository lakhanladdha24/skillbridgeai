import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, Play, Award, Video, Bot, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VisualFlowchart, { FlowchartNode } from '../components/VisualFlowchart';
import EmbeddedMaterialModal from '../components/EmbeddedMaterialModal';
import CertificateModal from '../components/CertificateModal';
import { useAuth } from '../hooks/useAuth';
import { Certificate } from '../types/certificate';

interface TopicNode {
    topicId: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
    estimatedHours: number;
    completed: boolean;
    recommended?: boolean;
    alternative?: boolean;
    prerequisites?: string[];
    videoQuery?: string;
    docUrl?: string;
    keyConcepts?: string[];
}

interface Phase {
    phaseId: string;
    title: string;
    description: string;
    topics: TopicNode[];
}

const RoadmapView: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [userGoal, setUserGoal] = useState<string>('');
    const studyTime = '2 hours/day';
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [activeRoleSlug, setActiveRoleSlug] = useState<string>('frontend');

    // Active Generated Roadmap State
    const [roadmapData, setRoadmapData] = useState<any>({
        goal: 'Frontend Developer',
        title: 'Frontend Developer Roadmap',
        estimatedDuration: '5–6 months',
        studyTimeDaily: '2 hours/day',
        completionPercentage: 0,
        semanticMatchScore: 99.4,
        phases: []
    });

    // Modal Drawer State
    const [selectedTopic, setSelectedTopic] = useState<FlowchartNode | null>(null);
    const [topicStudyData, setTopicStudyData] = useState<any>(null);
    const [isLoadingStudy, setIsLoadingStudy] = useState<boolean>(false);
    const [modalInitialTab, setModalInitialTab] = useState<'video' | 'ai' | 'article' | 'pdf' | 'practice'>('video');

    // Certificate State & Ceremony
    const [generatedCertificate, setGeneratedCertificate] = useState<Certificate | null>(null);
    const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

    // Global Roadmap AI Assistant Modal
    const [showGlobalAiModal, setShowGlobalAiModal] = useState<boolean>(false);
    const [globalAiQuery, setGlobalAiQuery] = useState<string>('');
    const [globalAiReply, setGlobalAiReply] = useState<string>('');
    const [isLoadingGlobalAi, setIsLoadingGlobalAi] = useState<boolean>(false);

    useEffect(() => {
        handleSearchRoadmapQuery('Frontend Developer');
    }, []);

    const handleOpenTopic = async (node: FlowchartNode, tab: 'video' | 'ai' | 'article' | 'pdf' | 'practice' = 'video') => {
        setSelectedTopic(node);
        setModalInitialTab(tab);
        setIsLoadingStudy(true);

        try {
            const [studyRes, videoRes] = await Promise.all([
                fetch(`/api/study/topic?q=${encodeURIComponent(node.title)}`),
                fetch(`/api/youtube/search?courseName=${encodeURIComponent(roadmapData.goal)}&topicTitle=${encodeURIComponent(node.title)}&level=${encodeURIComponent(node.level)}`)
            ]);
            const studyJson = await studyRes.json();
            const videoJson = await videoRes.json();

            setTopicStudyData({
                ...studyJson,
                videos: (videoJson.videos && videoJson.videos.length > 0) ? videoJson.videos : studyJson.videos
            });
        } catch (e) {
            setTopicStudyData(null);
        } finally {
            setIsLoadingStudy(false);
        }
    };

    const triggerCertificateGeneration = async (courseName: string) => {
        const userId = user?.id || 'usr_guest';
        const userName = user?.name || user?.email?.split('@')[0] || 'Skill Bridge Graduate';
        const courseId = `course_${courseName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

        try {
            const res = await fetch('/api/certificates/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    userName,
                    courseId,
                    courseName
                })
            });
            const data = await res.json();
            if (data.success && data.certificate) {
                setGeneratedCertificate(data.certificate);
                setShowCertificateModal(true);
            }
        } catch (e) {
            console.error('Certificate Auto Generation Error:', e);
        }
    };

    const toggleTopicComplete = (nodeId: string) => {
        setRoadmapData((prev: any) => {
            let total = 0;
            let done = 0;

            const updatedPhases = prev.phases.map((ph: Phase) => {
                const updatedTopics = ph.topics.map((t) => {
                    const isTarget = t.topicId === nodeId;
                    const newStatus = isTarget ? !t.completed : t.completed;
                    total += 1;
                    if (newStatus) done += 1;
                    return { ...t, completed: newStatus };
                });
                return { ...ph, topics: updatedTopics };
            });

            const newPercentage = Math.round((done / Math.max(total, 1)) * 100);

            if (newPercentage === 100 && prev.completionPercentage < 100) {
                triggerCertificateGeneration(prev.goal);
            }

            return {
                ...prev,
                completionPercentage: newPercentage,
                phases: updatedPhases
            };
        });
    };

    const roleRoadmaps = [
        { name: 'Frontend', slug: 'frontend', query: 'Frontend Developer' },
        { name: 'Backend', slug: 'backend', query: 'Backend Developer' },
        { name: 'Full Stack', slug: 'fullstack', query: 'Full Stack Developer' },
        { name: 'AI & Machine Learning', slug: 'machine-learning', query: 'Machine Learning & AI' },
        { name: 'Python', slug: 'python', query: 'Python Developer' },
        { name: 'DevOps & Cloud', slug: 'devops', query: 'DevOps & Cloud Engineer' },
        { name: 'React.js', slug: 'react', query: 'React.js Architecture' },
        { name: 'Data Analyst', slug: 'data-science', query: 'Data Science & Analyst' },
        { name: 'Cybersecurity', slug: 'cybersecurity', query: 'Cybersecurity & Ethical Hacking' }
    ];

    const handleSearchRoadmapQuery = async (queryText: string) => {
        const target = queryText || userGoal || 'Frontend Developer';
        setIsGenerating(true);

        try {
            const res = await fetch('/api/roadmap/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: target })
            });
            const data = await res.json();
            if (data.phases) {
                // Calculate completion
                const allT = data.phases.flatMap((p: Phase) => p.topics);
                const doneCount = allT.filter((t: TopicNode) => t.completed).length;
                const percentage = Math.round((doneCount / Math.max(allT.length, 1)) * 100);

                setRoadmapData({
                    goal: data.title || data.query || target,
                    title: data.title || `${target} Roadmap`,
                    estimatedDuration: data.estimated_duration || '5–6 months',
                    studyTimeDaily: studyTime,
                    completionPercentage: percentage,
                    semanticMatchScore: data.semantic_match_score || 98.8,
                    phases: data.phases
                });
            }
        } catch (e) {
            console.error('Roadmap Search Error:', e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGlobalAiQuery = async (qText?: string) => {
        const prompt = qText || globalAiQuery;
        if (!prompt.trim()) return;
        setIsLoadingGlobalAi(true);
        try {
            const res = await fetch('/api/ai/learn-topic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topicTitle: roadmapData.title || roadmapData.goal,
                    roadmapGoal: roadmapData.goal,
                    mode: 'chat',
                    userQuestion: prompt
                })
            });
            const data = await res.json();
            setGlobalAiReply(data.reply || 'Here is the recommended path for this roadmap.');
        } catch (e) {
            setGlobalAiReply('Could not connect to AI Tutor. Please try again.');
        } finally {
            setIsLoadingGlobalAi(false);
        }
    };

    // Calculate All Nodes & Find Recommended Next Topic
    const allTopicsList: FlowchartNode[] = roadmapData.phases?.flatMap((ph: Phase, pIdx: number) =>
        ph.topics.map((t, tIdx) => {
            let level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery' = t.difficulty || 'Beginner';
            if (!t.difficulty) {
                if (pIdx === 1 || tIdx === 1) level = 'Intermediate';
                if (pIdx === 2) level = 'Advanced';
                if (pIdx >= 3) level = 'Mastery';
            }

            const isCompleted = t.completed;
            const prereqs = t.prerequisites || [];
            const isLocked = prereqs.some(pId => {
                const foundPrereq = roadmapData.phases.flatMap((p: Phase) => p.topics).find((x: TopicNode) => x.topicId === pId);
                return foundPrereq && !foundPrereq.completed;
            });

            return {
                id: t.topicId,
                title: t.title,
                description: t.description,
                level,
                estimatedHours: t.estimatedHours || 15,
                completed: isCompleted,
                locked: isLocked,
                recommended: t.recommended !== false,
                alternative: !!t.alternative,
                prerequisites: prereqs,
                phaseTitle: ph.title,
                phaseId: ph.phaseId,
                keyConcepts: t.keyConcepts,
                videoQuery: t.videoQuery,
                docUrl: t.docUrl
            };
        })
    ) || [];

    const completedCount = allTopicsList.filter(n => n.completed).length;
    const totalTopicsCount = allTopicsList.length;

    // Recommended Next Topic
    const recommendedNextTopic = allTopicsList.find(n => !n.completed && !n.locked) || allTopicsList.find(n => !n.completed);
    const continueLearningTopic = allTopicsList.find(n => !n.completed) || allTopicsList[0];

    return (
        <div className="max-w-6xl mx-auto pt-6 px-3 sm:px-6 pb-24">
            {/* roadmap.sh Style Header & Hero */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs mb-3 shadow-lg">
                    <Compass size={14} className="text-primary" /> roadmap.sh standard • Curated YouTube Courses & AI Tutor
                </div>
                <h1 className="text-3xl sm:text-5xl font-black mb-3 text-white tracking-tight">
                    Developer Roadmaps
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
                    Interactive roadmaps, step-by-step YouTube video lectures, study materials, and an interactive <strong>AI Tutor</strong> to guide your software career.
                </p>
            </div>

            {/* AI Generator Search Input Bar */}
            <div className="glass-card p-3 sm:p-4 rounded-3xl border border-white/10 max-w-3xl mx-auto mb-6 flex flex-col md:flex-row items-center gap-3 bg-slate-900/90 shadow-2xl">
                <input
                    type="text"
                    placeholder="Search any skill or role (e.g. Next.js, Rust, Kubernetes, Spring Boot, Flutter, Machine Learning)..."
                    value={userGoal}
                    onChange={(e) => setUserGoal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchRoadmapQuery(userGoal)}
                    className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-2 text-xs sm:text-sm focus:outline-none"
                />
                <button
                    onClick={() => handleSearchRoadmapQuery(userGoal)}
                    disabled={isGenerating}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-primary via-secondary to-accent text-black font-black text-xs rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                    <Sparkles size={16} /> {isGenerating ? 'AI Generating Roadmap...' : 'Generate Roadmap'}
                </button>
            </div>

            {/* Role-based Roadmaps Catalog Tabs (roadmap.sh style) */}
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-4xl mx-auto mb-8">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold mr-1 flex items-center gap-1">
                    <Layers size={11} /> Roadmaps:
                </span>
                {roleRoadmaps.map((r) => {
                    const isSelected = activeRoleSlug === r.slug;
                    return (
                        <button
                            key={r.slug}
                            onClick={() => {
                                setActiveRoleSlug(r.slug);
                                setUserGoal(r.query);
                                handleSearchRoadmapQuery(r.query);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                                isSelected
                                    ? 'bg-primary/20 text-primary border-primary font-black shadow-lg shadow-primary/10'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                            }`}
                        >
                            {r.name}
                        </button>
                    );
                })}
            </div>

            {/* CONTINUE WATCHING & ROADMAP STATS DUAL BANNER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Left Card: Continue Learning Node */}
                {continueLearningTopic && (
                    <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 font-bold border border-primary/30">
                                <Video size={24} />
                            </div>
                            <div>
                                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                                    CONTINUE WATCHING
                                </span>
                                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                                    🎬 {continueLearningTopic.title}
                                </h3>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                    {continueLearningTopic.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => handleOpenTopic(continueLearningTopic, 'video')}
                                className="flex-1 sm:flex-none px-5 py-3 bg-primary text-black font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <Play size={14} fill="black" /> Watch Video
                            </button>
                            <button
                                onClick={() => handleOpenTopic(continueLearningTopic, 'ai')}
                                className="px-4 py-3 bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold text-xs rounded-xl hover:bg-purple-500/30 transition-all flex items-center gap-1.5"
                                title="Learn with AI Tutor"
                            >
                                <Bot size={15} /> AI Tutor
                            </button>
                        </div>
                    </div>
                )}

                {/* Right Card: Roadmap Progress & AI Tutor Quick Access */}
                <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4 bg-slate-900/60">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                            <span className="text-gray-400 uppercase">Roadmap Progress</span>
                            <span className="text-primary">{roadmapData.completionPercentage}%</span>
                        </div>
                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500"
                                style={{ width: `${roadmapData.completionPercentage}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-gray-400 pt-1">
                            {completedCount} of {totalTopicsCount} topics completed • {roadmapData.estimatedDuration} estimated
                        </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button
                            onClick={() => setShowGlobalAiModal(true)}
                            className="flex-1 py-2.5 px-3 bg-gradient-to-r from-purple-600 to-primary text-white font-bold text-xs rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-1.5"
                        >
                            <Sparkles size={14} /> Learn with AI
                        </button>

                        {roadmapData.completionPercentage === 100 && (
                            <button
                                onClick={() => triggerCertificateGeneration(roadmapData.goal)}
                                className="py-2.5 px-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black text-xs rounded-xl shadow-md hover:scale-105 transition-all flex items-center gap-1"
                            >
                                <Award size={14} /> Certificate
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Visual Interactive Flowchart (Canvas + Grid + Checklist) */}
            <VisualFlowchart
                courseTitle={roadmapData.goal}
                nodes={allTopicsList}
                phases={roadmapData.phases}
                onNodeClick={(node) => handleOpenTopic(node, 'video')}
                onToggleComplete={toggleTopicComplete}
                onOpenAiTutor={(node) => handleOpenTopic(node, 'ai')}
            />

            {/* Embedded Learning Resources & AI Tutor Drawer Modal */}
            <EmbeddedMaterialModal
                node={selectedTopic}
                studyData={topicStudyData}
                isLoading={isLoadingStudy}
                onClose={() => setSelectedTopic(null)}
                onToggleComplete={toggleTopicComplete}
                onNavigateToCoding={() => navigate('/coding-lab')}
                courseId={`course_${roadmapData.goal.toLowerCase().replace(/[^a-z0-9]/g, '_')}`}
                userId={user?.id}
                nextTopic={recommendedNextTopic}
                onSelectNextTopic={(next) => handleOpenTopic(next, 'video')}
                initialTab={modalInitialTab}
            />

            {/* Automatic Certificate Modal */}
            {showCertificateModal && (
                <CertificateModal
                    certificate={generatedCertificate}
                    onClose={() => setShowCertificateModal(false)}
                />
            )}

            {/* Global Roadmap "Learn with AI" Modal */}
            {showGlobalAiModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                    <div className="glass-card w-full max-w-2xl p-6 rounded-3xl border border-white/10 bg-slate-950 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white">Learn with AI — {roadmapData.goal}</h3>
                                    <p className="text-xs text-gray-400">Ask questions, get advice on where to start, or understand career strategy.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowGlobalAiModal(false)}
                                className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Quick Prompts */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-mono text-gray-400 font-bold uppercase">Suggested Questions:</span>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    `How should I structure my daily study for ${roadmapData.goal}?`,
                                    `What are the most in-demand skills in ${roadmapData.goal} for 2026?`,
                                    `What portfolio project should I build to get hired?`
                                ].map((p, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setGlobalAiQuery(p);
                                            handleGlobalAiQuery(p);
                                        }}
                                        className="text-left text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-primary transition-all"
                                    >
                                        {p} ➔
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* AI Reply Area */}
                        {isLoadingGlobalAi ? (
                            <div className="p-8 text-center text-primary font-mono text-xs animate-pulse flex flex-col items-center gap-2">
                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                AI Tutor is analyzing the roadmap curriculum...
                            </div>
                        ) : globalAiReply ? (
                            <div className="p-5 bg-slate-900 rounded-2xl border border-white/10 max-h-60 overflow-y-auto text-xs text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
                                {globalAiReply}
                            </div>
                        ) : null}

                        {/* Input */}
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="text"
                                placeholder={`Ask AI about the ${roadmapData.goal} path...`}
                                value={globalAiQuery}
                                onChange={(e) => setGlobalAiQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGlobalAiQuery()}
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
                            />
                            <button
                                onClick={() => handleGlobalAiQuery()}
                                disabled={isLoadingGlobalAi || !globalAiQuery.trim()}
                                className="px-5 py-3 bg-gradient-to-r from-primary to-secondary text-black font-black text-xs rounded-2xl shadow-lg hover:scale-105 transition-all"
                            >
                                Ask AI
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoadmapView;
