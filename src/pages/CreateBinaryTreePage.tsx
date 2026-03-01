import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft as ChevronLeftIcon,
    Menu,
    Home,
    Grid,
    Plus,
    GitFork,
    Zap,
    X,
    ZoomIn,
    ZoomOut,
    Maximize2,
    AlertCircle,
    Undo2,
    Redo2,
    MoveHorizontal,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    RotateCcw
} from 'lucide-react';

interface TreeNode {
    id: string;
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
}

interface PositionedNode {
    id: string;
    value: number;
    x: number;
    y: number;
    leftId: string | null;
    rightId: string | null;
}

interface CreateBinaryTreePageProps {
    onBack: () => void;
    onHome: () => void;
    onCatalog: () => void;
}

const MAX_HEIGHT = 6;
const VERTICAL_SPACING = 120;
const MIN_CANVAS_WIDTH = 800;
const SLOT_WIDTH = 120;

type TraversalType = 'preorder' | 'inorder' | 'postorder' | 'levelorder';

/**
 * Recursive Layout Logic
 */
function layoutTree(
    node: TreeNode | null,
    depth: number,
    minX: number,
    maxX: number,
    nodes: PositionedNode[] = []
): PositionedNode[] {
    if (!node) return nodes;

    const x = (minX + maxX) / 2;
    const y = depth * VERTICAL_SPACING;

    nodes.push({
        id: node.id,
        value: node.value,
        x,
        y,
        leftId: node.left?.id || null,
        rightId: node.right?.id || null
    });

    layoutTree(node.left, depth + 1, minX, x, nodes);
    layoutTree(node.right, depth + 1, x, maxX, nodes);

    return nodes;
}

export const CreateBinaryTreePage: React.FC<CreateBinaryTreePageProps> = ({ onBack, onHome, onCatalog }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [root, setRoot] = useState<TreeNode | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [inputValue, setInputValue] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // History State
    const [history, setHistory] = useState<TreeNode[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Traversal State
    const [traversalType, setTraversalType] = useState<TraversalType | null>(null);
    const [traversalSequence, setTraversalSequence] = useState<string[]>([]);
    const [traversalIndex, setTraversalIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(800);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Tree Height
    const treeHeight = useMemo(() => {
        const getH = (n: TreeNode | null): number => n ? 1 + Math.max(getH(n.left), getH(n.right)) : 0;
        return getH(root);
    }, [root]);

    const dynamicRange = useMemo(() => {
        if (treeHeight <= 1) return MIN_CANVAS_WIDTH;
        const calculated = Math.pow(2, treeHeight - 1) * SLOT_WIDTH * 1.5;
        return Math.max(calculated, MIN_CANVAS_WIDTH);
    }, [treeHeight]);

    const positionedNodes = useMemo(() => {
        if (!root) return [];
        return layoutTree(root, 1, -dynamicRange / 2, dynamicRange / 2);
    }, [root, dynamicRange]);

    // Traversal Logic
    const getSequence = (type: TraversalType): string[] => {
        if (!root) return [];
        const seq: string[] = [];

        const pre = (n: TreeNode) => {
            seq.push(n.id);
            if (n.left) pre(n.left);
            if (n.right) pre(n.right);
        };
        const ino = (n: TreeNode) => {
            if (n.left) ino(n.left);
            seq.push(n.id);
            if (n.right) ino(n.right);
        };
        const post = (n: TreeNode) => {
            if (n.left) post(n.left);
            if (n.right) post(n.right);
            seq.push(n.id);
        };
        const level = (n: TreeNode) => {
            const queue = [n];
            while (queue.length > 0) {
                const cur = queue.shift()!;
                seq.push(cur.id);
                if (cur.left) queue.push(cur.left);
                if (cur.right) queue.push(cur.right);
            }
        };

        if (type === 'preorder') pre(root);
        if (type === 'inorder') ino(root);
        if (type === 'postorder') post(root);
        if (type === 'levelorder') level(root);

        return seq;
    };

    const handleStartTraversal = (type: TraversalType) => {
        if (!root) return;
        setTraversalType(type);
        const seq = getSequence(type);
        setTraversalSequence(seq);
        setTraversalIndex(0);
        setIsPlaying(true);
        setSelectedId(null);
    };

    const handleStopTraversal = () => {
        setTraversalType(null);
        setTraversalSequence([]);
        setTraversalIndex(-1);
        setIsPlaying(false);
    };

    // Animation Loop
    useEffect(() => {
        let interval: any;
        if (isPlaying && traversalIndex < traversalSequence.length - 1) {
            interval = setInterval(() => {
                setTraversalIndex(prev => prev + 1);
            }, playbackSpeed);
        } else if (traversalIndex >= traversalSequence.length - 1) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, traversalIndex, traversalSequence, playbackSpeed]);

    // Auto-scroll to active node
    useEffect(() => {
        if (traversalIndex >= 0 && traversalSequence[traversalIndex] && scrollContainerRef.current) {
            const nodeId = traversalSequence[traversalIndex];
            const node = positionedNodes.find(n => n.id === nodeId);

            if (node) {
                const container = scrollContainerRef.current;
                const containerWidth = container.clientWidth;
                const totalWidth = dynamicRange + 1000;
                const centerOffset = totalWidth / 2;

                // Calculate absolute x position of the node in the content
                const nodeXInContent = centerOffset + (node.x * zoom);

                // Calculate target scrollLeft to center the node
                const targetScrollLeft = nodeXInContent - (containerWidth / 2);

                container.scrollTo({
                    left: targetScrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [traversalIndex, traversalSequence, positionedNodes, zoom, dynamicRange]);

    // Stats
    const stats = useMemo(() => {
        const getLeafCount = (n: TreeNode | null): number => {
            if (!n) return 0;
            if (!n.left && !n.right) return 1;
            return getLeafCount(n.left) + getLeafCount(n.right);
        };
        return {
            nodes: positionedNodes.length,
            height: treeHeight,
            leafNodes: getLeafCount(root)
        };
    }, [positionedNodes.length, treeHeight, root]);

    // Center root
    useEffect(() => {
        if (root && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const targetScrollX = (dynamicRange / 2 + 500) - container.clientWidth / 2;
            container.scrollTo({ left: targetScrollX, behavior: 'smooth' });
        }
    }, [root === null, treeHeight]);

    const pushHistory = (newState: TreeNode | null) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newState)));
        if (newHistory.length > 20) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            setHistoryIndex(prevIndex);
            setRoot(JSON.parse(JSON.stringify(history[prevIndex])));
        } else if (historyIndex === 0) {
            setHistoryIndex(-1);
            setRoot(null);
        }
        handleStopTraversal();
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            setHistoryIndex(nextIndex);
            setRoot(JSON.parse(JSON.stringify(history[nextIndex])));
        }
        handleStopTraversal();
    };

    const updateTreeManual = (currentRoot: TreeNode | null, targetId: string, side: 'left' | 'right', newValue: number): TreeNode | null => {
        if (!currentRoot) return null;
        const findAndInsert = (node: TreeNode, depth: number): TreeNode | null => {
            if (node.id === targetId) {
                if (depth >= MAX_HEIGHT) {
                    setError(`Max depth of ${MAX_HEIGHT} reached!`);
                    return null;
                }
                if (side === 'left') {
                    if (node.left) { setError("Left child already exists!"); return null; }
                    return { ...node, left: { id: Date.now().toString(), value: newValue, left: null, right: null } };
                } else {
                    if (node.right) { setError("Right child already exists!"); return null; }
                    return { ...node, right: { id: Date.now().toString(), value: newValue, left: null, right: null } };
                }
            }
            if (node.left) {
                const updatedLeft = findAndInsert(node.left, depth + 1);
                if (updatedLeft) return { ...node, left: updatedLeft };
            }
            if (node.right) {
                const updatedRight = findAndInsert(node.right, depth + 1);
                if (updatedRight) return { ...node, right: updatedRight };
            }
            return null;
        };
        const result = findAndInsert(currentRoot, 1);
        return result || currentRoot;
    };

    const handleGenerateRandom = () => {
        const generate = (depth: number): TreeNode | null => {
            if (depth > 4) return null;
            const prob = 0.8 - (depth * 0.15);
            const value = Math.floor(Math.random() * 90) + 10;
            return {
                id: Math.random().toString(36).substr(2, 9),
                value,
                left: Math.random() < prob ? generate(depth + 1) : null,
                right: Math.random() < prob ? generate(depth + 1) : null
            };
        };
        const newRoot = generate(1);
        if (newRoot) {
            setRoot(newRoot);
            pushHistory(newRoot);
            setSelectedId(newRoot.id);
            setError(null);
            handleStopTraversal();
        }
    };

    const handleAddRoot = () => {
        const val = parseInt(inputValue) || Math.floor(Math.random() * 90) + 10;
        const newRoot = { id: Date.now().toString(), value: val, left: null, right: null };
        setRoot(newRoot);
        pushHistory(newRoot);
        setSelectedId(newRoot.id);
        setInputValue('');
        setError(null);
        handleStopTraversal();
    };

    const handleAddChild = (side: 'left' | 'right') => {
        if (!selectedId) return;
        const val = parseInt(inputValue);
        if (isNaN(val)) {
            setError("Please enter a valid number");
            return;
        }
        setError(null);
        const newRoot = updateTreeManual(root, selectedId, side, val);
        if (newRoot && newRoot !== root) {
            setRoot(newRoot);
            pushHistory(newRoot);
            setInputValue('');
            handleStopTraversal();
        }
    };

    const handleReset = () => {
        setRoot(null);
        setHistory([]);
        setHistoryIndex(-1);
        setSelectedId(null);
        setError(null);
        setInputValue('');
        setZoom(1);
        handleStopTraversal();
    };

    const selectedNode = selectedId ? positionedNodes.find(n => n.id === selectedId) : null;
    const highlightedId = traversalIndex >= 0 ? traversalSequence[traversalIndex] : null;

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-amber-400/30 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />
            </div>

            <header className="h-20 border-b border-white/10 backdrop-blur-md bg-[#050505]/80 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block leading-none mb-1">Binary Trees</span>
                        <h1 className="font-black text-xl tracking-tight text-white uppercase leading-none text-center lg:text-left">Dynamic Expansion <span className="text-emerald-400 text-xs ml-2 italic underline underline-offset-4 decoration-emerald-400/30">Traversal mode</span></h1>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                    {['Preorder', 'Inorder', 'Postorder', 'Level Order'].map((label) => {
                        const type = label.toLowerCase().replace(' ', '') as TraversalType;
                        const isActive = traversalType === type;
                        return (
                            <button
                                key={type}
                                onClick={() => handleStartTraversal(type)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                <div className="relative flex items-center gap-3">
                    <button onClick={() => setShowMenu(!showMenu)} className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
                        <Menu className="w-5 h-5 text-white/60" />
                    </button>
                    <AnimatePresence>
                        {showMenu && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50">
                                <div className="p-2 space-y-1">
                                    <button onClick={onHome} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left font-medium">
                                        <Home className="w-4 h-4" /> <span>Home</span>
                                    </button>
                                    <button onClick={onCatalog} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left font-medium">
                                        <Grid className="w-4 h-4" /> <span>Catalog</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <main className="flex-1 flex flex-col p-6 gap-6 relative z-10 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-8 bg-[#1a1a1a]/95 rounded-[2.5rem] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-amber-400">Controls</h3>
                                    <div className="flex gap-1">
                                        <button disabled={historyIndex <= 0} onClick={handleUndo} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-amber-400 hover:text-black transition-all disabled:opacity-20"><Undo2 className="w-4 h-4" /></button>
                                        <button disabled={historyIndex >= history.length - 1} onClick={handleRedo} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-amber-400 hover:text-black transition-all disabled:opacity-20"><Redo2 className="w-4 h-4" /></button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Node Value</label>
                                        <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="0" className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-mono text-lg text-amber-400" />
                                        {error && (
                                            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                                                <AlertCircle className="w-3 h-3 text-rose-500" />
                                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{error}</span>
                                            </div>
                                        )}
                                    </div>

                                    {!root ? (
                                        <div className="flex flex-col gap-3">
                                            <button onClick={handleGenerateRandom} className="w-full bg-white/5 border border-white/10 hover:bg-amber-400 hover:text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/random shadow-lg">
                                                <Zap className="w-4 h-4 text-amber-400 group-hover:text-black" /> Generate Random
                                            </button>
                                            <button onClick={handleAddRoot} className="w-full bg-amber-400 text-black py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] shadow-xl shadow-amber-400/10 flex items-center justify-center gap-2">
                                                <Plus className="w-4 h-4" /> Create Root
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <button onClick={handleGenerateRandom} className="w-full bg-white/5 border border-amber-400/20 hover:bg-amber-400 hover:text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/random shadow-lg">
                                                <Zap className="w-4 h-4 text-amber-400 group-hover:text-black" /> Generate New Random
                                            </button>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button disabled={!selectedId || !!positionedNodes.find(n => n.id === selectedId)?.leftId} onClick={() => handleAddChild('left')} className="bg-white/5 border border-white/10 py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center gap-2 hover:bg-white/10 disabled:opacity-20">
                                                    <Plus className="w-4 h-4 text-emerald-400" /> Left Child
                                                </button>
                                                <button disabled={!selectedId || !!positionedNodes.find(n => n.id === selectedId)?.rightId} onClick={() => handleAddChild('right')} className="bg-white/5 border border-white/10 py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center gap-2 hover:bg-white/10 disabled:opacity-20">
                                                    <Plus className="w-4 h-4 text-emerald-400" /> Right Child
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={handleReset} className="w-full bg-black/40 border border-white/5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-white/20 hover:text-rose-500 transition-all">Reset</button>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-[#1a1a1a]/95 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/30 italic underline underline-offset-4 decoration-white/10">Hierarchy Stats</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-amber-400/20 transition-all">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40">Height</span>
                                    <span className="text-xl font-black text-amber-400 tabular-nums">{stats.height}</span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-amber-400/20 transition-all">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40">Total nodes</span>
                                    <span className="text-xl font-black text-amber-400 tabular-nums">{stats.nodes}</span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-amber-400/20 transition-all">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40">Leaf nodes</span>
                                    <span className="text-xl font-black text-amber-400 tabular-nums">{stats.leafNodes}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 bg-[#0d0d0d] rounded-[3.5rem] border border-white/10 relative shadow-2xl flex flex-col min-h-[700px] overflow-hidden">

                        <div className="px-10 py-5 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between z-20">
                            <div className="flex items-center gap-3">
                                <MoveHorizontal className="w-4 h-4 text-white/20" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Elastic Horizontal Container</span>

                                <AnimatePresence>
                                    {selectedNode && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center gap-4 ml-6 px-4 py-1.5 bg-amber-400/5 border border-amber-400/20 rounded-full backdrop-blur-xl shrink-0"
                                        >
                                            <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Node</span>
                                                <span className="text-sm font-black text-amber-400 tabular-nums">#{selectedNode.value}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-tight">
                                                <div className="flex flex-col leading-none">
                                                    <span className="text-white/20 mb-0.5">Left</span>
                                                    <span className={selectedNode.leftId ? 'text-white/40' : 'text-emerald-500'}>{selectedNode.leftId ? 'Occupied' : 'Ready'}</span>
                                                </div>
                                                <div className="flex flex-col leading-none">
                                                    <span className="text-white/20 mb-0.5">Right</span>
                                                    <span className={selectedNode.rightId ? 'text-white/40' : 'text-emerald-500'}>{selectedNode.rightId ? 'Occupied' : 'Ready'}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => setSelectedId(null)} className="ml-1 p-1 hover:text-rose-500 text-white/20 transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {traversalType && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-full backdrop-blur-xl shrink-0"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-tight text-emerald-400 mr-2 border-r border-white/10 pr-3">{traversalType}</span>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => { setTraversalIndex(prev => Math.max(prev - 1, 0)); setIsPlaying(false); }} className="p-1 hover:text-white text-white/40 transition-colors"><SkipBack className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => setIsPlaying(!isPlaying)} className={`p-1 transition-all ${isPlaying ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                                                </button>
                                                <button onClick={() => { setTraversalIndex(prev => Math.min(prev + 1, traversalSequence.length - 1)); setIsPlaying(false); }} className="p-1 hover:text-white text-white/40 transition-colors"><SkipForward className="w-3.5 h-3.5" /></button>

                                                <div className="flex items-center gap-3 mx-4 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 ring-1 ring-white/5 shadow-inner min-w-[140px]">
                                                    <div className="flex flex-col -space-y-0.5 min-w-[32px]">
                                                        <span className="text-[7px] font-black uppercase tracking-tighter text-white/20 leading-none">Speed</span>
                                                        <span className="text-[9px] font-black text-amber-400 tabular-nums leading-none">{playbackSpeed}ms</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="50"
                                                        max="1500"
                                                        step="50"
                                                        value={playbackSpeed}
                                                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                                                        className="w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                                                    />
                                                </div>

                                                <button onClick={() => { setTraversalIndex(0); setIsPlaying(true); }} className="p-1 hover:text-white text-white/40 transition-colors ml-1"><RotateCcw className="w-3.5 h-3.5" /></button>
                                                <button onClick={handleStopTraversal} className="p-1 hover:text-rose-500 text-white/40 ml-2 border-l border-white/10 pl-2 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))} className="p-2 bg-white/5 rounded-lg border border-white/10 transition-colors"><ZoomIn className="w-4 h-4 text-white/60" /></button>
                                <button onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.4))} className="p-2 bg-white/5 rounded-lg border border-white/10 transition-colors"><ZoomOut className="w-4 h-4 text-white/60" /></button>
                                <button onClick={() => setZoom(1)} className="p-2 bg-white/5 rounded-lg border border-white/10 transition-colors"><Maximize2 className="w-4 h-4 text-white/60" /></button>
                            </div>
                        </div>

                        <div
                            ref={scrollContainerRef}
                            className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar relative bg-[#050505]"
                            onClick={() => setSelectedId(null)}
                        >
                            <motion.div
                                layout
                                style={{
                                    width: dynamicRange + 1000,
                                    height: '100%',
                                    position: 'relative'
                                }}
                                className="transition-all duration-700 ease-in-out"
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: 0,
                                        width: 0,
                                        height: '100%',
                                        transform: `scale(${zoom})`,
                                        transformOrigin: 'center 50px'
                                    }}
                                >
                                    <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ left: 0, top: 0 }}>
                                        {positionedNodes.map(node => (
                                            <React.Fragment key={`link-${node.id}`}>
                                                {node.leftId && (
                                                    <motion.line
                                                        layout
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        x1={node.x} y1={node.y}
                                                        x2={positionedNodes.find(n => n.id === node.leftId)?.x}
                                                        y2={positionedNodes.find(n => n.id === node.leftId)?.y}
                                                        stroke="rgba(251, 191, 36, 0.2)"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />
                                                )}
                                                {node.rightId && (
                                                    <motion.line
                                                        layout
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        x1={node.x} y1={node.y}
                                                        x2={positionedNodes.find(n => n.id === node.rightId)?.x}
                                                        y2={positionedNodes.find(n => n.id === node.rightId)?.y}
                                                        stroke="rgba(251, 191, 36, 0.2)"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </svg>

                                    <AnimatePresence>
                                        {positionedNodes.map(node => {
                                            const isSelected = selectedId === node.id;
                                            const isHighlighted = highlightedId === node.id;
                                            const isVisited = traversalIndex >= 0 && traversalSequence.slice(0, traversalIndex).includes(node.id);

                                            return (
                                                <motion.div
                                                    key={node.id}
                                                    layout
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{
                                                        scale: 1,
                                                        opacity: 1,
                                                        left: node.x,
                                                        top: node.y,
                                                        borderColor: isHighlighted ? '#10b981' : isVisited ? '#10b981' : isSelected ? '#fbbf24' : 'rgba(251, 191, 36, 0.4)',
                                                        boxShadow: isHighlighted ? '0 0 40px rgba(16,185,129,0.8)' : isVisited ? '0 0 15px rgba(16,185,129,0.2)' : isSelected ? '0 0 40px rgba(251,191,36,0.3)' : '0 0 15px rgba(251,191,36,0.05)',
                                                        backgroundColor: isHighlighted ? 'rgba(16,185,129,0.1)' : isVisited ? 'rgba(16,185,129,0.02)' : '#111',
                                                        color: isHighlighted || isVisited ? '#10b981' : '#fbbf24'
                                                    }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedId(node.id);
                                                    }}
                                                    className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 cursor-pointer flex items-center justify-center font-black z-50 transition-all duration-300"
                                                >
                                                    {node.value}
                                                    {(isSelected || isHighlighted) && (
                                                        <motion.div
                                                            layoutId={isSelected ? 'node-selected' : 'node-highlighted'}
                                                            className={`absolute -inset-2 rounded-full border border-current pointer-events-none ${isHighlighted ? 'animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]' : 'animate-pulse'}`}
                                                        />
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </motion.div>

                            {!root && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="space-y-4 text-center">
                                        <div className="w-20 h-20 bg-amber-400/5 border border-amber-400/10 rounded-full flex items-center justify-center mx-auto">
                                            <GitFork className="w-8 h-8 text-amber-400/20" />
                                        </div>
                                        <h2 className="text-xl font-black uppercase tracking-widest text-white/30">Workspace Empty</h2>
                                        <p className="text-white/10 text-[10px] uppercase font-bold tracking-tight italic">Root node required for traversals</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-10 py-6 border-t border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">State History</span>
                                    <div className="flex gap-1">
                                        {history.map((_, i) => (
                                            <div key={i} className={`h-1 w-4 rounded-full transition-all ${i <= historyIndex ? 'bg-amber-400/60' : 'bg-white/5'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 block mb-1">Stability Guaranteed</span>
                                    <span className="text-[9px] font-bold text-white/20 uppercase italic">Dynamic Radius System v5.0</span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>


            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(251, 191, 36, 0.3); }
            `}</style>
        </div>
    );
};

export default CreateBinaryTreePage;
