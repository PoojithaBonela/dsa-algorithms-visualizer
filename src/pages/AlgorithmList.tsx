import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Play,
    Clock,
    Binary,
    Code2,
    Lock
} from 'lucide-react';

interface Algorithm {
    id: string;
    title: string;
    description: string;
    complexity: {
        time: string;
        space: string;
    };
    difficulty: 'Easy' | 'Medium' | 'Hard';
    comingSoon?: boolean;
}

const algorithmsByCategory: Record<string, Algorithm[]> = {
    "Sorting Algorithms": [
        {
            id: "bubble-sort",
            title: "Bubble Sort",
            description: "A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
            complexity: { time: "O(n²)", space: "O(1)" },
            difficulty: "Easy"
        },
        {
            id: "selection-sort",
            title: "Selection Sort",
            description: "Repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
            complexity: { time: "O(n²)", space: "O(1)" },
            difficulty: "Easy"
        },
        {
            id: "insertion-sort",
            title: "Insertion Sort",
            description: "Builds the final sorted array one item at a time, much like how you sort playing cards in your hands.",
            complexity: { time: "O(n²)", space: "O(1)" },
            difficulty: "Easy"
        },
        {
            id: "merge-sort",
            title: "Merge Sort",
            description: "A divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
            complexity: { time: "O(n log n)", space: "O(n)" },
            difficulty: "Medium"
        },
        {
            id: "quick-sort",
            title: "Quick Sort",
            description: "Picks an element as 'pivot' and partitions the given array around the picked pivot by placing the pivot in its correct position.",
            complexity: { time: "O(n log n)", space: "O(log n)" },
            difficulty: "Medium"
        }
    ],
    "Linear & Binary Search": [
        {
            id: "linear-search",
            title: "Linear Search",
            description: "Checks every element in the list sequentially until a match is found or the whole list has been searched.",
            complexity: { time: "O(n)", space: "O(1)" },
            difficulty: "Easy"
        },
        {
            id: "binary-search",
            title: "Binary Search",
            description: "Finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
            complexity: { time: "O(log n)", space: "O(1)" },
            difficulty: "Easy"
        }
    ],
    "Stacks & Queues": [
        {
            id: "stack",
            title: "Stack (LIFO)",
            description: "A linear data structure that follows the Last-In-First-Out (LIFO) principle. Elements are added and removed from the same end (top).",
            complexity: { time: "O(1)", space: "O(n)" },
            difficulty: "Easy"
        },
        {
            id: "queue",
            title: "Queue (FIFO)",
            description: "A linear data structure that follows the First-In-First-Out (FIFO) principle. Elements are added at the rear and removed from the front.",
            complexity: { time: "O(1)", space: "O(n)" },
            difficulty: "Easy"
        }
    ],
    "Binary Trees": [
        {
            id: "create-binary-tree",
            title: "Create Binary Tree",
            description: "Interactively build and visualize a binary tree. Understand node relationships, levels, and height.",
            complexity: { time: "O(log n)", space: "O(n)" },
            difficulty: "Medium"
        },
        {
            id: "explore-binary-tree-types",
            title: "Explore Types of Binary Tree",
            description: "Learn about different types of binary trees like Full, Complete, Perfect, and Balanced trees with visual examples.",
            complexity: { time: "O(1)", space: "O(1)" },
            difficulty: "Easy",
            comingSoon: true
        }
    ]
};

export const AlgorithmList = ({
    category,
    onBack,
    onSelect
}: {
    category: string,
    onBack: () => void,
    onSelect: (algoId: string) => void
}) => {
    const algorithms = algorithmsByCategory[category] || [];

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
            {/* Background Style - Blue Dots & Circles */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
            </div>

            <header className="h-20 border-b border-white/5 backdrop-blur-md bg-[#050505]/80 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block leading-none mb-1">{category}</span>
                        <h1 className="font-black text-xl tracking-tight text-white uppercase leading-none">Select <span className="text-primary">Logic</span></h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {algorithms.map((algo, i) => (
                        <motion.div
                            key={algo.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={algo.comingSoon ? {} : { scale: 1.01, x: 5 }}
                            onClick={() => !algo.comingSoon && onSelect(algo.id)}
                            className={`group p-8 bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 ring-1 ring-white/5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${algo.comingSoon
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'cursor-pointer hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10'
                                }`}
                        >
                            {!algo.comingSoon && (
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            )}

                            {/* Coming Soon Badge */}
                            {algo.comingSoon && (
                                <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full z-20">
                                    <Lock className="w-3 h-3 text-white/40" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Coming Soon</span>
                                </div>
                            )}

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-4 bg-white/5 rounded-2xl transition-all ${!algo.comingSoon ? 'group-hover:bg-primary/20 group-hover:scale-110' : ''}`}>
                                        <Code2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${algo.difficulty === 'Easy' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                                            algo.difficulty === 'Medium' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
                                                'border-rose-500/20 text-rose-400 bg-rose-500/5'
                                            }`}>
                                            {algo.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <h3 className={`text-2xl font-black text-white mb-3 tracking-tight transition-colors uppercase ${!algo.comingSoon ? 'group-hover:text-primary' : ''}`}>{algo.title}</h3>
                                <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">
                                    {algo.description}
                                </p>
                            </div>

                            <div className="relative z-10 flex flex-wrap items-center gap-6 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-white/20" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Time:</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{algo.complexity.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Binary className="w-4 h-4 text-white/20" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Space:</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{algo.complexity.space}</span>
                                </div>
                                {!algo.comingSoon && (
                                    <div className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        Visualize <Play className="w-3 h-3 fill-current" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};
