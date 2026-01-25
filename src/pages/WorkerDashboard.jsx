import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle, Clock, TrendingUp, Truck, ArrowRight, BarChart3, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import ElectricBorder from '@/components/ui/ElectricBorder';

export default function WorkerDashboard() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [packets, setPackets] = useState([]);
    const [centerInventory, setCenterInventory] = useState(0);
    const [stats, setStats] = useState({
        pending: 0,
        atCenter: 0,
        distributed: 0,
        totalMeals: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile?.center_id) {
            fetchCenterPackets();
            fetchCenterInventory();
            fetchStats();

            // Realtime subscription
            const channel = supabase
                .channel('worker-updates')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'food_packets',
                    filter: `center_id=eq.${profile.center_id}`
                }, () => {
                    fetchCenterPackets();
                    fetchCenterInventory();
                    fetchStats();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [profile]);

    const fetchCenterPackets = async () => {
        if (!profile?.center_id) return;

        try {
            const { data, error } = await supabase
                .from('food_packets')
                .select(`
          *,
          restaurants(name)
        `)
                .eq('center_id', profile.center_id)
                .in('status', ['pending', 'at_center'])
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            setPackets(data || []);
        } catch (error) {
            console.error('Error fetching packets:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCenterInventory = async () => {
        if (!profile?.center_id) return;

        try {
            const { data, error } = await supabase
                .from('centers')
                .select('current_inventory')
                .eq('id', profile.center_id)
                .single();

            if (error) throw error;
            setCenterInventory(data?.current_inventory || 0);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const fetchStats = async () => {
        if (!profile?.center_id) return;

        try {
            const { data, error } = await supabase
                .from('food_packets')
                .select('status, quantity')
                .eq('center_id', profile.center_id);

            if (error) throw error;

            const pending = data?.filter(p => p.status === 'pending').length || 0;
            const atCenter = data?.filter(p => p.status === 'at_center').length || 0;
            const distributed = data?.filter(p => p.status === 'distributed').length || 0;
            const totalMeals = data?.reduce((sum, p) => sum + p.quantity, 0) || 0;

            setStats({ pending, atCenter, distributed, totalMeals });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const updatePacketStatus = async (packetId, newStatus) => {
        try {
            const { error } = await supabase
                .from('food_packets')
                .update({
                    status: newStatus,
                    ...(newStatus === 'at_center' && { collected_at: new Date().toISOString() }),
                    ...(newStatus === 'distributed' && { distributed_at: new Date().toISOString() })
                })
                .eq('id', packetId);

            if (error) throw error;

            // Create distribution record if distributed
            if (newStatus === 'distributed') {
                const packet = packets.find(p => p.id === packetId);
                await supabase.from('distributions').insert([{
                    worker_id: profile?.id,
                    packet_id: packetId,
                    center_id: profile?.center_id,
                    quantity_distributed: packet?.quantity || 0,
                }]);
            }

            toast.success(`Packet ${newStatus === 'at_center' ? 'received' : 'distributed'}!`);
            fetchCenterPackets();
            fetchStats();
        } catch (error) {
            toast.error(error.message || 'Failed to update packet');
        }
    };

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
                        onClick={() => navigate('/')}
                        variant="ghost"
                        className="mb-4 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Worker <span className="gradient-text">Portal</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Welcome back, {profile?.name || profile?.email || 'Worker'}!
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
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.pending}</h3>
                        <p className="text-sm text-muted-foreground">Pending Pickups</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <BarChart3 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.atCenter}</h3>
                        <p className="text-sm text-muted-foreground">At Center</p>
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
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.totalMeals}</h3>
                        <p className="text-sm text-muted-foreground">Total Meals</p>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8 rounded-3xl mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link to="/worker/pickups">
                            <ElectricBorder color="#ff6b35" speed={0.8} chaos={0.1} borderRadius={16} thickness={2}>
                                <div className="depth-card p-6 cursor-pointer group">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Truck className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Manage Pickups</h3>
                                    <p className="text-sm text-muted-foreground mb-3">View and collect food from restaurants</p>
                                    <div className="flex items-center gap-2 text-sm text-cyan-400">
                                        <span>View Pickups</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </ElectricBorder>
                        </Link>

                        <Link to="/worker/distributions">
                            <ElectricBorder color="#10b981" speed={0.8} chaos={0.1} borderRadius={16} thickness={2}>
                                <div className="depth-card p-6 cursor-pointer group">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Distribution History</h3>
                                    <p className="text-sm text-muted-foreground mb-3">Track your distribution impact</p>
                                    <div className="flex items-center gap-2 text-sm text-cyan-400">
                                        <span>View History</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </ElectricBorder>
                        </Link>
                    </div>
                </motion.div>

                {/* Inventory Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-8 rounded-3xl mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Current Inventory</h2>
                            <p className="text-muted-foreground">Total meals at your center</p>
                        </div>
                        <div className="text-5xl font-bold gradient-text">
                            {centerInventory}
                        </div>
                    </div>
                </motion.div>

                {/* Recent Packets */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-8 rounded-3xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Recent Packets</h2>
                        <Link to="/worker/pickups">
                            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                                View All <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading...</p>
                        </div>
                    ) : packets.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">No pending packets</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {packets.map((packet, index) => (
                                <motion.div
                                    key={packet.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="depth-card p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${packet.status === 'at_center' ? 'from-cyan-500 to-blue-500' : 'from-orange-500 to-red-500'
                                                } flex items-center justify-center text-white`}>
                                                <Package className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{packet.restaurants?.name || 'Unknown'}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {packet.quantity} meals • {packet.food_type}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    QR: {packet.qr_code}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {packet.status === 'pending' && (
                                                <Button
                                                    onClick={() => updatePacketStatus(packet.id, 'at_center')}
                                                    className="rgb-ring h-10 px-4 font-semibold"
                                                >
                                                    <span className="relative z-10 flex items-center gap-2 text-white">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Mark Received
                                                    </span>
                                                </Button>
                                            )}
                                            {packet.status === 'at_center' && (
                                                <Button
                                                    onClick={() => updatePacketStatus(packet.id, 'distributed')}
                                                    className="rgb-ring h-10 px-4 font-semibold"
                                                >
                                                    <span className="relative z-10 flex items-center gap-2 text-white">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Mark Distributed
                                                    </span>
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
    );
}
