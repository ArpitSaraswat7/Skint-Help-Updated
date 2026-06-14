import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Mail, MapPin, Phone, User, Calendar, Eye, Trash2, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';
import { sanitizeError } from '@/lib/sanitizeError';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export default function AdminApplications() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedApp, setSelectedApp] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

    useEffect(() => {
        // CQ-06 FIX: profile is null on first render. Skip the check until profile is loaded.
        // Without this guard, null !== 'admin' evaluates to true and causes an immediate
        // redirect before the auth session has a chance to resolve.
        if (profile === null || profile === undefined) return;

        if (profile?.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchApplications();
    }, [profile, navigate]);

    useEffect(() => {
        // Filter applications
        let filtered = applications;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.phone?.includes(searchTerm)
            );
        }

        // Role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(app => app.role === roleFilter);
        }

        setFilteredApps(filtered);
    }, [applications, searchTerm, roleFilter]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('join_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                logger.error('Fetch error:', error);
                toast.error(sanitizeError(error));
                return;
            }

            setApplications(data || []);
        } catch (err) {
            logger.error('Error:', err);
            toast.error(sanitizeError(err));
        } finally {
            setLoading(false);
        }
    };

    const deleteApplication = async (id) => {
        try {
            setDeleting(id);
            const { error } = await supabase
                .from('join_applications')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setApplications(applications.filter(app => app.id !== id));
            setSelectedApp(null);
            toast.success('Application deleted successfully');
        } catch (err) {
            logger.error('Delete error:', err);
            toast.error(sanitizeError(err));
        } finally {
            setDeleting(null);
        }
    };

    const downloadCSV = () => {
        if (filteredApps.length === 0) {
            toast.warning('No applications to download');
            return;
        }

        // REL-06 FIX: Proper CSV escaping per RFC 4180.
        // 1. Wrap all cells in double-quotes.
        // 2. Escape embedded double-quotes by doubling them ("" not \").
        // 3. Neutralize formula-injection: prefix cells starting with =,+,-,@,| with a tab.
        const csvEscape = (value) => {
            const str = String(value ?? '');
            // Neutralize formula injection characters at the start of a field
            const safe = /^[=+\-@|]/.test(str) ? `\t${str}` : str;
            // Escape embedded double-quotes by doubling them (RFC 4180)
            return `"${safe.replace(/"/g, '""')}"`;
        };

        const headers = ['Name', 'Email', 'Phone', 'Role', 'Organization', 'Message', 'Date'];
        const rows = filteredApps.map(app => [
            `${app.first_name} ${app.last_name}`,
            app.email,
            app.phone,
            app.role,
            app.organization_name || app.address || '-',
            app.message || '',
            new Date(app.created_at).toLocaleDateString()
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(csvEscape).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            'restaurant': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
            'volunteer': 'bg-green-500/20 text-green-400 border border-green-500/30',
            'center': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
            'customer': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
        };
        return colors[role] || 'bg-gray-500/20 text-gray-400';
    };

    const getRoleTitle = (role) => {
        const titles = {
            'restaurant': 'Restaurant Portal',
            'volunteer': 'Volunteer Portal',
            'center': 'Collection Center',
            'customer': 'Customer Portal',
        };
        return titles[role] || role;
    };

    return (
        <div className="min-h-screen bg-black/50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2 gradient-text">Applications</h1>
                    <p className="text-muted-foreground">
                        {filteredApps.length} of {applications.length} applications
                    </p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-2xl mb-8"
                >
                    <div className="grid md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <label htmlFor="app-search" className="sr-only">Search applications by name, email, or phone</label>
                            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                            <input
                                id="app-search"
                                type="text"
                                placeholder="Search by name, email, phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-400 text-white placeholder:text-white/50"
                            />
                        </div>

                        {/* Role Filter */}
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-cyan-400 text-white"
                        >
                            <option value="all">All Roles</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="center">Collection Center</option>
                            <option value="customer">Customer</option>
                        </select>

                        {/* Download Button */}
                        <Button
                            onClick={downloadCSV}
                            className="rgb-ring"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>

                        {/* Refresh Button */}
                        <Button
                            onClick={fetchApplications}
                            className="rgb-ring"
                            variant="outline"
                        >
                            Refresh
                        </Button>
                    </div>
                </motion.div>

                {/* Applications List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card p-6 rounded-2xl h-24 animate-pulse bg-white/10" />
                        ))}
                    </div>
                ) : filteredApps.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card p-12 rounded-2xl text-center"
                    >
                        <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No applications found</p>
                    </motion.div>
                ) : (
                    <div className="grid gap-4">
                        {filteredApps.map((app, index) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass-card p-6 rounded-2xl hover:border-cyan-400/50 transition-all cursor-pointer group"
                                onClick={() => setSelectedApp(app.id === selectedApp ? null : app.id)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold">
                                                {app.first_name} {app.last_name}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(app.role)}`}>
                                                {getRoleTitle(app.role)}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {app.email}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                {app.phone}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <Eye className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Expanded Details */}
                                {selectedApp === app.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="border-t border-white/10 pt-4 mt-4"
                                    >
                                        {(app.organization_name || app.address) && (
                                            <div className="mb-4">
                                                <p className="text-sm text-muted-foreground mb-1">Organization</p>
                                                <p className="font-medium flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-cyan-400" />
                                                    {app.organization_name || app.address}
                                                </p>
                                            </div>
                                        )}

                                        {app.message && (
                                            <div className="mb-6">
                                                <p className="text-sm text-muted-foreground mb-2">Message</p>
                                                <p className="bg-white/5 p-4 rounded-lg border border-white/10">
                                                    {app.message}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const subject = `Re: Your ${getRoleTitle(app.role)} Application`;
                                                    window.location.href = `mailto:${app.email}?subject=${encodeURIComponent(subject)}`;
                                                }}
                                                className="flex-1 rgb-ring"
                                            >
                                                Reply via Email
                                            </Button>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteDialog({ open: true, id: app.id });
                                                }}
                                                disabled={deleting === app.id}
                                                className="px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            {/* Delete Confirmation Dialog (SEC-02/CQ-03) */}
            <ConfirmDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, id: null })}
                onConfirm={() => deleteApplication(deleteDialog.id)}
                title="Delete Application?"
                description="This will permanently remove the application. This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                icon={<Trash2 className="w-8 h-8" />}
            />
        </div>
    );
}
