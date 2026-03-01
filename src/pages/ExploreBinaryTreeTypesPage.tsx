import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft as ChevronLeftIcon,
    Menu,
    Home,
    Grid,
    Info,
    CheckCircle2,
    ArrowRight,
    Zap,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    RotateCcw,
    X,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Sparkles
} from 'lucide-react';

interface ExploreBinaryTreeTypesPageProps {
    onBack: () => void;
    onHome: () => void;
    onCatalog: () => void;
}

const treeTypes = [
    {
        title: "Full Binary Tree",
        description: "A binary tree in which every node has either 0 or 2 children.",
        rule: "Nodes have strictly 0 or 2 children.",
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/20"
    },
    {
        title: "Complete Binary Tree",
        description: "All levels are completely filled except possibly the last level, which is filled from left to right.",
        rule: "Left-aligned nodes in the last level.",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20"
    },
    {
        title: "Perfect Binary Tree",
        description: "All internal nodes have two children and all leaves are at the same level.",
        rule: "Completely symmetric and filled.",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/20"
    },
    {
        title: "Balanced Binary Tree",
        description: "The height of the left and right subtrees of every node differs by at most 1.",
        rule: "Minimal height for the number of nodes.",
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/20"
    },
    {
        title: "Left Skewed Tree",
        description: "A binary tree where every node has only a left child, forming a single path down to the left.",
        rule: "Maximum height; effectively a linked list.",
        color: "text-rose-400",
        bg: "bg-rose-400/10",
        border: "border-rose-400/20"
    },
    {
        title: "Right Skewed Tree",
        description: "A binary tree where every node has only a right child, forming a single path down to the right.",
        rule: "Maximum height; effectively a linked list.",
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20"
    }
];

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

const VERTICAL_SPACING = 100;
const MIN_CANVAS_WIDTH = 800;
const SLOT_WIDTH = 100;

type TraversalType = 'preorder' | 'inorder' | 'postorder' | 'levelorder';

function layoutTree(
    node: TreeNode | null,
    depth: number,
    minX: number,
    maxX: number,
    nodes: PositionedNode[] = []
): PositionedNode[] {
    if (!node) return nodes;

    const x = (minX + maxX) / 2;
    const y = depth * VERTICAL_SPACING + 50;

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

export const ExploreBinaryTreeTypesPage: React.FC<ExploreBinaryTreeTypesPageProps> = ({ onBack, onHome, onCatalog }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [selectedType, setSelectedType] = useState(treeTypes[0]);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [root, setRoot] = useState<TreeNode | null>(null);
    const [traversalType, setTraversalType] = useState<TraversalType | null>(null);
    const [traversalSequence, setTraversalSequence] = useState<string[]>([]);
    const [traversalIndex, setTraversalIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(800);
    const [zoom, setZoom] = useState(0.8);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

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
        return layoutTree(root, 1, 0, dynamicRange, []);
    }, [root, dynamicRange]);

    const handleStopTraversal = () => {
        setTraversalType(null);
        setTraversalSequence([]);
        setTraversalIndex(-1);
        setIsPlaying(false);
    };

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

    const getSequence = (type: TraversalType): string[] => {
        const seq: string[] = [];
        const pre = (n: TreeNode | null) => { if (!n) return; seq.push(n.id); pre(n.left); pre(n.right); };
        const ino = (n: TreeNode | null) => { if (!n) return; ino(n.left); seq.push(n.id); ino(n.right); };
        const post = (n: TreeNode | null) => { if (!n) return; post(n.left); post(n.right); seq.push(n.id); };
        const level = (n: TreeNode | null) => {
            if (!n) return;
            const q: TreeNode[] = [n];
            while (q.length) {
                const c = q.shift()!;
                seq.push(c.id);
                if (c.left) q.push(c.left);
                if (c.right) q.push(c.right);
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
        setTraversalSequence(getSequence(type));
        setTraversalIndex(0);
        setIsPlaying(true);
    };

    useEffect(() => {
        let interval: any;
        if (isPlaying && traversalIndex < traversalSequence.length - 1) {
            interval = setInterval(() => setTraversalIndex((p: number) => p + 1), playbackSpeed);
        } else if (traversalIndex >= traversalSequence.length - 1) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, traversalIndex, traversalSequence, playbackSpeed]);

    useEffect(() => {
        if (traversalIndex >= 0 && traversalSequence[traversalIndex] && scrollContainerRef.current) {
            const node = positionedNodes.find(n => n.id === traversalSequence[traversalIndex]);
            if (node) {
                const container = scrollContainerRef.current;

                // Calculate position relative to the motion.div wrapper
                // The inner div is centered in motion.div (width: dynamicRange + 1000)
                // Origin of scale is 'center 50px'
                const scaleOriginX = (dynamicRange / 2 + 500);
                const scaleOriginY = 550; // padding 500 + 50px top offset

                const xOffsetFromOrigin = (node.x - dynamicRange / 2) * zoom;
                const yOffsetFromOrigin = (node.y - 50) * zoom;

                const targetX = scaleOriginX + xOffsetFromOrigin;
                const targetY = scaleOriginY + yOffsetFromOrigin;

                container.scrollTo({
                    left: targetX - (container.clientWidth / 2),
                    top: targetY - (container.clientHeight / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [traversalIndex, zoom, dynamicRange, positionedNodes]);

    useEffect(() => {
        if (isVisualizing && root && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            setTimeout(() => {
                const rootX = (dynamicRange / 2 + 500);
                const rootY = 550; // padding 500 + y 50
                container.scrollTo({
                    left: rootX - container.clientWidth / 2,
                    top: rootY - 100, // Position root near the top
                    behavior: 'auto'
                });
            }, 100);
        }
    }, [isVisualizing, root, dynamicRange]);

    const generateTree = () => {
        const type = selectedType.title;
        let newRoot: TreeNode | null = null;
        const h = 4;

        const createNode = (v: number): TreeNode => ({
            id: Math.random().toString(36).substr(2, 9),
            value: v,
            left: null,
            right: null
        });

        if (type === "Full Binary Tree") {
            const gen = (d: number): TreeNode | null => {
                const node = createNode(Math.floor(Math.random() * 90) + 10);
                // Ensure min complexity by forcing children at top layers
                if (d < h && (d < 2 || Math.random() > 0.3)) {
                    node.left = gen(d + 1);
                    node.right = gen(d + 1);
                }
                return node;
            };
            newRoot = gen(1);
        } else if (type === "Complete Binary Tree") {
            const nodes: any[] = Array.from({ length: 10 }, (_, i) => createNode(i + 1));
            nodes.forEach((n, i) => {
                const l = 2 * i + 1;
                const r = 2 * i + 2;
                if (l < nodes.length) n.left = nodes[l];
                if (r < nodes.length) n.right = nodes[r];
            });
            newRoot = nodes[0] as TreeNode;
        } else if (type === "Perfect Binary Tree") {
            const gen = (d: number): TreeNode | null => {
                if (d > 3) return null;
                const node = createNode(Math.floor(Math.random() * 90) + 10);
                node.left = gen(d + 1);
                node.right = gen(d + 1);
                return node;
            };
            newRoot = gen(1);
        } else if (type === "Balanced Binary Tree") {
            const gen = (d: number): TreeNode | null => {
                if (d > h) return null;
                const node = createNode(Math.floor(Math.random() * 90) + 10);
                // Ensure min complexity by forcing children at top layers
                if (d < h && (d < 2 || Math.random() > 0.2)) {
                    node.left = gen(d + 1);
                    node.right = gen(d + 1);
                }
                return node;
            };
            newRoot = gen(1);
        } else if (type === "Left Skewed Tree") {
            const head = createNode(10);
            let current: any = head;
            for (let i = 0; i < 4; i++) {
                current.left = createNode(20 + i * 10);
                current = current.left;
            }
            newRoot = head as TreeNode;
        } else if (type === "Right Skewed Tree") {
            const head = createNode(10);
            let current: any = head;
            for (let i = 0; i < 4; i++) {
                current.right = createNode(20 + i * 10);
                current = current.right;
            }
            newRoot = head as TreeNode;
        }

        setRoot(newRoot);
        setIsVisualizing(true);
        handleStopTraversal();
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
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block leading-none mb-1">Binary Trees</span>
                        <h1 className="font-black text-xl tracking-tight text-white uppercase leading-none">Tree Taxonomy <span className="text-primary text-xs ml-2">Educational Guide</span></h1>
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

            <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* List Section */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Classifications</h2>
                            <p className="text-white/40 text-sm italic">Select a structure to explore its properties</p>
                        </div>

                        {treeTypes.map((type, i) => (
                            <motion.div
                                key={i}
                                onClick={() => setSelectedType(type)}
                                whileHover={{ x: 10 }}
                                className={`p-6 rounded-2xl border transition-all cursor-pointer ${selectedType.title === type.title
                                    ? 'bg-white/5 border-primary/50 ring-1 ring-primary/20'
                                    : 'bg-transparent border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`font-black uppercase tracking-tight ${selectedType.title === type.title ? 'text-primary' : 'text-white/60'}`}>
                                        {type.title}
                                    </h3>
                                    <ArrowRight className={`w-4 h-4 transition-transform ${selectedType.title === type.title ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                                </div>
                                <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest">{type.rule}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Detail Section */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedType.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-[#1a1a1a] rounded-[3rem] border border-white/10 p-12 space-y-8 relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-64 h-64 ${selectedType.bg} blur-[120px] rounded-full -mr-32 -mt-32 opacity-50`} />

                                <div className="relative z-10 space-y-6">
                                    <div className={`w-12 h-12 rounded-xl ${selectedType.bg} border ${selectedType.border} flex items-center justify-center`}>
                                        <Info className={`w-6 h-6 ${selectedType.color}`} />
                                    </div>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter">{selectedType.title}</h2>
                                    <p className="text-lg text-white/60 leading-relaxed font-medium">
                                        {selectedType.description}
                                    </p>
                                </div>

                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Visual Representation</h4>
                                        <button
                                            onClick={generateTree}
                                            className="w-full aspect-video bg-black/40 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center gap-4 group hover:border-primary/30 transition-all hover:bg-primary/5"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Zap className="w-8 h-8 text-primary" />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-primary transition-colors">Visualize {selectedType.title}</span>
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Properties & Constraints</h4>
                                        <ul className="space-y-3">
                                            {[
                                                selectedType.rule,
                                                "Property: Optimal for specific search patterns",
                                                "Constraint: Structural integrity maintained automatically"
                                            ].map((text, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                                                    <span className="text-sm text-white/70 italic font-medium">{text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Visualizer Overlay */}
            <AnimatePresence>
                {isVisualizing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#050505] flex flex-col overflow-y-auto custom-scrollbar"
                    >
                        {/* Overlay Header */}
                        <header className="h-20 border-b border-white/10 backdrop-blur-md bg-[#050505]/80 flex items-center justify-between px-6 shrink-0 sticky top-0 z-[110]">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsVisualizing(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                <div className="h-4 w-[1px] bg-white/10" />
                                <div className="hidden sm:block">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block leading-none mb-1">Visualization</span>
                                    <h1 className="font-black text-xl tracking-tight text-white uppercase leading-none">{selectedType.title}</h1>
                                </div>
                            </div>

                            {/* Traversal Buttons in Header */}
                            <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 mx-4">
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

                            <div className="flex items-center gap-3 font-semibold">
                                <button onClick={generateTree} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4" /> Regenerate
                                </button>
                                <button onClick={() => setIsVisualizing(false)} className="p-2.5 hover:bg-rose-500/10 hover:text-rose-500 text-white/40 rounded-xl transition-all border border-transparent hover:border-rose-500/20">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </header>

                        {/* Sub-header for Controls */}
                        <div className="h-14 border-b border-white/5 bg-[#0a0a0a]/50 flex items-center justify-center px-6 shrink-0 sticky top-20 z-[105] backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <AnimatePresence mode="wait">
                                    {traversalType ? (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-full backdrop-blur-xl shrink-0"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-tight text-emerald-400 mr-2 border-r border-white/10 pr-3">{traversalType}</span>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => { setTraversalIndex((p: number) => Math.max(p - 1, 0)); setIsPlaying(false); }} className="p-1 hover:text-white text-white/40 transition-colors"><SkipBack className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => setIsPlaying(!isPlaying)} className={`p-1 transition-all ${isPlaying ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                                                </button>
                                                <button onClick={() => { setTraversalIndex((p: number) => Math.min(p + 1, traversalSequence.length - 1)); setIsPlaying(false); }} className="p-1 hover:text-white text-white/40 transition-colors"><SkipForward className="w-3.5 h-3.5" /></button>

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
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2"
                                        >
                                            <Info className="w-4 h-4" /> Select a traversal to begin exploring {selectedType.title}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex items-center gap-2 absolute right-6">
                                <button onClick={() => setZoom(p => Math.min(p + 0.1, 1.5))} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"><ZoomIn className="w-4 h-4 text-white/60" /></button>
                                <button onClick={() => setZoom(p => Math.max(p - 0.1, 0.4))} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"><ZoomOut className="w-4 h-4 text-white/60" /></button>
                                <button onClick={() => setZoom(0.8)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"><Maximize2 className="w-4 h-4 text-white/60" /></button>
                            </div>
                        </div>

                        {/* Interactive Workspace */}
                        <div className="flex-1 flex bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:40px_40px] min-h-[calc(100vh-136px)]">
                            {/* Left Sidebar: Stats */}
                            <aside className="w-80 border-r border-white/10 bg-[#0a0a0a]/50 p-6 flex flex-col gap-6 relative z-50 shrink-0">
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

                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-emerald-400" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Classified as</h4>
                                    </div>
                                    <p className="text-sm text-white/60 font-medium leading-relaxed italic">
                                        "{selectedType.description}"
                                    </p>
                                </div>
                            </aside>

                            {/* Center Canvas */}
                            <div className="flex-1 relative overflow-hidden">
                                {/* Tree Canvas */}
                                <div ref={scrollContainerRef} className="absolute inset-0 overflow-auto cursor-grab active:cursor-grabbing custom-scrollbar" onClick={() => handleStopTraversal()}>
                                    <motion.div
                                        layout
                                        style={{
                                            width: dynamicRange + 1000,
                                            height: (treeHeight * VERTICAL_SPACING) + 1000,
                                            position: 'relative'
                                        }}
                                        className="transition-all duration-700 ease-in-out min-h-full flex items-center justify-center"
                                    >
                                        <div className="relative" style={{
                                            width: dynamicRange,
                                            height: treeHeight * VERTICAL_SPACING,
                                            transform: `scale(${zoom})`,
                                            transformOrigin: 'center 50px'
                                        }}>
                                            {/* Links */}
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                                {positionedNodes.map((node: PositionedNode) => (
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

                                            {/* Nodes */}
                                            <AnimatePresence>
                                                {positionedNodes.map((node: PositionedNode) => {
                                                    const isHighlighted = traversalType && traversalIndex >= 0 && traversalSequence[traversalIndex] === node.id;
                                                    const visitedIndex = traversalSequence.indexOf(node.id);
                                                    const isVisited = traversalIndex >= 0 && visitedIndex !== -1 && visitedIndex < traversalIndex;

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
                                                                borderColor: isHighlighted ? '#10b981' : isVisited ? '#10b981' : 'rgba(251, 191, 36, 0.4)',
                                                                boxShadow: isHighlighted ? '0 0 40px rgba(16,185,129,0.8)' : isVisited ? '0 0 15px rgba(16,185,129,0.2)' : '0 0 15px rgba(251,191,36,0.05)',
                                                                backgroundColor: isHighlighted ? 'rgba(16,185,129,0.1)' : isVisited ? 'rgba(16,185,129,0.02)' : '#111',
                                                                color: isHighlighted || isVisited ? '#10b981' : '#fbbf24'
                                                            }}
                                                            className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 flex items-center justify-center z-50 transition-all duration-300"
                                                        >
                                                            <span className="text-sm font-black tabular-nums">{node.value}</span>
                                                            {isHighlighted && (
                                                                <motion.div
                                                                    layoutId="node-highlighted"
                                                                    className="absolute -inset-2 rounded-full border border-current pointer-events-none animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
                                                                />
                                                            )}
                                                        </motion.div>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        <style>{`
                            .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.1); border-radius: 10px; }
                            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(251, 191, 36, 0.3); }
                        `}</style>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExploreBinaryTreeTypesPage;
