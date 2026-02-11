import { Outlet, Link, useLocation } from "react-router-dom";
import { Briefcase, LogOut, LayoutDashboard, Truck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSignOut } from "@/hooks/useSignOut";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useState } from "react";
import { usePresence } from "@/hooks/usePresence";

export function WorkerLayout() {
    const location = useLocation();
    const { profile } = useAuth();
    const handleSignOut = useSignOut();
    const [showSignOutDialog, setShowSignOutDialog] = useState(false);

    // Track presence (online/offline status)
    usePresence();

    const sidebarLinks = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/worker/dashboard" },
        { icon: Truck, label: "Pickups", path: "/worker/pickups" },
        { icon: Check, label: "Distributions", path: "/worker/distributions" },
    ];

    return (
        <div className="min-h-screen flex relative">
            {/* Background */}
            <div className="fixed inset-0 animated-gradient opacity-20 pointer-events-none" />

            {/* Sidebar */}
            <aside className="w-64 glass-card border-r border-white/10 fixed h-full z-20 backdrop-blur-xl">
                <div className="p-6 border-b border-white/10">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-lg gradient-text block">Worker</span>
                            <span className="text-xs text-muted-foreground">Portal</span>
                        </div>
                    </Link>
                </div>

                {/* User Info */}
                {profile && (
                    <div className="p-4 border-b border-white/10">
                        <div className="glass-card p-3 rounded-xl">
                            <p className="text-sm font-medium text-foreground truncate">{profile.name || profile.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">Delivery Worker</p>
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
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 font-medium shadow-lg shadow-blue-500/10"
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
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                        onClick={() => setShowSignOutDialog(true)}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 relative z-10">
                <Outlet />
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
                icon={<LogOut className="w-8 h-8" />}
            />
        </div>
    );
}
