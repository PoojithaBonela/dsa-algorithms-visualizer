import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Home,
    Grid,
    Binary,
    Type,
    ArrowRight,
    RotateCcw,
    CircleDot
} from 'lucide-react';
import { QueueVisualizer } from '../components/visualizer/QueueVisualizer';
import { cn } from '../utils/cn';

interface QueuePageProps {
    onBack: () => void;
    onHome: () => void;
    onCatalog: () => void;
}

export const QueuePage: React.FC<QueuePageProps> = ({ onBack, onHome, onCatalog }) => {
    // Initialization State
    const [isInitialized, setIsInitialized] = useState(false);
    const [queueType, setQueueType] = useState<'integer' | 'character'>('integer');
    const [isCircular, setIsCircular] = useState(false);
    const [queueSize, setQueueSize] = useState<number>(6);

    const handleInitialize = () => {
        setIsInitialized(true);
    };

    const handleReset = () => {
        setIsInitialized(false);
        // Defaults
        setQueueSize(6);
        setQueueType('integer');
        setIsCircular(false);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-primary/30 relative">
            {/* Background Dots - Blue theme for Queues */}
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
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block leading-none mb-1">Data Structures</span>
                        <h1 className="font-black text-xl tracking-tight text-white uppercase leading-none">Queue <span className="text-blue-500 text-xs ml-2">FIFO</span></h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onHome}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                        title="Home"
                    >
                        <Home className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onCatalog}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                        title="Catalog"
                    >
                        <Grid className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col p-6 gap-6 relative z-10 max-w-7xl mx-auto w-full">
                <AnimatePresence mode='wait'>
                    {!isInitialized ? (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex-1 flex items-center justify-center p-4"
                        >
                            <div className="w-full max-w-4xl bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 ring-1 ring-white/5 shadow-2xl p-8 md:p-12 space-y-10">
                                <div className="text-center space-y-4">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Initialize Queue</h2>
                                    <p className="text-white/40 text-lg max-w-lg mx-auto">Select your queue type and configuration to begin visualization.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Type Selection */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-2">Queue Catalog</label>
                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Linear Integer */}
                                            <button
                                                onClick={() => { setQueueType('integer'); setIsCircular(false); }}
                                                className={cn(
                                                    "p-6 rounded-2xl border text-left transition-all hover:scale-[1.02]",
                                                    (queueType === 'integer' && !isCircular)
                                                        ? "bg-blue-500/10 border-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                                                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className={cn("p-2.5 rounded-xl", (queueType === 'integer' && !isCircular) ? "bg-blue-500 text-white" : "bg-white/10")}>
                                                        <Binary className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-white">Linear</span>
                                                </div>
                                                <h3 className="text-lg font-bold uppercase mb-1">Integer Queue</h3>
                                                <p className="text-[10px] opacity-40">Fixed array based FIFO structure.</p>
                                            </button>

                                            {/* Linear Character */}
                                            <button
                                                onClick={() => { setQueueType('character'); setIsCircular(false); }}
                                                className={cn(
                                                    "p-6 rounded-2xl border text-left transition-all hover:scale-[1.02]",
                                                    (queueType === 'character' && !isCircular)
                                                        ? "bg-blue-500/10 border-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                                                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className={cn("p-2.5 rounded-xl", (queueType === 'character' && !isCircular) ? "bg-blue-500 text-white" : "bg-white/10")}>
                                                        <Type className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-white">Linear</span>
                                                </div>
                                                <h3 className="text-lg font-bold uppercase mb-1">Character Queue</h3>
                                                <p className="text-[10px] opacity-40">Store single characters and symbols.</p>
                                            </button>

                                            {/* Circular Integer */}
                                            <button
                                                onClick={() => { setQueueType('integer'); setIsCircular(true); }}
                                                className={cn(
                                                    "p-6 rounded-2xl border text-left transition-all hover:scale-[1.02]",
                                                    (queueType === 'integer' && isCircular)
                                                        ? "bg-cyan-500/10 border-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                                                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className={cn("p-2.5 rounded-xl", (queueType === 'integer' && isCircular) ? "bg-cyan-500 text-white" : "bg-white/10")}>
                                                        <CircleDot className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-white">Circular</span>
                                                </div>
                                                <h3 className="text-lg font-bold uppercase mb-1 text-cyan-400">Circular Integer</h3>
                                                <p className="text-[10px] opacity-40">Efficient wrap-around storage.</p>
                                            </button>

                                            {/* Circular Character */}
                                            <button
                                                onClick={() => { setQueueType('character'); setIsCircular(true); }}
                                                className={cn(
                                                    "p-6 rounded-2xl border text-left transition-all hover:scale-[1.02]",
                                                    (queueType === 'character' && isCircular)
                                                        ? "bg-cyan-500/10 border-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                                                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className={cn("p-2.5 rounded-xl", (queueType === 'character' && isCircular) ? "bg-cyan-500 text-white" : "bg-white/10")}>
                                                        <RotateCcw className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-white">Circular</span>
                                                </div>
                                                <h3 className="text-lg font-bold uppercase mb-1 text-cyan-400">Circular Character</h3>
                                                <p className="text-[10px] opacity-40">Characters with wrap-around logic.</p>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Size Selection */}
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-2">Queue Capacity</label>
                                                <span className="text-2xl font-black text-blue-400">{queueSize}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="3"
                                                max="15"
                                                step="1"
                                                value={queueSize}
                                                onChange={(e) => setQueueSize(Number(e.target.value))}
                                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                            />
                                            <div className="flex justify-between text-[10px] text-white/20 font-black uppercase tracking-widest">
                                                <span>Min: 3</span>
                                                <span>Max: 15</span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-white/60">Configuration Summary</h4>
                                            <ul className="space-y-2">
                                                <li className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                                                    <span className="text-white/40">Model</span>
                                                    <span className="font-bold text-white uppercase">{isCircular ? 'Circular' : 'Linear'}</span>
                                                </li>
                                                <li className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                                                    <span className="text-white/40">Type</span>
                                                    <span className="font-bold text-white uppercase">{queueType}</span>
                                                </li>
                                                <li className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                                                    <span className="text-white/40">Capacity</span>
                                                    <span className="font-bold text-white">{queueSize} Slots</span>
                                                </li>
                                                <li className="flex items-center justify-between text-sm">
                                                    <span className="text-white/40">Complexity</span>
                                                    <span className="font-bold text-emerald-400">O(1) Enq/Deq</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <button
                                            onClick={handleInitialize}
                                            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                                        >
                                            Create Queue <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="visualizer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1"
                        >
                            <QueueVisualizer
                                type={queueType}
                                size={queueSize}
                                isCircular={isCircular}
                                onReset={handleReset}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};
