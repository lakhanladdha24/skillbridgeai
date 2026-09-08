import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle2, Circle, ArrowDown, BookOpen, Layers, 
    ZoomIn, ZoomOut, RotateCcw, Lock, Search, Sparkles, 
    Download, LayoutGrid, GitFork, ListTodo, Star, PlayCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';

export interface FlowchartNode {
    id: string;
    title: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
    estimatedHours: number;
    completed: boolean;
    locked?: boolean;
    recommended?: boolean;
    alternative?: boolean;
    prerequisites?: string[];
    phaseTitle?: string;
    phaseId?: string;
    keyConcepts?: string[];
    videoQuery?: string;
    docUrl?: string;
}

interface VisualFlowchartProps {
    courseTitle: string;
    nodes: FlowchartNode[];
    phases?: any[];
    onNodeClick: (node: FlowchartNode) => void;
    onToggleComplete?: (nodeId: string) => void;
    onOpenAiTutor?: (node: FlowchartNode) => void;
}

const VisualFlowchart: React.FC<VisualFlowchartProps> = ({
    courseTitle,
    nodes,
    phases,
    onNodeClick,
    onToggleComplete,
    onOpenAiTutor
}) => {
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [viewMode, setViewMode] = useState<'flowchart' | 'grid' | 'checklist'>('flowchart');
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.4));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.7));
    const handleResetZoom = () => setZoomLevel(1);

    const handleDownloadImage = async () => {
        if (!canvasRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(canvasRef.current, {
                backgroundColor: '#090d16',
                scale: 2,
                logging: false,
                useCORS: true
            });
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `${courseTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_roadmap.png`;
            link.click();
        } catch (e) {
            console.error('Download Roadmap Image Error:', e);
        } finally {
            setIsDownloading(false);
        }
    };

    const getLevelBadge = (level: FlowchartNode['level']) => {
        switch (level) {
            case 'Beginner':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'Intermediate':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            case 'Advanced':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
            case 'Mastery':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
        }
    };

    // Filter nodes by search query
    const filteredNodes = nodes.filter(n => {
        if (!searchFilter.trim()) return true;
        const q = searchFilter.toLowerCase();
        return n.title.toLowerCase().includes(q) || 
               n.description.toLowerCase().includes(q) ||
               (n.keyConcepts && n.keyConcepts.some(c => c.toLowerCase().includes(q)));
    });

    // Group nodes by phase if phases exist
    const groupedPhases = phases && phases.length > 0 ? phases : [
        { phaseId: 'p1', title: 'Curriculum Progression', topics: nodes }
    ];

    return (
        <div className="glass-card p-4 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden bg-slate-950/80 shadow-2xl">
            {/* Top Toolbar Bar in roadmap.sh style */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5 uppercase tracking-widest">
                            <Layers size={12} /> roadmap.sh standard
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                            {nodes.filter(n => n.completed).length} / {nodes.length} Completed
                        </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                        {courseTitle} Visual Roadmap
                    </h2>
                </div>

                {/* View Switcher, Search & Zoom Controls */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* View Switcher */}
                    <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 text-xs font-mono">
                        <button
                            onClick={() => setViewMode('flowchart')}
                            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold ${
                                viewMode === 'flowchart' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                            }`}
                            title="Visual Flowchart View"
                        >
                            <GitFork size={13} /> Flowchart
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold ${
                                viewMode === 'grid' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                            }`}
                            title="Section Cards Grid"
                        >
                            <LayoutGrid size={13} /> Grid
                        </button>
                        <button
                            onClick={() => setViewMode('checklist')}
                            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-bold ${
                                viewMode === 'checklist' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                            }`}
                            title="Linear Checklist View"
                        >
                            <ListTodo size={13} /> Checklist
                        </button>
                    </div>

                    {/* Node Search Bar */}
                    <div className="relative flex items-center">
                        <Search size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Find topics..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 w-32 sm:w-44 transition-all"
                        />
                    </div>

                    {/* Flowchart Zoom Controls */}
                    {viewMode === 'flowchart' && (
                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
                            <button
                                onClick={handleZoomOut}
                                title="Zoom Out (-)"
                                className="p-1.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                            >
                                <ZoomOut size={15} />
                            </button>
                            <button
                                onClick={handleResetZoom}
                                title="Reset Zoom (100%)"
                                className="px-2 py-1 text-[11px] font-mono font-bold text-gray-300 hover:text-white"
                            >
                                <RotateCcw size={12} className="inline mr-1" />{Math.round(zoomLevel * 100)}%
                            </button>
                            <button
                                onClick={handleZoomIn}
                                title="Zoom In (+)"
                                className="p-1.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                            >
                                <ZoomIn size={15} />
                            </button>
                        </div>
                    )}

                    {/* Download Image Button */}
                    <button
                        onClick={handleDownloadImage}
                        disabled={isDownloading}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-mono font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                        title="Download Roadmap as PNG image"
                    >
                        <Download size={14} /> {isDownloading ? 'Exporting...' : 'PNG'}
                    </button>
                </div>
            </div>

            {/* Canvas Container with authentic dot-grid styling */}
            <div 
                ref={canvasRef}
                className="relative rounded-2xl border border-white/5 p-4 sm:p-8 bg-[#090d16] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] overflow-hidden min-h-[500px]"
            >
                {/* 1. FLOWCHART CANVAS VIEW (ICONIC ROADMAP.SH FORMAT) */}
                {viewMode === 'flowchart' && (
                    <div 
                        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                        className="transition-transform duration-300 ease-out max-w-4xl mx-auto space-y-12"
                    >
                        {groupedPhases.map((phase: any, pIdx: number) => {
                            const phaseTopics: FlowchartNode[] = nodes.filter(n => {
                                if (phase.topics) {
                                    return phase.topics.some((pt: any) => pt.topicId === n.id || pt.id === n.id);
                                }
                                return true;
                            });

                            const isPhaseMatching = phaseTopics.some(t => filteredNodes.some(fn => fn.id === t.id));
                            if (searchFilter && !isPhaseMatching) return null;

                            return (
                                <div key={phase.phaseId || pIdx} className="relative">
                                    {/* Milestone Header Banner */}
                                    <div className="flex items-center justify-center mb-6">
                                        <div className="px-5 py-2 rounded-2xl bg-slate-900/90 border border-primary/40 shadow-xl flex items-center gap-3 backdrop-blur-md">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                                            <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider font-mono">
                                                {phase.title}
                                            </span>
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300 font-bold">
                                                {phaseTopics.filter(t => t.completed).length}/{phaseTopics.length} Done
                                            </span>
                                        </div>
                                    </div>

                                    {/* Nodes Stream within this Phase */}
                                    <div className="space-y-6">
                                        {phaseTopics.map((node, nIdx) => {
                                            const isMatching = filteredNodes.some(fn => fn.id === node.id);
                                            if (searchFilter && !isMatching) return null;

                                            const isLastInPhase = nIdx === phaseTopics.length - 1;

                                            return (
                                                <div key={node.id} className="relative flex flex-col items-center">
                                                    {/* Roadmap Node Card */}
                                                    <motion.div
                                                        whileHover={{ scale: node.locked ? 1 : 1.015 }}
                                                        whileTap={{ scale: node.locked ? 1 : 0.985 }}
                                                        onClick={() => !node.locked && onNodeClick(node)}
                                                        className={`w-full max-w-2xl p-5 rounded-2xl border transition-all cursor-pointer shadow-lg relative group ${
                                                            node.completed
                                                                ? 'bg-emerald-950/25 border-emerald-500/60 hover:border-emerald-400'
                                                                : node.locked
                                                                ? 'bg-slate-900/40 border-white/5 opacity-50 cursor-not-allowed'
                                                                : 'bg-slate-900/80 border-slate-700/80 hover:border-primary hover:bg-slate-800/80'
                                                        }`}
                                                    >
                                                        {/* Top Node Chips */}
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex items-start gap-3 flex-1">
                                                                {/* Interactive Completion Toggle */}
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (onToggleComplete && !node.locked) onToggleComplete(node.id);
                                                                    }}
                                                                    className="mt-0.5 focus:outline-none transition-transform hover:scale-110"
                                                                    title={node.completed ? "Mark as Incomplete" : "Mark as Complete"}
                                                                >
                                                                    {node.completed ? (
                                                                        <CheckCircle2 size={24} className="text-emerald-400" />
                                                                    ) : node.locked ? (
                                                                        <Lock size={20} className="text-gray-500" />
                                                                    ) : (
                                                                        <Circle size={24} className="text-gray-500 hover:text-primary transition-all" />
                                                                    )}
                                                                </button>

                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                                                        {/* Recommendation Badges */}
                                                                        {node.recommended !== false && (
                                                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                                                                                <Star size={10} fill="currentColor" /> Recommended
                                                                            </span>
                                                                        )}
                                                                        {node.alternative && (
                                                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                                                                Alternative Option
                                                                            </span>
                                                                        )}

                                                                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getLevelBadge(node.level)}`}>
                                                                            {node.level}
                                                                        </span>

                                                                        <span className="text-[10px] font-mono text-gray-400">
                                                                            ~{node.estimatedHours}h
                                                                        </span>

                                                                        {node.completed && (
                                                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                                                                ✓ Done
                                                                            </span>
                                                                        )}

                                                                        {node.locked && (
                                                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 flex items-center gap-1">
                                                                                <Lock size={10} /> Prerequisite Required
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-primary transition-colors">
                                                                        {node.title}
                                                                    </h3>
                                                                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                                                        {node.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Node Action Footer */}
                                                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono font-bold flex items-center gap-1">
                                                                    <PlayCircle size={11} /> YouTube Course
                                                                </span>
                                                                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">
                                                                    Study Docs
                                                                </span>
                                                                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono font-bold">
                                                                    AI Tutor
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                {onOpenAiTutor && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onOpenAiTutor(node);
                                                                        }}
                                                                        className="px-2.5 py-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-[11px] font-mono font-bold transition-all flex items-center gap-1"
                                                                    >
                                                                        <Sparkles size={12} /> Learn with AI
                                                                    </button>
                                                                )}
                                                                <span className="text-primary font-bold flex items-center gap-1 font-mono text-[11px]">
                                                                    <BookOpen size={12} /> Details ➔
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>

                                                    {/* Connecting Arrow between topics */}
                                                    {!isLastInPhase && (
                                                        <div className="my-2.5 flex flex-col items-center text-primary/60">
                                                            <div className="w-0.5 h-6 bg-gradient-to-b from-primary/60 via-primary/40 to-secondary/60" />
                                                            <ArrowDown size={16} className="text-secondary -mt-1 animate-bounce" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Connecting Line to Next Phase */}
                                    {pIdx < groupedPhases.length - 1 && (
                                        <div className="my-6 flex flex-col items-center text-secondary/60">
                                            <div className="w-1 h-10 rounded bg-gradient-to-b from-primary via-secondary to-accent" />
                                            <ArrowDown size={20} className="text-accent -mt-1.5" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 2. GRID / CARDS VIEW */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredNodes.map((node) => (
                            <motion.div
                                key={node.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => !node.locked && onNodeClick(node)}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                                    node.completed
                                        ? 'bg-emerald-950/25 border-emerald-500/50'
                                        : node.locked
                                        ? 'bg-slate-900/40 border-white/5 opacity-50 cursor-not-allowed'
                                        : 'bg-slate-900/80 border-slate-700/80 hover:border-primary'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getLevelBadge(node.level)}`}>
                                            {node.level}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onToggleComplete && !node.locked) onToggleComplete(node.id);
                                            }}
                                        >
                                            {node.completed ? (
                                                <CheckCircle2 size={20} className="text-emerald-400" />
                                            ) : (
                                                <Circle size={20} className="text-gray-500 hover:text-primary" />
                                            )}
                                        </button>
                                    </div>

                                    <h3 className="text-base font-bold text-white mb-1">{node.title}</h3>
                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{node.description}</p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                                    <span className="text-gray-400 font-mono text-[10px]">~{node.estimatedHours} Hours</span>
                                    <span className="text-primary font-mono text-[11px] font-bold">Open Topic ➔</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* 3. CHECKLIST VIEW */}
                {viewMode === 'checklist' && (
                    <div className="space-y-3 max-w-2xl mx-auto">
                        {filteredNodes.map((node, idx) => (
                            <div
                                key={node.id}
                                onClick={() => !node.locked && onNodeClick(node)}
                                className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                                    node.completed 
                                        ? 'bg-emerald-950/20 border-emerald-500/40' 
                                        : 'bg-slate-900/70 border-white/10 hover:border-primary/50'
                                }`}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onToggleComplete && !node.locked) onToggleComplete(node.id);
                                        }}
                                    >
                                        {node.completed ? (
                                            <CheckCircle2 size={20} className="text-emerald-400" />
                                        ) : (
                                            <Circle size={20} className="text-gray-500 hover:text-primary" />
                                        )}
                                    </button>
                                    <div>
                                        <h4 className={`text-sm font-bold ${node.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                                            {idx + 1}. {node.title}
                                        </h4>
                                        <span className="text-[10px] font-mono text-gray-400">
                                            {node.level} • {node.estimatedHours} Hours
                                        </span>
                                    </div>
                                </div>
                                <span className="text-primary font-mono text-xs font-bold whitespace-nowrap">
                                    Details ➔
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisualFlowchart;
