import { useCallback } from 'react';
import {
    successConfetti,
    deleteConfetti,
    celebrationConfetti,
    fireworksConfetti,
    burstConfetti,
} from '@/lib/confetti';

export function useConfetti() {
    const success = useCallback(() => {
        successConfetti();
    }, []);

    const deleted = useCallback(() => {
        deleteConfetti();
    }, []);

    const celebration = useCallback(() => {
        celebrationConfetti();
    }, []);

    const fireworks = useCallback(() => {
        fireworksConfetti();
    }, []);

    const burst = useCallback((options) => {
        burstConfetti(options);
    }, []);

    return {
        success,
        deleted,
        celebration,
        fireworks,
        burst,
    };
}
