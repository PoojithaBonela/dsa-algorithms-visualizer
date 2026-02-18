import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const SpaceBackground = () => {
    const [stars, setStars] = useState<{ id: number, x: number, y: number, size: number, duration: number }[]>([]);

    useEffect(() => {
        const newStars = Array.from({ length: 80 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 3 + 2,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050505] pointer-events-none">
            {/* Deep Space Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#050505_100%)] opacity-40" />

            {/* Stars/Snow Particles */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full opacity-0"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        filter: 'blur(0.5px)',
                    }}
                    animate={{
                        opacity: [0, 0.4, 0],
                        scale: [0.8, 1.2, 0.8],
                        y: [0, Math.random() * 40 - 20],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5,
                    }}
                />
            ))}

            {/* Nebula Clouds */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
    );
};
