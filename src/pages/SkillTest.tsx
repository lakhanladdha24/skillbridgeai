import React, { useState, useEffect } from 'react';
import { assessmentBank, AssessmentQuestion } from '../data/assessmentBank';
import { 
    Clock, Bookmark, ArrowRight, ArrowLeft, 
    RotateCcw, Sparkles, BarChart2, Award, Zap, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnswerRecord {
    questionId: number;
    selectedOption: string | null;
    isMarkedForReview: boolean;
}

const STORAGE_KEY = 'skillbridge_assessment_v2_state';

const SkillTest: React.FC = () => {
    const navigate = useNavigate();

    // Mode state
    const [started, setStarted] = useState<boolean>(false);
    const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<number, AnswerRecord>>({});
    const [timerSeconds, setTimerSeconds] = useState<number>(3000); // 50 mins default (60s per Q)
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    // Filter questions by distribution if needed
    useEffect(() => {
        // Load stored state on mount if present
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.questions && parsed.questions.length > 0 && !parsed.isSubmitted) {
                    setQuestions(parsed.questions);
                    setAnswers(parsed.answers || {});
                    setCurrentIndex(parsed.currentIndex || 0);
                    setTimerSeconds(parsed.timerSeconds || 3000);
                    setStarted(true);
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, []);

    // Save state on change
    useEffect(() => {
        if (started && !isSubmitted) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                questions,
                answers,
                currentIndex,
                timerSeconds,
                isSubmitted: false
            }));
        }
    }, [started, questions, answers, currentIndex, timerSeconds, isSubmitted]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (started && !isSubmitted && timerSeconds > 0) {
            interval = setInterval(() => {
                setTimerSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        handleFinalSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [started, isSubmitted, timerSeconds]);

    const startAssessment = () => {
        // Select 50 balanced questions from assessmentBank
        let selected: AssessmentQuestion[] = [...assessmentBank];

        // Shuffle if more than 50
        if (selected.length > 50) {
            selected = selected.sort(() => 0.5 - Math.random()).slice(0, 50);
        }

        const initialAnswers: Record<number, AnswerRecord> = {};
        selected.forEach((q) => {
            initialAnswers[q.id] = { questionId: q.id, selectedOption: null, isMarkedForReview: false };
        });

        setQuestions(selected);
        setAnswers(initialAnswers);
        setCurrentIndex(0);
        setTimerSeconds(3000);
        setStarted(true);
        setIsSubmitted(false);
        setAnalysisResult(null);
    };

    const handleOptionSelect = (option: string) => {
        const currentQ = questions[currentIndex];
        setAnswers((prev) => ({
            ...prev,
            [currentQ.id]: {
                ...prev[currentQ.id],
                selectedOption: option
            }
        }));
    };

    const toggleMarkForReview = () => {
        const currentQ = questions[currentIndex];
        setAnswers((prev) => ({
            ...prev,
            [currentQ.id]: {
                ...prev[currentQ.id],
                isMarkedForReview: !prev[currentQ.id]?.isMarkedForReview
            }
        }));
    };

    const handleFinalSubmit = async () => {
        setIsSubmitted(true);
        localStorage.removeItem(STORAGE_KEY);

        // Convert answers dict to array format
        const answerList = Object.values(answers);
        const totalTimeSpent = 3000 - timerSeconds;

        try {
            const res = await fetch('/api/assessment/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'local_user',
                    answers: answerList,
                    questions,
                    timeSpentSeconds: totalTimeSpent
                })
            });
            const data = await res.json();
            if (data.success && data.analysis) {
                setAnalysisResult(data.analysis);
            } else {
                // Fallback client-side score computation if backend unreachable
                computeLocalResult(answerList, totalTimeSpent);
            }
        } catch (e) {
            computeLocalResult(answerList, totalTimeSpent);
        }
    };

    const computeLocalResult = (_answerList: AnswerRecord[], timeSpent: number) => {
        let score = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let unattemptedCount = 0;

        const categoryStats: Record<string, { score: number; total: number }> = {};
        const skillMap: Record<string, { score: number; total: number }> = {};

        questions.forEach((q) => {
            const cat = q.category;
            const sk = q.skill;
            if (!categoryStats[cat]) categoryStats[cat] = { score: 0, total: 0 };
            if (!skillMap[sk]) skillMap[sk] = { score: 0, total: 0 };

            categoryStats[cat].total += 1;
            skillMap[sk].total += 1;

            const userAns = answers[q.id]?.selectedOption;
            if (!userAns) {
                unattemptedCount += 1;
            } else if (userAns === q.correctAnswer) {
                score += 1;
                correctCount += 1;
                categoryStats[cat].score += 1;
                skillMap[sk].score += 1;
            } else {
                incorrectCount += 1;
            }
        });

        const percentage = Math.round((score / Math.max(questions.length, 1)) * 100);
        const categoryScores = Object.keys(categoryStats).map((cat) => ({
            category: cat,
            score: categoryStats[cat].score,
            total: categoryStats[cat].total,
            percentage: Math.round((categoryStats[cat].score / categoryStats[cat].total) * 100)
        }));

        const skillProfiles = Object.keys(skillMap).map((sk) => {
            const pct = Math.round((skillMap[sk].score / skillMap[sk].total) * 100);
            let level = 'Beginner';
            if (pct >= 90) level = 'Professional';
            else if (pct >= 80) level = 'Advanced';
            else if (pct >= 70) level = 'Upper Intermediate';
            else if (pct >= 55) level = 'Intermediate';
            else if (pct >= 40) level = 'Elementary';
            return { skill: sk, percentage: pct, level };
        });

        const strongSkills = skillProfiles.filter((s) => s.percentage >= 70).map((s) => s.skill);
        const weakSkills = skillProfiles.filter((s) => s.percentage < 70).map((s) => s.skill);

        setAnalysisResult({
            totalQuestions: questions.length,
            score,
            percentage,
            correctAnswers: correctCount,
            incorrectAnswers: incorrectCount,
            unattempted: unattemptedCount,
            timeSpentSeconds: timeSpent,
            categoryScores,
            skillProfiles,
            strongSkills,
            weakSkills,
            missingSkills: ["System Design", "Cloud Computing"],
            recommendedSkills: [...weakSkills, "System Design"].slice(0, 5)
        });
    };

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remSecs = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
    };

    // --- LANDING SCREEN ---
    if (!started) {
        return (
            <div className="max-w-5xl mx-auto pt-12 px-4 pb-20">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-sm mb-4">
                        <Sparkles size={16} /> Skill Bridge AI V2 Assessment Engine
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                        50-Question Comprehensive Assessment
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Evaluate your technical proficiency across Programming, Computer Science, AI/Data, Aptitude, Reasoning, and System Architecture.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                        <Layers className="text-primary mb-3" size={32} />
                        <h3 className="text-xl font-bold mb-2">6 Domains Covered</h3>
                        <p className="text-gray-400 text-sm">Programming, CS Fundamentals, AI/ML, Aptitude, Logical Reasoning, and System Design.</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                        <Clock className="text-secondary mb-3" size={32} />
                        <h3 className="text-xl font-bold mb-2">50 Minutes Duration</h3>
                        <p className="text-gray-400 text-sm">Adaptive timer with auto-saving progress in case of page refresh.</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                        <BarChart2 className="text-accent mb-3" size={32} />
                        <h3 className="text-xl font-bold mb-2">AI Skill Profile</h3>
                        <p className="text-gray-400 text-sm">Instant skill classification (Beginner to Professional) and personalized roadmap trigger.</p>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-3xl border border-white/10 text-center max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4">Ready to Start Your Assessment?</h3>
                    <p className="text-gray-400 mb-6">Ensure a stable connection. You can mark questions for review and skip as needed.</p>
                    <button
                        onClick={startAssessment}
                        className="px-8 py-4 bg-primary text-black font-black text-lg rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                        Start 50-Question Assessment
                    </button>
                </div>
            </div>
        );
    }

    // --- ASSESSMENT RESULT SCREEN ---
    if (isSubmitted && analysisResult) {
        return (
            <div className="max-w-6xl mx-auto pt-10 px-4 pb-20">
                <div className="text-center mb-10">
                    <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h1 className="text-4xl font-black mb-2">Assessment Results & AI Skill Profile</h1>
                    <p className="text-gray-400">Detailed breakdown of your performance across categories and skill levels.</p>
                </div>

                {/* Score Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
                        <div className="text-4xl font-black text-primary mb-1">{analysisResult.percentage}%</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Overall Score</div>
                        <div className="text-sm font-semibold text-gray-300 mt-1">{analysisResult.score} / {analysisResult.totalQuestions}</div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
                        <div className="text-4xl font-black text-green-400 mb-1">{analysisResult.correctAnswers}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Correct</div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
                        <div className="text-4xl font-black text-red-400 mb-1">{analysisResult.incorrectAnswers}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Incorrect</div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
                        <div className="text-4xl font-black text-yellow-400 mb-1">{analysisResult.unattempted}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Unattempted</div>
                    </div>
                </div>

                {/* Category Breakdown & Skill Profiles */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <BarChart2 className="text-primary" size={20} /> Category Performance
                        </h3>
                        <div className="space-y-4">
                            {analysisResult.categoryScores?.map((cat: any) => (
                                <div key={cat.category}>
                                    <div className="flex justify-between text-sm mb-1 font-semibold">
                                        <span>{cat.category}</span>
                                        <span className="text-primary">{cat.percentage}% ({cat.score}/{cat.total})</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/5">
                                        <div 
                                            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500" 
                                            style={{ width: `${cat.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Zap className="text-secondary" size={20} /> Classified Skill Levels
                        </h3>
                        <div className="space-y-3">
                            {analysisResult.skillProfiles?.map((sk: any) => (
                                <div key={sk.skill} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="font-semibold text-sm">{sk.skill}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-gray-400">{sk.percentage}%</span>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                                            sk.level === 'Professional' || sk.level === 'Advanced' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                            sk.level === 'Upper Intermediate' || sk.level === 'Intermediate' ? 'bg-primary/20 text-primary border border-primary/30' :
                                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        }`}>
                                            {sk.level}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recommendations & Roadmap Action */}
                <div className="glass-card p-8 rounded-3xl border border-primary/30 bg-primary/5 text-center">
                    <h3 className="text-2xl font-bold mb-2">Connect Assessment Results to Personalized Roadmap</h3>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-6 text-sm">
                        Based on your strengths ({analysisResult.strongSkills?.join(', ') || 'General'}) and weak areas ({analysisResult.weakSkills?.join(', ') || 'Advanced Topics'}), Skill Bridge AI can auto-generate a targeted learning roadmap that skips concepts you've mastered.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/career-path')}
                            className="px-8 py-3.5 bg-primary text-black font-black rounded-xl shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                        >
                            Generate Personalized Roadmap <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                setStarted(false);
                            }}
                            className="px-6 py-3.5 bg-white/5 border border-white/10 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            <RotateCcw size={16} /> Retake Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- ACTIVE ASSESSMENT QUESTION SCREEN ---
    const currentQ = questions[currentIndex];
    const currentAns = answers[currentQ?.id];

    return (
        <div className="max-w-7xl mx-auto pt-6 px-4 pb-20">
            {/* Top Navigation & Status Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 p-4 glass-card rounded-2xl border border-white/10">
                <div className="flex items-center gap-4">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-primary/20 text-primary font-bold font-mono">
                        Question {currentIndex + 1} / {questions.length}
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/10 font-medium">
                        Category: <strong className="text-white">{currentQ?.category}</strong> ({currentQ?.subcategory})
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded font-bold uppercase ${
                        currentQ?.difficulty === 'Easy' ? 'text-green-400 bg-green-500/10' :
                        currentQ?.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-500/10' :
                        'text-red-400 bg-red-500/10'
                    }`}>
                        {currentQ?.difficulty}
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 font-mono font-bold text-lg text-primary">
                        <Clock size={20} /> {formatTime(timerSeconds)}
                    </div>
                    <button
                        onClick={handleFinalSubmit}
                        className="px-5 py-2 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl text-sm transition-all"
                    >
                        Submit Test
                    </button>
                </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full bg-white/5 h-2 rounded-full mb-6 overflow-hidden border border-white/5">
                <div 
                    className="bg-gradient-to-r from-primary via-secondary to-accent h-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* Main Question & Question Palette Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left 3 Cols: Question & Options */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="glass-card p-8 rounded-3xl border border-white/10 min-h-[360px] flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold mb-6 leading-relaxed">
                                {currentQ?.question}
                            </h2>

                            <div className="space-y-3 mb-6">
                                {currentQ?.options.map((opt, i) => {
                                    const isSelected = currentAns?.selectedOption === opt;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleOptionSelect(opt)}
                                            className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center gap-4 ${
                                                isSelected 
                                                    ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/10' 
                                                    : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/20'
                                            }`}
                                        >
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                                isSelected ? 'bg-primary text-black' : 'bg-white/10 text-gray-400 border border-white/10'
                                            }`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <span className="text-base font-medium">{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Question Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                            <button
                                onClick={toggleMarkForReview}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${
                                    currentAns?.isMarkedForReview
                                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                }`}
                            >
                                <Bookmark size={16} />
                                {currentAns?.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
                            </button>

                            <div className="flex gap-3">
                                <button
                                    disabled={currentIndex === 0}
                                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                                    className="px-5 py-2.5 bg-white/5 border border-white/10 text-gray-300 font-bold rounded-xl hover:bg-white/10 disabled:opacity-30 transition-all flex items-center gap-2 text-sm"
                                >
                                    <ArrowLeft size={16} /> Previous
                                </button>

                                <button
                                    onClick={() => {
                                        if (currentIndex < questions.length - 1) {
                                            setCurrentIndex((prev) => prev + 1);
                                        } else {
                                            handleFinalSubmit();
                                        }
                                    }}
                                    className="px-6 py-2.5 bg-primary text-black font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 text-sm"
                                >
                                    {currentIndex === questions.length - 1 ? 'Finish Test' : 'Next'} <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Question Navigation Palette */}
                <div className="space-y-4">
                    <div className="glass-card p-5 rounded-3xl border border-white/10">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                            <span>Question Palette</span>
                            <span className="font-mono text-xs text-primary">{Object.values(answers).filter(a => a.selectedOption).length}/50 Answered</span>
                        </h4>

                        <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
                            {questions.map((q, idx) => {
                                const ans = answers[q.id];
                                const isCurrent = idx === currentIndex;
                                const isAnswered = !!ans?.selectedOption;
                                const isMarked = !!ans?.isMarkedForReview;

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-full aspect-square rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center border ${
                                            isCurrent ? 'ring-2 ring-primary border-primary bg-primary/30 text-white font-black' :
                                            isMarked ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' :
                                            isAnswered ? 'bg-green-500/20 border-green-500/40 text-green-400' :
                                            'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-gray-400 font-medium">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500" /> Answered
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500" /> Marked for Review
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-white/5 border border-white/20" /> Unanswered / Skipped
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillTest;
