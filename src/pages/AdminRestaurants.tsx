import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Store, MapPin, Phone, Mail, CheckCircle, XCircle, Ban, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Restaurant {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    status: 'active' | 'pending' | 'blocked';
    created_at: string;
    total_contributions?: number;
}

export default function AdminRestaurants() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchRestaurants();

        // Subscribe to realtime updates
        const channel = supabase
            .channel('restaurants-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                fetchRestaurants();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchRestaurants = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'restaurant')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRestaurants(data || []);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            toast({
                title: 'Error',
                description: 'Failed to load restaurants',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const updateRestaurantStatus = async (id: string, status: 'active' | 'pending' | 'blocked') => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ status })
                .eq('id', id);

            if (error) throw error;

            toast({
                title: 'Success',
                description: `Restaurant ${status === 'active' ? 'approved' : status === 'blocked' ? 'blocked' : 'set to pending'}`,
            });

            fetchRestaurants();
        } catch (error) {
            console.error('Error updating restaurant:', error);
            toast({
                title: 'Error',
                description: 'Failed to update restaurant status',
                variant: 'destructive',
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            active: { color: 'from-green-500 to-emerald-500', icon: CheckCircle, text: 'Active' },
            pending: { color: 'from-yellow-500 to-orange-500', icon: Clock, text: 'Pending' },
            blocked: { color: 'from-red-500 to-rose-500', icon: Ban, text: 'Blocked' },
        };

        const badge = badges[status as keyof typeof badges] || badges.pending;
        const Icon = badge.icon;

        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${badge.color} text-white text-sm font-medium`}>
                <Icon className="w-4 h-4" />
                {badge.text}
            </div>
        );
    };

    return (
        <div className="min-h-screen p-8">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 animated-gradient opacity-20" />

                <div className="relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="gradient-text">Restaurants</span> Management
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Manage restaurant partners and their contributions
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold gradient-text">
                                        {restaurants.filter(r => r.status === 'active').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Active</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold gradient-text">
                                        {restaurants.filter(r => r.status === 'pending').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                                    <Ban className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold gradient-text">
                                        {restaurants.filter(r => r.status === 'blocked').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Blocked</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Restaurants List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-8 rounded-3xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Store className="w-6 h-6 text-green-400" />
                            All Restaurants
                        </h2>

                        {loading ? (
                            <p className="text-muted-foreground">Loading...</p>
                        ) : restaurants.length === 0 ? (
                            <p className="text-muted-foreground">No restaurants found</p>
                        ) : (
                            <div className="space-y-4">
                                {restaurants.map((restaurant, index) => (
                                    <motion.div
                                        key={restaurant.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass-card p-6 rounded-2xl hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                                        <Store className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                                                        {getStatusBadge(restaurant.status)}
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                                    {restaurant.email && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4" />
                                                            {restaurant.email}
                                                        </div>
                                                    )}
                                                    {restaurant.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4" />
                                                            {restaurant.phone}
                                                        </div>
                                                    )}
                                                    {restaurant.address && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            {restaurant.address}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        Joined {new Date(restaurant.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2">
                                                {restaurant.status !== 'active' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                                                        onClick={() => updateRestaurantStatus(restaurant.id, 'active')}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                )}
                                                {restaurant.status !== 'blocked' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                                        onClick={() => updateRestaurantStatus(restaurant.id, 'blocked')}
                                                    >
                                                        <Ban className="w-4 h-4 mr-2" />
                                                        Block
                                                    </Button>
                                                )}
                                                {restaurant.status === 'blocked' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                                                        onClick={() => updateRestaurantStatus(restaurant.id, 'pending')}
                                                    >
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        Set Pending
                                                    </Button>
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
        </div>
    );
}
