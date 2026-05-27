import { Link, useLocation, Navigate } from "react-router-dom";
import { Storefront, SignOut, SquaresFour, ForkKnife, MapPin, List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSignOut } from "@/hooks/useSignOut";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useState } from "react";
import { usePresence } from "@/hooks/usePresence";
import { AnimatedOutlet } from "@/components/AnimatedOutlet";

export function RestaurantLayout() {
    const { user, profile, loading, isSigningOut } = useAuth();
    const location = useLocation();
    const handleSignOut = useSignOut();
    const [showSignOutDialog, setShowSignOutDialog] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Track presence (online/offline status)
    usePresence();

    if (isSigningOut) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Signing out...</p>
            </div>
        );
    }

    // Still loading auth — show spinner
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated at all — redirect to select-role
    if (!user && !loading) {
        return <Navigate to="/select-role" replace />;
    }

    // User exists but profile still loading — show spinner (don't redirect!)
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    const sidebarLinks = [
        { icon: SquaresFour, label: "Dashboard", path: "/restaurant/dashboard" },
        { icon: ForkKnife, label: "My Donations", path: "/restaurant/donations" },
        { icon: MapPin, label: "Collection Centers", path: "/restaurant/centers" },
    ];

    return (
        <div className="min-h-screen flex relative">
            {/* Background */}
            <div className="fixed inset-0 animated-gradient opacity-20 pointer-events-none" />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 border-b border-white/10 backdrop-blur-xl glass-card">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                        <Storefront className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-sm gradient-text block leading-none">Restaurant</span>
                        <span className="text-xs text-muted-foreground">Portal</span>
                    </div>
                </Link>
                <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/10 text-foreground transition-colors" aria-label="Open menu">
                    <List className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`w-64 glass-card border-r border-white/10 fixed h-full z-30 backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group" onClick={() => setSidebarOpen(false)}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg group-hover:shadow-orange-500/50 transition-all duration-300">
                            <Storefront className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-lg gradient-text block">Restaurant</span>
                            <span className="text-xs text-muted-foreground">Portal</span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close menu">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* User Info */}
                {profile && (
                    <div className="p-4 border-b border-white/10">
                        <div className="glass-card p-3 rounded-xl">
                            <p className="text-sm font-medium text-foreground truncate">{profile.name || profile.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">Restaurant Portal</p>
                        </div>
                    </div>
                )}

                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 font-medium shadow-lg shadow-orange-500/10"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 backdrop-blur-xl">
                    <Button
                        onClick={() => setShowSignOutDialog(true)}
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                    >
                        <SignOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 relative z-10 pt-14 md:pt-0">
                <AnimatedOutlet />
            </main>

            {/* Sign Out Confirmation Dialog */}
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
