import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowDown, BookOpen, Layers } from 'lucide-react';

export interface FlowchartNode {
    id: string;
    title: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
    estimatedHours: number;
    completed: boolean;
    prerequisites: string[];
}

interface VisualFlowchartProps {
    courseTitle: string;
    nodes: FlowchartNode[];
    onNodeClick: (node: FlowchartNode) => void;
    onToggleComplete: (nodeId: string) => void;
}

const levelColors: Record<string, { bg: string; border: string; text: string }> = {
    Beginner: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    Intermediate: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    Advanced: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
    Mastery: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' }
};

const VisualFlowchart: React.FC<VisualFlowchartProps> = ({
    courseTitle,
    nodes,
    onNodeClick,
    onToggleComplete
}) => {
    return (
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <span className="text-xs font-mono font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
                        <Layers size={14} /> Interactive Skill Roadmap Flowchart
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-white">{courseTitle} — Learning Path</h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400">
                    <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Beginner</span>
                    <span>➔</span>
                    <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Intermediate</span>
                    <span>➔</span>
                    <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">Advanced</span>
                    <span>➔</span>
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Mastery</span>
                </div>
            </div>

            {/* Vertical Connected Flowchart Nodes */}
            <div className="space-y-6 relative max-w-3xl mx-auto py-4">
                {nodes.map((node, index) => {
                    const style = levelColors[node.level] || levelColors.Beginner;
                    const isLast = index === nodes.length - 1;

                    return (
                        <React.Fragment key={node.id}>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className={`p-6 rounded-3xl border transition-all cursor-pointer relative ${
                                    node.completed
                                        ? 'bg-green-500/10 border-green-500/30'
                                        : `${style.bg} ${style.border} hover:border-primary`
                                }`}
                                onClick={() => onNodeClick(node)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${style.bg} ${style.text} ${style.border} border`}>
                                                Step {index + 1}: {node.level}
                                            </span>
                                            <span className="text-[11px] text-gray-400 font-mono">
                                                ⏱ {node.estimatedHours} Hours
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                                            {node.title}
                                        </h3>

                                        <p className="text-xs text-gray-300 leading-relaxed">
                                            {node.description}
                                        </p>
                                    </div>

                                    {/* Completion Toggle Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleComplete(node.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                                        title={node.completed ? "Mark Incomplete" : "Mark Complete"}
                                    >
                                        {node.completed ? (
                                            <CheckCircle2 className="text-green-400" size={24} />
                                        ) : (
                                            <Circle size={24} />
                                        )}
                                    </button>
                                </div>

                                {/* Flowchart Action Bar */}
                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono font-bold">
                                            ★ 4.9 Rated Tutorial
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">
                                            📄 Downloadable PDF
                                        </span>
                                    </div>

                                    <span className="text-primary font-bold flex items-center gap-1 font-mono text-[11px]">
                                        <BookOpen size={13} /> Open Step Learning Hub ➔
                                    </span>
                                </div>
                            </motion.div>

                            {/* Directional Connection Arrow */}
                            {!isLast && (
                                <div className="flex justify-center my-2">
                                    <div className="p-2 rounded-full bg-white/5 border border-white/10 text-primary animate-bounce">
                                        <ArrowDown size={18} />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default VisualFlowchart;
