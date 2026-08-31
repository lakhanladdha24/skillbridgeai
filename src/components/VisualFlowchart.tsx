import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowDown, BookOpen, Layers, ZoomIn, ZoomOut, RotateCcw, Lock } from 'lucide-react';

export interface FlowchartNode {
    id: string;
    title: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
    estimatedHours: number;
    completed: boolean;
    locked?: boolean;
    prerequisites?: string[];
}

interface VisualFlowchartProps {
    courseTitle: string;
    nodes: FlowchartNode[];
    onNodeClick: (node: FlowchartNode) => void;
    onToggleComplete?: (nodeId: string) => void;
}

const VisualFlowchart: React.FC<VisualFlowchartProps> = ({
    courseTitle,
    nodes,
    onNodeClick,
    onToggleComplete
}) => {
    const [zoomLevel, setZoomLevel] = useState<number>(1);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.4));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.7));
    const handleResetZoom = () => setZoomLevel(1);

    const getLevelBadge = (level: FlowchartNode['level']) => {
        switch (level) {
            case 'Beginner':
                return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'Intermediate':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Advanced':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'Mastery':
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            {/* Flowchart Control Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                <div>
                    <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Layers size={14} /> Interactive Step-by-Step Learning Map
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                        {courseTitle} Dependency Flowchart
                    </h2>
                </div>

                {/* Zoom & Pan Controls */}
                <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
                    <button
                        onClick={handleZoomOut}
                        title="Zoom Out (-)"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                    >
                        <ZoomOut size={16} />
                    </button>
                    <button
                        onClick={handleResetZoom}
                        title="Reset Pan & Zoom"
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1"
                    >
                        <RotateCcw size={14} /> {Math.round(zoomLevel * 100)}%
                    </button>
                    <button
                        onClick={handleZoomIn}
                        title="Zoom In (+)"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                    >
                        <ZoomIn size={16} />
                    </button>
                </div>
            </div>

            {/* Interactive Graph Node Stream */}
            <div
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                className="transition-transform duration-300 ease-out space-y-6 max-w-3xl mx-auto"
            >
                {nodes.map((node, index) => {
                    const isLast = index === nodes.length - 1;

                    return (
                        <div key={node.id} className="relative flex flex-col items-center">
                            {/* Node Card */}
                            <motion.div
                                whileHover={{ scale: node.locked ? 1 : 1.02 }}
                                whileTap={{ scale: node.locked ? 1 : 0.98 }}
                                onClick={() => !node.locked && onNodeClick(node)}
                                className={`w-full p-5 rounded-2xl border transition-all cursor-pointer shadow-lg relative ${
                                    node.completed
                                        ? 'bg-emerald-950/20 border-emerald-500/50 hover:border-emerald-400'
                                        : node.locked
                                        ? 'bg-white/5 border-white/5 opacity-60 cursor-not-allowed'
                                        : 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onToggleComplete && !node.locked) onToggleComplete(node.id);
                                            }}
                                            className="focus:outline-none"
                                        >
                                            {node.completed ? (
                                                <CheckCircle2 size={24} className="text-emerald-400" />
                                            ) : node.locked ? (
                                                <Lock size={20} className="text-gray-500" />
                                            ) : (
                                                <Circle size={24} className="text-gray-500 hover:text-primary transition-all" />
                                            )}
                                        </button>

                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getLevelBadge(node.level)}`}>
                                                    {node.level}
                                                </span>
                                                <span className="text-[10px] font-mono text-gray-400">
                                                    ~{node.estimatedHours} Hours
                                                </span>
                                                {node.completed && (
                                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                                        ✓ Completed
                                                    </span>
                                                )}
                                                {node.locked && (
                                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-500/20 text-gray-400">
                                                        🔒 Locked (Prerequisite Required)
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-base font-bold text-white group-hover:text-primary transition-all">
                                                Step {index + 1}: {node.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                                    {node.description}
                                </p>

                                {/* Flowchart Action Bar */}
                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono font-bold">
                                            ★ 4.9 Video Tutorial
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">
                                            📄 PDF Handbook
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono font-bold">
                                            🚀 Projects
                                        </span>
                                    </div>

                                    <span className="text-primary font-bold flex items-center gap-1 font-mono text-[11px]">
                                        <BookOpen size={13} /> Open Step Panel ➔
                                    </span>
                                </div>
                            </motion.div>

                            {/* Connecting Dependency Arrow */}
                            {!isLast && (
                                <div className="my-2 flex flex-col items-center text-primary/60">
                                    <div className="w-0.5 h-6 bg-gradient-to-b from-primary/60 to-secondary/60" />
                                    <ArrowDown size={18} className="text-secondary -mt-1 animate-pulse" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VisualFlowchart;
