import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Package, Clock, TrendingUp, CheckCircle, AlertCircle, BarChart3, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import ElectricBorder from '@/components/ui/ElectricBorder';

export default function RestaurantDashboard() {
    const { profile } = useAuth();
    const [centers, setCenters] = useState([]);
    const [myPackets, setMyPackets] = useState([]);
    const [stats, setStats] = useState({
        totalDonations: 0,
        pendingDonations: 0,
        distributedDonations: 0,
        totalMeals: 0
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        quantity: '',
        food_type: '',
        description: '',
        center_id: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCenters();
        fetchMyPackets();
    }, [profile]);

    const fetchCenters = async () => {
        try {
            const { data, error } = await supabase
                .from('centers')
                .select('*')
                .eq('is_active', true);

            if (error) throw error;
            setCenters(data || []);
        } catch (error) {
            console.error('Error fetching centers:', error);
        }
    };

    const fetchMyPackets = async () => {
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
            setMyPackets(data || []);

            // Calculate stats
            const totalDonations = data?.length || 0;
            const pendingDonations = data?.filter(p => p.status === 'pending').length || 0;
            const distributedDonations = data?.filter(p => p.status === 'distributed').length || 0;
            const totalMeals = data?.reduce((sum, p) => sum + p.quantity, 0) || 0;

            setStats({
                totalDonations,
                pendingDonations,
                distributedDonations,
                totalMeals
            });
        } catch (error) {
            console.error('Error fetching packets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profile?.restaurant_id) {
            toast.error('Restaurant profile not found');
            return;
        }

        try {
            const { error } = await supabase
                .from('food_packets')
                .insert([
                    {
                        restaurant_id: profile.restaurant_id,
                        center_id: formData.center_id,
                        quantity: parseInt(formData.quantity),
                        food_type: formData.food_type,
                        description: formData.description,
                        status: 'pending',
                    },
                ]);

            if (error) throw error;

            toast.success('Food packet added successfully!');
            setShowAddForm(false);
            setFormData({ quantity: '', food_type: '', description: '', center_id: '' });
            fetchMyPackets();
        } catch (error) {
            toast.error(error.message || 'Failed to add food packet');
        }
    };

    const recentPackets = myPackets.slice(0, 3);

    return (
        <section className="relative py-16 overflow-hidden min-h-screen">
            <div className="absolute inset-0 animated-gradient opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Restaurant <span className="gradient-text">Portal</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Welcome back, {profile?.name || profile?.email || 'Partner'}!
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="rgb-ring h-12 px-6 font-semibold group"
                    >
                        <span className="relative z-10 flex items-center gap-2 text-white">
                            <Plus className="w-5 h-5" />
                            Add Food Packet
                        </span>
                    </Button>
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
                        <h3 className="text-3xl font-bold mb-1">{stats.totalDonations}</h3>
                        <p className="text-sm text-muted-foreground">Total Donations</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <Clock className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.pendingDonations}</h3>
                        <p className="text-sm text-muted-foreground">Pending</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats.distributedDonations}</h3>
                        <p className="text-sm text-muted-foreground">Distributed</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-cyan-400" />
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
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link to="/restaurant/donations">
                            <ElectricBorder color="#a855f7" speed={0.8} chaos={0.1} borderRadius={16} thickness={2}>
                                <div className="depth-card p-6 cursor-pointer group">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">View All Donations</h3>
                                    <p className="text-sm text-muted-foreground mb-3">Track your donation history</p>
                                    <div className="flex items-center gap-2 text-sm text-cyan-400">
                                        <span>View Details</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </ElectricBorder>
                        </Link>

                        <Link to="/restaurant/centers">
                            <ElectricBorder color="#10b981" speed={0.8} chaos={0.1} borderRadius={16} thickness={2}>
                                <div className="depth-card p-6 cursor-pointer group">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Collection Centers</h3>
                                    <p className="text-sm text-muted-foreground mb-3">Find nearby centers</p>
                                    <div className="flex items-center gap-2 text-sm text-cyan-400">
                                        <span>Explore</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </ElectricBorder>
                        </Link>

                        <ElectricBorder color="#ff6b35" speed={0.8} chaos={0.1} borderRadius={16} thickness={2}>
                            <div className="depth-card p-6 cursor-pointer group" onClick={() => setShowAddForm(true)}>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Add Donation</h3>
                                <p className="text-sm text-muted-foreground mb-3">Create a new food packet</p>
                                <div className="flex items-center gap-2 text-sm text-cyan-400">
                                    <span>Get Started</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </ElectricBorder>
                    </div>
                </motion.div>

                {/* Add Food Form */}
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 rounded-3xl mb-8"
                    >
                        <h2 className="text-2xl font-bold mb-6">Add New Food Packet</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="input-3d">
                                    <input
                                        type="number"
                                        placeholder="Quantity (meals)"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                        required
                                        min="1"
                                    />
                                </div>
                                <div className="input-3d">
                                    <input
                                        type="text"
                                        placeholder="Food Type (e.g., Veg, Non-Veg)"
                                        value={formData.food_type}
                                        onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-3d">
                                <select
                                    value={formData.center_id}
                                    onChange={(e) => setFormData({ ...formData, center_id: e.target.value })}
                                    className="w-full bg-transparent border-0 focus:outline-none text-foreground py-3"
                                    required
                                >
                                    <option value="">Select Collection Center</option>
                                    {centers.map((center) => (
                                        <option key={center.id} value={center.id} className="bg-gray-900">
                                            {center.name} - {center.address}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-3d">
                                <textarea
                                    placeholder="Description (optional)"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3 resize-none"
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" className="rgb-ring h-12 px-8 font-semibold flex-1">
                                    <span className="relative z-10 text-white">Submit</span>
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    variant="outline"
                                    className="glass-card border-white/20 hover:bg-white/10 h-12 px-8"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-8 rounded-3xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Recent Activity</h2>
                        <Link to="/restaurant/donations">
                            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                                View All <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading...</p>
                        </div>
                    ) : recentPackets.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground mb-4">
                                No food packets yet. Add your first donation!
                            </p>
                            <Button onClick={() => setShowAddForm(true)} className="rgb-ring h-10 px-6">
                                <span className="relative z-10 text-white">Add Food Packet</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-4">
                            {recentPackets.map((packet, index) => (
                                <motion.div
                                    key={packet.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="depth-card p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${packet.status === 'distributed' ? 'from-green-500 to-emerald-500' :
                                            packet.status === 'at_center' ? 'from-cyan-500 to-blue-500' :
                                                'from-orange-500 to-red-500'
                                            } flex items-center justify-center text-white`}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${packet.status === 'distributed' ? 'bg-green-500/20 text-green-400' :
                                            packet.status === 'at_center' ? 'bg-cyan-500/20 text-cyan-400' :
                                                'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {packet.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">{packet.food_type}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {packet.quantity} meals
                                    </p>

                                    {packet.centers && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <MapPin className="w-4 h-4" />
                                            {packet.centers.name}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        {new Date(packet.created_at).toLocaleDateString()}
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
