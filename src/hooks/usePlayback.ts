import { useState, useRef, useEffect, useCallback } from 'react';
import type { TraceStep } from '../lib/algorithms/types';

interface PlaybackState {
    currentIndex: number;
    isPlaying: boolean;
    speed: number;
}

export const usePlayback = (traces: TraceStep[]) => {
    const [state, setState] = useState<PlaybackState>({
        currentIndex: 0,
        isPlaying: false,
        speed: 500, // ms per step
    });

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const stepForward = useCallback(() => {
        setState((prev) => {
            if (prev.currentIndex < traces.length - 1) {
                return { ...prev, currentIndex: prev.currentIndex + 1 };
            }
            return { ...prev, isPlaying: false };
        });
    }, [traces.length]);

    const stepBackward = useCallback(() => {
        setState((prev) => ({
            ...prev,
            currentIndex: Math.max(0, prev.currentIndex - 1),
            isPlaying: false,
        }));
    }, []);

    const togglePlay = useCallback(() => {
        setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    }, []);

    const seek = useCallback((index: number) => {
        setState((prev) => ({
            ...prev,
            currentIndex: Math.max(0, Math.min(index, traces.length - 1)),
            isPlaying: false,
        }));
    }, [traces.length]);

    useEffect(() => {
        if (state.isPlaying && state.currentIndex < traces.length - 1) {
            timerRef.current = setTimeout(stepForward, state.speed);
        } else {
            if (timerRef.current) clearTimeout(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [state.isPlaying, state.currentIndex, state.speed, stepForward, traces.length]);

    return {
        ...state,
        currentStep: traces[state.currentIndex],
        togglePlay,
        stepForward,
        stepBackward,
        seek,
        setSpeed: (speed: number) => setState((prev) => ({ ...prev, speed })),
    };
};
