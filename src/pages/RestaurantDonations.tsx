import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, MapPin, Clock, TrendingUp, CheckCircle, AlertCircle, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Donation {
    id: string;
    quantity: number;
    food_type: string;
    description: string;
    status: 'pending' | 'at_center' | 'distributed';
    created_at: string;
    qr_code?: string;
    centers?: {
        name: string;
        address: string;
    };
}

export default function RestaurantDonations() {
    const { profile } = useAuth();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'at_center' | 'distributed'>('all');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        distributed: 0,
        totalMeals: 0
    });

    useEffect(() => {
        fetchDonations();
    }, [profile]);

    const fetchDonations = async () => {
        if (!profile?.restaurant_id) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('food_packets')
                .select(`
                    *,
                    centers(name, address)
                `)
                .eq('restaurant_id', profile.restaurant_id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setDonations(data || []);

            // Calculate stats
            const total = data?.length || 0;
            const pending = data?.filter(d => d.status === 'pending').length || 0;
            const distributed = data?.filter(d => d.status === 'distributed').length || 0;
            const totalMeals = data?.reduce((sum, d) => sum + d.quantity, 0) || 0;

            setStats({ total, pending, distributed, totalMeals });
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDonations = filter === 'all'
        ? donations
        : donations.filter(d => d.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'distributed':
                return 'from-green-500 to-emerald-500';
            case 'at_center':
                return 'from-cyan-500 to-blue-500';
            default:
                return 'from-orange-500 to-red-500';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'distributed':
                return 'bg-green-500/20 text-green-400';
            case 'at_center':
                return 'bg-cyan-500/20 text-cyan-400';
            default:
                return 'bg-orange-500/20 text-orange-400';
        }
    };

    return (
        <section className="relative py-16 overflow-hidden min-h-screen">
            <div className="absolute inset-0 animated-gradient opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        My <span className="gradient-text">Donations</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Track and manage all your food donations
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
                        <p className="text-sm text-muted-foreground">Total Donations</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <Clock className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.pending}</h3>
                        <p className="text-sm text-muted-foreground">Pending</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.distributed}</h3>
                        <p className="text-sm text-muted-foreground">Distributed</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.totalMeals}</h3>
                        <p className="text-sm text-muted-foreground">Total Meals</p>
                    </div>
                </motion.div>

                {/* Filter Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-3xl mb-8"
                >
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-muted-foreground" />
                            <span className="font-semibold">Filter:</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {(['all', 'pending', 'at_center', 'distributed'] as const).map((status) => (
                                <Button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    variant={filter === status ? 'default' : 'outline'}
                                    className={`${filter === status
                                            ? 'rgb-ring h-10 font-semibold'
                                            : 'glass-card border-white/20 hover:bg-white/10 h-10'
                                        }`}
                                >
                                    <span className={filter === status ? 'relative z-10 text-white' : ''}>
                                        {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Donations List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-8 rounded-3xl"
                >
                    <h2 className="text-2xl font-bold mb-6">Donation History</h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading donations...</p>
                        </div>
                    ) : filteredDonations.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">
                                {filter === 'all'
                                    ? 'No donations yet. Start making a difference today!'
                                    : `No ${filter.replace('_', ' ')} donations found.`}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDonations.map((donation, index) => (
                                <motion.div
                                    key={donation.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="depth-card p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStatusColor(donation.status)} flex items-center justify-center text-white shadow-lg`}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(donation.status)}`}>
                                            {donation.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">{donation.food_type}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {donation.quantity} meals
                                    </p>

                                    {donation.description && (
                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                            {donation.description}
                                        </p>
                                    )}

                                    {donation.centers && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <MapPin className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{donation.centers.name}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(donation.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>

                                    {donation.qr_code && (
                                        <div className="mt-3 pt-3 border-t border-white/10">
                                            <p className="text-xs text-muted-foreground font-mono">QR: {donation.qr_code}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
