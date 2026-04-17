import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Package, MapPin, Clock, TrendingUp, CheckCircle, AlertCircle, Calendar, Filter, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsSkeleton, CardSkeleton } from '@/components/ui/skeleton-loaders';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from 'sonner';
import { useConfetti } from '@/hooks/useConfetti';
import { logger } from '@/lib/logger';

export default function RestaurantDonations() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const confetti = useConfetti();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        distributed: 0,
        totalMeals: 0
    });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, donation: null });
    const [centers, setCenters] = useState([]);

    // ✅ FIXED: Separate useEffect for fetching centers (runs once on mount)
    useEffect(() => {
        let isSubscribed = true;

        const fetchCenters = async () => {
            try {
                const { data, error } = await supabase
                    .from("collection_centers")
                    .select("*")
                    .eq('is_active', true);

                if (!isSubscribed) return;

                if (error) {
                    logger.error("Failed to fetch centers:", error);
                    return;
                }

                if (data) {
                    setCenters(data);
                }
            } catch (error) {
                logger.error("Unexpected error fetching centers:", error);
            }
        };

        fetchCenters();

        return () => {
            isSubscribed = false;
        };
    }, []);

    // ✅ FIXED: Separate useEffect for fetching donations (depends on profile)
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
            const totalMeals = data?.reduce((sum, d) => sum + (d.quantity || 0), 0) || 0;

            setStats({ total, pending, distributed, totalMeals });
        } catch (error) {
            logger.error('Error fetching donations:', error);
            toast.error('Failed to load donations');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDonation = async (donationId) => {
        try {
            const { error } = await supabase
                .from('food_packets')
                .delete()
                .eq('id', donationId);

            if (error) throw error;

            toast.success('Donation deleted successfully');
            confetti.deleted();
            setDeleteDialog({ open: false, donation: null });
            fetchDonations();
        } catch (error) {
            logger.error('Error deleting donation:', error);
            toast.error('Failed to delete donation');
        }
    };

    const filteredDonations = filter === 'all'
        ? donations
        : donations.filter(d => d.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'distributed':
                return 'from-green-500 to-emerald-500';
            case 'at_center':
                return 'from-cyan-500 to-blue-500';
            default:
                return 'from-orange-500 to-red-500';
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'distributed':
                return 'bg-green-500/20 text-green-400';
            case 'at_center':
                return 'bg-cyan-500/20 text-cyan-400';
            default:
                return 'bg-orange-500/20 text-orange-400';
        }
    };

    if (loading) {
        return (
            <section className="relative py-16 overflow-hidden min-h-screen">
                <div className="absolute inset-0 animated-gradient opacity-20" />
                <div className="container mx-auto px-4 relative z-10">
                    <StatsSkeleton count={4} className="mb-8" />
                    <CardSkeleton count={3} />
                </div>
            </section>
        );
    }

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
                    <Button
                        onClick={() => navigate('/restaurant/dashboard')}
                        variant="ghost"
                        className="mb-4 text-muted-foreground hover:text-foreground"
                        aria-label="Back to dashboard"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
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
                            <span className="text-sm font-medium text-muted-foreground">Total Donations</span>
                            <Package className="w-5 h-5 text-orange-400" />
                        </div>
                        <p className="text-3xl font-bold">{stats.total}</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-muted-foreground">Pending</span>
                            <Clock className="w-5 h-5 text-yellow-400" />
                        </div>
                        <p className="text-3xl font-bold">{stats.pending}</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-muted-foreground">Distributed</span>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-3xl font-bold">{stats.distributed}</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-muted-foreground">Total Meals</span>
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-3xl font-bold">{stats.totalMeals}</p>
                    </div>
                </motion.div>

                {/* Filter & List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="mb-6 flex gap-2">
                        {['all', 'pending', 'at_center', 'distributed'].map(status => (
                            <Button
                                key={status}
                                onClick={() => setFilter(status)}
                                variant={filter === status ? 'default' : 'outline'}
                                size="sm"
                                className="capitalize"
                            >
                                <Filter className="w-3 h-3 mr-2" />
                                {status === 'at_center' ? 'At Center' : status}
                            </Button>
                        ))}
                    </div>

                    {filteredDonations.length === 0 ? (
                        <div className="glass-card p-12 rounded-3xl text-center">
                            <Package className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-lg font-medium">No donations found</p>
                            <p className="text-muted-foreground">Start by creating your first donation</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredDonations.map((donation) => (
                                <motion.div
                                    key={donation.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`glass-card p-6 rounded-2xl bg-gradient-to-r ${getStatusColor(donation.status)} bg-opacity-10`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{donation.food_type}</h3>
                                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadgeColor(donation.status)}`}>
                                                    {donation.status === 'at_center' ? 'At Center' : donation.status}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground text-sm mb-2">{donation.description}</p>
                                            <div className="flex gap-6 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    {donation.quantity} meals
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {donation.centers?.name || 'Unknown'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(donation.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => setDeleteDialog({ open: true, donation })}
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-400 hover:text-red-300"
                                            aria-label={`Delete donation ${donation.id}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Delete Dialog */}
            <ConfirmDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
                title="Delete Donation"
                description="Are you sure you want to delete this donation? This action cannot be undone."
                onConfirm={() => deleteDialog.donation && handleDeleteDonation(deleteDialog.donation.id)}
                confirmText="Delete"
                confirmVariant="destructive"
                cancelText="Cancel"
            />
        </section>
    );
}
