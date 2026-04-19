import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Package, TrendingUp, Clock, CheckCircle, AlertCircle, MapPin, Utensils, Plus, ArrowRight, ArrowLeft, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ElectricBorder from '@/components/ui/ElectricBorder';
import { logger } from '@/lib/logger';
import { StatsSkeleton, ListSkeleton } from '@/components/ui/skeleton-loaders';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useConfetti } from '@/hooks/useConfetti';

export default function RestaurantDashboard() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const confetti = useConfetti();
    const [selectedCenter, setSelectedCenter] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [foodType, setFoodType] = useState('');
    const [isDemoMode, setIsDemoMode] = useState(false);

    // Mock centers for demo mode when table doesn't exist
    const MOCK_CENTERS = [
        { id: 'center-001', name: 'Downtown Collection Center', address: '123 Main St, City Center', is_active: true },
        { id: 'center-002', name: 'North Side Hub', address: '456 North Ave, Uptown', is_active: true },
        { id: 'center-003', name: 'Community Kitchen', address: '789 Community Rd, Suburb', is_active: true },
    ];
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
    const [deleteDialog, setDeleteDialog] = useState({ open: false, packet: null });

    useEffect(() => {
        fetchMyPackets();
    }, [profile]);

    useEffect(() => {
        logger.debug('Fetching restaurant dashboard data...');

        const fetchCenters = async () => {
            const { data, error } = await supabase
                .from("collection_centers")
                .select("*");

            logger.debug('Dashboard data:', data);
            if (error) logger.error('Dashboard error:', error);

            if (data) setCenters(data);
        };

        fetchCenters();
    }, []);

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

            if (error) {
                // If table doesn't exist (404), use mock data for demo
                if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
                    logger.debug('Food packets table not found, using mock data');
                    const mockData = [
                        {
                            id: 'packet-001',
                            restaurant_id: profile.restaurant_id,
                            center_id: 'center-001',
                            quantity: 50,
                            food_type: 'Vegetarian',
                            description: 'Mixed vegetables and rice',
                            status: 'distributed',
                            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                            centers: { name: 'Downtown Collection Center', address: '123 Main St' }
                        },
                        {
                            id: 'packet-002',
                            restaurant_id: profile.restaurant_id,
                            center_id: 'center-002',
                            quantity: 30,
                            food_type: 'Non-Vegetarian',
                            description: 'Chicken curry and bread',
                            status: 'at_center',
                            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                            centers: { name: 'North Side Hub', address: '456 North Ave' }
                        },
                        {
                            id: 'packet-003',
                            restaurant_id: profile.restaurant_id,
                            center_id: 'center-001',
                            quantity: 25,
                            food_type: 'Vegetarian',
                            description: 'Lentil soup and salad',
                            status: 'pending',
                            created_at: new Date().toISOString(),
                            centers: { name: 'Downtown Collection Center', address: '123 Main St' }
                        }
                    ];
                    setMyPackets(mockData);

                    // Calculate stats from mock data
                    const totalDonations = mockData.length;
                    const pendingDonations = mockData.filter(p => p.status === 'pending').length;
                    const distributedDonations = mockData.filter(p => p.status === 'distributed').length;
                    const totalMeals = mockData.reduce((sum, p) => sum + p.quantity, 0);

                    setStats({
                        totalDonations,
                        pendingDonations,
                        distributedDonations,
                        totalMeals
                    });
                    setLoading(false);
                    return;
                }
                throw error;
            }
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
            logger.debug('Using mock food packets data for demo');
            // Fallback to empty state
            setMyPackets([]);
            setStats({
                totalDonations: 0,
                pendingDonations: 0,
                distributedDonations: 0,
                totalMeals: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePacket = async (e) => {
        e.preventDefault();

        // Prevent submission in demo mode to avoid FK constraint failures
        if (isDemoMode) {
            toast.error('Demo mode: Cannot create packets with mock data. Please connect to a real Supabase database.');
            return;
        }

        if (!profile?.restaurant_id) {
            toast.error('Restaurant profile not found');
            return;
        }

        if (!selectedCenter || !quantity || !foodType) { // Added foodType to validation
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('food_packets')
                .insert([
                    {
                        restaurant_id: profile.restaurant_id,
                        center_id: selectedCenter,
                        quantity: parseInt(quantity),
                        food_type: foodType, // Using foodType state
                        description: description || null,
                        status: 'pending'
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            toast.success('Food packet created successfully!');
            confetti.success(); // 🎉 Confetti celebration!
            setShowAddForm(false);
            setSelectedCenter('');
            setQuantity('');
            setDescription('');
            setFoodType(''); // Clear foodType state
            fetchMyPackets(); // Refresh the list
        } catch (error) {
            logger.error('Error creating packet:', error);
            toast.error(error.message || 'Failed to create food packet');
        }
    };

    const handleDeletePacket = async (packetId) => {
        try {
            const { error } = await supabase
                .from('food_packets')
                .delete()
                .eq('id', packetId);

            if (error) throw error;

            toast.success('Donation deleted successfully');
            confetti.deleted(); // 🎊 Confetti for deletion
            await fetchMyPackets(); // Refresh the list
        } catch (error) {
            logger.error('Error deleting packet:', error);
            toast.error(error.message || 'Failed to delete donation');
        }
    };

    const recentPackets = myPackets.slice(0, 3);

    return (
        <section className="relative py-16 overflow-hidden min-h-screen">
            <div className="absolute inset-0 animated-gradient opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                <Button
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="mb-4 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
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
                )}

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
                        <form onSubmit={handleCreatePacket} className="space-y-6">
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
                                    {centers?.map((center, index) => (
                                        <option key={center.id || index} value={center.id} className="bg-gray-900">
                                            {center.name || center.address || 'Mathura'} {center.name && center.address ? `- ${center.address}` : ''}
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

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    open={deleteDialog.open}
                    onOpenChange={(open) => setDeleteDialog({ open, packet: null })}
                    onConfirm={async () => {
                        if (deleteDialog.packet?.id) {
                            await handleDeletePacket(deleteDialog.packet.id);
                        }
                        setDeleteDialog({ open: false, packet: null });
                    }}
                    title="Delete Donation?"
                    description={`Are you sure you want to delete this ${deleteDialog.packet?.food_type || 'donation'}? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="destructive"
                    icon={<Package className="w-8 h-8" />}
                >
                    {deleteDialog.packet && (
                        <div className="glass-card p-4 rounded-xl space-y-2 text-sm">
                            <p><strong>Food Type:</strong> {deleteDialog.packet.food_type}</p>
                            <p><strong>Quantity:</strong> {deleteDialog.packet.quantity} meals</p>
                            <p><strong>Status:</strong> <span className="capitalize">{deleteDialog.packet.status}</span></p>
                            {deleteDialog.packet.description && (
                                <p><strong>Description:</strong> {deleteDialog.packet.description}</p>
                            )}
                        </div>
                    )}
                </ConfirmDialog>
            </div>
        </section>
    );
}
