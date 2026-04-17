import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Users, Utensils, MapPin, Package, Activity, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';
import { StatsSkeleton, ListSkeleton } from '@/components/ui/skeleton-loaders';
import { ActivityFeed } from '@/components/ActivityFeed';

export default function AdminDashboard() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    // Default metrics for demo mode or when table doesn't exist
    const DEFAULT_METRICS = {
        total_meals_distributed: 0,
        active_restaurants: 0,
        total_workers: 0,
        active_centers: 0,
        total_inventory: 0
    };

    useEffect(() => {
        fetchDashboardData();

        // Subscribe to realtime updates
        const channel = supabase
            .channel('dashboard-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'food_packets' }, () => {
                fetchDashboardData();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'distributions' }, () => {
                fetchDashboardData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch metrics
            const { data: metricsData, error: metricsError } = await supabase
                .from('dashboard_metrics')
                .select('*')
                .single();

            if (metricsError) {
                if (metricsError?.code === 'PGRST116' || metricsError?.message?.includes('does not exist')) {
                    logger.debug('Dashboard metrics table not found, using default values');
                    setMetrics(DEFAULT_METRICS);
                } else {
                    throw metricsError;
                }
            } else {
                setMetrics(metricsData);
            }

            // Fetch recent activity
            const { data: activityData, error: activityError } = await supabase
                .from('food_packets')
                .select(`
          *,
          restaurants(name),
          centers(name)
        `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (activityError) {
                if (activityError?.code === 'PGRST116' || activityError?.message?.includes('does not exist')) {
                    logger.debug('Food packets table not found, using empty activity');
                    setRecentActivity([]);
                } else {
                    throw activityError;
                }
            } else {
                setRecentActivity(activityData || []);
            }
        } catch (error) {
            logger.debug('Using default dashboard data for demo');
            setMetrics(DEFAULT_METRICS);
            setRecentActivity([]);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            icon: <Package className="w-8 h-8" />,
            label: 'Meals Distributed',
            value: metrics?.total_meals_distributed || 0,
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: <Utensils className="w-8 h-8" />,
            label: 'Active Restaurants',
            value: metrics?.active_restaurants || 0,
            color: 'from-orange-500 to-red-500',
        },
        {
            icon: <Users className="w-8 h-8" />,
            label: 'Workers',
            value: metrics?.total_workers || 0,
            color: 'from-cyan-500 to-blue-500',
        },
        {
            icon: <MapPin className="w-8 h-8" />,
            label: 'Collection Centers',
            value: metrics?.active_centers || 0,
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: <Activity className="w-8 h-8" />,
            label: 'Current Inventory',
            value: metrics?.total_inventory || 0,
            color: 'from-yellow-500 to-orange-500',
        },
    ];

    return (
        <div className="min-h-screen p-8">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 animated-gradient opacity-20" />

                <div className="relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Admin <span className="gradient-text">Dashboard</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Welcome back, {profile?.name || 'Admin'}
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    {loading ? (
                        <StatsSkeleton count={5} />
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="depth-card p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold gradient-text mb-1">
                                        {stat.value.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Real-time Activity Feed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <ActivityFeed limit={8} />
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="depth-card p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Recent Activity</h2>
                                <p className="text-sm text-muted-foreground">Latest food packet movements</p>
                            </div>
                        </div>

                        {loading ? (
                            <ListSkeleton items={5} />
                        ) : recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass-card p-4 rounded-xl flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                                                {activity.quantity}
                                            </div>
                                            <div>
                                                <p className="font-medium">{activity.food_type}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {activity.status} • {new Date(activity.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${activity.status === 'distributed'
                                            ? 'bg-green-500/20 text-green-400'
                                            : activity.status === 'at_center'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {activity.status}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                    <Activity className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground">No recent activity</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
