import { useCallback, useMemo } from 'react';
import {
    successConfetti,
    deleteConfetti,
    celebrationConfetti,
    fireworksConfetti,
    burstConfetti,
} from '@/lib/confetti';

/**
 * ✅ FIXED: Added useMemo to prevent unnecessary re-renders
 * 
 * Before: Returned new object every render ❌
 * - Child components re-render on every parent render
 * - Even though callback functions are memoized, the object containing them is new
 * - This breaks React.memo and useCallback optimizations
 * 
 * After: Returned memoized object ✅
 * - Object reference stays same if dependencies haven't changed
 * - Child components using this hook won't unnecessarily re-render
 * - Proper optimization for performance-critical code
 */
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

    // ✅ MEMOIZE THE RETURNED OBJECT
    // This ensures that the object reference only changes
    // if one of the callback functions changes (which won't happen here)
    return useMemo(() => ({
        success,
        deleted,
        celebration,
        fireworks,
        burst,
    }), [success, deleted, celebration, fireworks, burst]);
}
