import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
    ArrowRight,
    RotateCcw,
    Layers,
    AlertCircle,
    CheckCircle2,
    History,
    CornerRightDown,
    ArrowUpFromLine,
    Eye,
    Maximize,
    Minimize,
    ZoomIn,
    ZoomOut
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface StackVisualizerProps {
    type: 'integer' | 'character';
    size: number;
    onReset: () => void;
}

interface StackOperation {
    type: 'PUSH' | 'POP' | 'TOP' | 'ISEMPTY' | 'ISFULL' | 'ERROR' | 'RESET';
    value?: string | number;
    message: string;
    complexity?: string;
    timestamp: number;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({
    type,
    size,
    onReset
}) => {
    const [stack, setStack] = useState<(string | number)[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [history, setHistory] = useState<StackOperation[]>([]);
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [zoom, setZoom] = useState(1);

    // Refs and Controls
    const inputRef = useRef<HTMLInputElement>(null);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();
    const [resetKey, setResetKey] = useState(0);

    // Helpers
    const addToHistory = (op: StackOperation['type'], msg: string, val?: string | number) => {
        setHistory(prev => [{
            type: op,
            message: msg,
            value: val,
            complexity: op === 'ERROR' || op === 'RESET' ? undefined : 'O(1)',
            timestamp: Date.now()
        }, ...prev].slice(0, 10)); // Keep last 10
    };

    const setStatus = (type: 'success' | 'error' | 'info', text: string) => {
        setStatusMessage({ type, text });
        // Clear status after 3 seconds
        setTimeout(() => setStatusMessage(null), 3000);
    };

    // Operations
    const handlePush = () => {
        if (stack.length >= size) {
            setStatus('error', 'Stack Overflow! Cannot push to a full stack.');
            addToHistory('ERROR', 'Stack Overflow');
            return;
        }

        if (!inputValue.trim()) {
            setStatus('error', 'Please enter a value.');
            return;
        }

        // Validation
        let value: string | number = inputValue;
        if (type === 'integer') {
            const num = parseInt(inputValue);
            if (isNaN(num)) {
                setStatus('error', 'Invalid input: integers only.');
                return;
            }
            if (inputValue.length > 5 && (num > 99999 || num < -9999)) { // Check visual length or value
                // User asked for max length of integer input = 5 digits.
                // Let's stick to string length check roughly or strict 5 digits.
            }
            if (inputValue.replace('-', '').length > 5) {
                setStatus('error', 'Input too long: max 5 digits.');
                return;
            }
            value = num;
        } else {
            // Any single character
            if (inputValue.length !== 1) {
                setStatus('error', 'Invalid input: single character only.');
                return;
            }
            value = inputValue;
        }

        setStack(prev => [...prev, value]);
        setInputValue('');
        setStatus('success', `Pushed ${value} to stack.`);
        addToHistory('PUSH', `Pushed ${value}`, value);

        // Auto-focus back to input
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    const handlePop = () => {
        if (stack.length === 0) {
            setStatus('error', 'Stack Underflow! Cannot pop from an empty stack.');
            addToHistory('ERROR', 'Stack Underflow');
            return;
        }

        const poppedValue = stack[stack.length - 1];
        setStack(prev => prev.slice(0, -1));
        setStatus('success', `Popped ${poppedValue} from stack.`);
        addToHistory('POP', `Popped ${poppedValue}`, poppedValue);
    };

    const handleTop = () => {
        if (stack.length === 0) {
            setStatus('error', 'Stack is empty. No top element.');
            return;
        }

        const topIndex = stack.length - 1;
        setHighlightIndex(topIndex);
        const topValue = stack[topIndex];

        setStatus('info', `Top element is ${topValue} at index ${topIndex}.`);
        addToHistory('TOP', `Top: ${topValue}`, topValue);

        setTimeout(() => setHighlightIndex(null), 2000);
    };

    const handleIsEmpty = () => {
        const empty = stack.length === 0;
        setStatus(empty ? 'info' : 'info', `isEmpty() returned ${empty}`);
        addToHistory('ISEMPTY', `Result: ${empty}`);
    };

    const handleIsFull = () => {
        const full = stack.length === size;
        setStatus(full ? 'error' : 'info', `isFull() returned ${full}`); // Error color for full warning? Or just info. User said "visual warning if stack is full"
        addToHistory('ISFULL', `Result: ${full}`);
    };

    // Render slots reversed (visual growth upward)
    // We want index 0 at bottom, size-1 at top.
    // Flex-col-reverse matches this naturally for DOM order vs Visual order if we map 0..size.
    // However, we want to render explicit slots.


    return (
        <div className="flex-1 flex flex-col xl:flex-row gap-4 h-full min-h-[600px]">
            {/* Left Sidebar: Controls */}
            <aside className="w-full xl:w-80 flex flex-col gap-4 min-h-0">
                <div className="p-6 bg-[#1a1a1a] rounded-2xl border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-black/50 flex flex-col gap-6">
                    {/* Header/Stats */}
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Type</span>
                            <span className="text-sm font-bold text-white uppercase">{type}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Capacity</span>
                            <span className="text-sm font-bold text-white uppercase">{stack.length} / {size}</span>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">
                            Input ({type === 'integer' ? 'Max 5 digits' : 'Any Single Char'})
                        </label>
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type={type === 'integer' ? 'number' : 'text'}
                                value={inputValue}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (type === 'character') {
                                        // Allow any single character
                                        const singleChar = val.slice(0, 1);
                                        setInputValue(singleChar);
                                    } else {
                                        setInputValue(val);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handlePush();
                                }}
                                maxLength={type === 'character' ? 1 : 5}
                                placeholder={type === 'integer' ? "123" : "*"}
                                className="min-w-0 flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-center uppercase"
                            />
                            <button
                                onClick={handlePush}
                                disabled={stack.length >= size}
                                className="shrink-0 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/20 flex items-center justify-center"
                            >
                                <CornerRightDown className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Operations */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handlePop}
                            disabled={stack.length === 0}
                            className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider disabled:opacity-30"
                        >
                            <ArrowUpFromLine className="w-4 h-4" /> Pop
                        </button>
                        <button
                            onClick={handleTop}
                            disabled={stack.length === 0}
                            className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider disabled:opacity-30"
                        >
                            <Eye className="w-4 h-4" /> Top
                        </button>
                        <button
                            onClick={handleIsEmpty}
                            className="p-3 bg-white/5 text-white/60 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider"
                        >
                            <Minimize className="w-3 h-3" /> isEmpty
                        </button>
                        <button
                            onClick={handleIsFull}
                            className="p-3 bg-white/5 text-white/60 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider"
                        >
                            <Maximize className="w-3 h-3" /> isFull
                        </button>
                    </div>

                    {/* Zoom & View Controls */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs uppercase tracking-widest text-white/40 font-bold">View Controls</label>
                            <span className="text-[10px] font-black text-primary uppercase">{Math.round(zoom * 100)}%</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                                title="Zoom Out"
                                className="flex-1 p-3 bg-white/5 text-white/60 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    setZoom(1);
                                    setResetKey(prev => prev + 1);
                                }}
                                className="px-4 bg-white/5 text-white/60 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-[10px] font-black uppercase"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                                title="Zoom In"
                                className="flex-1 p-3 bg-white/5 text-white/60 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onReset}
                        className="w-full py-3 mt-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                    >
                        <RotateCcw className="w-4 h-4" /> Reset Configuration
                    </button>
                </div>
            </aside>

            {/* Visualizer Area */}
            <section className="flex-1 bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 ring-1 ring-white/5 shadow-2xl relative overflow-hidden flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-white">Interactive Stack</h2>
                    </div>

                    <AnimatePresence>
                        {statusMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={cn(
                                    "px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wide flex items-center gap-2",
                                    statusMessage.type === 'error' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                                        statusMessage.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                            "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                )}
                            >
                                {statusMessage.type === 'error' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                {statusMessage.text}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Stack Container */}
                <div
                    ref={constraintsRef}
                    onPointerDown={(e) => dragControls.start(e)}
                    className="flex-1 relative flex flex-col items-center justify-start p-0 bg-grid-white/[0.02] overflow-hidden cursor-grab active:cursor-grabbing touch-none"
                >
                    {/* The Stack Box with Zoom Scaling and Dynamic Growth */}
                    <motion.div
                        key={resetKey}
                        drag
                        dragControls={dragControls}
                        dragListener={false}
                        dragElastic={0}
                        dragMomentum={false}
                        layout
                        animate={{ scale: zoom }}
                        transition={{
                            scale: { type: "spring", stiffness: 300, damping: 25 },
                            layout: { duration: 0.3 }
                        }}
                        className="relative flex flex-col-reverse items-center gap-1 origin-top"
                    >
                        {/* Stack Base Visual */}
                        <div className="w-24 md:w-40 h-2 bg-white/10 rounded-full mt-2" />

                        <AnimatePresence initial={false} mode='popLayout'>
                            {stack.map((value, index) => {
                                const isTop = index === stack.length - 1;
                                const isHighlighted = highlightIndex === index;

                                return (
                                    <motion.div
                                        key={`${index}-${value}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8, y: -50 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, x: 50, transition: { duration: 0.2 } }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="flex items-center gap-4 relative group"
                                    >
                                        {/* Index Label */}
                                        <span className="absolute -left-8 text-[10px] font-mono text-white/20 w-4 text-right">{index}</span>

                                        {/* Stack Slot Box */}
                                        <div className={cn(
                                            "w-20 h-14 md:w-32 md:h-16 rounded-xl border-2 flex items-center justify-center relative transition-all duration-300",
                                            isHighlighted
                                                ? "bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                                : isTop
                                                    ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                                    : "bg-white/10 border-white/20"
                                        )}>
                                            <span className={cn(
                                                "text-lg md:text-xl font-black font-mono",
                                                isHighlighted ? "text-amber-400" : isTop ? "text-primary-foreground" : "text-white"
                                            )}>
                                                {value}
                                            </span>
                                        </div>

                                        {/* Top Pointer */}
                                        {isTop && (
                                            <motion.div
                                                layoutId="top-pointer"
                                                className="absolute -right-24 flex items-center gap-2 text-primary"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            >
                                                <ArrowRight className="w-5 h-5 rotate-180" />
                                                <span className="text-xs font-black uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md border border-primary/20">Top</span>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* Capacity Indicator if Stack is not full */}
                        {stack.length < size && (
                            <div className="w-20 h-14 md:w-32 md:h-16 rounded-xl border-2 border-dashed border-white/5 flex items-center justify-center opacity-30">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 uppercase">Empty</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Right Sidebar: History */}
            <aside className="w-full xl:w-80 flex flex-col gap-4 min-h-0">
                <div className="flex-1 p-6 bg-[#1a1a1a] rounded-2xl border border-white/10 ring-1 ring-white/5 shadow-2xl flex flex-col gap-4 min-h-[400px]">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                        <History className="w-4 h-4 text-white/40" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Operation History</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {history.map((op) => (
                                <motion.div
                                    key={op.timestamp}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={cn(
                                        "p-3 rounded-lg border text-xs font-medium flex flex-col gap-1 bg-white/[0.02]",
                                        op.type === 'ERROR' ? "border-rose-500/20 text-rose-400" :
                                            op.type === 'PUSH' ? "border-emerald-500/20 text-emerald-400" :
                                                op.type === 'POP' ? "border-blue-500/20 text-blue-400" :
                                                    "border-white/10 text-white/60"
                                    )}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <span>{op.message}</span>
                                        <span className="text-[10px] opacity-50 font-mono">{new Date(op.timestamp).toLocaleTimeString().split(' ')[0]}</span>
                                    </div>
                                    {op.complexity && (
                                        <div className="flex items-center gap-1.5 mt-1 border-t border-white/[0.03] pt-1">
                                            <span className="text-[9px] font-black uppercase tracking-tighter opacity-40">Time complexity:</span>
                                            <span className="text-[10px] font-mono font-bold bg-white/5 px-1.5 py-0.5 rounded text-primary border border-white/5">{op.complexity}</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {history.length === 0 && (
                            <div className="text-center text-white/20 text-xs py-8 italic">No operations yet</div>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
};
