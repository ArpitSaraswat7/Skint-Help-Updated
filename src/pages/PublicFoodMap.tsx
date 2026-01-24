import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Package, Clock } from 'lucide-react';

interface FoodLocation {
    id: string;
    center_name: string;
    center_address?: string; // Added field
    center_location: any;
    total_meals: number;
    packets: any[];
}

export default function PublicFoodMap() {
    const [locations, setLocations] = useState<FoodLocation[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

    useEffect(() => {
        fetchAvailableFood();

        // Realtime subscription
        const channel = supabase
            .channel('public-food-updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'food_packets'
            }, () => {
                fetchAvailableFood();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchAvailableFood = async () => {
        try {
            const { data, error } = await supabase
                .from('food_packets')
                .select(`
          *,
          centers(id, name, address, geo_location, current_inventory)
        `)
                .eq('status', 'at_center')
                .not('centers', 'is', null);

            if (error) throw error;

            // Group by center
            const grouped = (data || []).reduce((acc: any, packet: any) => {
                const centerId = packet.centers?.id;
                if (!centerId) return acc;

                if (!acc[centerId]) {
                    acc[centerId] = {
                        id: centerId,
                        center_name: packet.centers.name,
                        center_address: packet.centers.address,
                        center_location: packet.centers.geo_location,
                        total_meals: 0,
                        packets: []
                    };
                }

                acc[centerId].total_meals += packet.quantity;
                acc[centerId].packets.push(packet);
                return acc;
            }, {});

            setLocations(Object.values(grouped));
        } catch (error) {
            console.error('Error fetching available food:', error);
        }
    };

    return (
        <section className="relative py-16 overflow-hidden">
            <div className="absolute inset-0 animated-gradient opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-sm font-medium">Live Updates</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Find <span className="gradient-text">Available Food</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Real-time map of available meals at collection centers near you
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Map Visualization */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="depth-card p-8 h-[600px] relative overflow-hidden">
                            {/* Map Background */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-cyan-500/20" />
                                <svg className="w-full h-full">
                                    <defs>
                                        <pattern id="public-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#public-grid)" />
                                </svg>
                            </div>

                            {/* Location Markers */}
                            {locations.map((location, index) => {
                                const positions = [
                                    { top: '25%', left: '30%' },
                                    { top: '45%', left: '60%' },
                                    { top: '60%', left: '35%' },
                                    { top: '30%', left: '70%' },
                                    { top: '70%', left: '55%' },
                                ];
                                const position = positions[index % positions.length];

                                return (
                                    <motion.div
                                        key={location.id}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="absolute"
                                        style={position}
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.2 }}
                                            onClick={() => setSelectedLocation(location.id)}
                                            className="relative group"
                                        >
                                            {/* Pulsing ring */}
                                            <motion.div
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 blur-md"
                                            />

                                            {/* Marker */}
                                            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50">
                                                <MapPin className="w-7 h-7 text-white" />
                                            </div>

                                            {/* Meal count badge */}
                                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                                {location.total_meals}
                                            </div>
                                        </motion.button>
                                    </motion.div>
                                );
                            })}

                            {/* Live Indicator */}
                            <div className="absolute top-4 right-4 glass-card px-3 py-2 rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs font-medium">Live</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Location Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <h2 className="text-2xl font-bold mb-4">Available Locations</h2>

                        {locations.length === 0 ? (
                            <div className="glass-card p-6 rounded-2xl text-center">
                                <p className="text-muted-foreground">No food available at the moment</p>
                            </div>
                        ) : (
                            locations.map((location, index) => (
                                <motion.div
                                    key={location.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`depth-card p-6 cursor-pointer transition-all ${selectedLocation === location.id ? 'ring-2 ring-green-500 neon-glow' : ''
                                        }`}
                                    onClick={() => setSelectedLocation(location.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold mb-1">{location.center_name}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {location.center_address}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-4 h-4 text-green-400" />
                                                    <span className="font-medium">{location.total_meals} meals</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-cyan-400" />
                                                    <span className="text-muted-foreground">Now</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedLocation === location.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4 pt-4 border-t border-white/10 space-y-2"
                                        >
                                            <p className="text-sm font-medium mb-2">Available Packets:</p>
                                            {location.packets.map((packet: any) => (
                                                <div key={packet.id} className="text-sm text-muted-foreground flex justify-between">
                                                    <span>{packet.food_type}</span>
                                                    <span>{packet.quantity} meals</span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
