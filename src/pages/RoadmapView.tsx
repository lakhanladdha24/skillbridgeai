import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, Trophy, ArrowRight, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VisualFlowchart, { FlowchartNode } from '../components/VisualFlowchart';
import EmbeddedMaterialModal from '../components/EmbeddedMaterialModal';

interface TopicNode {
    topicId: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
    estimatedHours: number;
    completed: boolean;
    prerequisites?: string[];
}

interface Phase {
    phaseId: string;
    title: string;
    description: string;
    topics: TopicNode[];
}

const RoadmapView: React.FC = () => {
    const navigate = useNavigate();
    const [userGoal, setUserGoal] = useState<string>('');
    const [studyTime, setStudyTime] = useState<string>('2 hours/day');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    // Active Generated Roadmap State
    const [roadmapData, setRoadmapData] = useState<any>({
        goal: 'Machine Learning',
        estimatedDuration: '4–6 months',
        studyTimeDaily: '2 hours/day',
        completionPercentage: 25,
        semanticMatchScore: 98.4,
        phases: []
    });

    // Modal Drawer State
    const [selectedTopic, setSelectedTopic] = useState<FlowchartNode | null>(null);
    const [topicStudyData, setTopicStudyData] = useState<any>(null);
    const [isLoadingStudy, setIsLoadingStudy] = useState<boolean>(false);

    // Completion Celebration State
    const [showCompletionCeremony, setShowCompletionCeremony] = useState<boolean>(false);

    useEffect(() => {
        handleSearchRoadmapQuery('Machine Learning');
    }, []);

    const handleOpenTopic = async (node: FlowchartNode) => {
        setSelectedTopic(node);
        setIsLoadingStudy(true);

        try {
            const [studyRes, videoRes] = await Promise.all([
                fetch(`/api/study/topic?q=${encodeURIComponent(node.title)}`),
                fetch(`/api/videos/recommend?q=${encodeURIComponent(node.title)}`)
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
                setShowCompletionCeremony(true);
            }

            return {
                ...prev,
                completionPercentage: newPercentage,
                phases: updatedPhases
            };
        });
    };

    const quickCourses = [
        'Machine Learning',
        'Python',
        'Java',
        'React',
        'Data Science',
        'Artificial Intelligence',
        'Generative AI',
        'Web Development',
        'AWS',
        'Cybersecurity'
    ];

    const handleSearchRoadmapQuery = async (queryText: string) => {
        const target = queryText || userGoal || 'Machine Learning';
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
            // Keep current
        } finally {
            setIsGenerating(false);
        }
    };

    // Calculate All Nodes & Find Recommended Next Topic
    const allTopicsList: FlowchartNode[] = roadmapData.phases?.flatMap((ph: Phase, pIdx: number) =>
        ph.topics.map((t, tIdx) => {
            let level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery' = 'Beginner';
            if (pIdx === 1 || tIdx === 1) level = 'Intermediate';
            if (pIdx === 2 || t.difficulty === 'Advanced') level = 'Advanced';
            if (pIdx >= 3 || t.difficulty === 'Mastery') level = 'Mastery';

            // Check if locked (if prerequisites uncompleted)
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
                estimatedHours: t.estimatedHours,
                completed: isCompleted,
                locked: isLocked,
                prerequisites: prereqs
            };
        })
    ) || [];

    const completedCount = allTopicsList.filter(n => n.completed).length;
    const totalTopicsCount = allTopicsList.length;

    // Recommended Next Topic logic
    const recommendedNextTopic = allTopicsList.find(n => !n.completed && !n.locked) || allTopicsList.find(n => !n.completed);

    return (
        <div className="max-w-6xl mx-auto pt-8 px-4 pb-20">
            {/* Header & Goal Input */}
            <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-mono text-xs mb-3">
                    <Compass size={14} /> Dynamic AI Learning Roadmap System
                </span>
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                    AI-Generated Learning Roadmap
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                    Search any course, skill, programming language, or career goal to dynamically generate an interactive prerequisite-gated learning path.
                </p>
            </div>

            {/* Search Input Bar */}
            <div className="glass-card p-4 rounded-3xl border border-white/10 max-w-3xl mx-auto mb-6 flex flex-col md:flex-row items-center gap-3">
                <input
                    type="text"
                    placeholder="Search any course (e.g. Machine Learning, Python, React, Java, AWS, Cybersecurity)..."
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
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-10">
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

            {/* Progress Bar Header */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <Trophy size={18} className="text-amber-400" />
                        <h2 className="text-lg font-bold text-white">{roadmapData.goal} Roadmap</h2>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            {roadmapData.semanticMatchScore || 98.4}% Match
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                        {completedCount} / {totalTopicsCount} Topics Completed • {roadmapData.estimatedDuration} Total
                    </p>
                </div>

                <div className="w-full md:w-72 space-y-2">
                    <div className="flex justify-between text-xs font-bold font-mono">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-primary">{roadmapData.completionPercentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                        <div
                            className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500"
                            style={{ width: `${roadmapData.completionPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* RECOMMENDED NEXT TOPIC BANNER */}
            {recommendedNextTopic && (
                <div className="p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent rounded-3xl border border-primary/30 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                            <Target size={14} /> Recommended Next Topic
                        </span>
                        <h3 className="text-lg font-bold text-white">{recommendedNextTopic.title}</h3>
                        <p className="text-xs text-gray-400">{recommendedNextTopic.description}</p>
                    </div>

                    <button
                        onClick={() => handleOpenTopic(recommendedNextTopic)}
                        className="px-6 py-3 bg-primary text-black font-black text-xs rounded-2xl hover:bg-primary/90 transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-primary/20"
                    >
                        Start Next Topic <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* Interactive Visual Flowchart Component */}
            <div className="mb-12">
                <VisualFlowchart
                    courseTitle={roadmapData.goal}
                    nodes={allTopicsList}
                    onNodeClick={handleOpenTopic}
                    onToggleComplete={toggleTopicComplete}
                />
            </div>

            {/* Detailed Topic View Modal */}
            <EmbeddedMaterialModal
                node={selectedTopic}
                studyData={topicStudyData}
                isLoading={isLoadingStudy}
                onClose={() => setSelectedTopic(null)}
                onToggleComplete={(id) => {
                    toggleTopicComplete(id);
                    if (selectedTopic) setSelectedTopic({ ...selectedTopic, completed: !selectedTopic.completed });
                }}
                onNavigateToCoding={() => navigate('/coding-lab')}
            />

            {/* ROADMAP COMPLETION CEREMONY MODAL */}
            {showCompletionCeremony && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-emerald-500/50 bg-gray-950 text-center space-y-6 shadow-2xl">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                            <Trophy size={36} />
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                                🎉 Roadmap 100% Completed!
                            </span>
                            <h2 className="text-2xl font-black text-white">
                                Congratulations! You Mastered {roadmapData.goal}!
                            </h2>
                            <p className="text-xs text-gray-400">
                                You have successfully completed all {totalTopicsCount} topics in this learning path. You are now ready for real-world projects and technical interviews!
                            </p>
                        </div>

                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left space-y-2 font-mono text-xs text-gray-300">
                            <div className="font-bold text-primary">🚀 Next Recommended Steps:</div>
                            <div>✓ Publish Capstone Projects on GitHub</div>
                            <div>✓ Practice LeetCode Problems in Coding Lab</div>
                            <div>✓ Update Resume with Portfolio Achievements</div>
                        </div>

                        <button
                            onClick={() => setShowCompletionCeremony(false)}
                            className="w-full py-3.5 bg-primary text-black font-black text-xs rounded-2xl shadow-lg hover:bg-primary/90 transition-all"
                        >
                            Continue Learning Track
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoadmapView;
