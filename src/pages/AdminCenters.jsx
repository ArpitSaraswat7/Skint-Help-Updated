import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Plus, MapPin, Phone, CheckCircle, Navigation, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CardSkeleton } from '@/components/ui/skeleton-loaders';

export default function AdminCenters() {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCenters();

        const channel = supabase
            .channel('admin-centers-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'centers' }, () => {
                fetchCenters();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchCenters = async () => {
        try {
            const { data, error } = await supabase
                .from('centers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCenters(data || []);
        } catch (error) {
            console.error('Error fetching centers:', error);
            toast.error('Failed to load centers');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('centers')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success(`Center ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
            fetchCenters();
        } catch (error) {
            console.error('Error toggling center status:', error);
            toast.error('Failed to update center status');
        }
    };

    return (
        <div className="min-h-screen p-8">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 animated-gradient opacity-20" />

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className="gradient-text">Collection Centers</span>
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Manage food collection centers
                            </p>
                        </div>
                        <Button className="rgb-ring h-10 px-4 font-semibold" onClick={() => toast.info('Center creation logic would go here')}>
                            <span className="relative z-10 flex items-center gap-2 text-white">
                                <Plus className="w-4 h-4" /> Add Center
                            </span>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    >
                        <div className="glass-card p-6 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold gradient-text">{centers.length}</p>
                                    <p className="text-sm text-muted-foreground">Total Centers</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold gradient-text">{centers.filter(c => c.is_active).length}</p>
                                    <p className="text-sm text-muted-foreground">Active Centers</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 rounded-3xl"
                    >
                        {loading ? (
                            <div className="space-y-4">
                                <CardSkeleton />
                                <CardSkeleton />
                            </div>
                        ) : centers.length === 0 ? (
                            <p className="text-muted-foreground">No centers found.</p>
                        ) : (
                            <div className="space-y-4">
                                {centers.map((center, index) => (
                                    <motion.div
                                        key={center.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass-card p-6 rounded-2xl hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${center.is_active ? 'from-green-500 to-emerald-500' : 'from-gray-500 to-slate-500'} flex items-center justify-center`}>
                                                        <Building2 className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                                            {center.name}
                                                            {!center.is_active && <AlertCircle className="w-4 h-4 text-orange-400" />}
                                                        </h3>
                                                        <div className="text-sm text-muted-foreground">
                                                            Capacity: {center.capacity || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" /> {center.address}
                                                    </div>
                                                    {center.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4" /> {center.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant={center.is_active ? 'outline' : 'default'}
                                                    className={center.is_active ? 'border-orange-500/50 text-orange-400 hover:bg-orange-500/10' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'}
                                                    onClick={() => toggleStatus(center.id, center.is_active)}
                                                >
                                                    {center.is_active ? 'Deactivate' : 'Activate'}
                                                </Button>
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
