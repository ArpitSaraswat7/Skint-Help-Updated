import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Package, Users, TrendingUp, CheckCircle, Calendar, Search, ArrowLeft, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function WorkerDistributions() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [distributions, setDistributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        totalMeals: 0,
        thisWeek: 0,
        thisMonth: 0
    });

    useEffect(() => {
        fetchDistributions();
    }, [profile]);

    const fetchDistributions = async () => {
        if (!profile?.id) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('distributions')
                .select(`
                    *,
                    food_packets(
                        food_type,
                        quantity,
                        restaurants(name)
                    )
                `)
                .eq('worker_id', profile.id)
                .order('distributed_at', { ascending: false });

            if (error) throw error;
            setDistributions(data || []);

            // Calculate stats
            const total = data?.length || 0;
            const totalMeals = data?.reduce((sum, d) => sum + d.quantity_distributed, 0) || 0;

            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            const thisWeek = data?.filter(d => new Date(d.distributed_at) >= weekAgo).length || 0;
            const thisMonth = data?.filter(d => new Date(d.distributed_at) >= monthAgo).length || 0;

            setStats({ total, totalMeals, thisWeek, thisMonth });
        } catch (error) {
            console.error('Error fetching distributions:', error);
            toast.error('Failed to load distributions');
        } finally {
            setLoading(false);
        }
    };

    const filteredDistributions = distributions.filter(dist =>
        dist.food_packets?.food_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dist.food_packets?.restaurants?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="relative py-16 overflow-hidden min-h-screen">
            <div className="absolute inset-0 animated-gradient opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header with Back Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Button
                        onClick={() => navigate('/worker/dashboard')}
                        variant="ghost"
                        className="mb-4 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Distribution <span className="gradient-text">History</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Track your food distribution impact
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
                        <p className="text-sm text-muted-foreground">Total Distributions</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.totalMeals}</h3>
                        <p className="text-sm text-muted-foreground">Meals Distributed</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <BarChart3 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.thisWeek}</h3>
                        <p className="text-sm text-muted-foreground">This Week</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.thisMonth}</h3>
                        <p className="text-sm text-muted-foreground">This Month</p>
                    </div>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-3xl mb-8"
                >
                    <div className="flex items-center gap-3 input-3d">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by restaurant or food type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                        />
                    </div>
                </motion.div>

                {/* Distributions List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-8 rounded-3xl"
                >
                    <h2 className="text-2xl font-bold mb-6">Distribution Records</h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading distributions...</p>
                        </div>
                    ) : filteredDistributions.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">
                                {searchQuery ? 'No distributions found matching your search.' : 'No distributions yet. Start distributing food to see your impact!'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDistributions.map((dist, index) => (
                                <motion.div
                                    key={dist.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="depth-card p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                            Distributed
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">
                                        {dist.food_packets?.restaurants?.name || 'Unknown Restaurant'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {dist.quantity_distributed} meals • {dist.food_packets?.food_type || 'N/A'}
                                    </p>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(dist.distributed_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-white/10">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-cyan-400" />
                                            <p className="text-xs text-cyan-400 font-semibold">
                                                Helped {dist.quantity_distributed} people
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Impact Summary */}
                {!loading && distributions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-8 rounded-3xl mt-8 text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4">Your Impact</h2>
                        <p className="text-muted-foreground mb-6">
                            You've made a real difference in your community!
                        </p>
                        <div className="flex justify-center items-center gap-2">
                            <Users className="w-8 h-8 text-green-400" />
                            <span className="text-5xl font-bold gradient-text">{stats.totalMeals}</span>
                        </div>
                        <p className="text-lg text-muted-foreground mt-4">
                            meals delivered to people in need
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
