import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Phone, Clock, Navigation, Building2, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RestaurantCenters() {
    const { profile } = useAuth();
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [donationStats, setDonationStats] = useState({});

    useEffect(() => {
        fetchCenters();
        fetchDonationStats();
    }, []);

    const fetchCenters = async () => {
        try {
            const { data, error } = await supabase
                .from('centers')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setCenters(data || []);
        } catch (error) {
            console.error('Error fetching centers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDonationStats = async () => {
        if (!profile?.restaurant_id) return;

        try {
            const { data, error } = await supabase
                .from('food_packets')
                .select('center_id')
                .eq('restaurant_id', profile.restaurant_id);

            if (error) throw error;

            // Count donations per center
            const stats = {};
            data?.forEach(packet => {
                if (packet.center_id) {
                    stats[packet.center_id] = (stats[packet.center_id] || 0) + 1;
                }
            });
            setDonationStats(stats);
        } catch (error) {
            console.error('Error fetching donation stats:', error);
        }
    };

    const filteredCenters = centers.filter(center =>
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCenters = filteredCenters.filter(c => c.is_active);
    const inactiveCenters = filteredCenters.filter(c => !c.is_active);

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
                        Collection <span className="gradient-text">Centers</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Find and connect with food collection centers near you
                    </p>
                </motion.div>

                {/* Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{activeCenters.length}</h3>
                        <p className="text-sm text-muted-foreground">Active Centers</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <Navigation className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{centers.length}</h3>
                        <p className="text-sm text-muted-foreground">Total Centers</p>
                    </div>

                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <CheckCircle className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">
                            {Object.values(donationStats).reduce((a, b) => a + b, 0)}
                        </h3>
                        <p className="text-sm text-muted-foreground">Your Donations</p>
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
                            placeholder="Search centers by name or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                        />
                    </div>
                </motion.div>

                {/* Active Centers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-8 rounded-3xl mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        Active Centers
                    </h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading centers...</p>
                        </div>
                    ) : activeCenters.length === 0 ? (
                        <div className="text-center py-12">
                            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">
                                {searchQuery ? 'No centers found matching your search.' : 'No active centers available.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeCenters.map((center, index) => (
                                <motion.div
                                    key={center.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`depth-card p-6 cursor-pointer ${selectedCenter === center.id ? 'ring-2 ring-green-400' : ''
                                        }`}
                                    onClick={() => setSelectedCenter(selectedCenter === center.id ? null : center.id)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                            Active
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">{center.name}</h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span className="line-clamp-2">{center.address}</span>
                                        </div>

                                        {center.phone && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="w-4 h-4 flex-shrink-0" />
                                                <span>{center.phone}</span>
                                            </div>
                                        )}

                                        {center.operating_hours && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="w-4 h-4 flex-shrink-0" />
                                                <span>{center.operating_hours}</span>
                                            </div>
                                        )}
                                    </div>

                                    {donationStats[center.id] && (
                                        <div className="mt-3 pt-3 border-t border-white/10">
                                            <p className="text-xs text-cyan-400 font-semibold">
                                                {donationStats[center.id]} donation{donationStats[center.id] !== 1 ? 's' : ''} sent here
                                            </p>
                                        </div>
                                    )}

                                    {selectedCenter === center.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4 pt-4 border-t border-white/10"
                                        >
                                            <Button className="w-full rgb-ring h-10 font-semibold">
                                                <span className="relative z-10 text-white flex items-center gap-2">
                                                    <Navigation className="w-4 h-4" />
                                                    Get Directions
                                                </span>
                                            </Button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Inactive Centers */}
                {inactiveCenters.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-8 rounded-3xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-orange-400" />
                            Inactive Centers
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {inactiveCenters.map((center, index) => (
                                <motion.div
                                    key={center.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="depth-card p-6 opacity-60"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                                            Inactive
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">{center.name}</h3>

                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{center.address}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
