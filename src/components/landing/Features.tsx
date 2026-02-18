import { motion } from 'framer-motion';
import { Binary, FastForward, Play, Cpu, MousePointer2, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';

const features = [
    {
        icon: FastForward,
        title: "Trace Generation",
        description: "Every logic step is recorded as a high-fidelity event, enabling precise visualization.",
        color: "from-blue-500/20 to-blue-600/20",
        border: "border-blue-500/20",
        text: "text-blue-400"
    },
    {
        icon: Play,
        title: "Playback Engine",
        description: "Pause, reverse, or step through algorithms with a custom virtual timeline.",
        color: "from-purple-500/20 to-purple-600/20",
        border: "border-purple-500/20",
        text: "text-purple-400"
    },
    {
        icon: Cpu,
        title: "60FPS Rendering",
        description: "Hardware-accelerated animations ensure buttery smooth 60FPS across all devices.",
        color: "from-emerald-500/20 to-emerald-600/20",
        border: "border-emerald-500/20",
        text: "text-emerald-400"
    },
    {
        icon: Binary,
        title: "State Snapshots",
        description: "Inspect the exact state of your data structures at any micro-moment in time.",
        color: "from-amber-500/20 to-amber-600/20",
        border: "border-amber-500/20",
        text: "text-amber-400"
    },
    {
        icon: MousePointer2,
        title: "Adaptive Viewports",
        description: "Dynamically scaling canvas that feels premium on mobile, tablet, and desktop.",
        color: "from-rose-500/20 to-rose-600/20",
        border: "border-rose-500/20",
        text: "text-rose-400"
    },
    {
        icon: Zap,
        title: "Real-time Insight",
        description: "Deep-dive into complexity metrics and logic flow as the algorithm executes.",
        color: "from-cyan-500/20 to-cyan-600/20",
        border: "border-cyan-500/20",
        text: "text-cyan-400"
    }
];

export const Features = () => {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-20">
                <h2 className="text-3xl sm:text-5xl font-black text-white">CORE ENGINE <span className="text-primary">FEATURES</span></h2>
                <p className="text-white/40 max-w-2xl mx-auto text-sm sm:text-base font-medium">
                    Powered by a custom asynchronous playback engine designed for maximum clarity and performance.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className={cn(
                            "group p-8 rounded-[2.5rem] border border-white/10 ring-1 ring-white/5 bg-[#1a1a1a] shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-primary/50 hover:shadow-primary/10",
                            feature.border
                        )}
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
                            feature.color
                        )}>
                            <feature.icon className={cn("w-6 h-6", feature.text)} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                        <p className="text-white/40 leading-relaxed text-sm font-medium">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
