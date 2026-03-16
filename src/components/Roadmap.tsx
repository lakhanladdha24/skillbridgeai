import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { CareerPath } from '../data/careerPaths';

interface RoadmapProps {
    careerPath: CareerPath;
}

const Roadmap: React.FC<RoadmapProps> = ({ careerPath }) => {
    return (
        <div className="w-full max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        {careerPath.title}
                    </h2>
                    <p className="text-gray-400 mt-2">{careerPath.description}</p>
                </div>
                <div className="text-right">
                    <span className="text-sm text-gray-500 block mb-1">Match Score</span>
                    <span className="text-4xl font-bold text-primary">{careerPath.matchScore}%</span>
                </div>
            </div>

            <div className="relative">
                <div className="absolute left-[21px] top-0 bottom-0 w-0.5 bg-gray-800" />

                <div className="space-y-12">
                    {careerPath.milestones.map((milestone, index) => (
                        <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="relative pl-16"
                        >
                            <div className="absolute left-0 top-1 w-11 h-11 flex items-center justify-center bg-background border-4 border-background rounded-full z-10">
                                <div className={`w-full h-full rounded-full flex items-center justify-center ${index === 0 ? 'bg-primary text-black' : 'bg-gray-800 text-gray-400'}`}>
                                    {index < 1 ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-xl border-l-4 border-l-primary">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                                        <p className="text-gray-400 mb-4">{milestone.description}</p>
                                        {milestone.notes && (
                                            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                                                <p className="text-xs font-bold text-secondary uppercase mb-1">Step-by-Step Notes</p>
                                                <p className="text-sm text-gray-300">{milestone.notes}</p>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {milestone.resources.map((res, i) => (
                                                <a 
                                                    key={i} 
                                                    href={res.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-xs px-2 py-1 bg-primary/10 rounded text-primary border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-1"
                                                >
                                                    {res.name}
                                                    <span className="text-[10px] opacity-70">({res.source})</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center text-secondary text-sm font-semibold whitespace-nowrap bg-secondary/10 px-3 py-1 rounded-full self-start">
                                        {milestone.duration}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: careerPath.milestones.length * 0.2 + 0.2 }}
                        className="pl-16 pt-4"
                    >
                        <button 
                            onClick={() => {
                                const event = new CustomEvent('openChat', { 
                                    detail: { 
                                        message: `I have started the ${careerPath.title} roadmap. Can you give me more specific details and additional resources from CampusX or Stanford for the first few steps?` 
                                    } 
                                });
                                window.dispatchEvent(event);
                            }}
                            className="flex items-center gap-2 text-primary hover:text-white transition-colors py-2 px-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/50"
                        >
                            <span>Generate Advanced Roadmap with AI</span>
                            <ArrowRight size={20} />
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
