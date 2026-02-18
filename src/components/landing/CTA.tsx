import { Play } from 'lucide-react';

export const CTA = ({ onStart }: { onStart: () => void }) => {
    return (
        <section className="py-32 px-6 text-center">
            <div className="max-w-5xl mx-auto bg-[#1a1a1a] rounded-[3rem] p-12 sm:p-24 border border-white/10 ring-1 ring-white/5 shadow-2xl shadow-black/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                        READY TO <span className="text-primary italic">MASTER</span> <br /> ALGORITHMS?
                    </h2>
                    <p className="max-w-xl mx-auto text-white/40 font-medium text-lg">
                        Join thousands of developers leveling up their technical interviews and CS fundamentals today.
                    </p>

                    <div className="pt-6">
                        <button
                            onClick={onStart}
                            className="px-12 py-6 bg-white text-black rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10 flex items-center gap-4 mx-auto"
                        >
                            GET STARTED NOW
                            <Play className="w-6 h-6 fill-current" />
                        </button>
                    </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                    <code className="text-xs">while (learning) {'{ \n  visualize(); \n}'}</code>
                </div>
            </div>
        </section>
    );
};
