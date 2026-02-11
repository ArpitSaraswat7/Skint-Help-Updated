import { motion } from 'framer-motion';

/**
 * StatusBadge - Shows user status (Available, Busy, Offline)
 * Color-coded and animated
 */
export function StatusBadge({ status = 'offline', size = 'md', showLabel = true, className = '' }) {
    const statusConfig = {
        available: {
            color: 'bg-green-500',
            textColor: 'text-green-400',
            label: 'Available',
            borderColor: 'border-green-500/20'
        },
        busy: {
            color: 'bg-orange-500',
            textColor: 'text-orange-400',
            label: 'Busy',
            borderColor: 'border-orange-500/20'
        },
        offline: {
            color: 'bg-gray-500',
            textColor: 'text-gray-400',
            label: 'Offline',
            borderColor: 'border-gray-500/20'
        }
    };

    const config = statusConfig[status] || statusConfig.offline;

    const sizeClasses = {
        sm: 'w-2 h-2 text-xs',
        md: 'w-2.5 h-2.5 text-sm',
        lg: 'w-3 h-3 text-base'
    };

    if (!showLabel) {
        return (
            <div className={`relative inline-flex items-center justify-center ${className}`}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} rounded-full ${config.color}`}
                />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.borderColor} bg-white/5 ${className}`}
        >
            <div className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} rounded-full ${config.color} relative`}>
                {status === 'available' && (
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                        className={`absolute inset-0 rounded-full ${config.color}`}
                    />
                )}
            </div>
            <span className={`${sizeClasses[size].split(' ')[2]} font-medium ${config.textColor}`}>
                {config.label}
            </span>
        </motion.div>
    );
}
