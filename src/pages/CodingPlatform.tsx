import React, { useState } from 'react';
import { leetcodeProblems, CodingProblem } from '../data/leetcodeProblems';
import CodeEditor from '../components/CodeEditor';
import { 
    Play, Send, CheckCircle2, XCircle, Clock, Cpu, Code2, 
    BookOpen, Lightbulb, Search, Filter
} from 'lucide-react';

const CodingPlatform: React.FC = () => {
    const [selectedProblem, setSelectedProblem] = useState<CodingProblem>(leetcodeProblems[0]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
    const [userCode, setUserCode] = useState<string>(leetcodeProblems[0].starterCode.python);
    const [activeTab, setActiveTab] = useState<'description' | 'solution' | 'hints'>('description');

    // Bottom Console State
    const [consoleActiveTab, setConsoleActiveTab] = useState<'testcases' | 'custom' | 'result'>('testcases');
    const [customInput, setCustomInput] = useState<string>('');
    const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const [executionResult, setExecutionResult] = useState<any>(null);

    // Search and Filters
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('All');

    const handleSelectProblem = (p: CodingProblem) => {
        setSelectedProblem(p);
        const code = p.starterCode[selectedLanguage as keyof typeof p.starterCode] || p.starterCode.python;
        setUserCode(code);
        setExecutionResult(null);
    };

    const handleLanguageChange = (lang: string) => {
        setSelectedLanguage(lang);
        const code = selectedProblem.starterCode[lang as keyof typeof selectedProblem.starterCode] || selectedProblem.starterCode.python;
        setUserCode(code);
    };

    const handleRunCode = async () => {
        setIsExecuting(true);
        setConsoleActiveTab('result');

        try {
            const isCustom = consoleActiveTab === 'custom';
            const res = await fetch('/api/code/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: selectedLanguage,
                    code: userCode,
                    testCases: selectedProblem.testCases,
                    customInput: isCustom ? customInput : null
                })
            });
            const data = await res.json();
            setExecutionResult(data);
        } catch (err: any) {
            setExecutionResult({
                status: 'Runtime Error',
                message: err.message || 'Execution service error',
                results: []
            });
        } finally {
            setIsExecuting(false);
        }
    };

    const handleSubmitCode = async () => {
        setIsExecuting(true);
        setConsoleActiveTab('result');

        try {
            const res = await fetch('/api/code/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'local_user',
                    problemId: selectedProblem.id,
                    language: selectedLanguage,
                    code: userCode,
                    testCases: selectedProblem.testCases,
                    hiddenTestCases: selectedProblem.hiddenTestCases
                })
            });
            const data = await res.json();
            setExecutionResult(data);
        } catch (err: any) {
            setExecutionResult({
                status: 'Runtime Error',
                message: err.message || 'Submission service error',
                results: []
            });
        } finally {
            setIsExecuting(false);
        }
    };

    const filteredProblems = leetcodeProblems.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
        return matchesSearch && matchesDiff;
    });

    return (
        <div className="max-w-[1600px] mx-auto pt-4 px-4 pb-16 min-h-screen flex flex-col gap-4">
            {/* Top Bar: Problem Selector & Filters */}
            <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search coding problems by title or topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-full"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-semibold">
                        <Filter size={14} /> Difficulty:
                    </span>
                    {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
                        <button
                            key={d}
                            onClick={() => setDifficultyFilter(d)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                difficultyFilter === d
                                    ? 'bg-primary text-black'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                            }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split Screen Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
                {/* Left Panel: Problem List + Details (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    {/* Problem List Selector Pill Strip */}
                    <div className="glass-card p-3 rounded-2xl border border-white/10 flex gap-2 overflow-x-auto">
                        {filteredProblems.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => handleSelectProblem(p)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                                    selectedProblem.id === p.id
                                        ? 'bg-primary/20 border-primary text-primary shadow-md'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                }`}
                            >
                                {p.title}
                            </button>
                        ))}
                    </div>

                    {/* Problem Description Panel */}
                    <div className="glass-card p-6 rounded-3xl border border-white/10 flex-1 flex flex-col justify-between overflow-y-auto max-h-[720px]">
                        <div>
                            {/* Problem Header */}
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <h1 className="text-2xl font-black">{selectedProblem.title}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    selectedProblem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                    selectedProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                    'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                    {selectedProblem.difficulty}
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedProblem.tags.map((t) => (
                                    <span key={t} className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 text-gray-400 font-mono border border-white/5">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* Sub Nav Tabs */}
                            <div className="flex gap-4 border-b border-white/10 pb-3 mb-6">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`text-sm font-bold pb-1 transition-all ${
                                        activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
                                    }`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab('solution')}
                                    className={`text-sm font-bold pb-1 transition-all ${
                                        activeTab === 'solution' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
                                    }`}
                                >
                                    Solution Concept
                                </button>
                                <button
                                    onClick={() => setActiveTab('hints')}
                                    className={`text-sm font-bold pb-1 transition-all ${
                                        activeTab === 'hints' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
                                    }`}
                                >
                                    Hints & Explanation
                                </button>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'description' && (
                                <div className="space-y-6 text-sm text-gray-300">
                                    <p className="whitespace-pre-line leading-relaxed font-sans">{selectedProblem.description}</p>

                                    {/* Examples */}
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-white text-base">Examples:</h4>
                                        {selectedProblem.examples.map((ex, idx) => (
                                            <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 font-mono text-xs space-y-2">
                                                <div><strong className="text-primary">Input:</strong> {ex.input}</div>
                                                <div><strong className="text-secondary">Output:</strong> {ex.output}</div>
                                                {ex.explanation && <div className="text-gray-400 font-sans"><strong className="text-gray-300">Explanation:</strong> {ex.explanation}</div>}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Constraints */}
                                    <div>
                                        <h4 className="font-bold text-white text-base mb-2">Constraints:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-xs font-mono text-gray-400">
                                            {selectedProblem.constraints.map((c, i) => (
                                                <li key={i}>{c}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'solution' && (
                                <div className="space-y-4 text-sm text-gray-300">
                                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                                        <h4 className="font-bold text-primary mb-1 flex items-center gap-2">
                                            <BookOpen size={16} /> Optimal Approach
                                        </h4>
                                        <p>{selectedProblem.solution}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'hints' && (
                                <div className="space-y-4 text-sm text-gray-300">
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                                        <h4 className="font-bold text-yellow-400 mb-1 flex items-center gap-2">
                                            <Lightbulb size={16} /> Solution Hint
                                        </h4>
                                        <p>{selectedProblem.explanation}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Code Editor + Execution Console (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    {/* Top Editor Bar: Language Selector & Actions */}
                    <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Code2 className="text-primary" size={20} />
                            <span className="text-sm font-bold text-gray-400">Language:</span>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="bg-white/10 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-xl border border-white/10 focus:outline-none cursor-pointer"
                            >
                                {selectedProblem.supportedLanguages.map((lang) => (
                                    <option key={lang} value={lang} className="bg-gray-900 text-white">
                                        {lang}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRunCode}
                                disabled={isExecuting}
                                className="px-5 py-2 bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                                <Play size={14} className="text-green-400" /> Run Code
                            </button>

                            <button
                                onClick={handleSubmitCode}
                                disabled={isExecuting}
                                className="px-6 py-2 bg-primary text-black font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                <Send size={14} /> Submit Solution
                            </button>
                        </div>
                    </div>

                    {/* Code Editor Container */}
                    <div className="flex-1 min-h-[380px] glass-card rounded-3xl border border-white/10 overflow-hidden">
                        <CodeEditor
                            code={userCode}
                            language={selectedLanguage}
                            onChange={(val) => setUserCode(val)}
                        />
                    </div>

                    {/* Bottom Execution Console */}
                    <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
                        {/* Console Sub Tabs */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setConsoleActiveTab('testcases')}
                                    className={`text-xs font-bold pb-1 transition-all ${
                                        consoleActiveTab === 'testcases' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
                                    }`}
                                >
                                    Visible Test Cases
                                </button>
                                <button
                                    onClick={() => setConsoleActiveTab('custom')}
                                    className={`text-xs font-bold pb-1 transition-all ${
                                        consoleActiveTab === 'custom' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
                                    }`}
                                >
                                    Custom Input
                                </button>
                                <button
                                    onClick={() => setConsoleActiveTab('result')}
                                    className={`text-xs font-bold pb-1 transition-all ${
                                        consoleActiveTab === 'result' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
                                    }`}
                                >
                                    Execution Console Output {executionResult && `(${executionResult.status})`}
                                </button>
                            </div>

                            {/* Execution Specs Metrics */}
                            {executionResult && (
                                <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} className="text-primary" /> {executionResult.executionTimeMs || 2}ms
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Cpu size={12} className="text-secondary" /> {executionResult.memoryKb || 14200} KB
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Console Content */}
                        {consoleActiveTab === 'testcases' && (
                            <div className="space-y-3">
                                {selectedProblem.testCases.map((tc, idx) => (
                                    <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono text-xs flex justify-between items-center">
                                        <div>
                                            <span className="text-gray-400">Case {idx + 1}: </span>
                                            <span className="text-white">{tc.input}</span>
                                        </div>
                                        <span className="text-gray-400">Expected: {tc.output}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {consoleActiveTab === 'custom' && (
                            <div>
                                <textarea
                                    rows={3}
                                    placeholder="Enter custom input JSON or plain text..."
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                        )}

                        {consoleActiveTab === 'result' && (
                            <div>
                                {isExecuting ? (
                                    <div className="p-6 text-center text-sm font-semibold text-primary animate-pulse flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        Running sandboxed code execution service...
                                    </div>
                                ) : executionResult ? (
                                    <div className="space-y-4">
                                        {/* Status Header */}
                                        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                                            executionResult.status === 'Accepted'
                                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                                        }`}>
                                            {executionResult.status === 'Accepted' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                                            <div>
                                                <h4 className="font-bold text-base">{executionResult.status}</h4>
                                                <p className="text-xs text-gray-300">{executionResult.message}</p>
                                            </div>
                                        </div>

                                        {/* Detailed Results List */}
                                        {executionResult.results?.length > 0 && (
                                            <div className="space-y-2">
                                                {executionResult.results.map((r: any, idx: number) => (
                                                    <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono text-xs flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {r.passed ? <span className="text-green-400 font-bold">✓ Pass</span> : <span className="text-red-400 font-bold">✗ Fail</span>}
                                                            <span className="text-gray-300">Test {r.testCaseIndex}: {r.input}</span>
                                                        </div>
                                                        <div className="text-gray-400">
                                                            Actual: <span className={r.passed ? 'text-green-400' : 'text-red-400'}>{r.actualOutput}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-500 text-center py-4">Click "Run Code" or "Submit Solution" to inspect compilation and output.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingPlatform;
