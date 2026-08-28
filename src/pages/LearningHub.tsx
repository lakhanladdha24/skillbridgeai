import React, { useState } from 'react';
import { Search, BookOpen, Code2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningHub: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Study Notes' | 'Videos' | 'Coding Problems'>('All');

    const sampleResources = [
        {
            type: 'Study Notes',
            title: 'Python Fundamentals & Object-Oriented Programming',
            category: 'Programming',
            difficulty: 'Beginner',
            summary: 'Comprehensive guide to classes, inheritance, dunder methods, decorators, and memory management in Python.',
            badge: 'FREE'
        },
        {
            type: 'Study Notes',
            title: 'Data Structures: Hash Tables, Trees & Graphs',
            category: 'Computer Science',
            difficulty: 'Intermediate',
            summary: 'Deep dive into memory organization, collision resolution, binary search trees, BFS and DFS algorithms.',
            badge: 'FREE'
        },
        {
            type: 'Videos',
            title: 'Python OOP Full Course - Object Oriented Programming in Python',
            category: 'Programming',
            creator: 'FreeCodeCamp',
            url: 'https://www.youtube.com/watch?v=Ej_02ICOIgs',
            score: 4.9,
            badge: 'FREE'
        },
        {
            type: 'Videos',
            title: 'Machine Learning Course for Beginners',
            category: 'AI / Data',
            creator: 'Andrew Ng / DeepLearning.AI',
            url: 'https://www.youtube.com/watch?v=PPLop442ScU',
            score: 5.0,
            badge: 'FREE'
        },
        {
            type: 'Coding Problems',
            title: '1. Two Sum (Arrays & Hash Table)',
            category: 'DSA & Algorithms',
            difficulty: 'Easy',
            link: '/coding-lab',
            badge: 'PRACTICE'
        },
        {
            type: 'Coding Problems',
            title: '4. LRU Cache (System Design & Doubly Linked List)',
            category: 'System Design',
            difficulty: 'Hard',
            link: '/coding-lab',
            badge: 'PRACTICE'
        }
    ];

    const filtered = sampleResources.filter((r) => {
        const matchesQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = activeFilter === 'All' || r.type === activeFilter;
        return matchesQuery && matchesType;
    });

    return (
        <div className="max-w-6xl mx-auto pt-8 px-4 pb-20">
            {/* Header */}
            <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs mb-3">
                    <BookOpen size={14} /> Centralized Study Material & Resource Hub
                </span>
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                    Skill Bridge Learning Hub
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                    Access indexed study notes, ranked video tutorials, and interactive coding challenges without leaving the platform.
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="glass-card p-4 rounded-3xl border border-white/10 max-w-4xl mx-auto mb-10 space-y-4">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search notes, concepts, videos, or coding problems..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-full font-semibold"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-center">
                    {['All', 'Study Notes', 'Videos', 'Coding Problems'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab as any)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                activeFilter === tab
                                    ? 'bg-primary text-black border-primary'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Resource Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((item, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-3xl border border-white/10 hover:border-primary/50 transition-all flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-primary border border-white/10 font-bold uppercase">
                                    {item.type}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-mono font-bold">
                                    {item.badge}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                            {item.summary && <p className="text-xs text-gray-400 leading-relaxed">{item.summary}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                            <span className="text-gray-400 font-mono">{item.category}</span>
                            {item.url ? (
                                <a href={item.url} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline flex items-center gap-1">
                                    Watch Video <ExternalLink size={12} />
                                </a>
                            ) : (
                                <button onClick={() => navigate('/coding-lab')} className="text-primary font-bold hover:underline flex items-center gap-1">
                                    Practice Now <Code2 size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningHub;
