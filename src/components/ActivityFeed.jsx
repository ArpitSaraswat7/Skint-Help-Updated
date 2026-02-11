import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react';

/**
 * ActivityFeed - Shows real-time activity updates
 * Updates automatically via Supabase Realtime
 * 100% FREE - no external APIs!
 */
export function ActivityFeed({ limit = 5, className = '' }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch initial activities
        const fetchActivities = async () => {
            try {
                const { data, error } = await supabase
                    .from('food_packets')
                    .select(`
                        id,
                        created_at,
                        status,
                        quantity,
                        food_type,
                        restaurants(name),
                        centers(name)
                    `)
                    .order('created_at', { ascending: false })
                    .limit(limit);

                if (error) throw error;
                setActivities(data || []);
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();

        // Subscribe to real-time updates
        const channel = supabase
            .channel('activity-feed')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'food_packets'
            }, async (payload) => {
                if (payload.eventType === 'INSERT') {
                    // Fetch full data with relations
                    const { data, error } = await supabase
                        .from('food_packets')
                        .select(`
                            id,
                            created_at,
                            status,
                            quantity,
                            food_type,
                            restaurants(name),
                            centers(name)
                        `)
                        .eq('id', payload.new.id)
                        .single();

                    if (error) {
                        console.error('Error fetching new activity:', error);
                        return;
                    }

                    if (data) {
                        setActivities(prev => [data, ...prev].slice(0, limit));
                    }
                } else if (payload.eventType === 'UPDATE') {
                    // Fetch full data with relations to preserve nested objects
                    const { data, error } = await supabase
                        .from('food_packets')
                        .select(`
                            id,
                            created_at,
                            status,
                            quantity,
                            food_type,
                            restaurants(name),
                            centers(name)
                        `)
                        .eq('id', payload.new.id)
                        .single();

                    if (error) {
                        console.error('Error fetching updated activity:', error);
                        return;
                    }

                    if (data) {
                        setActivities(prev =>
                            prev.map(a => a.id === payload.new.id ? data : a)
                        );
                    }
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [limit]);

    const getIcon = (status) => {
        switch (status) {
            case 'distributed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'at_center':
                return <Package className="w-5 h-5 text-blue-500" />;
            default:
                return <Clock className="w-5 h-5 text-orange-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'distributed': return 'text-green-400';
            case 'at_center': return 'text-blue-400';
            default: return 'text-orange-400';
        }
    };

    const getTimeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    if (loading) {
        return (
            <div className={`glass-card p-6 rounded-3xl ${className}`}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Live Activity
                </h3>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 animate-pulse">
                            <div className="w-5 h-5 rounded-full bg-white/10" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-white/10 rounded w-3/4" />
                                <div className="h-3 bg-white/10 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`glass-card p-6 rounded-3xl ${className}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Live Activity
                {activities.length > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400"
                    >
                        {activities.length} recent
                    </motion.span>
                )}
            </h3>

            {activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <div className="mt-0.5">
                                    {getIcon(activity.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate group-hover:text-white transition-colors">
                                        <span className="text-purple-400">
                                            {activity.restaurants?.name || 'Unknown Restaurant'}
                                        </span>
                                        {' '}donated{' '}
                                        <span className="text-green-400 font-semibold">
                                            {activity.quantity} meals
                                        </span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-muted-foreground truncate">
                                            {activity.food_type}
                                        </p>
                                        <span className="text-muted-foreground">•</span>
                                        <p className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                                            {activity.status.replace('_', ' ')}
                                        </p>
                                        <span className="text-muted-foreground">•</span>
                                        <p className="text-xs text-muted-foreground">
                                            {getTimeAgo(activity.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
