import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Youtube, FileText, Search } from 'lucide-react';
import { CareerPath } from '../data/careerPaths';

interface RoadmapProps {
    careerPath: CareerPath;
}

const Roadmap: React.FC<RoadmapProps> = ({ careerPath }) => {
    // Helper to generate YouTube search link
    const getYouTubeLink = (query: string) => {
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' lecture course full tutorial')}`;
    };

    // Helper to generate Google search link for notes
    const getNotesLink = (query: string) => {
        return `https://www.google.com/search?q=${encodeURIComponent(query + ' documentation notes pdf tutorial')}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        {careerPath.title}
                    </h2>
                    <p className="text-gray-400 mt-2 max-w-2xl">{careerPath.description}</p>
                </div>
                <div className="flex flex-col items-start md:items-end justify-center bg-white/5 p-4 rounded-xl border border-white/10 min-w-[120px]">
                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Match Score</span>
                    <span className="text-4xl font-bold text-primary">{careerPath.matchScore}%</span>
                </div>
            </div>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[19px] sm:left-[21px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-gray-800 to-gray-800" />

                <div className="space-y-12">
                    {careerPath.milestones.map((milestone, index) => (
                        <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-12 sm:pl-16"
                        >
                            {/* Icon Circle */}
                            <div className="absolute left-0 top-1 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-background border-4 border-background rounded-full z-10">
                                <div className={`w-full h-full rounded-full flex items-center justify-center ${index === 0 ? 'bg-primary text-black' : 'bg-gray-800 text-gray-400'}`}>
                                    {index < 1 ? <CheckCircle2 size={20} className="sm:size-6" /> : <Circle size={20} className="sm:size-6" />}
                                </div>
                            </div>

                            <div className="glass-card p-5 sm:p-6 rounded-xl border-l-4 border-l-primary hover:border-l-secondary transition-all duration-300">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-white">{milestone.title}</h3>
                                            <span className="lg:hidden flex items-center text-secondary text-[10px] font-semibold bg-secondary/10 px-2 py-0.5 rounded-full">
                                                {milestone.duration}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 mb-4 text-sm sm:text-base">{milestone.description}</p>
                                        
                                        {/* Suggested Search Links Section */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                            <a 
                                                href={getYouTubeLink(milestone.title)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-lg group transition-all"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Youtube size={16} className="text-red-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white uppercase opacity-70">Watch Lecture</p>
                                                    <p className="text-[10px] text-gray-400">YouTube Search</p>
                                                </div>
                                            </a>
                                            <a 
                                                href={getNotesLink(milestone.title)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-lg group transition-all"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <FileText size={16} className="text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white uppercase opacity-70">Study Notes</p>
                                                    <p className="text-[10px] text-gray-400">Documentation Search</p>
                                                </div>
                                            </a>
                                        </div>

                                        {milestone.notes && (
                                            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <Search size={12} className="text-secondary" />
                                                    <p className="text-xs font-bold text-secondary uppercase">Quick Guide</p>
                                                </div>
                                                <p className="text-sm text-gray-300 italic">{milestone.notes}</p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {milestone.resources.map((res, i) => (
                                                <a 
                                                    key={i} 
                                                    href={res.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] px-2 py-1 bg-white/5 rounded text-gray-300 border border-white/10 hover:border-primary/40 hover:text-primary transition-all flex items-center gap-1"
                                                >
                                                    {res.name}
                                                    <span className="opacity-50">({res.source})</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex items-center text-secondary text-sm font-semibold whitespace-nowrap bg-secondary/10 px-3 py-1 rounded-full">
                                        {milestone.duration}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="pl-12 sm:pl-16 pt-4"
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
                            className="w-full sm:w-auto flex items-center justify-center gap-2 text-primary hover:text-white transition-colors py-3 px-6 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/50 group"
                        >
                            <span>Generate Personalised Support with AI</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;

