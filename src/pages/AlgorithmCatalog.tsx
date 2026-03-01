import { motion } from 'framer-motion';
import {
    ArrowDownUp,
    Search,
    Database,
    Workflow,
    GitFork,
    Triangle,
    Atom,
    ChevronLeft,
    ArrowRight,
    Zap,
    Lock
} from 'lucide-react';

const categories = [
    {
        title: "Sorting Algorithms",
        description: "Visualize the logic of reordering data efficiently. From Bubble to Quick Sort.",
        icon: ArrowDownUp,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20"
    },
    {
        title: "Linear & Binary Search",
        description: "Master the fundamental techniques of locating data in sorted and unsorted structures.",
        icon: Search,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/20"
    },
    {
        title: "Stacks & Queues",
        description: "Deep dive into LIFO and FIFO primitives. The backbone of memory and tasks.",
        icon: Database,
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/20"
    },
    {
        title: "Linked Lists",
        description: "Understand pointers and node-based traversal. Singly, doubly, and circular lists.",
        icon: Workflow,
        color: "text-rose-400",
        bg: "bg-rose-400/10",
        border: "border-rose-400/20",
        comingSoon: true
    },
    {
        title: "Binary Trees",
        description: "Explore recursive structures and tree traversals (In-order, Pre-order, Post-order).",
        icon: GitFork,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/20"
    },
    {
        title: "Binary Search Trees",
        description: "Visualize efficient insertion, deletion, and searching in hierarchical structures.",
        icon: Triangle,
        color: "text-cyan-400",
        bg: "bg-cyan-400/10",
        border: "border-cyan-400/20",
        comingSoon: true
    },
    {
        title: "Graph Algorithms",
        description: "Solve complex pathfinding and connectivity problems with BFS, DFS, and Dijkstra's.",
        icon: Atom,
        color: "text-indigo-400",
        bg: "bg-indigo-400/10",
        border: "border-indigo-400/20",
        comingSoon: true
    }
];

export const AlgorithmCatalog = ({ onSelect, onBack }: { onSelect: (algo: string) => void, onBack: () => void }) => {
    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
            {/* Background Style - Blue Dots & Circles */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />

                {/* Subtle SVG Circles */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10" viewBox="0 0 1000 1000">
                    <circle cx="500" cy="500" r="450" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4 8" />
                    <circle cx="500" cy="500" r="350" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2 4" />
                </svg>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
            </div>

            {/* Catalog Header */}
            <header className="h-20 border-b border-white/5 backdrop-blur-md bg-[#050505]/80 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <h1 className="font-black text-xl tracking-tight text-white uppercase">Visualizer <span className="text-primary">Catalog</span></h1>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Select logic to begin</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={category.comingSoon ? {} : { scale: 1.02, y: -5 }}
                            onClick={() => !category.comingSoon && onSelect(category.title)}
                            className={`group p-8 bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 ring-1 ring-white/5 transition-all duration-300 relative overflow-hidden ${category.comingSoon
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10'
                                }`}
                        >
                            {/* Card Shine Effect */}
                            {!category.comingSoon && (
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            )}

                            {/* Coming Soon Badge */}
                            {category.comingSoon && (
                                <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full z-20">
                                    <Lock className="w-3 h-3 text-white/40" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Coming Soon</span>
                                </div>
                            )}

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 transition-all relative z-10 ${!category.comingSoon ? 'group-hover:bg-primary/20 group-hover:scale-110' : ''}`}>
                                <category.icon className={`w-7 h-7 ${category.color} transition-colors ${!category.comingSoon ? 'group-hover:text-primary' : ''}`} />
                            </div>
                            <h3 className={`text-2xl font-black text-white mb-3 tracking-tight transition-colors uppercase relative z-10 ${!category.comingSoon ? 'group-hover:text-primary' : ''}`}>{category.title}</h3>
                            <p className="text-white/40 text-sm font-medium leading-relaxed mb-6 italic relative z-10">
                                {category.description}
                            </p>
                            {!category.comingSoon && (
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                                    Explore Algos <ArrowRight className="w-3 h-3" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};
