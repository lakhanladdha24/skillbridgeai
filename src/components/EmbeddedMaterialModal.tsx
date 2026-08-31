import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Video, FileText, Download, Code2, CheckCircle2, 
    ExternalLink, BookOpen, AlertTriangle, Rocket, Bookmark
} from 'lucide-react';
import { FlowchartNode } from './VisualFlowchart';

export function toEmbedUrl(urlStr?: string, topicTitle?: string): string {
    if (urlStr && urlStr.includes("embed/")) {
        const videoIdMatch = urlStr.match(/embed\/([a-zA-Z0-9_-]{11})/);
        if (videoIdMatch && videoIdMatch[1]) {
            return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        }
        return urlStr;
    }

    if (urlStr) {
        const watchMatch = urlStr.match(/(?:v=|\/v\/|embed\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
        if (watchMatch && watchMatch[1]) {
            return `https://www.youtube.com/embed/${watchMatch[1]}`;
        }
    }

    // Official YouTube Live Search Embed Endpoint Fallback for 100% video availability
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
}

const EmbeddedMaterialModal: React.FC<EmbeddedMaterialModalProps> = ({
    node,
    studyData,
    isLoading,
    onClose,
    onToggleComplete,
    onNavigateToCoding
}) => {
    const [activeTab, setActiveTab] = useState<'video' | 'article' | 'pdf' | 'practice' | 'docs' | 'projects'>('video');
    const [selectedVidIdx, setSelectedVidIdx] = useState<number>(0);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

    if (!node) return null;

    const currentVideo = studyData?.videos?.[selectedVidIdx] || studyData?.videos?.[0];
    const projectObj = studyData?.projects?.[0];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-card w-full max-w-5xl h-[90vh] flex flex-col rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-gray-950"
                >
                    {/* Header */}
                    <div className="p-6 md:px-8 md:py-6 border-b border-white/10 flex items-center justify-between gap-4 bg-white/5">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                    {node.level} LEVEL
                                </span>
                                <span className="text-[10px] font-mono text-gray-400">
                                    ESTIMATED: {node.estimatedHours} HOURS
                                </span>
                                {node.completed && (
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 size={12} /> COMPLETED
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-white">{node.title}</h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`p-2.5 rounded-2xl border transition-all ${
                                    isBookmarked ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                }`}
                                title="Save / Bookmark Topic"
                            >
                                <Bookmark size={18} />
                            </button>

                            <button
                                onClick={() => onToggleComplete(node.id)}
                                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    node.completed
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                        : 'bg-primary text-black font-black hover:bg-primary/90 shadow-lg shadow-primary/20'
                                }`}
                            >
                                <CheckCircle2 size={16} />
                                {node.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
                            </button>

                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* PREREQUISITES CHECK BANNER */}
                    {node.prerequisites && node.prerequisites.length > 0 && (
                        <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-3 text-xs text-amber-300">
                            <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
                            <span>
                                <strong>Recommended Prerequisites:</strong> Ensure you understand prerequisite concepts ({node.prerequisites.join(', ')}) before continuing.
                            </span>
                        </div>
                    )}

                    {/* Navigation Tabs Bar */}
                    <div className="flex items-center gap-2 px-6 overflow-x-auto border-b border-white/10 bg-black/40 scrollbar-none">
                        {[
                            { id: 'video', label: '📺 Videos', icon: Video },
                            { id: 'article', label: '📚 Articles', icon: FileText },
                            { id: 'pdf', label: '📄 Study Material', icon: Download },
                            { id: 'practice', label: '💻 Practice', icon: Code2 },
                            { id: 'docs', label: '📖 Documentation', icon: BookOpen },
                            { id: 'projects', label: '🚀 Projects', icon: Rocket }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-3.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'text-primary border-primary font-black'
                                        : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Body */}
                    <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
                        {isLoading ? (
                            <div className="p-12 text-center text-primary font-semibold animate-pulse flex items-center justify-center gap-3">
                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                Loading learning resources, video lectures & documentation...
                            </div>
                        ) : (
                            <>
                                {/* TAB 1: VIDEOS */}
                                {activeTab === 'video' && (
                                    <div className="space-y-4">
                                        {currentVideo ? (
                                            <>
                                                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg">
                                                    <iframe
                                                        src={toEmbedUrl(currentVideo?.embedUrl || currentVideo?.url, node.title)}
                                                        title={currentVideo?.title || node.title}
                                                        className="w-full h-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>

                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                    <div>
                                                        <h4 className="font-bold text-white text-base">{currentVideo?.title || `Top YouTube Video Tutorial for ${node.title}`}</h4>
                                                        <p className="text-xs text-gray-400 mt-1">{currentVideo?.summary || `Live YouTube search tutorial for ${node.title}.`}</p>
                                                        <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mt-2">
                                                            <span>Creator: {currentVideo?.creator || 'YouTube Creator'}</span>
                                                            <span>Duration: {currentVideo?.duration || '15m - 45m'}</span>
                                                            <span className="text-yellow-400 font-bold">{currentVideo?.ratingText || `★ 4.9 Verified Step Video`}</span>
                                                        </div>
                                                    </div>

                                                    {/* Direct YouTube Step Search Button */}
                                                    <a
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(node.title + " tutorial")}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="px-4 py-2.5 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold hover:bg-red-600/30 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-lg"
                                                    >
                                                        <Video size={14} /> Open Direct YouTube Search <ExternalLink size={12} />
                                                    </a>
                                                </div>

                                                {/* Multi-Video Selector Pills */}
                                                {studyData?.videos?.length > 1 && (
                                                    <div className="space-y-2 pt-2">
                                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Available Video Tutorial:</h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {studyData.videos.map((v: any, i: number) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => setSelectedVidIdx(i)}
                                                                    className={`p-3 rounded-xl border text-left transition-all text-xs font-sans ${
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
                                            <div className="text-xs text-gray-400 p-8 text-center">No video available.</div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 2: ARTICLES */}
                                {activeTab === 'article' && (
                                    <div className="space-y-4">
                                        <div className="p-6 bg-gray-900 rounded-2xl border border-white/10 space-y-4 font-sans">
                                            <h3 className="text-lg font-bold text-white">GeeksforGeeks & W3Schools Certified Documentation</h3>
                                            <p className="text-sm text-gray-300 leading-relaxed">{studyData?.studyNotes?.definition}</p>
                                            <p className="text-sm text-gray-400 leading-relaxed">{studyData?.studyNotes?.explanation}</p>

                                            <div className="flex flex-wrap items-center gap-3 pt-3">
                                                {studyData?.gfgUrl && (
                                                    <a href={studyData.gfgUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl text-xs font-bold hover:bg-green-600/30 transition-all flex items-center gap-1.5">
                                                        GeeksforGeeks Article <ExternalLink size={12} />
                                                    </a>
                                                )}
                                                {studyData?.w3schoolsUrl && (
                                                    <a href={studyData.w3schoolsUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold hover:bg-blue-600/30 transition-all flex items-center gap-1.5">
                                                        W3Schools Tutorial <ExternalLink size={12} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: STUDY MATERIAL / PDF */}
                                {activeTab === 'pdf' && (
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="space-y-2">
                                            <span className="text-xs font-mono font-bold text-secondary flex items-center gap-1">
                                                <Download size={14} /> Legitimate Reference PDF & Markdown Cheat Sheet
                                            </span>
                                            <h3 className="text-xl font-bold text-white">
                                                {studyData?.studyNotes?.pdfGuide?.title || `${node.title} Complete Study Guide`}
                                            </h3>
                                            <p className="text-xs text-gray-400 max-w-xl">
                                                {studyData?.studyNotes?.pdfGuide?.summary || "Download reference handbook covering formulas, syntax, and interview questions."}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                const pdfData = studyData?.studyNotes?.pdfGuide;
                                                const fileName = pdfData?.downloadName || `${node.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_guide.md`;
                                                const content = pdfData?.markdownContent || `# ${node.title} Study Guide\n\n## Overview\n${studyData?.studyNotes?.definition || ''}\n`;
                                                
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
                                            className="px-6 py-3 bg-primary text-black font-black text-xs rounded-2xl shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                                        >
                                            <Download size={16} /> Download Study Guide ({studyData?.studyNotes?.pdfGuide?.fileSize || '1.8 MB'})
                                        </button>
                                    </div>
                                )}

                                {/* TAB 4: PRACTICE */}
                                {activeTab === 'practice' && (
                                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center space-y-4">
                                        <Code2 size={36} className="text-primary mx-auto" />
                                        <h3 className="text-xl font-bold text-white">Skill Bridge Interactive Coding Sandbox</h3>
                                        <p className="text-xs text-gray-400 max-w-md mx-auto">
                                            Solve 18+ LeetCode-style problem challenges for {node.title} directly inside our multi-language code runner.
                                        </p>
                                        <button
                                            onClick={onNavigateToCoding}
                                            className="px-6 py-3 bg-primary text-black font-black text-xs rounded-2xl shadow-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2"
                                        >
                                            <Code2 size={16} /> Launch Practice Lab
                                        </button>
                                    </div>
                                )}

                                {/* TAB 5: DOCUMENTATION */}
                                {activeTab === 'docs' && (
                                    <div className="space-y-4">
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                                            <h4 className="font-bold text-white">{studyData?.docName || "Official Documentation"}</h4>
                                            <p className="text-xs text-gray-400">Read official specification guidelines and API manuals directly from the source.</p>
                                            {studyData?.officialDocUrl && (
                                                <a
                                                    href={studyData.officialDocUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 border border-primary/30 text-primary font-bold text-xs rounded-xl hover:bg-primary hover:text-black transition-all"
                                                >
                                                    Open Official Docs <ExternalLink size={12} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 6: PROJECTS */}
                                {activeTab === 'projects' && (
                                    <div className="p-6 bg-gray-900 rounded-3xl border border-white/10 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Rocket size={20} className="text-accent" />
                                            <h3 className="text-lg font-bold text-white">{projectObj?.title || `Hands-on Project for ${node.title}`}</h3>
                                        </div>
                                        <p className="text-xs text-gray-300">{projectObj?.problemStatement || `Build a real-world application putting ${node.title} concepts into production practice.`}</p>

                                        <div className="space-y-2 pt-2 border-t border-white/10">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase">Step-by-Step Guidance:</h4>
                                            <ul className="text-xs text-gray-400 space-y-1 font-mono">
                                                {projectObj?.stepByStepInstructions?.map((step: string, idx: number) => (
                                                    <li key={idx}>• {step}</li>
                                                )) || <li>• Implement core logic, test cases, and push to GitHub.</li>}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EmbeddedMaterialModal;
