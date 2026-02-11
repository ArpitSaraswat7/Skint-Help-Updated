import { throttle } from './utils-performance';

// Scroll event listener to pause animations during scroll
let scrollTimeout;
let isScrolling = false;

const handleScroll = () => {
    if (!isScrolling) {
        document.documentElement.classList.add('scrolling');
        isScrolling = true;
    }

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
        document.documentElement.classList.remove('scrolling');
        isScrolling = false;
    }, 150); // Resume animations 150ms after scroll stops
};

// Throttle scroll handler to max 60fps (16ms)
const throttledScroll = throttle(handleScroll, 16);

// Use passive listener for better performance
if (typeof window !== 'undefined') {
    window.addEventListener('scroll', throttledScroll, { passive: true });
}

export { handleScroll, throttledScroll };
