import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

export const Hero = ({ onStart }: { onStart: () => void }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 }
        }
    };

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-40 pb-20 overflow-hidden">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl text-center space-y-8 relative z-10"
            >

                <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.9] text-white">
                    VISUALIZE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">LOGIC</span> <br />
                    IN REAL-TIME.
                </motion.h1>

                <motion.p variants={itemVariants} className="max-w-lg mx-auto text-white/50 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                    Experience the elegance of algorithms through high-performance, frame-perfect animations. Built for engineers, by engineers.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={onStart}
                        className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-3 overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/20"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                        <Play className="w-5 h-5 fill-current" />
                        LAUNCH VISUALIZER
                    </button>

                    <button
                        onClick={onStart}
                        className="px-8 py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold flex items-center gap-3 border border-white/5 hover:bg-white/10 transition-all"
                    >
                        ALGO CATALOG
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>
            </motion.div>

            {/* Hero Visual - Adaptive for Mobile */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-16 w-full max-w-5xl aspect-[16/10] sm:aspect-video rounded-[3rem] bg-[#1a1a1a] border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-black/50 overflow-hidden relative"
            >
                <div className="absolute top-4 left-4 flex gap-1.5 z-20">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>

                <div className="absolute top-4 right-6 text-[10px] font-black uppercase tracking-widest text-white/20 z-20">
                    Visualizer Engine v1.0
                </div>

                <div className="h-full flex items-end justify-center gap-[2px] sm:gap-1 px-4 sm:px-8 pb-8 pt-16">
                    {[...Array(40)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-primary/20 via-primary/60 to-primary rounded-t-sm sm:rounded-t-lg border-t border-white/10"
                            initial={{ height: "10%" }}
                            animate={{ height: [`${20 + Math.random() * 60}%`, `${10 + Math.random() * 80}%`, `${20 + Math.random() * 60}%`] }}
                            transition={{ repeat: Infinity, duration: 3 + Math.random() * 2, delay: i * 0.05, ease: "easeInOut" }}
                        />
                    ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 pointer-events-none" />
            </motion.div>
        </section>
    );
};
