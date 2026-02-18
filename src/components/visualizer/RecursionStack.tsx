import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';

interface RecursionStackProps {
    stack: string[];
}

export const RecursionStack: React.FC<RecursionStackProps> = ({ stack }) => {
    return (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 ring-1 ring-white/5 shadow-2xl p-4 flex flex-col gap-4 min-h-[200px] h-full">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Recursion Stack</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {stack.map((call, index) => (
                        <motion.div
                            key={`${index}-${call}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/5 border border-white/5 rounded-lg p-3 text-xs font-mono text-white/80 relative overflow-hidden group"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/50" />
                            <span className="relative z-10">{call}</span>
                            {index === stack.length - 1 && (
                                <motion.div
                                    layoutId="active-stack-indicator"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {stack.length === 0 && (
                    <div className="text-center py-8 text-white/20 text-xs italic">
                        Stack is empty
                    </div>
                )}
            </div>
        </div>
    );
};
