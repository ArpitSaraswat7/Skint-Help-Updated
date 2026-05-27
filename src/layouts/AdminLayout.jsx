import { Link, useLocation, Navigate } from "react-router-dom";
import { Buildings, SignOut, SquaresFour, Users, Storefront, ChartBar, Envelope, List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSignOut } from "@/hooks/useSignOut";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useState } from "react";
import { usePresence } from "@/hooks/usePresence";
import { AnimatedOutlet } from "@/components/AnimatedOutlet";

export function AdminLayout() {
    const { user, profile, loading, isSigningOut } = useAuth();
    const location = useLocation();
    const handleSignOut = useSignOut();
    const [showSignOutDialog, setShowSignOutDialog] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Track presence (online/offline status)
    usePresence();

    if (isSigningOut) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <p className="text-white/40 text-sm">Signing out...</p>
            </div>
        );
    }

    // Still loading auth — show spinner
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated — redirect to admin login
    if (!user && !loading) {
        return <Navigate to="/sysadmin" replace />;
    }

    // User exists but profile not yet loaded
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Wrong role — redirect away silently
    if (profile.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const sidebarLinks = [
        { icon: SquaresFour, label: "Overview",      path: "/sysadmin/dashboard" },
        { icon: Envelope,    label: "Applications",  path: "/sysadmin/applications" },
        { icon: Storefront,  label: "Restaurants",   path: "/sysadmin/restaurants" },
        { icon: Users,       label: "Workers",       path: "/sysadmin/workers" },
        { icon: Buildings,   label: "Centers",       path: "/sysadmin/centers" },
        { icon: ChartBar,    label: "Analytics",     path: "/sysadmin/analytics" },
    ];

    return (
        <div className="min-h-screen flex bg-[#0a0a0f]">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 border-b border-white/8 backdrop-blur-xl" style={{ background: 'rgba(10,10,20,0.92)' }}>
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Buildings className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white text-sm tracking-tight">Control Panel</span>
                </Link>
                <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors" aria-label="Open menu">
                    <List className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`w-64 fixed h-full z-30 border-r border-white/8 backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ background: 'rgba(10,10,20,0.85)' }}>

                {/* Header */}
                <div className="p-6 border-b border-white/8 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group" onClick={() => setSidebarOpen(false)}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-cyan-500/20">
                            <Buildings className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white tracking-tight">Control Panel</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors" aria-label="Close menu">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-white/8">
                    <div className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/8">
                        <p className="text-xs text-white/40 mb-0.5">Logged in as</p>
                        <p className="font-semibold text-sm text-white truncate">{profile?.name || 'Administrator'}</p>
                        <p className="text-xs text-cyan-400 mt-0.5">● Admin</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-1">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                                    isActive
                                        ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                                        : "text-white/50 hover:bg-white/5 hover:text-white border border-transparent"
                                }`}
                            >
                                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
                                <span className="text-sm font-medium">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign Out */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/8">
                    <Button
                        onClick={() => setShowSignOutDialog(true)}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-white/40 hover:text-white hover:bg-white/5 gap-2"
                    >
                        <SignOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen bg-transparent pt-14 md:pt-0">
                <AnimatedOutlet />
            </main>

            {/* Sign Out Confirmation */}
            <ConfirmDialog
                open={showSignOutDialog}
                onOpenChange={setShowSignOutDialog}
                onConfirm={handleSignOut}
                title="Sign Out?"
                description="Are you sure you want to sign out of your account?"
                confirmText="Sign Out"
                cancelText="Cancel"
                variant="destructive"
                icon={<SignOut className="w-8 h-8" />}
            />
        </div>
    );
}
