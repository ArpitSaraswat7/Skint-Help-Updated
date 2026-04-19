import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';

/**
 * OnlineBadge - Shows real-time online/offline status
 * Green dot = online, Gray dot = offline
 * Uses Supabase Realtime - 100% FREE!
 */
export function OnlineBadge({ userId, size = 'sm', showPulse = true, className = '' }) {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        if (!userId) return;

        // Fetch initial status
        const fetchStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('user_presence')
                    .select('is_online, last_seen')
                    .eq('user_id', userId)
                    .single();

                if (error) throw error;

                if (data) {
                    // Consider online if last_seen within 1 minute
                    const lastSeen = new Date(data.last_seen);
                    const now = new Date();
                    const diffSeconds = (now - lastSeen) / 1000;
                    setIsOnline(data.is_online && diffSeconds < 60);
                }
            } catch (error) {
                logger.error('Error fetching status:', error);
            }
        };

        fetchStatus();

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`presence-${userId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'user_presence',
                filter: `user_id=eq.${userId}`
            }, (payload) => {
                const lastSeen = new Date(payload.new.last_seen);
                const now = new Date();
                const diffSeconds = (now - lastSeen) / 1000;
                setIsOnline(payload.new.is_online && diffSeconds < 60);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const sizeClasses = {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`${sizeClasses[size]} rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'
                    } relative`}
            >
                {isOnline && showPulse && (
                    <motion.div
                        animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0.6, 0, 0.6]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        className="absolute inset-0 rounded-full bg-green-500"
                    />
                )}
            </motion.div>
        </div>
    );
}
