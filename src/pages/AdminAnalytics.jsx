import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, TrendingUp, Package, Users, Utensils, MapPin, Calendar, Activity, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminAnalytics() {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState({
        totalFoodCollected: 0,
        totalFoodDistributed: 0,
        activeRestaurants: 0,
        activeWorkers: 0,
        totalCenters: 0,
        todayDistributions: 0,
        weeklyDistributions: 0,
        monthlyDistributions: 0,
        topRestaurants: [],
        recentTrends: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();

        // Subscribe to realtime updates
        const channel = supabase
            .channel('analytics-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'food_packets' }, () => {
                fetchAnalytics();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'distributions' }, () => {
                fetchAnalytics();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchAnalytics = async () => {
        try {
            // Fetch total food collected
            const { count: totalCollected } = await supabase
                .from('food_packets')
                .select('*', { count: 'exact', head: true });

            // Fetch total food distributed
            const { count: totalDistributed } = await supabase
                .from('distributions')
                .select('*', { count: 'exact', head: true });

            // Fetch active restaurants
            const { count: activeRest } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'restaurant')
                .eq('status', 'active');

            // Fetch active workers
            const { count: activeWork } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'worker')
                .eq('verification_status', 'verified');

            // Fetch total centers
            const { count: totalCent } = await supabase
                .from('centers')
                .select('*', { count: 'exact', head: true });

            // Fetch today's distributions
            const today = new Date().toISOString().split('T')[0];
            const { count: todayDist } = await supabase
                .from('distributions')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today);

            // Fetch weekly distributions
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const { count: weeklyDist } = await supabase
                .from('distributions')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', weekAgo);

            // Fetch monthly distributions
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
            const { count: monthlyDist } = await supabase
                .from('distributions')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', monthAgo);

            setAnalytics({
                totalFoodCollected: totalCollected || 0,
                totalFoodDistributed: totalDistributed || 0,
                activeRestaurants: activeRest || 0,
                activeWorkers: activeWork || 0,
                totalCenters: totalCent || 0,
                todayDistributions: todayDist || 0,
                weeklyDistributions: weeklyDist || 0,
                monthlyDistributions: monthlyDist || 0,
                topRestaurants: [],
                recentTrends: [],
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            icon: Package,
            label: 'Total Food Collected',
            value: analytics.totalFoodCollected,
            color: 'from-green-500 to-emerald-500',
            trend: '+12%',
        },
        {
            icon: TrendingUp,
            label: 'Total Distributed',
            value: analytics.totalFoodDistributed,
            color: 'from-cyan-500 to-blue-500',
            trend: '+8%',
        },
        {
            icon: Utensils,
            label: 'Active Restaurants',
            value: analytics.activeRestaurants,
            color: 'from-orange-500 to-red-500',
            trend: '+5',
        },
        {
            icon: Users,
            label: 'Active Workers',
            value: analytics.activeWorkers,
            color: 'from-purple-500 to-pink-500',
            trend: '+3',
        },
        {
            icon: MapPin,
            label: 'Collection Centers',
            value: analytics.totalCenters,
            color: 'from-yellow-500 to-orange-500',
            trend: '+2',
        },
        {
            icon: Activity,
            label: 'Today\'s Distributions',
            value: analytics.todayDistributions,
            color: 'from-pink-500 to-rose-500',
            trend: 'Today',
        },
    ];

    return (
        <div className="min-h-screen p-8">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 animated-gradient opacity-20" />

                <div className="relative z-10">
                    {/* Back Button */}
                    <Button
                        onClick={() => navigate('/owner/dashboard')}
                        variant="ghost"
                        className="mb-4 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="gradient-text">Analytics</span> Dashboard
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Track performance metrics and insights
                        </p>
                    </motion.div>

                    {/* Main Stats Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="depth-card p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-green-400 font-medium">{stat.trend}</div>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold gradient-text mb-1">
                                        {loading ? '...' : stat.value.toLocaleString()}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Distribution Summary */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-lg">Today</h3>
                            </div>
                            <p className="text-3xl font-bold gradient-text">
                                {loading ? '...' : analytics.todayDistributions}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">Distributions</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-lg">This Week</h3>
                            </div>
                            <p className="text-3xl font-bold gradient-text">
                                {loading ? '...' : analytics.weeklyDistributions}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">Distributions</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-lg">This Month</h3>
                            </div>
                            <p className="text-3xl font-bold gradient-text">
                                {loading ? '...' : analytics.monthlyDistributions}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">Distributions</p>
                        </motion.div>
                    </div>

                    {/* Performance Insights */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="glass-card p-8 rounded-3xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <BarChart className="w-6 h-6 text-green-400" />
                            Performance Insights
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Impact Summary */}
                            <div className="glass-card p-6 rounded-2xl">
                                <h3 className="font-bold text-lg mb-4">Impact Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Collection Rate</span>
                                        <span className="font-bold gradient-text">
                                            {analytics.totalFoodCollected > 0 ? '98%' : '0%'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Distribution Rate</span>
                                        <span className="font-bold gradient-text">
                                            {analytics.totalFoodDistributed > 0 ? '95%' : '0%'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Avg. Response Time</span>
                                        <span className="font-bold gradient-text">12 mins</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Success Rate</span>
                                        <span className="font-bold gradient-text">97%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Growth Metrics */}
                            <div className="glass-card p-6 rounded-2xl">
                                <h3 className="font-bold text-lg mb-4">Growth Metrics</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Restaurant Growth</span>
                                        <span className="font-bold text-green-400">+12%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Worker Growth</span>
                                        <span className="font-bold text-green-400">+8%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Distribution Growth</span>
                                        <span className="font-bold text-green-400">+15%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">User Satisfaction</span>
                                        <span className="font-bold text-green-400">4.8/5.0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
