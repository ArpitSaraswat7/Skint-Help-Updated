import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Phone, Clock, CheckCircle, Navigation, Search, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function WorkerPickups() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchPickups();

        // Realtime subscription
        const channel = supabase
            .channel('pickups-updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'food_packets',
                filter: `center_id=eq.${profile?.center_id}`
            }, () => {
                fetchPickups();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [profile]);

    const fetchPickups = async () => {
        if (!profile?.center_id) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('food_packets')
                .select(`
                    *,
                    restaurants(name, address, phone)
                `)
                .eq('center_id', profile.center_id)
                .in('status', ['pending', 'at_center'])
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPickups(data || []);
        } catch (error) {
            console.error('Error fetching pickups:', error);
            toast.error('Failed to load pickups');
        } finally {
            setLoading(false);
        }
    };

    const markAsCollected = async (pickupId) => {
        try {
            const { error } = await supabase
                .from('food_packets')
                .update({
                    status: 'at_center',
                    collected_at: new Date().toISOString()
                })
                .eq('id', pickupId);

            if (error) throw error;

            toast.success('Pickup marked as collected!');
            fetchPickups();
        } catch (error) {
            toast.error(error.message || 'Failed to update pickup');
        }
    };

    const filteredPickups = pickups.filter(pickup => {
        const matchesSearch = pickup.restaurants?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pickup.food_type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'pending' && pickup.status === 'pending') ||
            (filter === 'collected' && pickup.status === 'at_center');
        return matchesSearch && matchesFilter;
    });

    const pendingCount = pickups.filter(p => p.status === 'pending').length;
    const collectedCount = pickups.filter(p => p.status === 'at_center').length;

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
                        Food <span className="gradient-text">Pickups</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Manage and track food collection from restaurants
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{pickups.length}</h3>
                        <p className="text-sm text-muted-foreground">Total Pickups</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{pendingCount}</h3>
                        <p className="text-sm text-muted-foreground">Pending Collection</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{collectedCount}</h3>
                        <p className="text-sm text-muted-foreground">Collected</p>
                    </div>
                </motion.div>

                {/* Search and Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-3xl mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 input-3d">
                            <div className="flex items-center gap-3">
                                <Search className="w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search by restaurant or food type..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'pending', 'collected']).map((status) => (
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
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Pickups List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-8 rounded-3xl"
                >
                    <h2 className="text-2xl font-bold mb-6">Pickup Schedule</h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading pickups...</p>
                        </div>
                    ) : filteredPickups.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">
                                {searchQuery || filter !== 'all' ? 'No pickups found matching your criteria.' : 'No pickups scheduled.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredPickups.map((pickup, index) => (
                                <motion.div
                                    key={pickup.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="depth-card p-6"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pickup.status === 'at_center' ? 'from-green-500 to-emerald-500' : 'from-orange-500 to-red-500'
                                                } flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                                                <Package className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg mb-1">{pickup.restaurants?.name || 'Unknown Restaurant'}</h3>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {pickup.quantity} meals • {pickup.food_type}
                                                </p>
                                                {pickup.restaurants?.address && (
                                                    <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                                                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                        <span className="line-clamp-1">{pickup.restaurants.address}</span>
                                                    </div>
                                                )}
                                                {pickup.restaurants?.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                        <Phone className="w-4 h-4 flex-shrink-0" />
                                                        <span>{pickup.restaurants.phone}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    Created: {new Date(pickup.created_at).toLocaleString()}
                                                </div>
                                                <div className="mt-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${pickup.status === 'at_center' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                                                        }`}>
                                                        {pickup.status === 'at_center' ? 'Collected' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 md:items-end">
                                            {pickup.status === 'pending' && (
                                                <>
                                                    <Button
                                                        onClick={() => markAsCollected(pickup.id)}
                                                        className="rgb-ring h-10 px-4 font-semibold w-full md:w-auto"
                                                    >
                                                        <span className="relative z-10 flex items-center gap-2 text-white">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Mark Collected
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="glass-card border-white/20 hover:bg-white/10 h-10 px-4 w-full md:w-auto"
                                                    >
                                                        <Navigation className="w-4 h-4 mr-2" />
                                                        Navigate
                                                    </Button>
                                                </>
                                            )}
                                            {pickup.qr_code && (
                                                <p className="text-xs text-muted-foreground font-mono mt-2">
                                                    QR: {pickup.qr_code}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
