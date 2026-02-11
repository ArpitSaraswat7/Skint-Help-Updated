import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, MapPin, Phone, Mail, CheckCircle, XCircle, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CardSkeleton } from '@/components/ui/skeleton-loaders';

export default function AdminWorkers() {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchWorkers();

        // Subscribe to realtime updates
        const channel = supabase
            .channel('workers-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                fetchWorkers();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchWorkers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'worker')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWorkers(data || []);
        } catch (error) {
            console.error('Error fetching workers:', error);
            toast({
                title: 'Error',
                description: 'Failed to load workers',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const updateWorkerStatus = async (id, field, value) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ [field]: value })
                .eq('id', id);

            if (error) throw error;

            toast({
                title: 'Success',
                description: 'Worker status updated successfully',
            });

            fetchWorkers();
        } catch (error) {
            console.error('Error updating worker:', error);
            toast({
                title: 'Error',
                description: 'Failed to update worker status',
                variant: 'destructive',
            });
        }
    };

    const getAvailabilityBadge = (status) => {
        const badges = {
            available: { color: 'from-green-500 to-emerald-500', text: 'Available' },
            busy: { color: 'from-yellow-500 to-orange-500', text: 'Busy' },
            offline: { color: 'from-gray-500 to-slate-500', text: 'Offline' },
        };

        const badge = badges[status] || badges.offline;

        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${badge.color} text-white text-xs font-medium`}>
                ● {badge.text}
            </div>
        );
    };

    const getVerificationBadge = (status) => {
        const badges = {
            verified: { color: 'from-green-500 to-emerald-500', icon: CheckCircle, text: 'Verified' },
            pending: { color: 'from-yellow-500 to-orange-500', icon: UserCheck, text: 'Pending' },
            rejected: { color: 'from-red-500 to-rose-500', icon: XCircle, text: 'Rejected' },
        };

        const badge = badges[status] || badges.pending;
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
                            <span className="gradient-text">Workers</span> Management
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Manage field workers and their assignments
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
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold gradient-text">{workers.length}</p>
                                    <p className="text-sm text-muted-foreground">Total Workers</p>
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
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <UserCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold gradient-text">
                                        {workers.filter(w => w.verification_status === 'verified').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Verified</p>
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
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold gradient-text">
                                        {workers.filter(w => w.availability_status === 'available').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Available</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Workers List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-8 rounded-3xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Users className="w-6 h-6 text-cyan-400" />
                            All Workers
                        </h2>

                        {loading ? (
                            <div className="space-y-4">
                                <CardSkeleton />
                                <CardSkeleton />
                                <CardSkeleton />
                            </div>
                        ) : workers.length === 0 ? (
                            <p className="text-muted-foreground">No workers found</p>
                        ) : (
                            <div className="space-y-4">
                                {workers.map((worker, index) => (
                                    <motion.div
                                        key={worker.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="glass-card p-6 rounded-2xl hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                                        <Users className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">{worker.name}</h3>
                                                        <div className="flex gap-2 mt-1">
                                                            {getVerificationBadge(worker.verification_status)}
                                                            {getAvailabilityBadge(worker.availability_status)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                                    {worker.email && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4" />
                                                            {worker.email}
                                                        </div>
                                                    )}
                                                    {worker.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4" />
                                                            {worker.phone}
                                                        </div>
                                                    )}
                                                    {worker.assigned_area && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            {worker.assigned_area}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2">
                                                {worker.verification_status !== 'verified' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                                                        onClick={() => updateWorkerStatus(worker.id, 'verification_status', 'verified')}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Verify
                                                    </Button>
                                                )}
                                                {worker.verification_status !== 'rejected' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                                        onClick={() => updateWorkerStatus(worker.id, 'verification_status', 'rejected')}
                                                    >
                                                        <UserX className="w-4 h-4 mr-2" />
                                                        Reject
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
