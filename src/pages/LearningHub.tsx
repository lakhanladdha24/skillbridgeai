import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Code2, Video, X, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toEmbedUrl } from '../components/EmbeddedMaterialModal';

const LearningHub: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Study Notes' | 'Videos' | 'Coding Problems'>('All');
    const [liveVideos, setLiveVideos] = useState<any[]>([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState<boolean>(false);

    // Selected Video Modal State
    const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

    useEffect(() => {
        fetchLiveVideos(searchQuery);
    }, []);

    const fetchLiveVideos = async (q: string) => {
        setIsLoadingVideos(true);
        try {
            const res = await fetch(`/api/videos/recommend?q=${encodeURIComponent(q || 'Python Machine Learning')}`);
            const data = await res.json();
            if (data.videos) {
                setLiveVideos(data.videos);
            }
        } catch (e) {
            // Keep fallback
        } finally {
            setIsLoadingVideos(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchLiveVideos(searchQuery);
    };

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

    const mappedVideos = liveVideos.map(v => ({
        type: 'Videos',
        title: v.title,
        category: v.category || 'Video Resource',
        creator: v.creator,
        url: v.url || v.embedUrl,
        embedUrl: v.embedUrl,
        score: v.score,
        badge: 'LIVE VIDEO',
        summary: v.summary,
        videoObj: v
    }));

    const combinedResources = [...mappedVideos, ...sampleResources];

    const filtered = combinedResources.filter((r) => {
        const matchesQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = activeFilter === 'All' || r.type === activeFilter;
        return matchesQuery && matchesType;
    });

    return (
        <div className="max-w-6xl mx-auto pt-8 px-4 pb-20">
            {/* Header */}
            <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs mb-3">
                    <BookOpen size={14} /> Centralized Study Material & Live Resource Hub
                </span>
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                    Skill Bridge Learning Hub
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                    Access live YouTube Data API v3 video tutorials, indexed study notes, and interactive coding challenges directly inside Skill Bridge AI.
                </p>
            </div>

            {/* Search & Filter Bar */}
            <form onSubmit={handleSearchSubmit} className="glass-card p-4 rounded-3xl border border-white/10 max-w-4xl mx-auto mb-10 space-y-4">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search live YouTube videos, study notes, or coding topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-full font-semibold"
                    />
                    <button
                        type="submit"
                        className="px-5 py-2 bg-primary text-black font-black text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1"
                    >
                        Search
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-center">
                    {['All', 'Study Notes', 'Videos', 'Coding Problems'].map((tab) => (
                        <button
                            key={tab}
                            type="button"
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
            </form>

            {/* Resource Cards Grid */}
            {isLoadingVideos ? (
                <div className="p-12 text-center text-primary font-semibold animate-pulse">
                    Searching YouTube Data API v3 live for tutorials...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((item: any, idx: number) => (
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
                                <span className="text-gray-400 font-mono flex items-center gap-1">
                                    {item.creator ? `Creator: ${item.creator}` : item.category}
                                    {item.score && <span className="text-yellow-400 font-bold ml-2">★ {item.score}</span>}
                                </span>
                                {item.type === 'Videos' ? (
                                    <button
                                        onClick={() => setSelectedVideo(item)}
                                        className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary font-bold rounded-xl hover:bg-primary hover:text-black transition-all flex items-center gap-1"
                                    >
                                        <Video size={14} /> Watch Video
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/coding-lab')} className="text-primary font-bold hover:underline flex items-center gap-1">
                                        Practice Now <Code2 size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* IN-APP EMBEDDED YOUTUBE VIDEO MODAL */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="w-full max-w-4xl bg-gray-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div>
                                <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-1">
                                    <Sparkles size={14} /> Skill Bridge In-App Video Player
                                </span>
                                <h3 className="text-lg font-bold text-white">{selectedVideo.title}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg">
                            <iframe
                                src={toEmbedUrl(selectedVideo.embedUrl || selectedVideo.url)}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-400 font-mono pt-2">
                            <span>Creator: {selectedVideo.creator || 'YouTube Creator'}</span>
                            <span className="text-yellow-400 font-bold flex items-center gap-1">
                                <Star size={14} fill="currentColor" /> {selectedVideo.score || '5.0'} Rating
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearningHub;
