import React, { useState } from 'react';
import { skillTestQuestions, Question } from '../data/skillTestQuestions';
import { codingQuestions } from '../data/codingQuestions';
import CodeEditor from '../components/CodeEditor';
import { motion } from 'framer-motion';
import { Code2, ClipboardList, Send, RotateCcw, CheckCircle, XCircle, Sparkles } from 'lucide-react';

const SkillTest: React.FC = () => {
    const [mode, setMode] = useState<'selection' | 'mcq' | 'coding'>('selection');
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    
    // MCQ State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [mcqScore, setMcqScore] = useState(0);
    const [showMcqResult, setShowMcqResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // Coding State
    const [currentCodingIndex, setCurrentCodingIndex] = useState(0);
    const [userCode, setUserCode] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [codingResult, setCodingResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'fail', feedback: string }>({ status: 'idle', feedback: '' });

    const skills = ["AI", "Web Dev", "DSA", "Python"];

    const questions: Question[] = selectedSkill
        ? skillTestQuestions.filter((q) => q.skill === selectedSkill)
        : [];

    const availableCodingQuestions = selectedSkill 
        ? codingQuestions.filter(q => q.category.toLowerCase().includes(selectedSkill.toLowerCase().split(' ')[0]))
        : codingQuestions;

    const handleMCQSubmit = () => {
        if (!selectedOption) return;
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.correctAnswer) setMcqScore(prev => prev + 1);
        
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
        } else {
            setShowMcqResult(true);
        }
    };

    const handleCodingSubmit = async () => {
        setCodingResult({ status: 'testing', feedback: 'AI is analyzing your code and running test cases...' });
        
        const question = availableCodingQuestions[currentCodingIndex];
        const prompt = `
            Task: Evaluate this coding solution.
            Problem: ${question.title} - ${question.description}
            Language: ${selectedLanguage}
            User Code: ${userCode}
            Test Cases: ${JSON.stringify(question.testCases)}

            Please provide:
            1. Status: SUCCESS or FAIL
            2. Concise Feedback: Why it works or why it failed.
            3. Possible Answers: List 3-4 different ways (architectural approaches) this could be solved (e.g., recursive, iterative, functional).
            
            Return format: JSON with "status", "feedback", and "alternatives" (array of strings).
        `;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: prompt, history: [] }),
            });
            const data = await response.json();
            
            // Try to extract JSON from AI response
            const text = data.reply;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                setCodingResult({ 
                    status: parsed.status === 'SUCCESS' ? 'success' : 'fail', 
                    feedback: parsed.feedback + "\n\n**Alternative Approaches:**\n" + parsed.alternatives.map((a: string) => `• ${a}`).join('\n')
                });
            } else {
                setCodingResult({ status: 'success', feedback: text });
            }
        } catch (error) {
            setCodingResult({ status: 'fail', feedback: 'Connection to AI Judge failed. Please try again.' });
        }
    };

    const reset = () => {
        setMode('selection');
        setSelectedSkill(null);
        setCurrentQuestionIndex(0);
        setMcqScore(0);
        setShowMcqResult(false);
        setCodingResult({ status: 'idle', feedback: '' });
        setCurrentCodingIndex(0);
    };

    if (mode === 'selection') {
        return (
            <div className="max-w-6xl mx-auto pt-20 px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        SkillBridge AI Assessment
                    </h1>
                    <p className="text-xl text-gray-400">Choose your assessment type and show your expertise.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setMode('mcq')}
                        className="glass-card p-8 rounded-2xl border-2 border-white/5 hover:border-primary/50 cursor-pointer group transition-all"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                            <ClipboardList size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Theoretical MCQ Test</h3>
                        <p className="text-gray-400">Test your conceptual knowledge with our AI-generated multiple choice questions.</p>
                    </motion.div>

                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setMode('coding')}
                        className="glass-card p-8 rounded-2xl border-2 border-white/5 hover:border-secondary/50 cursor-pointer group transition-all"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6 text-secondary group-hover:bg-secondary group-hover:text-black transition-all">
                            <Code2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Hands-on Coding Lab</h3>
                        <p className="text-gray-400">Solve real-world coding problems. Our AI will judge your code and provide feedback.</p>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (mode === 'coding') {
        const question = availableCodingQuestions[currentCodingIndex];
        
        if (!selectedSkill) {
            return (
                <div className="max-w-6xl mx-auto pt-20 px-4">
                    <h2 className="text-2xl font-bold mb-8">Select Domain for Coding Challenge</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {skills.map(s => (
                            <button 
                                key={s} 
                                onClick={() => {
                                    setSelectedSkill(s);
                                    const q = codingQuestions.find(cq => cq.category.toLowerCase().includes(s.toLowerCase().split(' ')[0]));
                                    setUserCode(q?.initialCode[selectedLanguage] || '');
                                }}
                                className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all text-center font-bold border border-white/10"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )
        }

        return (
            <div className="max-w-7xl mx-auto pt-20 px-4 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={reset} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <RotateCcw size={18} /> Back to Selection
                    </button>
                    <div className="flex gap-2">
                        {['javascript', 'python'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => {
                                    setSelectedLanguage(lang);
                                    setUserCode(question.initialCode[lang] || '');
                                }}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold uppercase transition-all ${selectedLanguage === lang ? 'bg-primary text-black' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="glass-card p-8 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded uppercase font-bold tracking-widest">{question.category}</span>
                                <span className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded uppercase font-bold tracking-widest">{question.difficulty}</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-4">{question.title}</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">{question.description}</p>
                            
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><Sparkles size={14} /> AI Solution Hint</h4>
                                <p className="text-sm text-gray-400">{question.solutionGuide}</p>
                            </div>
                        </div>

                        {codingResult.feedback && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-6 rounded-2xl border ${codingResult.status === 'success' ? 'bg-green-500/10 border-green-500/20' : codingResult.status === 'testing' ? 'bg-primary/10 border-primary/20 animate-pulse' : 'bg-red-500/10 border-red-500/20'}`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    {codingResult.status === 'success' ? <CheckCircle className="text-green-500" /> : codingResult.status === 'fail' ? <XCircle className="text-red-500" /> : <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                                    <h4 className="font-bold flex-1">{codingResult.status === 'testing' ? 'Evaluating Solution...' : codingResult.status === 'success' ? 'Solution Accepted!' : 'Review Required'}</h4>
                                </div>
                                <div className="text-gray-300 text-sm whitespace-pre-wrap prose prose-invert max-w-none">
                                    {codingResult.feedback}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <CodeEditor 
                            code={userCode} 
                            language={selectedLanguage} 
                            onChange={setUserCode} 
                        />
                        <button 
                            onClick={handleCodingSubmit}
                            disabled={codingResult.status === 'testing'}
                            className="w-full py-4 bg-primary text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            <Send size={18} />
                            Submit Solution
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Default MCQ behavior
    if (!selectedSkill) {
        return (
            <div className="max-w-6xl mx-auto pt-20 px-4">
                <button onClick={reset} className="mb-8 text-gray-400 hover:text-white transition-colors">← Back</button>
                <h2 className="text-2xl font-bold mb-8">Select Domain for Theory Test</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {skills.map(s => (
                        <button 
                            key={s} 
                            onClick={() => setSelectedSkill(s)}
                            className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all text-center font-bold border border-white/10"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    if (showMcqResult) {
        return (
            <div className="max-w-2xl mx-auto pt-20 px-4 text-center">
                <div className="glass-card p-12 rounded-3xl border border-white/10">
                    <h2 className="text-4xl font-bold mb-6">Assessment Complete!</h2>
                    <div className="text-6xl font-black text-primary mb-4">{mcqScore} / {questions.length}</div>
                    <p className="text-gray-400 mb-8">Great job! You have demonstrated solid theoretical knowledge in {selectedSkill}.</p>
                    <button onClick={reset} className="px-8 py-3 bg-primary text-black font-bold rounded-xl">Try Another Assessment</button>
                </div>
            </div>
        )
    }

    const currentQuestion = questions[currentQuestionIndex];
    return (
        <div className="max-w-3xl mx-auto pt-20 px-4">
            <div className="flex items-center justify-between mb-8">
                <button onClick={reset} className="text-gray-400 hover:text-white transition-colors">← Exit</button>
                <div className="text-sm font-bold tracking-widest text-gray-500 uppercase">Question {currentQuestionIndex + 1} / {questions.length}</div>
            </div>

            <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10">
                <h3 className="text-2xl font-bold mb-8 leading-relaxed">{currentQuestion.question}</h3>
                <div className="space-y-4 mb-10">
                    {currentQuestion.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedOption(opt)}
                            className={`w-full p-5 rounded-2xl text-left border-2 transition-all flex items-center gap-4 ${selectedOption === opt ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/10' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'}`}
                        >
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selectedOption === opt ? 'bg-primary text-black' : 'bg-white/10 border border-white/10'}`}>{String.fromCharCode(65 + i)}</span>
                            {opt}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={handleMCQSubmit}
                    disabled={!selectedOption}
                    className="w-full py-4 bg-primary text-black font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                </button>
            </div>
        </div>
    );
};

export default SkillTest;
