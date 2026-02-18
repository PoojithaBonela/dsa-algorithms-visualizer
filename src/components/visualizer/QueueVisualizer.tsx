import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import {
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
    ZoomOut,
    ArrowDown,
    X
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface QueueVisualizerProps {
    type: 'integer' | 'character';
    size: number;
    isCircular: boolean;
    onReset: () => void;
}

interface QueueOperation {
    type: 'ENQUEUE' | 'DEQUEUE' | 'FRONT' | 'ISEMPTY' | 'ISFULL' | 'ERROR' | 'RESET' | 'CLEAR';
    value?: string | number;
    message: string;
    complexity?: string;
    timestamp: number;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({
    type,
    size,
    isCircular,
    onReset
}) => {
    // Queue State
    const [queue, setQueue] = useState<(string | number | null)[]>(Array(size).fill(null));
    const [frontInd, setFrontInd] = useState<number>(0);
    const [rearInd, setRearInd] = useState<number>(-1);
    const [count, setCount] = useState<number>(0);

    const [inputValue, setInputValue] = useState('');
    const [history, setHistory] = useState<QueueOperation[]>([]);
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [zoom, setZoom] = useState(1);
    const [showHistory, setShowHistory] = useState(true);

    // Refs and Controls
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [resetKey, setResetKey] = useState(0);
    const [lastOp, setLastOp] = useState<'ENQUEUE' | 'DEQUEUE' | 'FRONT' | 'RESET'>('RESET');
    const [opCount, setOpCount] = useState(0);

    // Helpers
    const addToHistory = (op: QueueOperation['type'], msg: string, val?: string | number) => {
        setHistory(prev => [{
            type: op,
            message: msg,
            value: val,
            complexity: op === 'ERROR' || op === 'RESET' || op === 'CLEAR' ? undefined : 'O(1)',
            timestamp: Date.now()
        }, ...prev].slice(0, 10)); // Keep last 10
    };

    const setStatus = (type: 'success' | 'error' | 'info', text: string) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage(null), 3000);
    };

    // Auto-scroll logic with visibility check and size-based animation strength
    useEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            // Determine target index: rear for enqueue/reset, front for dequeue/front
            const targetIdx = (lastOp === 'DEQUEUE' || lastOp === 'FRONT') ? frontInd : rearInd;

            // For reset or initial state, targetIdx might be -1
            if (targetIdx === -1) return;

            const targetItem = itemRefs.current[targetIdx];

            if (targetItem) {
                // Visibility Check: Only scroll if not fully visible
                const itemLeft = targetItem.offsetLeft * zoom;
                const itemRight = (targetItem.offsetLeft + targetItem.offsetWidth) * zoom;
                const visibleLeft = container.scrollLeft;
                const visibleRight = container.scrollLeft + container.clientWidth;

                // Buffer of 60px to ensure pointers/labels are also seen
                const isFullyVisible = itemLeft >= (visibleLeft + 60) && itemRight <= (visibleRight - 60);

                // If it's already visible, skip animation (unless it's a reset)
                if (isFullyVisible && lastOp !== 'RESET') return;

                const itemCenter = (targetItem.offsetLeft + targetItem.offsetWidth / 2) * zoom;
                const scrollLeft = Math.max(0, itemCenter - (container.clientWidth / 2));

                // Strength scaling based on queue size
                const strengthFactor = Math.min(2, Math.max(1, size / 10)); // 1.0 to 2.0 range

                animate(container.scrollLeft, scrollLeft, {
                    type: 'spring',
                    stiffness: 70 * strengthFactor,
                    damping: 15 * strengthFactor,
                    mass: 0.8 * strengthFactor,
                    onUpdate: (latest: number) => {
                        container.scrollLeft = latest;
                    }
                });
            }
        }
    }, [count, frontInd, rearInd, zoom, lastOp, size, opCount]);

    // Operations
    const handleEnqueue = () => {
        if (!inputValue.trim()) {
            setStatus('error', 'Please enter a value.');
            return;
        }

        if (count === size) {
            setStatus('error', 'Queue Overflow!');
            addToHistory('ERROR', 'Queue Overflow');
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
            value = num;
        } else {
            if (inputValue.length !== 1) {
                setStatus('error', 'Single character only.');
                return;
            }
            value = inputValue;
        }

        if (isCircular) {
            const nextRear = (rearInd + 1) % size;
            const newQueue = [...queue];
            newQueue[nextRear] = value;
            setQueue(newQueue);
            setRearInd(nextRear);
            setCount(prev => prev + 1);
        } else {
            // Linear Fixed Queue logic: Just increment rear
            // In a fixed-size linear queue, we can't enqueue if rear hits size-1 
            // even if space is at front, unless we reset or use circular.
            // But we'll follow the user's expectation of "Front pointer moving".
            const nextRear = rearInd + 1;
            if (nextRear >= size) {
                setStatus('error', 'End of Queue reached! (Linear Queue)');
                return;
            }
            const newQueue = [...queue];
            newQueue[nextRear] = value;
            setQueue(newQueue);
            setRearInd(nextRear);
            setCount(prev => prev + 1);
        }

        setInputValue('');
        setStatus('success', `Enqueued ${value}`);
        addToHistory('ENQUEUE', `Enqueued ${value}`, value);
        setLastOp('ENQUEUE');
        setOpCount(prev => prev + 1);
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    const handleDequeue = () => {
        if (count === 0) {
            setStatus('error', 'Queue Underflow!');
            addToHistory('ERROR', 'Queue Underflow');
            return;
        }

        let dequeuedValue: string | number | null = null;

        if (isCircular) {
            dequeuedValue = queue[frontInd];
            const newQueue = [...queue];
            newQueue[frontInd] = null;
            setQueue(newQueue);
            setFrontInd(prev => (prev + 1) % size);
            setCount(prev => prev - 1);
        } else {
            // Linear Dequeue: Move frontInd forward, don't shift array
            dequeuedValue = queue[frontInd];
            const newQueue = [...queue];
            newQueue[frontInd] = null;
            setQueue(newQueue);
            setFrontInd(prev => prev + 1);
            setCount(prev => prev - 1);
        }

        setStatus('success', `Dequeued ${dequeuedValue}`);
        addToHistory('DEQUEUE', `Dequeued ${dequeuedValue}`, dequeuedValue as any);
        setLastOp('DEQUEUE');
        setOpCount(prev => prev + 1);
    };

    const handlePeek = () => {
        if (count === 0) {
            setStatus('error', 'Queue is empty.');
            return;
        }
        const val = queue[frontInd];
        setHighlightIndex(frontInd);
        setStatus('info', `Front is ${val}`);
        addToHistory('FRONT', `Front: ${val}`, val as any);
        setLastOp('FRONT');
        setOpCount(prev => prev + 1);
        setTimeout(() => setHighlightIndex(null), 2000);
    };

    const handleIsEmpty = () => {
        const empty = count === 0;
        setStatus('info', `isEmpty(): ${empty}`);
        addToHistory('ISEMPTY', `isEmpty: ${empty}`);
    };

    const handleIsFull = () => {
        const full = count === size;
        setStatus('info', `isFull(): ${full}`);
        addToHistory('ISFULL', `isFull: ${full}`);
    };

    return (
        <div className="flex-1 flex flex-col xl:flex-row gap-4 h-full min-h-[600px] xl:min-h-[660px]">
            {/* Sidebar Controls */}
            <aside className="w-full xl:w-80 flex flex-col gap-4">
                <div className="p-6 bg-[#1a1a1a] rounded-2xl border border-white/10 ring-1 ring-white/5 shadow-2xl flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Model</span>
                            <span className="text-sm font-bold text-white uppercase">{isCircular ? 'Circular' : 'Linear'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Count</span>
                            <span className="text-sm font-bold text-white uppercase">{count} / {size}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">Input</label>
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type={type === 'integer' ? 'number' : 'text'}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value.slice(0, type === 'integer' ? 5 : 1))}
                                onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
                                placeholder={type === 'integer' ? "123" : "*"}
                                className="min-w-0 flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-center uppercase text-white shadow-inner"
                            />
                            <button
                                onClick={handleEnqueue}
                                disabled={count >= size}
                                className="shrink-0 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                <CornerRightDown className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={handleDequeue} disabled={count === 0} className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider disabled:opacity-30">
                            <ArrowUpFromLine className="w-4 h-4 rotate-90" /> Dequeue
                        </button>
                        <button onClick={handlePeek} disabled={count === 0} className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider disabled:opacity-30">
                            <Eye className="w-4 h-4" /> Front
                        </button>
                        <button onClick={handleIsEmpty} className="p-3 bg-white/5 text-white/60 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider">
                            <Minimize className="w-3 h-3" /> isEmpty
                        </button>
                        <button onClick={handleIsFull} className="p-3 bg-white/5 text-white/60 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider">
                            <Maximize className="w-3 h-3" /> isFull
                        </button>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Zoom</label>
                            <span className="text-[10px] font-black text-blue-400">{Math.round(zoom * 100)}%</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))} className="flex-1 p-3 bg-white/5 text-white/60 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center">
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setZoom(1); setResetKey(prev => prev + 1); }} className="px-4 bg-white/5 text-white/60 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-[10px] font-black uppercase">
                                Reset
                            </button>
                            <button onClick={() => setZoom(prev => Math.min(2, prev + 0.1))} className="flex-1 p-3 bg-white/5 text-white/60 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center">
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <button onClick={onReset} className="w-full py-3 mt-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                        <RotateCcw className="w-4 h-4" /> Reset Config
                    </button>
                </div>
            </aside>

            {/* Visualization Workspace */}
            <section className="flex-1 bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 ring-1 ring-white/5 shadow-2xl relative overflow-hidden flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-blue-500" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-white">Interactive Queue</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <AnimatePresence>
                            {statusMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={cn(
                                        "hidden sm:flex px-4 py-2 rounded-full border text-[10px] md:text-xs font-bold uppercase tracking-wide items-center gap-2",
                                        statusMessage.type === 'error' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : statusMessage.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                    )}
                                >
                                    {statusMessage.type === 'error' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                    {statusMessage.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className={cn(
                                "px-3 md:px-4 py-2 rounded-lg transition-all hover:bg-white/10 active:scale-95 border flex items-center gap-2",
                                showHistory ? "bg-blue-500/10 border-blue-500/50 text-blue-400" : "bg-white/5 border-white/10 text-white/40"
                            )}
                            title={showHistory ? "Hide History" : "Show History"}
                        >
                            <History className="w-4 h-4" />
                            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">History</span>
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex-1 relative overflow-x-auto overflow-y-hidden bg-grid-white/[0.02] cursor-default touch-none flex items-end p-6 md:p-12 custom-scrollbar-thin scale-y-[-1]"
                >
                    <div className="flex-1 flex justify-start min-w-max scale-y-[-1] pb-16">
                        <motion.div
                            key={resetKey}
                            animate={{ scale: zoom }}
                            className="flex flex-row items-center gap-3 origin-top-left ml-12 py-16 px-12 rounded-xl border-y-2 border-white/10 bg-white/[0.01] shadow-inner"
                        >
                            <div className="flex items-center gap-4 py-16 md:py-32 px-12 relative min-w-[300px]">
                                {queue.map((val, idx) => {
                                    const isFront = count > 0 && idx === frontInd;
                                    const isRear = count > 0 && idx === rearInd;
                                    const isHighlighted = highlightIndex === idx;

                                    return (
                                        <div
                                            key={idx}
                                            ref={(el) => { itemRefs.current[idx] = el; }}
                                            className="relative flex flex-col items-center"
                                        >
                                            {/* Front Pointer */}
                                            <AnimatePresence>
                                                {isFront && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                                        className="absolute -top-20 flex flex-col items-center gap-1 z-30 pointer-events-none"
                                                    >
                                                        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-400 backdrop-blur-sm">Front</span>
                                                        <ArrowDown className="w-4 h-4 text-emerald-500 animate-bounce" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div
                                                className={cn(
                                                    "w-20 h-16 md:w-28 md:h-20 rounded-xl border-2 flex items-center justify-center relative transition-all duration-300",
                                                    val !== null
                                                        ? isHighlighted ? "bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]" : isFront ? "bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : isRear ? "bg-rose-500/20 border-rose-500 shadow-[0_0_15px_rgba(244,31,74,0.3)]" : "bg-white/10 border-white/20"
                                                        : "bg-white/[0.02] border-white/10 border-dashed"
                                                )}
                                            >
                                                {val !== null ? (
                                                    <motion.span
                                                        key={`${idx}-${val}`}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className={cn("text-xl md:text-2xl font-black font-mono", isHighlighted ? "text-amber-400" : isFront ? "text-blue-400" : isRear ? "text-rose-400" : "text-white")}
                                                    >
                                                        {val}
                                                    </motion.span>
                                                ) : (
                                                    <span className="text-[8px] font-black text-white/5 uppercase tracking-widest">Empty</span>
                                                )}
                                                <span className="absolute -bottom-6 text-[8px] font-mono text-white/10">{idx}</span>
                                            </div>

                                            {/* Rear Pointer */}
                                            <AnimatePresence>
                                                {isRear && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                                        className="absolute -bottom-20 flex flex-col-reverse items-center gap-1 z-30 pointer-events-none"
                                                    >
                                                        <span className="text-[10px] font-black uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 text-rose-400 backdrop-blur-sm">Rear</span>
                                                        <ArrowDown className="w-4 h-4 text-rose-500 rotate-180 animate-bounce" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Operation History Sidebar */}
            <AnimatePresence mode="wait">
                {showHistory && (
                    <motion.aside
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto', width: '100%', maxWidth: 320 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-4 overflow-hidden xl:h-full"
                    >
                        <div className="flex-1 p-6 bg-[#1a1a1a] rounded-2xl border border-white/10 ring-1 ring-white/5 shadow-2xl flex flex-col gap-4 max-h-[400px] xl:max-h-full min-w-full">
                            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4 text-white/40" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">History</span>
                                </div>
                                <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-white/5 rounded transition-colors text-white/20 hover:text-white/60">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                <AnimatePresence initial={false}>
                                    {history.map((op) => (
                                        <motion.div key={op.timestamp} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={cn("p-3 rounded-lg border text-xs font-medium flex flex-col gap-1 bg-white/[0.02]", op.type === 'ERROR' ? "border-rose-500/20 text-rose-400" : op.type === 'ENQUEUE' ? "border-emerald-500/20 text-emerald-400" : op.type === 'DEQUEUE' ? "border-blue-500/20 text-blue-400" : "border-white/10 text-white/60")}>
                                            <div className="flex justify-between items-center w-full">
                                                <span>{op.message}</span>
                                                <span className="text-[10px] opacity-50 font-mono">{new Date(op.timestamp).toLocaleTimeString().split(' ')[0]}</span>
                                            </div>
                                            {op.complexity && (
                                                <div className="flex items-center gap-1.5 mt-1 border-t border-white/[0.03] pt-1">
                                                    <span className="text-[9px] font-black uppercase tracking-tighter opacity-40">Time:</span>
                                                    <span className="text-[10px] font-mono font-bold bg-white/5 px-1.5 py-0.5 rounded text-blue-400">{op.complexity}</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
};
