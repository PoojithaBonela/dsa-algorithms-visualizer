import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Move
} from 'lucide-react';
import type { AlgorithmTrace, MergeNode } from '../../lib/algorithms/types';
import { cn } from '../../utils/cn';

import { RecursionStack } from './RecursionStack';

interface MergeSortVisualizerProps {
    trace: AlgorithmTrace;
    onReset: () => void;
}

export const MergeSortVisualizer: React.FC<MergeSortVisualizerProps> = ({
    trace,
    onReset
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(500);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const timerRef = useRef<number | null>(null);

    const step = trace.steps[currentStep];
    const maxSteps = trace.steps.length;
    const nodes = step.nodes || [];

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

    // Group nodes by level for rendering
    const levels = nodes.reduce((acc, node) => {
        if (!acc[node.level]) acc[node.level] = [];
        acc[node.level].push(node);
        return acc;
    }, {} as Record<number, MergeNode[]>);

    const sortedLevels = Object.keys(levels).map(Number).sort((a, b) => a - b);

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

    return (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[600px] lg:h-[800px] bg-[#0a0a0a] rounded-[2.5rem] p-6 border border-white/10 ring-1 ring-white/5 shadow-2xl">

            {/* Main Visualizer Area */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                {/* Message Bar */}
                <div className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-mono text-white/80">{step.message}</span>
                </div>
                {/* Controls Toolbar */}
                <div className="flex flex-col md:flex-row items-center justify-between p-3 gap-4 bg-[#1a1a1a] rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                        <button
                            onClick={() => !((currentStep === maxSteps - 1)) && setIsPlaying(!isPlaying)}
                            disabled={currentStep === maxSteps - 1}
                            className={cn(
                                "px-4 py-2 rounded-xl flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-all",
                                isPlaying
                                    ? "bg-accent/20 text-accent border border-accent/20"
                                    : "bg-primary text-primary-foreground hover:scale-[1.02]"
                            )}
                        >
                            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>

                        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                            <button onClick={prevStep} disabled={currentStep === 0} className="p-1.5 hover:bg-white/10 rounded-md disabled:opacity-20"><ChevronLeft className="w-3.5 h-3.5" /></button>
                            <span className="text-[10px] font-mono w-16 text-center text-white/50">{currentStep} / {maxSteps - 1}</span>
                            <button onClick={nextStep} disabled={currentStep === maxSteps - 1} className="p-1.5 hover:bg-white/10 rounded-md disabled:opacity-20"><ChevronRight className="w-3.5 h-3.5" /></button>
                        </div>

                        <button onClick={handleReset} className="p-2 bg-white/5 rounded-xl hover:bg-white/10"><RotateCcw className="w-3.5 h-3.5" /></button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t border-white/5 pt-2 md:pt-0 md:border-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Speed</span>
                            <input
                                type="range"
                                min="50"
                                max="1500"
                                step="50"
                                value={playbackSpeed}
                                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                                className="w-24 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                        <div className="w-[1px] h-6 bg-white/10 hidden md:block" />
                        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                            <button onClick={() => setScale(s => Math.max(0.2, s - 0.1))} className="p-1.5 hover:bg-white/10 rounded-lg"><ZoomOut className="w-3.5 h-3.5 text-white/60" /></button>
                            <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }} className="p-1.5 hover:bg-white/10 rounded-lg"><Move className="w-3.5 h-3.5 text-white/60" /></button>
                            <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-1.5 hover:bg-white/10 rounded-lg"><ZoomIn className="w-3.5 h-3.5 text-white/60" /></button>
                        </div>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-[#151515] rounded-2xl border border-white/5 relative overflow-hidden cursor-move group perspective-1000 shadow-inner"
                    onMouseDown={(e) => {
                        const startX = e.clientX - position.x;
                        const startY = e.clientY - position.y;
                        const handleMouseMove = (ev: MouseEvent) => {
                            setPosition({ x: ev.clientX - startX, y: ev.clientY - startY });
                        };
                        const handleMouseUp = () => {
                            window.removeEventListener('mousemove', handleMouseMove);
                            window.removeEventListener('mouseup', handleMouseUp);
                        };
                        window.addEventListener('mousemove', handleMouseMove);
                        window.addEventListener('mouseup', handleMouseUp);
                    }}
                >
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                    />

                    <div
                        className="w-full h-full flex flex-col items-center pt-10 transition-transform duration-75 ease-out origin-top"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
                        }}
                    >
                        <AnimatePresence mode="popLayout">
                            {sortedLevels.map((level) => (
                                <div key={level} className="flex gap-8 justify-center mb-12 relative">
                                    {levels[level].map((node) => {
                                        const isActive = node.status === 'active' || node.status === 'merging';
                                        const isSorted = node.status === 'sorted';

                                        return (
                                            <motion.div
                                                key={node.id}
                                                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                                animate={{
                                                    opacity: isActive || isSorted ? 1 : 0.4,
                                                    y: 0,
                                                    scale: 1,
                                                    borderColor: isActive ? 'rgba(59, 130, 246, 0.5)' : isSorted ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                                                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : isSorted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)'
                                                }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                className={cn(
                                                    "relative p-2 rounded-xl border border-white/10 min-w-[60px] flex items-center justify-center gap-1 transition-all duration-300",
                                                    isActive && "ring-2 ring-primary/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]",
                                                    isSorted && "ring-1 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                                )}
                                            >
                                                {node.values.map((val, idx) => (
                                                    <motion.div
                                                        key={`${node.id}-${idx}`}
                                                        layout
                                                        className={cn(
                                                            "w-7 h-7 flex items-center justify-center rounded-md text-[10px] font-bold font-mono border transition-colors duration-300",
                                                            isSorted
                                                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                                : isActive
                                                                    ? "bg-primary/20 text-primary border-primary/30"
                                                                    : "bg-white/5 text-white/40 border-white/5"
                                                        )}
                                                    >
                                                        {val}
                                                    </motion.div>
                                                ))}

                                                {/* Node ID Label */}
                                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-white/10 font-mono tracking-tighter whitespace-nowrap uppercase">
                                                    {node.id === 'root' ? 'ROOT' : node.id.split('-').pop()}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>


            </div>

            {/* Sidebar: Recursion Stack */}
            <div className="w-full lg:w-72 flex-shrink-0">
                <RecursionStack stack={step.recursionStack || []} />
            </div>
        </div>
    );
};
