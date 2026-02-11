import confetti from 'canvas-confetti';

/**
 * Success confetti - Green theme
 */
export const successConfetti = () => {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
    };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#10b981', '#34d399', '#6ee7b7'],
    });

    fire(0.2, {
        spread: 60,
        colors: ['#10b981', '#34d399', '#6ee7b7'],
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#10b981', '#34d399', '#6ee7b7'],
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        colors: ['#10b981', '#34d399', '#6ee7b7'],
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
        colors: ['#10b981', '#34d399', '#6ee7b7'],
    });
};

/**
 * Delete confetti - Red theme (subtle)
 */
export const deleteConfetti = () => {
    confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f87171', '#fca5a5'],
        zIndex: 9999,
        scalar: 0.8,
    });
};

/**
 * Celebration confetti - Multi-color
 */
export const celebrationConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
};

/**
 * Fireworks confetti
 */
export const fireworksConfetti = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        confetti({
            particleCount: 100,
            startVelocity: 30,
            spread: 360,
            origin: {
                x: Math.random(),
                y: Math.random() - 0.2
            },
            zIndex: 9999,
        });
    }, 400);
};

/**
 * Simple burst
 */
export const burstConfetti = (options = {}) => {
    const {
        particleCount = 100,
        spread = 70,
        origin = { y: 0.6 },
        colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
    } = options;

    confetti({
        particleCount,
        spread,
        origin,
        colors,
        zIndex: 9999,
    });
};
