import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Clock, TrendingUp, CheckCircle, AlertCircle, Calendar, Filter, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsSkeleton, CardSkeleton } from '@/components/ui/skeleton-loaders';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from 'sonner';
import { useConfetti } from '@/hooks/useConfetti';

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

    useEffect(() => {
        console.log("FETCH RUNNING..."); // 👈 DEBUG

        const fetchCenters = async () => {
            const { data, error } = await supabase
                .from("collection_centers")
                .select("*");

            console.log("DATA:", data);
            console.log("ERROR:", error);

            if (data) setCenters(data);
        };

        fetchCenters();
    }, []);

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
                {loading ? (
                    <StatsSkeleton count={4} className="mb-8" />
                ) : (
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
                )}

                {/* Centers Dropdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="glass-card p-6 rounded-3xl mb-8"
                >
                    <select className="bg-background/50 border border-white/20 rounded-xl px-4 py-2 w-full max-w-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option>Select Collection Center</option>

                        {centers.map((center, index) => (
                            <option key={center.id || index} value={center.id}>
                                {center.name || center.address || 'Designated Location'}
                            </option>
                        ))}
                    </select>
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
                            {(['all', 'pending', 'at_center', 'distributed']).map((status) => (
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
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <CardSkeleton />
                            <CardSkeleton />
                            <CardSkeleton />
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

                                    {donation.status === 'pending' && (
                                        <button
                                            onClick={() => setDeleteDialog({ open: true, donation })}
                                            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm font-medium"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Donation
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) => setDeleteDialog({ open, donation: null })}
                    onConfirm={async () => {
                        if (deleteDialog.donation?.id) {
                            try {
                                // Delete from database
                                const { error } = await supabase
                                    .from('food_packets')
                                    .delete()
                                    .eq('id', deleteDialog.donation.id);

                                if (error) throw error;

                                // Success: update UI and show feedback
                                toast.success('Donation deleted successfully');
                                confetti.deleted(); // 🎉 Subtle delete confetti
                                setDonations(prev => prev.filter(d => d.id !== deleteDialog.donation.id));

                                // Update stats
                                setStats(prev => ({
                                    total: prev.total - 1,
                                    pending: deleteDialog.donation.status === 'pending' ? prev.pending - 1 : prev.pending,
                                    distributed: deleteDialog.donation.status === 'distributed' ? prev.distributed - 1 : prev.distributed,
                                    totalMeals: prev.totalMeals - deleteDialog.donation.quantity
                                }));
                            } catch (error) {
                                console.error('Error deleting donation:', error);
                                toast.error(error.message || 'Failed to delete donation');
                            }
                        }
                        setDeleteDialog({ open: false, donation: null });
                    }}
                    title="Delete Donation?"
                    description={`Are you sure you want to delete this ${deleteDialog.donation?.food_type || 'donation'}? This action cannot be undone.`}
                    confirmText="Delete"
                    variant="destructive"
                    icon={<Package className="w-8 h-8" />}
                >
                    {deleteDialog.donation && (
                        <div className="glass-card p-4 rounded-xl space-y-2 text-sm">
                            <p><strong>Food Type:</strong> {deleteDialog.donation.food_type}</p>
                            <p><strong>Quantity:</strong> {deleteDialog.donation.quantity} meals</p>
                            <p><strong>Status:</strong> <span className="capitalize">{deleteDialog.donation.status}</span></p>
                            {deleteDialog.donation.description && (
                                <p><strong>Description:</strong> {deleteDialog.donation.description}</p>
                            )}
                        </div>
                    )}
                </ConfirmDialog>
            </div>
        </section>
    );
}
