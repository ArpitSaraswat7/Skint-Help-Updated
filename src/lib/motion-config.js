// Optimized Framer Motion configuration for better scroll performance
export const scrollAnimationConfig = {
    // Viewport settings for scroll-triggered animations
    viewport: {
        once: true, // Only animate once when entering viewport
        amount: 0.2, // Trigger when 20% of element is visible (reduced from default 0.5)
        margin: "0px 0px -10% 0px" // Start animation slightly before element enters viewport
    },

    // Transition settings for smoother animations
    transition: {
        type: "tween", // Use tween instead of spring for more predictable performance
        duration: 0.4, // Reduced from typical 0.6-0.8s
        ease: "easeOut"
    }
};

// Fade in from bottom animation
export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: scrollAnimationConfig.viewport,
    transition: scrollAnimationConfig.transition
};

// Fade in from left animation
export const fadeInLeft = {
    initial: { opacity: 0, x: -20 },
    whileInView: { opacity: 1, x: 0 },
    viewport: scrollAnimationConfig.viewport,
    transition: scrollAnimationConfig.transition
};

// Fade in from right animation
export const fadeInRight = {
    initial: { opacity: 0, x: 20 },
    whileInView: { opacity: 1, x: 0 },
    viewport: scrollAnimationConfig.viewport,
    transition: scrollAnimationConfig.transition
};

// Scale in animation
export const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: scrollAnimationConfig.viewport,
    transition: scrollAnimationConfig.transition
};

// Stagger children animation config
export const staggerContainer = {
    initial: {},
    whileInView: {},
    viewport: scrollAnimationConfig.viewport,
    transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
    }
};
