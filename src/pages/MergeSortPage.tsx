import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    RotateCcw,
    ChevronLeft as ChevronLeftIcon,
    Menu,
    Home,
    Grid
} from 'lucide-react';
import { MergeSortVisualizer } from '../components/visualizer/MergeSortVisualizer';
import { generateMergeSortTrace } from '../lib/algorithms/sorting';
import type { AlgorithmTrace } from '../lib/algorithms/types';

interface MergeSortPageProps {
    onBack: () => void;
    onHome: () => void;
    onCatalog: () => void;
}

export const MergeSortPage: React.FC<MergeSortPageProps> = ({ onBack, onHome, onCatalog }) => {
    const [input, setInput] = useState<string>('64, 34, 25, 12, 22, 11, 90');
    const [trace, setTrace] = useState<AlgorithmTrace | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);

    const handleVisualize = () => {
        try {
            const numbers = input
                .split(',')
                .map(n => n.trim())
                .filter(n => n !== '')
                .map(n => {
                    const parsed = parseInt(n);
                    if (isNaN(parsed)) throw new Error(`Invalid number: ${n}`);
                    return parsed;
                });

            if (numbers.length === 0) {
                throw new Error('Please enter at least one number.');
            }

            if (numbers.length > 20) {
                throw new Error('Maximum 20 numbers allowed for visualization.');
            }

            setTrace(generateMergeSortTrace(numbers));
            setError(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleRandomize = () => {
        const length = Math.floor(Math.random() * 8) + 5;
        const randomNumbers = Array.from({ length }, () => Math.floor(Math.random() * 90) + 10);
        setInput(randomNumbers.join(', '));
        setTrace(generateMergeSortTrace(randomNumbers));
        setError(null);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-primary/30 relative">
            {/* Background Dots */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />
            </div>

            {/* Navigation Header */}
            <header className="h-20 border-b border-white/10 backdrop-blur-md bg-[#050505]/80 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block leading-none mb-1">Sorting Algorithms</span>
                        <h1 className="font-black text-xl tracking-tight text-white uppercase leading-none">Merge Sort <span className="text-primary text-xs ml-2">Active Insight</span></h1>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"
                    >
                        <Menu className="w-5 h-5 text-white/60" />
                    </button>

                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
                            >
                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={onHome}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                                    >
                                        <Home className="w-4 h-4" />
                                        <span>Home</span>
                                    </button>
                                    <button
                                        onClick={onCatalog}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                                    >
                                        <Grid className="w-4 h-4" />
                                        <span>Catalog</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <main className="flex-1 flex flex-col p-6 gap-6 relative z-10 max-w-6xl mx-auto w-full">
                {/* Input Section */}
                {!trace ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex items-center justify-center"
                    >
                        <div className="w-full max-w-2xl p-10 bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 ring-1 ring-white/5 shadow-2xl space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Initialize Dataset</h2>
                                <p className="text-white/40 text-sm">Enter comma-separated numbers or generate a random sequence.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-2">Input Numbers</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="e.g. 5, 2, 9, 1, 5"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-lg"
                                        />
                                        <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                                    </div>
                                    <AnimatePresence>
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-rose-500 text-xs font-bold uppercase tracking-widest mt-2 ml-2"
                                            >
                                                {error}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleVisualize}
                                        className="flex-1 bg-primary text-primary-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                        Initialize Visualizer
                                    </button>
                                    <button
                                        onClick={handleRandomize}
                                        className="px-6 bg-white/5 border border-white/10 hover:bg-white/10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Random
                                    </button>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">Algorithm Complexity</span>
                                        <div className="flex items-center gap-4">
                                            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                                                <span className="text-[10px] font-black text-primary">T: O(n log n)</span>
                                            </div>
                                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                                <span className="text-[10px] font-black text-emerald-400">S: O(n)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">Best Case</span>
                                        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full inline-block">
                                            <span className="text-[10px] font-black text-amber-400">T: O(n log n)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl px-8">
                            <div className="flex items-center gap-6">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block leading-none">Dataset</span>
                                    <div className="flex gap-2">
                                        {input.split(',').slice(0, 8).map((n, i) => (
                                            <span key={i} className="text-xs font-mono text-white/60">{n.trim()}</span>
                                        ))}
                                        {input.split(',').length > 8 && <span className="text-xs text-white/40">...</span>}
                                    </div>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10" />
                                <button
                                    onClick={() => setTrace(null)}
                                    className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                >
                                    Edit Input
                                </button>
                            </div>

                            <button
                                onClick={handleRandomize}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                New Random Data
                            </button>
                        </div>

                        <MergeSortVisualizer
                            trace={trace}
                            onReset={() => setTrace(generateMergeSortTrace(input.split(',').map(n => parseInt(n.trim()))))}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};
