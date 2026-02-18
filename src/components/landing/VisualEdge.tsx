import { motion } from 'framer-motion';
import { Network, Brain, Sparkles, Activity } from 'lucide-react';

export const VisualEdge = () => {
    return (
        <section className="py-24 px-6 bg-[#050505] relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 text-center lg:text-left">
                    <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight">
                        WHY <span className="text-primary italic">VISUAL</span> <br /> LEARNING WORKS.
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 text-left p-6 bg-[#1a1a1a] rounded-[1.5rem] border border-white/10 ring-1 ring-white/5 transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary"><Brain className="w-6 h-6" /></div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Cognitive Recall</h4>
                                <p className="text-white/40 text-sm">Visual patterns stay in long-term memory significantly longer than pseudocode or lecture notes.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 text-left p-6 bg-[#1a1a1a] rounded-[1.5rem] border border-white/10 ring-1 ring-white/5 transition-all hover:scale-[1.02] hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10">
                            <div className="p-3 bg-accent/10 rounded-xl text-accent"><Activity className="w-6 h-6" /></div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Interactive Engagement</h4>
                                <p className="text-white/40 text-sm">Testing edge cases by manually modifying data structures solidifies conceptual understanding.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 text-left p-6 bg-[#1a1a1a] rounded-[1.5rem] border border-white/10 ring-1 ring-white/5 transition-all hover:scale-[1.02] hover:border-white/30 hover:shadow-2xl">
                            <div className="p-3 bg-white/5 rounded-xl text-white/40"><Sparkles className="w-6 h-6" /></div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Conceptual Clarity</h4>
                                <p className="text-white/40 text-sm">Complex recursive patterns become intuitive when you see the call stack visualize live.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative aspect-square sm:aspect-video lg:aspect-square flex items-center justify-center">
                    {/* Animated Mesh/Network Background */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-4/5 h-4/5 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center"
                    >
                        <div className="w-1/2 h-1/2 border-2 border-dashed border-primary/20 rounded-full flex items-center justify-center animate-pulse" />
                    </motion.div>

                    <div className="absolute glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4 max-w-[280px]">
                        <div className="flex items-center gap-2">
                            <Network className="text-primary w-5 h-5" />
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Active Insight</span>
                        </div>
                        <p className="text-white font-medium text-sm leading-relaxed">
                            "Visualization turns abstract logic into physical intuition."
                        </p>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                whileInView={{ width: "70%" }}
                                transition={{ duration: 1.5 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
