import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';

export function RippleButton({ children, onClick, className, ...props }) {
    const [ripples, setRipples] = useState([]);
    const timeoutsRef = useRef([]);

    const handleClick = (e) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const newRipple = {
            x,
            y,
            size,
            id: Date.now(),
        };

        setRipples((prev) => [...prev, newRipple]);

        const timeoutId = setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);

        timeoutsRef.current.push(timeoutId);

        onClick?.(e);
    };

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(clearTimeout);
        };
    }, []);

    return (
        <Button
            {...props}
            className={`relative overflow-hidden ${className || ''}`}
            onClick={handleClick}
        >
            {children}
            {ripples.map((ripple) => (
                <motion.span
                    key={ripple.id}
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute rounded-full bg-white pointer-events-none"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}
        </Button>
    );
}
