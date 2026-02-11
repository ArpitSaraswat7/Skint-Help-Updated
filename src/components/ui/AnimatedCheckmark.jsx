import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function AnimatedCheckmark({ size = 64, color = '#10b981', className = '' }) {
    return (
        <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            {/* Circle background */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full"
                style={{
                    background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                    width: size,
                    height: size,
                }}
            />

            {/* Checkmark */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    duration: 0.5,
                    delay: 0.2,
                    ease: [0.34, 1.56, 0.64, 1], // Bounce effect
                }}
                style={{ color }}
            >
                <Check size={size * 0.6} strokeWidth={3} />
            </motion.div>

            {/* Pulse ring */}
            <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute inset-0 rounded-full border-4"
                style={{
                    borderColor: color,
                    width: size,
                    height: size,
                }}
            />
        </div>
    );
}
