import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to track user presence (online/offline status)
 * Uses Page Visibility API and heartbeat to update Supabase
 * Uses user_presence table - 100% FREE!
 */
export function usePresence() {
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        // Guard: demo users have non-UUID IDs (e.g. 'demo-admin-001') which
        // would cause Supabase upsert to throw a database error on every heartbeat.
        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!UUID_REGEX.test(user.id)) return;

        // Mark user as online (upsert to handle first-time users)
        const markOnline = async () => {
            try {
                await supabase
                    .from('user_presence')
                    .upsert({
                        user_id: user.id,
                        is_online: true,
                        last_seen: new Date().toISOString(),
                        status: 'available'
                    }, {
                        onConflict: 'user_id'
                    });
            } catch (error) {
                console.error('Error marking online:', error);
            }
        };

        // Mark user as offline
        const markOffline = async () => {
            try {
                await supabase
                    .from('user_presence')
                    .upsert({
                        user_id: user.id,
                        is_online: false,
                        last_seen: new Date().toISOString(),
                        status: 'offline'
                    }, {
                        onConflict: 'user_id'
                    });
            } catch (error) {
                console.error('Error marking offline:', error);
            }
        };

        // Initial online status
        markOnline();

        // Update every 30 seconds (heartbeat)
        const heartbeatInterval = setInterval(markOnline, 30000);

        // Handle page visibility changes (when user switches tabs)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                markOffline();
            } else {
                markOnline();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Handle beforeunload (when user closes tab/window)
        const handleBeforeUnload = () => {
            // Best-effort offline status on page unload
            markOffline();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup on unmount
        return () => {
            clearInterval(heartbeatInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            markOffline();
        };
    }, [user?.id]);
}
