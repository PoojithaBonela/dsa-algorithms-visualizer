import { motion } from 'framer-motion';
import { Binary, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="py-20 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Binary className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">DSAV<span className="text-primary">.pro</span></span>
                    </div>
                    <p className="text-white/20 text-xs font-bold tracking-widest uppercase">
                        © 2026 ANTIGRAVITY SYSTEMS. ALL RIGHTS RESERVED.
                    </p>
                </div>

                <div className="flex gap-8">
                    <a href="#" className="text-white/40 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                    <a href="#" className="text-white/40 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                    <a href="#" className="text-white/40 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                </div>

                <div className="flex gap-12 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
};
