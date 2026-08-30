import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Video, FileText, Download, Code2, CheckCircle2, 
    Sparkles, BookOpen, ExternalLink
} from 'lucide-react';
import { FlowchartNode } from './VisualFlowchart';

interface EmbeddedMaterialModalProps {
    node: FlowchartNode | null;
    studyData: any;
    isLoading: boolean;
    onClose: () => void;
    onNavigateToCoding: () => void;
}

const EmbeddedMaterialModal: React.FC<EmbeddedMaterialModalProps> = ({
    node,
    studyData,
    isLoading,
    onClose,
    onNavigateToCoding
}) => {
    const [activeTab, setActiveTab] = useState<'video' | 'article' | 'pdf' | 'practice'>('video');
    const [selectedVidIdx, setSelectedVidIdx] = useState<number>(0);

    if (!node) return null;

    const currentVideo = studyData?.videos?.[selectedVidIdx] || studyData?.videos?.[0];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="w-full max-w-5xl bg-gray-950 border border-white/10 rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Top Header Bar */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-white/5">
                        <div>
                            <span className="text-xs text-primary font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                                <Sparkles size={14} /> In-App Learning Hub — Skill Bridge AI
                            </span>
                            <h2 className="text-2xl font-black text-white">{node.title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Tabs Bar */}
                    <div className="flex border-b border-white/10 px-6 gap-6 bg-black/40 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('video')}
                            className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'video'
                                    ? 'text-primary border-primary'
                                    : 'text-gray-400 border-transparent hover:text-white'
                            }`}
                        >
                            <Video size={16} /> In-App Video Tutorial
                        </button>
                        <button
                            onClick={() => setActiveTab('article')}
                            className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'article'
                                    ? 'text-primary border-primary'
                                    : 'text-gray-400 border-transparent hover:text-white'
                            }`}
                        >
                            <FileText size={16} /> GfG / W3Schools Article
                        </button>
                        <button
                            onClick={() => setActiveTab('pdf')}
                            className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'pdf'
                                    ? 'text-primary border-primary'
                                    : 'text-gray-400 border-transparent hover:text-white'
                            }`}
                        >
                            <Download size={16} /> PDF Handbook & Cheat Sheet
                        </button>
                        <button
                            onClick={() => setActiveTab('practice')}
                            className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                                activeTab === 'practice'
                                    ? 'text-primary border-primary'
                                    : 'text-gray-400 border-transparent hover:text-white'
                            }`}
                        >
                            <Code2 size={16} /> Interactive Practice
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
                        {isLoading ? (
                            <div className="p-12 text-center text-primary font-semibold animate-pulse flex items-center justify-center gap-3">
                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                Loading grounded study notes, embedded video & PDF handbook...
                            </div>
                        ) : (
                            <>
                                {/* TAB 1: IN-APP VIDEO PLAYER */}
                                {activeTab === 'video' && (
                                    <div className="space-y-4">
                                        {currentVideo ? (
                                            <>
                                                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg">
                                                    <iframe
                                                        src={currentVideo.embedUrl || "https://www.youtube-nocookie.com/embed/Ej_02ICOIgs"}
                                                        title={currentVideo.title}
                                                        className="w-full h-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>

                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                    <div>
                                                        <h4 className="font-bold text-white text-base">{currentVideo.title}</h4>
                                                        <p className="text-xs text-gray-400">{currentVideo.summary}</p>
                                                        <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mt-2">
                                                            <span>Creator: {currentVideo.creator}</span>
                                                            <span>Duration: {currentVideo.duration}</span>
                                                            <span className="text-yellow-400 font-bold">Rating: {currentVideo.ratingText || `★ ${currentVideo.score}`}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Multiple Videos Selection Bar */}
                                                {studyData?.videos?.length > 1 && (
                                                    <div className="space-y-2 pt-2">
                                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Available Video Result:</h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {studyData.videos.map((v: any, i: number) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => setSelectedVidIdx(i)}
                                                                    className={`p-3 rounded-xl border text-left transition-all font-sans text-xs ${
                                                                        selectedVidIdx === i
                                                                            ? 'bg-primary/20 border-primary text-white shadow-md'
                                                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                                                    }`}
                                                                >
                                                                    <div className="font-bold line-clamp-1">{v.title}</div>
                                                                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">{v.creator} • {v.ratingText || `★ ${v.score}`}</div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-xs text-gray-400 p-8 text-center">No video available for this topic.</div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 2: GFG / W3SCHOOLS ARTICLE & CODE */}
                                {activeTab === 'article' && (
                                    <div className="space-y-6">
                                        <div className="p-6 bg-gray-900 rounded-2xl border border-white/10 space-y-4 font-sans">
                                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                                <span className="text-xs font-mono font-bold text-green-400 uppercase tracking-widest flex items-center gap-1">
                                                    <BookOpen size={14} /> {studyData?.studyNotes?.gfgW3Article?.source || "GeeksforGeeks / W3Schools Certified Documentation"}
                                                </span>
                                                <span className="text-xs px-2.5 py-0.5 rounded bg-green-500/20 text-green-400 font-mono font-bold">
                                                    Verifiable In-App Reader
                                                </span>
                                            </div>

                                            <div className="space-y-4 text-sm text-gray-300">
                                                <p className="leading-relaxed font-sans">{studyData?.studyNotes?.definition}</p>
                                                <p className="leading-relaxed font-sans text-gray-400">{studyData?.studyNotes?.explanation}</p>
                                            </div>

                                            {/* Article Sections */}
                                            {studyData?.studyNotes?.gfgW3Article?.sections?.map((sec: any, idx: number) => (
                                                <div key={idx} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                                                    <h4 className="font-bold text-white text-sm">{sec.title}</h4>
                                                    <p className="text-xs text-gray-300 leading-relaxed">{sec.content}</p>
                                                </div>
                                            ))}

                                            {/* Key Concepts */}
                                            {studyData?.studyNotes?.keyConcepts?.length > 0 && (
                                                <div className="pt-2">
                                                    <h4 className="font-bold text-white text-xs mb-2">Key Concepts to Remember:</h4>
                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-gray-300">
                                                        {studyData.studyNotes.keyConcepts.map((kc: string, i: number) => (
                                                            <li key={i} className="p-2 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2">
                                                                <CheckCircle2 size={14} className="text-primary" /> {kc}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Code Snippet Box */}
                                        {studyData?.studyNotes?.codeExample && (
                                            <div className="p-4 bg-gray-900 rounded-2xl border border-white/10 space-y-2 font-mono text-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-accent flex items-center gap-1 font-sans">
                                                        <Code2 size={14} /> Production Code Implementation
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-mono">Python / JS</span>
                                                </div>
                                                <pre className="text-green-400 overflow-x-auto p-4 bg-black/60 rounded-xl leading-relaxed">
                                                    {studyData.studyNotes.codeExample}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 3: PDF HANDBOOK & CHEAT SHEET */}
                                {activeTab === 'pdf' && (
                                    <div className="space-y-6">
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div className="space-y-2">
                                                <span className="text-xs font-mono font-bold text-secondary flex items-center gap-1">
                                                    <Download size={14} /> Skill Bridge Downloadable Study Guide
                                                </span>
                                                <h3 className="text-xl font-bold text-white">
                                                    {studyData?.studyNotes?.pdfGuide?.title || `${node.title} Complete Study Guide`}
                                                </h3>
                                                <p className="text-xs text-gray-400 max-w-xl">
                                                    {studyData?.studyNotes?.pdfGuide?.summary || "Download the official reference study handbook covering key formulas, code patterns, and interview questions."}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={() => {
                                                        const pdfData = studyData?.studyNotes?.pdfGuide;
                                                        const fileName = pdfData?.downloadName || `${node.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_guide.md`;
                                                        const content = pdfData?.markdownContent || `# ${node.title} Study Guide\n\n## Definition\n${studyData?.studyNotes?.definition || ''}\n\n## Explanation\n${studyData?.studyNotes?.explanation || ''}\n\n## Code Example\n\`\`\`python\n${studyData?.studyNotes?.codeExample || ''}\n\`\`\`\n`;
                                                        
                                                        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
                                                        const url = URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = fileName;
                                                        document.body.appendChild(a);
                                                        a.click();
                                                        document.body.removeChild(a);
                                                        URL.revokeObjectURL(url);
                                                    }}
                                                    className="px-6 py-3 bg-primary text-black font-black text-xs rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                                                >
                                                    <Download size={16} /> Download Study Guide ({studyData?.studyNotes?.pdfGuide?.fileSize || '1.8 MB'})
                                                </button>
                                            </div>
                                        </div>

                                        {/* In-App PDF Preview Block */}
                                        <div className="p-6 bg-gray-900 rounded-3xl border border-white/10 font-mono text-xs space-y-4">
                                            <h4 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                                                <FileText size={16} className="text-primary" /> PDF Handbook Quick Preview
                                            </h4>
                                            <div className="p-4 bg-black/60 rounded-2xl text-gray-300 space-y-3">
                                                <div className="text-green-400 font-bold border-b border-white/10 pb-2">
                                                    [DOCUMENT PAGE 1] — {node.title} Core Master Cheat Sheet
                                                </div>
                                                <p className="text-xs text-gray-300 font-sans">
                                                    1. Core Architecture: Designed for maximum execution efficiency and scalable software design.
                                                </p>
                                                <p className="text-xs text-gray-300 font-sans">
                                                    2. Key Algorithms & Data Operations: Focuses on minimizing time complexity (O(1) to O(N log N)).
                                                </p>
                                                <pre className="text-xs text-secondary bg-black/40 p-3 rounded-xl overflow-x-auto">
                                                    {studyData?.studyNotes?.flowchart || "[Visual Process Flowchart Node Tree]"}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 4: INTERACTIVE PRACTICE */}
                                {activeTab === 'practice' && (
                                    <div className="space-y-6 text-center py-8">
                                        <div className="max-w-md mx-auto space-y-4">
                                            <div className="p-4 rounded-full bg-primary/10 border border-primary/20 text-primary w-16 h-16 mx-auto flex items-center justify-center">
                                                <Code2 size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Practice Coding Problems for {node.title}</h3>
                                            <p className="text-xs text-gray-400">
                                                Test your knowledge in our sandboxed multi-language Coding Lab with real-time test case evaluation.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    onNavigateToCoding();
                                                }}
                                                className="px-8 py-3.5 bg-primary text-black font-black text-xs rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mx-auto"
                                            >
                                                Launch Coding Lab <ExternalLink size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EmbeddedMaterialModal;
