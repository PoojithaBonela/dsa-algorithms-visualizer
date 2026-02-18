import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Home,
    Grid,
    Binary,
    Type,
    ArrowRight
} from 'lucide-react';
import { StackVisualizer } from '../components/visualizer/StackVisualizer';
import { cn } from '../utils/cn';

interface StackPageProps {
    onBack: () => void;
    onHome: () => void;
    onCatalog: () => void;
}

export const StackPage: React.FC<StackPageProps> = ({ onBack, onHome, onCatalog }) => {
    // Initialization State
    const [isInitialized, setIsInitialized] = useState(false);
    const [stackType, setStackType] = useState<'integer' | 'character'>('integer');
    const [stackSize, setStackSize] = useState<number>(10);

    const handleInitialize = () => {
        setIsInitialized(true);
    };

    const handleReset = () => {
        setIsInitialized(false);
        // Defaults
        setStackSize(10);
        setStackType('integer');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-primary/30 relative">
            {/* Background Dots */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)', // Purple theme for Stacks
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
                        <h1 className="font-black text-xl tracking-tight text-white uppercase leading-none">Stack <span className="text-purple-500 text-xs ml-2">LIFO</span></h1>
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
                            <div className="w-full max-w-3xl bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 ring-1 ring-white/5 shadow-2xl p-8 md:p-12 space-y-10">
                                <div className="text-center space-y-4">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Initialize Stack</h2>
                                    <p className="text-white/40 text-lg max-w-lg mx-auto">Configure your stack before we begin. Choose the data type and capacity.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Type Selection */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-2">Data Type</label>
                                        <div className="grid grid-cols-1 gap-4">
                                            <button
                                                onClick={() => setStackType('integer')}
                                                className={cn(
                                                    "p-6 rounded-2xl border text-left transition-all hover:scale-[1.02]",
                                                    stackType === 'integer'
                                                        ? "bg-purple-500/10 border-purple-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                                                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className={cn("p-3 rounded-xl", stackType === 'integer' ? "bg-purple-500 text-white" : "bg-white/10")}>
                                                        <Binary className="w-6 h-6" />
                                                    </div>
                                                    {stackType === 'integer' && <div className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />}
                                                </div>
                                                <h3 className="text-xl font-bold uppercase mb-1">Integer Stack</h3>
                                                <p className="text-xs opacity-60">Store numbers with up to 5 digits. Supports negative values.</p>
                                            </button>

                                            <button
                                                onClick={() => setStackType('character')}
                                                className={cn(
                                                    "p-6 rounded-2xl border text-left transition-all hover:scale-[1.02]",
                                                    stackType === 'character'
                                                        ? "bg-purple-500/10 border-purple-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                                                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className={cn("p-3 rounded-xl", stackType === 'character' ? "bg-purple-500 text-white" : "bg-white/10")}>
                                                        <Type className="w-6 h-6" />
                                                    </div>
                                                    {stackType === 'character' && <div className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />}
                                                </div>
                                                <h3 className="text-xl font-bold uppercase mb-1">Character Stack</h3>
                                                <p className="text-xs opacity-60">Store single letters (A-Z). Case sensitive storage.</p>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Size Selection */}
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-2">Stack Capacity</label>
                                                <span className="text-2xl font-black text-purple-400">{stackSize}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="3"
                                                max="20"
                                                step="1"
                                                value={stackSize}
                                                onChange={(e) => setStackSize(Number(e.target.value))}
                                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                            />
                                            <div className="flex justify-between text-[10px] text-white/20 font-black uppercase tracking-widest">
                                                <span>Min: 3</span>
                                                <span>Max: 20</span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-white/60">Configuration Summary</h4>
                                            <ul className="space-y-2">
                                                <li className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                                                    <span className="text-white/40">Type</span>
                                                    <span className="font-bold text-white uppercase">{stackType}</span>
                                                </li>
                                                <li className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                                                    <span className="text-white/40">Size Limit</span>
                                                    <span className="font-bold text-white">{stackSize} Slots</span>
                                                </li>
                                                <li className="flex items-center justify-between text-sm">
                                                    <span className="text-white/40">Est. Memory</span>
                                                    <span className="font-bold text-emerald-400">O(N)</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <button
                                            onClick={handleInitialize}
                                            className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
                                        >
                                            Create Stack <ArrowRight className="w-4 h-4" />
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
                            <StackVisualizer
                                type={stackType}
                                size={stackSize}
                                onReset={handleReset}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};
