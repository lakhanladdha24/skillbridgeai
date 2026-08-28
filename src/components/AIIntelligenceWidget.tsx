import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, Target, AlertTriangle, Calendar, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

const AIIntelligenceWidget: React.FC = () => {
    const [summary, setSummary] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchIntelligenceSummary();
    }, []);

    const fetchIntelligenceSummary = async () => {
        try {
            const res = await fetch('/api/ml/intelligence-summary');
            const data = await res.json();
            setSummary(data);
        } catch (e) {
            // Fallback mock
            setSummary({
                overallProficiency: 76.5,
                careerPredictions: [
                    {
                        role: "AI Engineer",
                        match_score: 91.2,
                        confidence: "High",
                        explanation: {
                            positive_factors: ["Strong Python (85%)", "Machine Learning Foundations (70%)"],
                            areas_to_improve: ["Requires Deep Learning", "Requires MLOps"]
                        }
                    },
                    {
                        role: "ML Engineer",
                        match_score: 84.5,
                        confidence: "High",
                        explanation: {
                            positive_factors: ["Strong Python", "Data Structures"],
                            areas_to_improve: ["Requires Advanced Statistics"]
                        }
                    }
                ],
                dailyPlan: [
                    { task: "Revision: Statistics & Probability", duration_mins: 35, category: "Study Notes & Quiz", priority: "High" },
                    { task: "Coding Practice: LeetCode Medium Problem", duration_mins: 45, category: "Hands-on Coding", priority: "High" },
                    { task: "Curated Video Tutorial Session", duration_mins: 25, category: "Video Resource", priority: "Medium" }
                ],
                knowledgeDecayAlerts: [
                    { skill: "SQL Joins & Indexing", decayPercent: 18, lastPracticedDaysAgo: 14, action: "Revision Recommended" }
                ]
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="glass-card p-8 rounded-3xl border border-white/10 text-center animate-pulse text-primary font-bold">
                Loading AI/ML Intelligence Layer & Bayesian Knowledge State...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <BrainCircuit className="text-primary" size={26} />
                    AI Learning Intelligence & Career Predictions
                </h2>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono font-bold flex items-center gap-1">
                    <Sparkles size={12} /> ML Model Active
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 Cols: Career Prediction & Explainable AI */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Target className="text-secondary" size={18} /> Career Match Predictions (XAI)
                        </h3>

                        <div className="space-y-4">
                            {summary?.careerPredictions?.slice(0, 3).map((cp: any, idx: number) => (
                                <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-white text-base">{cp.role}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold text-primary">{cp.match_score}% Match</span>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-mono font-bold">
                                                {cp.confidence} Confidence
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                                            style={{ width: `${cp.match_score}%` }}
                                        />
                                    </div>

                                    {/* Explainable AI Factors */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                                        <div className="space-y-1">
                                            <span className="text-green-400 font-bold flex items-center gap-1">
                                                <ShieldCheck size={12} /> Matching Strengths:
                                            </span>
                                            {cp.explanation?.positive_factors?.map((f: string, i: number) => (
                                                <div key={i} className="text-gray-300 font-mono text-[11px]">• {f}</div>
                                            ))}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-yellow-400 font-bold flex items-center gap-1">
                                                <HelpCircle size={12} /> Target Gaps:
                                            </span>
                                            {cp.explanation?.areas_to_improve?.map((a: string, i: number) => (
                                                <div key={i} className="text-gray-400 font-mono text-[11px]">• {a}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right 5 Cols: Knowledge Decay & Daily Plan */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Knowledge Decay Alert Card */}
                    {summary?.knowledgeDecayAlerts?.length > 0 && (
                        <div className="glass-card p-6 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 space-y-3">
                            <h3 className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                                <AlertTriangle size={16} /> Knowledge Tracing & Decay Alert
                            </h3>
                            {summary.knowledgeDecayAlerts.map((al: any, idx: number) => (
                                <div key={idx} className="p-3 bg-black/40 rounded-xl border border-yellow-500/20 text-xs space-y-1">
                                    <div className="flex justify-between font-bold text-white">
                                        <span>{al.skill}</span>
                                        <span className="text-yellow-400">-{al.decayPercent}% Decay</span>
                                    </div>
                                    <p className="text-gray-400 text-[11px]">
                                        Inactive for {al.lastPracticedDaysAgo} days. Bayesian Knowledge Tracing suggests spaced revision.
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Today's Adaptive Daily Plan */}
                    <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Calendar className="text-primary" size={18} /> Today's Adaptive Daily Plan
                        </h3>

                        <div className="space-y-2">
                            {summary?.dailyPlan?.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-primary" />
                                        <div>
                                            <div className="font-bold text-white">{item.task}</div>
                                            <div className="text-[10px] text-gray-400 font-mono">{item.category} • {item.duration_mins} mins</div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                                        {item.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIIntelligenceWidget;
