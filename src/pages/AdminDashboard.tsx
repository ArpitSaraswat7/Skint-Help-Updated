import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Users, Utensils, MapPin, Package, Activity } from 'lucide-react';

interface DashboardMetrics {
    total_meals_distributed: number;
    active_restaurants: number;
    total_workers: number;
    active_centers: number;
    total_inventory: number;
}

export default function AdminDashboard() {
    const { profile } = useAuth();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
            const { data: metricsData, error: metricsError } = await (supabase as any)
                .from('dashboard_metrics')
                .select('*')
                .single();

            if (metricsError) throw metricsError;
            setMetrics(metricsData);

            // Fetch recent activity
            const { data: activityData, error: activityError } = await (supabase as any)
                .from('food_packets')
                .select(`
          *,
          restaurants(name),
          centers(name)
        `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (activityError) throw activityError;
            setRecentActivity(activityData || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card p-8 rounded-3xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-green-400" />
                            Recent Activity
                        </h2>

                        {loading ? (
                            <p className="text-muted-foreground">Loading...</p>
                        ) : recentActivity.length === 0 ? (
                            <p className="text-muted-foreground">No recent activity</p>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center justify-between p-4 glass-card rounded-xl"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activity.status === 'distributed' ? 'from-green-500 to-emerald-500' :
                                                activity.status === 'at_center' ? 'from-cyan-500 to-blue-500' :
                                                    'from-orange-500 to-red-500'
                                                } flex items-center justify-center text-white`}>
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {activity.restaurants?.name || 'Unknown Restaurant'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {activity.quantity} meals • {activity.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(activity.created_at).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(activity.created_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
