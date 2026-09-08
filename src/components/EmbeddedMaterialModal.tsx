import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Video, FileText, Download, Code2, CheckCircle2, 
    ExternalLink, Rocket, Bookmark, Play, ArrowRight, Clock,
    Sparkles, MessageSquare, HelpCircle, Check, AlertCircle,
    Send, BookOpen, Trophy, Star
} from 'lucide-react';
import { FlowchartNode } from './VisualFlowchart';

export function toEmbedUrl(urlStr?: string, topicTitle?: string): string {
    if (urlStr && urlStr.includes("embed/")) {
        const videoIdMatch = urlStr.match(/embed\/([a-zA-Z0-9_-]{11})/);
        if (videoIdMatch && videoIdMatch[1]) {
            return `https://www.youtube.com/embed/${videoIdMatch[1]}?enablejsapi=1`;
        }
        return urlStr;
    }

    if (urlStr) {
        const watchMatch = urlStr.match(/(?:v=|\/v\/|embed\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
        if (watchMatch && watchMatch[1]) {
            return `https://www.youtube.com/embed/${watchMatch[1]}?enablejsapi=1`;
        }
    }

    const cleanTopic = (topicTitle || 'Software Engineering').trim();
    return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(cleanTopic + " tutorial")}`;
}

interface EmbeddedMaterialModalProps {
    node: FlowchartNode | null;
    studyData: any;
    isLoading: boolean;
    onClose: () => void;
    onToggleComplete: (nodeId: string) => void;
    onNavigateToCoding: () => void;
    courseId?: string;
    userId?: string;
    nextTopic?: FlowchartNode | null;
    onSelectNextTopic?: (next: FlowchartNode) => void;
    initialTab?: 'video' | 'ai' | 'article' | 'pdf' | 'practice';
}

const EmbeddedMaterialModal: React.FC<EmbeddedMaterialModalProps> = ({
    node,
    studyData,
    isLoading,
    onClose,
    onToggleComplete,
    onNavigateToCoding,
    courseId = 'course_default',
    userId = 'user_default',
    nextTopic,
    onSelectNextTopic,
    initialTab = 'video'
}) => {
    const [activeTab, setActiveTab] = useState<'video' | 'ai' | 'article' | 'pdf' | 'practice'>('video');
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    
    // Video selection & progress state
    const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
    const [watchProgress, setWatchProgress] = useState<number>(0);
    const [isSimulatingWatch, setIsSimulatingWatch] = useState<boolean>(false);

    // AI Tutor States
    const [aiSubTab, setAiSubTab] = useState<'explain' | 'chat' | 'quiz' | 'project'>('explain');
    const [aiExplainDepth, setAiExplainDepth] = useState<'eli5' | 'technical' | 'architecture'>('technical');
    const [aiExplanation, setAiExplanation] = useState<any>(null);
    const [isLoadingAiExplain, setIsLoadingAiExplain] = useState<boolean>(false);
    
    // AI Chat State
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
    const [chatInput, setChatInput] = useState<string>('');
    const [isAiReplying, setIsAiReplying] = useState<boolean>(false);

    // AI Quiz State
    const [quizData, setQuizData] = useState<any>(null);
    const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

    // AI Project State
    const [projectData, setProjectData] = useState<any>(null);
    const [isLoadingProject, setIsLoadingProject] = useState<boolean>(false);

    useEffect(() => {
        if (node) {
            setSelectedVideoIndex(0);
            setWatchProgress(node.completed ? 100 : 0);
            setIsSimulatingWatch(false);
            setActiveTab(initialTab);
            setAiSubTab('explain');
            setChatMessages([]);
            setQuizAnswers({});
            setQuizSubmitted(false);

            // Fetch AI Explanation for the node automatically
            fetchAiExplanation(node.title);
        }
    }, [node]);

    const fetchAiExplanation = async (title: string) => {
        setIsLoadingAiExplain(true);
        try {
            const res = await fetch('/api/ai/learn-topic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topicTitle: title,
                    roadmapGoal: courseId,
                    mode: 'explain'
                })
            });
            const data = await res.json();
            setAiExplanation(data);
        } catch (e) {
            setAiExplanation(null);
        } finally {
            setIsLoadingAiExplain(false);
        }
    };

    const handleLoadQuiz = async () => {
        if (!node || quizData) return;
        setIsLoadingQuiz(true);
        try {
            const res = await fetch('/api/ai/learn-topic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topicTitle: node.title,
                    roadmapGoal: courseId,
                    mode: 'quiz'
                })
            });
            const data = await res.json();
            setQuizData(data);
        } catch (e) {
            setQuizData(null);
        } finally {
            setIsLoadingQuiz(false);
        }
    };

    const handleLoadProject = async () => {
        if (!node || projectData) return;
        setIsLoadingProject(true);
        try {
            const res = await fetch('/api/ai/learn-topic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topicTitle: node.title,
                    roadmapGoal: courseId,
                    mode: 'project'
                })
            });
            const data = await res.json();
            setProjectData(data);
        } catch (e) {
            setProjectData(null);
        } finally {
            setIsLoadingProject(false);
        }
    };

    const handleSendChatMessage = async (msgText?: string) => {
        const text = msgText || chatInput;
        if (!text.trim() || !node) return;

        const newHistory = [...chatMessages, { role: 'user' as const, content: text }];
        setChatMessages(newHistory);
        setChatInput('');
        setIsAiReplying(true);

        try {
            const res = await fetch('/api/ai/learn-topic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topicTitle: node.title,
                    roadmapGoal: courseId,
                    mode: 'chat',
                    userQuestion: text,
                    history: newHistory
                })
            });
            const data = await res.json();
            if (data.reply) {
                setChatMessages([...newHistory, { role: 'assistant', content: data.reply }]);
            }
        } catch (e) {
            setChatMessages([...newHistory, { role: 'assistant', content: 'Apologies, could not connect to AI Tutor. Please try again.' }]);
        } finally {
            setIsAiReplying(false);
        }
    };

    if (!node) return null;

    const videosList = studyData?.videos || [];
    const currentVideo = videosList[selectedVideoIndex] || videosList[0];

    // Handle Watch Progress Simulation / Timer
    const handleStartWatch = () => {
        setIsSimulatingWatch(true);
        const interval = setInterval(() => {
            setWatchProgress((prev) => {
                const next = prev + 15;
                if (next >= 90 && !node.completed) {
                    onToggleComplete(node.id);
                    saveProgressToBackend(currentVideo, 100);
                }
                if (next >= 100) {
                    clearInterval(interval);
                    setIsSimulatingWatch(false);
                    return 100;
                }
                saveProgressToBackend(currentVideo, next);
                return next;
            });
        }, 1000);
    };

    const saveProgressToBackend = async (vid: any, progressPercent: number) => {
        if (!vid) return;
        const videoId = vid.videoId || vid.url?.split('v=')[1] || 'vid_default';
        try {
            await fetch('/api/videos/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    courseId,
                    topicId: node.id,
                    videoId,
                    videoTitle: vid.title || node.title,
                    watchProgress: progressPercent,
                    durationSeconds: 1200
                })
            });
        } catch (e) {
            // ignore network errors in fallback
        }
    };

    // Calculate Quiz Score
    const calculateQuizScore = () => {
        if (!quizData?.questions) return 0;
        let correct = 0;
        quizData.questions.forEach((q: any) => {
            if (quizAnswers[q.id] === q.correctIndex) {
                correct += 1;
            }
        });
        return correct;
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 15 }}
                    className="glass-card w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-950"
                >
                    {/* Top Header Drawer */}
                    <div className="p-5 md:px-8 md:py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                    {node.level} LEVEL
                                </span>
                                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                                    <Clock size={12} /> {node.estimatedHours} HOURS
                                </span>
                                {node.recommended !== false && (
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                                        <Star size={10} fill="currentColor" /> Recommended
                                    </span>
                                )}
                                {node.completed && (
                                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                        <CheckCircle2 size={12} /> COMPLETED
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-white">{node.title}</h2>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`p-2.5 rounded-2xl border transition-all ${
                                    isBookmarked ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                }`}
                                title="Save / Bookmark Topic"
                            >
                                <Bookmark size={17} />
                            </button>

                            <button
                                onClick={() => {
                                    onToggleComplete(node.id);
                                    if (!node.completed) setWatchProgress(100);
                                }}
                                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    node.completed
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                        : 'bg-primary text-black font-black hover:bg-primary/90 shadow-lg shadow-primary/20'
                                }`}
                            >
                                <CheckCircle2 size={16} />
                                {node.completed ? 'Completed ✓' : 'Mark as Done'}
                            </button>

                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs Bar */}
                    <div className="flex items-center gap-2 px-6 overflow-x-auto border-b border-white/10 bg-black/40 scrollbar-none">
                        {[
                            { id: 'video', label: '📺 YouTube Course', icon: Video },
                            { id: 'ai', label: '🤖 Learn with AI (Tutor)', icon: Sparkles, badge: 'Groq AI' },
                            { id: 'article', label: '📚 Study Material & Docs', icon: FileText },
                            { id: 'pdf', label: '📄 Cheat Sheet Notes', icon: Download },
                            { id: 'practice', label: '💻 Coding Lab Challenge', icon: Code2 }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'text-primary border-primary font-black'
                                        : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                            >
                                {tab.label}
                                {tab.badge && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Body */}
                    <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
                        {isLoading && (
                            <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                Synchronizing latest verified YouTube lecture & resource materials...
                            </div>
                        )}
                        {/* TAB 1: YOUTUBE VIDEO LEARNING */}
                        {activeTab === 'video' && (
                            <div className="space-y-6">
                                {videosList.length > 1 && (
                                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold mr-2">
                                            Select Course Video:
                                        </span>
                                        {videosList.map((vid: any, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedVideoIndex(idx)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-1.5 ${
                                                    selectedVideoIndex === idx
                                                        ? 'bg-primary text-black border-primary font-black'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                                }`}
                                            >
                                                <Video size={12} /> {vid.title ? vid.title.slice(0, 26) + '...' : `Lecture ${idx + 1}`}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentVideo ? (
                                    <>
                                        {/* Embedded Video Frame */}
                                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl relative group">
                                            <iframe
                                                src={toEmbedUrl(currentVideo?.embedUrl || currentVideo?.url, node.title)}
                                                title={currentVideo?.title || node.title}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>

                                        {/* Watch Progress & Control Bar */}
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                                            ✓ Verified Educational Video
                                                        </span>
                                                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                                                            {currentVideo?.ratingText || '★ 4.9 Verified Course'}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-bold text-white text-base">{currentVideo?.title}</h4>
                                                    <p className="text-xs text-gray-400">{currentVideo?.summary || node.description}</p>
                                                    <div className="flex items-center gap-4 text-xs font-mono text-gray-400 mt-2">
                                                        <span>Creator: <strong className="text-white">{currentVideo?.creator || 'Top Educator'}</strong></span>
                                                        <span>Duration: {currentVideo?.duration || 'Full Course'}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={handleStartWatch}
                                                        disabled={isSimulatingWatch || watchProgress >= 100}
                                                        className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-black font-black rounded-xl text-xs shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        <Play size={14} fill="black" />
                                                        {watchProgress >= 100 ? 'Completed ✓' : isSimulatingWatch ? 'Tracking Progress...' : 'Simulate Video Progress'}
                                                    </button>

                                                    <a
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(node.title + " tutorial")}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[11px] text-red-400 hover:underline font-mono flex items-center gap-1"
                                                    >
                                                        Watch on YouTube <ExternalLink size={10} />
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="space-y-1 pt-2 border-t border-white/5">
                                                <div className="flex justify-between items-center text-xs font-mono">
                                                    <span className="text-gray-400">Watch Progress</span>
                                                    <span className="text-primary font-bold">{Math.round(watchProgress)}%</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary via-secondary to-emerald-400 rounded-full transition-all duration-300"
                                                        style={{ width: `${watchProgress}%` }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-mono">
                                                    * Reaching 90% watch progress automatically completes this topic.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Next Topic Recommendation */}
                                        {(node.completed || watchProgress >= 90) && nextTopic && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-5 bg-gradient-to-r from-emerald-500/20 via-primary/20 to-transparent border border-emerald-500/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold">
                                                        <CheckCircle2 size={20} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                                                            ✓ TOPIC COMPLETED
                                                        </span>
                                                        <h4 className="font-bold text-white text-sm">
                                                            Next Topic: {nextTopic.title}
                                                        </h4>
                                                    </div>
                                                </div>

                                                {onSelectNextTopic && (
                                                    <button
                                                        onClick={() => onSelectNextTopic(nextTopic)}
                                                        className="px-5 py-2.5 bg-emerald-400 text-black font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
                                                    >
                                                        Watch Next Topic <ArrowRight size={14} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-xs text-gray-400 p-8 text-center">No video available.</div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: LEARN WITH AI (ROADMAP.SH AI TUTOR) */}
                        {activeTab === 'ai' && (
                            <div className="space-y-6">
                                {/* AI Tutor Sub-Navigation */}
                                <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
                                    {[
                                        { id: 'explain', label: '📖 Topic Explanation', icon: BookOpen },
                                        { id: 'chat', label: '💬 Ask AI Tutor', icon: MessageSquare },
                                        { id: 'quiz', label: '🎯 Knowledge Check Quiz', icon: HelpCircle, onSelect: handleLoadQuiz },
                                        { id: 'project', label: '🚀 Project Challenge', icon: Rocket, onSelect: handleLoadProject }
                                    ].map(sub => (
                                        <button
                                            key={sub.id}
                                            onClick={() => {
                                                setAiSubTab(sub.id as any);
                                                if (sub.onSelect) sub.onSelect();
                                            }}
                                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                                                aiSubTab === sub.id
                                                    ? 'bg-gradient-to-r from-purple-600 to-primary text-white shadow-lg'
                                                    : 'bg-white/5 text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            <sub.icon size={13} /> {sub.label}
                                        </button>
                                    ))}
                                </div>

                                {/* AI SUB-TAB 1: EXPLANATION MODES */}
                                {aiSubTab === 'explain' && (
                                    <div className="space-y-6">
                                        {/* Depth Selector */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase mr-1">
                                                Explanation Depth:
                                            </span>
                                            {[
                                                { id: 'eli5', label: '👶 ELI5 (Metaphor)' },
                                                { id: 'technical', label: '⚙️ Technical Deep Dive' },
                                                { id: 'architecture', label: '🏢 Production Architecture' }
                                            ].map(d => (
                                                <button
                                                    key={d.id}
                                                    onClick={() => setAiExplainDepth(d.id as any)}
                                                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                                                        aiExplainDepth === d.id
                                                            ? 'bg-primary text-black font-black'
                                                            : 'bg-white/5 text-gray-400 hover:text-white'
                                                    }`}
                                                >
                                                    {d.label}
                                                </button>
                                            ))}
                                        </div>

                                        {isLoadingAiExplain ? (
                                            <div className="p-12 text-center text-primary font-mono text-sm animate-pulse flex flex-col items-center gap-3">
                                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                Groq AI Tutor analyzing "{node.title}" and generating tailored architectural breakdown...
                                            </div>
                                        ) : aiExplanation ? (
                                            <div className="space-y-5">
                                                {/* Selected Explanation Card */}
                                                <div className="p-6 bg-slate-900/90 rounded-2xl border border-white/10 space-y-3">
                                                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                                                        <Sparkles size={16} className="text-primary" />
                                                        {aiExplainDepth === 'eli5' && 'Simple Beginner Metaphor (ELI5)'}
                                                        {aiExplainDepth === 'technical' && 'Under the Hood: Technical Mechanics'}
                                                        {aiExplainDepth === 'architecture' && 'Industry Architecture & High-Scale Implementation'}
                                                    </h4>
                                                    <p className="text-sm text-gray-300 leading-relaxed font-sans">
                                                        {aiExplanation[aiExplainDepth] || aiExplanation.technical}
                                                    </p>
                                                </div>

                                                {/* Production Code Snippet */}
                                                {aiExplanation.codeSnippet && (
                                                    <div className="p-5 bg-black/60 rounded-2xl border border-white/10 font-mono text-xs space-y-2">
                                                        <div className="flex items-center justify-between text-[11px] text-gray-400 border-b border-white/10 pb-2">
                                                            <span className="text-primary font-bold">Production Code Example:</span>
                                                            <span className="text-gray-500">{node.title}</span>
                                                        </div>
                                                        <pre className="overflow-x-auto text-emerald-400 py-2">
                                                            {aiExplanation.codeSnippet}
                                                        </pre>
                                                    </div>
                                                )}

                                                {/* Best Practices */}
                                                {aiExplanation.bestPractices && (
                                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                                                        <h5 className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                                                            ★ Industry Best Practices & Pitfalls:
                                                        </h5>
                                                        <ul className="space-y-2 text-xs text-gray-300">
                                                            {aiExplanation.bestPractices.map((bp: string, idx: number) => (
                                                                <li key={idx} className="flex items-start gap-2">
                                                                    <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                                                    <span>{bp}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-400 p-8 text-center">
                                                Could not load AI breakdown. Click "Ask AI Tutor" below to query directly.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* AI SUB-TAB 2: INTERACTIVE AI CHAT */}
                                {aiSubTab === 'chat' && (
                                    <div className="space-y-4 flex flex-col h-[500px]">
                                        <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                                                    <Sparkles size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white">AI Tutor Discussion</h4>
                                                    <p className="text-[11px] text-gray-400">Ask any question or clear your doubts regarding {node.title}.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message History */}
                                        <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-black/40 rounded-2xl border border-white/10">
                                            {chatMessages.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                                                    <MessageSquare size={32} className="text-gray-600" />
                                                    <p className="text-xs text-gray-400 max-w-sm">
                                                        What would you like to clarify about <strong>{node.title}</strong>? Try one of the quick prompts below:
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 justify-center max-w-md">
                                                        {[
                                                            "Give me a real-world code example",
                                                            "What are the top 3 interview questions?",
                                                            "What is the biggest common mistake?"
                                                        ].map((qp, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => handleSendChatMessage(qp)}
                                                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-primary transition-all text-left"
                                                            >
                                                                {qp} ➔
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                chatMessages.map((msg, i) => (
                                                    <div
                                                        key={i}
                                                        className={`flex gap-3 text-xs leading-relaxed ${
                                                            msg.role === 'user' ? 'justify-end' : 'justify-start'
                                                        }`}
                                                    >
                                                        <div
                                                            className={`p-3.5 rounded-2xl max-w-[80%] ${
                                                                msg.role === 'user'
                                                                    ? 'bg-primary text-black font-semibold'
                                                                    : 'bg-slate-900 border border-white/10 text-gray-200'
                                                            }`}
                                                        >
                                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                            {isAiReplying && (
                                                <div className="flex items-center gap-2 text-xs text-primary font-mono animate-pulse p-2">
                                                    <Sparkles size={14} /> AI Tutor is thinking...
                                                </div>
                                            )}
                                        </div>

                                        {/* Input Box */}
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder={`Ask anything about ${node.title}...`}
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
                                            />
                                            <button
                                                onClick={() => handleSendChatMessage()}
                                                disabled={isAiReplying || !chatInput.trim()}
                                                className="px-5 py-3 bg-gradient-to-r from-primary to-secondary text-black font-black text-xs rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 disabled:opacity-40"
                                            >
                                                <Send size={14} /> Send
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* AI SUB-TAB 3: KNOWLEDGE CHECK QUIZ */}
                                {aiSubTab === 'quiz' && (
                                    <div className="space-y-6">
                                        {isLoadingQuiz ? (
                                            <div className="p-12 text-center text-primary font-mono text-sm animate-pulse flex flex-col items-center gap-3">
                                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                Generating interactive technical quiz for "{node.title}"...
                                            </div>
                                        ) : quizData?.questions ? (
                                            <div className="space-y-6">
                                                {/* Score Banner when submitted */}
                                                {quizSubmitted && (
                                                    <div className="p-5 bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent border border-primary/40 rounded-2xl flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Trophy size={24} className="text-primary" />
                                                            <div>
                                                                <h4 className="text-base font-bold text-white">
                                                                    Quiz Score: {calculateQuizScore()} / {quizData.questions.length} Correct
                                                                </h4>
                                                                <p className="text-xs text-gray-300">
                                                                    {calculateQuizScore() === quizData.questions.length
                                                                        ? '🎉 Flawless mastery! You understand this topic deeply.'
                                                                        : 'Review the explanations below to reinforce key concepts.'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setQuizSubmitted(false);
                                                                setQuizAnswers({});
                                                            }}
                                                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white"
                                                        >
                                                            Retake Quiz
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Question Cards */}
                                                {quizData.questions.map((q: any, qIdx: number) => {
                                                    const selected = quizAnswers[q.id];
                                                    const isCorrect = selected === q.correctIndex;

                                                    return (
                                                        <div key={q.id || qIdx} className="p-5 bg-slate-900/80 rounded-2xl border border-white/10 space-y-3">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <h4 className="text-sm font-bold text-white">
                                                                    Q{qIdx + 1}: {q.question}
                                                                </h4>
                                                            </div>

                                                            {/* Options */}
                                                            <div className="space-y-2 pt-1">
                                                                {q.options.map((opt: string, optIdx: number) => {
                                                                    const isSelected = selected === optIdx;
                                                                    const showAsCorrect = quizSubmitted && optIdx === q.correctIndex;
                                                                    const showAsWrong = quizSubmitted && isSelected && !isCorrect;

                                                                    return (
                                                                        <button
                                                                            key={optIdx}
                                                                            disabled={quizSubmitted}
                                                                            onClick={() => {
                                                                                setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }));
                                                                            }}
                                                                            className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                                                                                showAsCorrect
                                                                                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                                                                                    : showAsWrong
                                                                                    ? 'bg-red-950/40 border-red-500 text-red-300'
                                                                                    : isSelected
                                                                                    ? 'bg-primary/20 border-primary text-white font-bold'
                                                                                    : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                                                            }`}
                                                                        >
                                                                            <span>{opt}</span>
                                                                            {showAsCorrect && <Check size={14} className="text-emerald-400" />}
                                                                            {showAsWrong && <AlertCircle size={14} className="text-red-400" />}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Explanation after submit */}
                                                            {quizSubmitted && (
                                                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300 space-y-1">
                                                                    <strong className="text-primary">Explanation: </strong>
                                                                    <span>{q.explanation}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}

                                                {!quizSubmitted && (
                                                    <button
                                                        onClick={() => setQuizSubmitted(true)}
                                                        disabled={Object.keys(quizAnswers).length === 0}
                                                        className="w-full py-3.5 bg-gradient-to-r from-primary via-secondary to-accent text-black font-black text-xs rounded-2xl shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
                                                    >
                                                        Submit Quiz Answers ➔
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center space-y-3">
                                                <HelpCircle size={32} className="text-gray-500 mx-auto" />
                                                <p className="text-xs text-gray-400">Click below to generate an AI quiz for {node.title}.</p>
                                                <button
                                                    onClick={handleLoadQuiz}
                                                    className="px-5 py-2.5 bg-primary text-black font-black rounded-xl text-xs"
                                                >
                                                    Generate 3-Question Quiz
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* AI SUB-TAB 4: PROJECT CHALLENGE */}
                                {aiSubTab === 'project' && (
                                    <div className="space-y-5">
                                        {isLoadingProject ? (
                                            <div className="p-12 text-center text-primary font-mono text-sm animate-pulse flex flex-col items-center gap-3">
                                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                Generating production project challenge for "{node.title}"...
                                            </div>
                                        ) : projectData ? (
                                            <div className="p-6 bg-slate-900/90 rounded-2xl border border-white/10 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                                                            {projectData.difficulty || 'Intermediate'} Challenge
                                                        </span>
                                                        <h4 className="text-lg font-black text-white mt-1">{projectData.title}</h4>
                                                    </div>
                                                    <span className="text-xs font-mono text-gray-400">
                                                        ⏱ {projectData.estimatedTime || '3-4 Hours'}
                                                    </span>
                                                </div>

                                                <p className="text-xs text-gray-300 leading-relaxed">
                                                    {projectData.objective}
                                                </p>

                                                {/* User Stories */}
                                                {projectData.userStories && (
                                                    <div className="space-y-2 pt-2 border-t border-white/5">
                                                        <span className="text-[11px] font-mono font-bold text-primary uppercase">
                                                            Key Deliverables & Stories:
                                                        </span>
                                                        <ul className="space-y-1.5 text-xs text-gray-300">
                                                            {projectData.userStories.map((story: string, sIdx: number) => (
                                                                <li key={sIdx} className="flex items-start gap-2">
                                                                    <Check size={14} className="text-secondary mt-0.5 flex-shrink-0" />
                                                                    <span>{story}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={onNavigateToCoding}
                                                    className="w-full py-3 bg-secondary text-black font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Code2 size={16} /> Open in SkillAI Coding Lab
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center space-y-3">
                                                <Rocket size={32} className="text-gray-500 mx-auto" />
                                                <p className="text-xs text-gray-400">Build a portfolio project with {node.title}.</p>
                                                <button
                                                    onClick={handleLoadProject}
                                                    className="px-5 py-2.5 bg-secondary text-black font-black rounded-xl text-xs"
                                                >
                                                    Generate Hands-on Project Spec
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: ARTICLES & OFFICIAL DOCUMENTATION */}
                        {activeTab === 'article' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Official Documentation & Verified Guides</h3>
                                    <p className="text-xs text-gray-400">Curated resources following roadmap.sh verified standards.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {studyData?.articles?.map((art: any, i: number) => (
                                        <a
                                            key={i}
                                            href={art.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-5 bg-slate-900/80 hover:bg-slate-800/80 rounded-2xl border border-white/10 hover:border-primary/50 transition-all group flex flex-col justify-between"
                                        >
                                            <div>
                                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/20 text-primary">
                                                    {art.source}
                                                </span>
                                                <h4 className="font-bold text-white text-sm mt-2 group-hover:text-primary transition-colors">
                                                    {art.title}
                                                </h4>
                                            </div>
                                            <span className="text-xs text-gray-400 mt-4 flex items-center gap-1 font-mono">
                                                Open Documentation <ExternalLink size={12} />
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 4: CHEATSHEET & STUDY NOTES */}
                        {activeTab === 'pdf' && (
                            <div className="space-y-5">
                                <div className="p-6 bg-slate-900/90 rounded-2xl border border-white/10 space-y-4">
                                    <h3 className="text-lg font-bold text-white">Study Notes & Reference Cheat Sheet</h3>
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        {studyData?.studyNotes?.definition || `Comprehensive guide and cheat sheet covering ${node.title}.`}
                                    </p>

                                    <div className="p-4 bg-black/50 rounded-xl border border-white/10 font-mono text-xs text-emerald-400 space-y-1">
                                        <div className="text-gray-400 font-bold text-[10px] uppercase">Core Code Snippet:</div>
                                        <pre className="overflow-x-auto text-xs py-1">
                                            {studyData?.studyNotes?.codeExample || `// ${node.title} Snippet\nconsole.log("${node.title} initialized");`}
                                        </pre>
                                    </div>

                                    {/* Download Study Guide File */}
                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            onClick={() => {
                                                const content = studyData?.studyNotes?.pdfGuide?.markdownContent || `# ${node.title}\n\nStudy guide for ${node.title}.`;
                                                const blob = new Blob([content], { type: 'text/markdown' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `${node.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_notes.md`;
                                                a.click();
                                            }}
                                            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2 transition-all"
                                        >
                                            <Download size={14} /> Download Markdown Study Notes (.md)
                                        </button>

                                        <a
                                            href={`https://www.google.com/search?q=${encodeURIComponent(node.title + ' cheat sheet pdf')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-mono flex items-center gap-1.5"
                                        >
                                            Search PDF Notes on Google <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 5: INTERACTIVE PRACTICE */}
                        {activeTab === 'practice' && (
                            <div className="p-8 text-center glass-card rounded-2xl border border-white/10 space-y-4 bg-slate-900/60">
                                <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mx-auto">
                                    <Code2 size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Interactive Coding Lab</h3>
                                <p className="text-xs text-gray-400 max-w-md mx-auto">
                                    Apply your knowledge of {node.title} by solving interactive challenges in the Skill Bridge AI Coding Lab.
                                </p>
                                <button
                                    onClick={onNavigateToCoding}
                                    className="px-6 py-3 bg-secondary text-black font-black rounded-xl text-xs shadow-lg hover:scale-105 transition-all"
                                >
                                    Launch Coding Lab Now
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EmbeddedMaterialModal;
