import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Play,
    Pause,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    Activity,
    History
} from 'lucide-react';
import type { AlgorithmTrace } from '../../lib/algorithms/types';
import { cn } from '../../utils/cn';

interface VisualizerProps {
    trace: AlgorithmTrace;
    onReset: () => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({
    trace,
    onReset
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(500); // ms
    const timerRef = useRef<number | null>(null);

    const step = trace.steps[currentStep];
    const maxSteps = trace.steps.length;

    useEffect(() => {
        if (isPlaying && currentStep < maxSteps - 1) {
            timerRef.current = window.setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, playbackSpeed);
        } else if (currentStep >= maxSteps - 1) {
            setIsPlaying(false);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isPlaying, currentStep, maxSteps, playbackSpeed]);


    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStep(0);
        onReset();
    };

    const nextStep = () => {
        if (currentStep < maxSteps - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Calculate max value for bar scaling
    const maxValue = Math.max(...trace.steps[0].array);
    const isComplete = currentStep === maxSteps - 1;

    return (
        <div className="flex-1 flex flex-col md:flex-row gap-6">
            {/* Sidebar Controls */}
            <aside className="w-full md:w-80 flex flex-col gap-4 min-h-0">
                <div className="p-6 bg-[#1a1a1a] rounded-2xl border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-black/50 flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Speed</label>
                            <span className="text-[10px] font-black text-primary uppercase">{playbackSpeed}ms</span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="1500"
                            step="50"
                            value={playbackSpeed}
                            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                            className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => !isComplete && setIsPlaying(!isPlaying)}
                                disabled={isComplete}
                                className={cn(
                                    "flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all",
                                    isComplete
                                        ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                                        : isPlaying
                                            ? "bg-accent/20 text-accent border border-accent/20"
                                            : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02]"
                                )}
                            >
                                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className={cn("w-4 h-4 fill-current", isComplete && "fill-white/20")} />}
                                {isPlaying ? 'PAUSE' : isComplete ? 'SORTED' : 'VISUALIZE'}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="flex-1 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 disabled:opacity-20"
                            >
                                <ChevronLeft className="w-4 h-4 mx-auto" />
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex-1 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5"
                            >
                                <RotateCcw className="w-4 h-4 mx-auto" />
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={currentStep >= maxSteps - 1}
                                className="flex-1 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 disabled:opacity-20"
                            >
                                <ChevronRight className="w-4 h-4 mx-auto" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Current Step Trace */}
                <div className="p-6 bg-[#1a1a1a] rounded-2xl border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-black/50 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-white/20" />
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Current Operation</label>
                    </div>
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                        <div className="flex items-start gap-3">
                            <span className="text-primary/40 font-mono text-xs pt-0.5">[{currentStep.toString().padStart(3, '0')}]</span>
                            <p className="text-sm font-medium text-white leading-relaxed">
                                {step.message}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Visualization Canvas Area */}
            <section className="flex-1 bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-black/50 relative overflow-hidden flex flex-col min-h-[450px]">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-white">Visualizer Canvas</h2>
                        </div>
                        <p className="text-xs text-white/30 font-medium italic">Active Insight: Step {currentStep} of {maxSteps - 1}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                        <Activity className="w-3 h-3 text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Simulation Active</span>
                    </div>
                </div>

                <div className="flex-1 flex items-end justify-center gap-2 px-12 pb-4 pt-12 relative">
                    {/* SVG Patterns */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                        <svg className="w-full h-full" viewBox="0 0 1000 1000">
                            <circle cx="500" cy="500" r="400" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 8" />
                            <circle cx="500" cy="500" r="300" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2 4" />
                        </svg>
                    </div>

                    <div className="flex items-end justify-center gap-1 w-full h-full max-w-4xl mx-auto">
                        {step.array.map((value, idx) => {
                            const isComparing = step.type === 'COMPARE' && step.indices.includes(idx);
                            const isSwapping = step.type === 'SWAP' && step.indices.includes(idx);
                            const isHighlighted = step.type === 'HIGHLIGHT' && step.indices.includes(idx);

                            return (
                                <motion.div
                                    key={idx}
                                    layout
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className={cn(
                                        "flex-1 max-w-[50px] rounded-t-lg border-t relative transition-colors duration-300",
                                        isSwapping ? "bg-accent border-accent shadow-[0_0_20px_rgba(244,63,94,0.3)]" :
                                            isComparing ? "bg-primary border-primary shadow-[0_0_20px_rgba(59,130,246,0.3)]" :
                                                isHighlighted ? "bg-emerald-500 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" :
                                                    "bg-white/10 border-white/5"
                                    )}
                                    style={{ height: `${(value / maxValue) * 100}%` }}
                                >
                                    <div className={cn(
                                        "absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black transition-opacity",
                                        (isComparing || isSwapping || isHighlighted) ? "opacity-100" : "opacity-20"
                                    )}>
                                        {value}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Status Bar */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between px-8 text-[10px] font-black uppercase tracking-widest text-white/30">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2 italic">
                            {step.message}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                animate={{ width: `${(currentStep / (maxSteps - 1)) * 100}%` }}
                            />
                        </div>
                        <span>{Math.round((currentStep / (maxSteps - 1)) * 100)}%</span>
                    </div>
                </div>
            </section>
        </div>
    );
};
