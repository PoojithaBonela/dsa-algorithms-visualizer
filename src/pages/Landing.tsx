import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { VisualEdge } from '../components/landing/VisualEdge';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';
import { SpaceBackground } from '../components/landing/SpaceBackground';
import { Binary } from 'lucide-react';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
    return (
        <div className="min-h-screen bg-transparent text-foreground scroll-smooth relative">
            <SpaceBackground />
            {/* Dynamic Navbar */}
            <nav className="fixed top-0 inset-x-0 h-20 z-[100] px-6 flex items-center justify-between glass border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Binary className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">DSAV<span className="text-primary">.pro</span></span>
                </div>

                <div className="hidden md:flex items-center gap-10 text-[10px] uppercase font-black tracking-widest text-white/40">
                    <a href="#features" className="hover:text-primary transition-colors">Features</a>
                    <a href="#visual" className="hover:text-primary transition-colors">Why Visual?</a>
                    <button onClick={onStart} className="hover:text-primary transition-colors uppercase">Visualizer</button>
                </div>

                <button
                    onClick={onStart}
                    className="px-6 py-2.5 bg-white text-black rounded-xl text-xs font-black tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                >
                    GET STARTED
                </button>
            </nav>

            <Hero onStart={onStart} />

            <div id="features">
                <Features />
            </div>

            <div id="visual">
                <VisualEdge />
            </div>

            <CTA onStart={onStart} />

            <Footer />
        </div>
    );
};
