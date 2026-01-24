import { Outlet, Link, useLocation } from "react-router-dom";
import { Building2, LogOut, LayoutDashboard, Users, Store as StoreIcon, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function OwnerLayout() {
    const { signOut, profile } = useAuth();
    const location = useLocation();

    const sidebarLinks = [
        { icon: LayoutDashboard, label: "Overview", path: "/owner/dashboard" },
        { icon: StoreIcon, label: "Restaurants", path: "/owner/restaurants" },
        { icon: Users, label: "Workers", path: "/owner/workers" },
        { icon: BarChart, label: "Analytics", path: "/owner/analytics" },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Sidebar with glassmorphism */}
            <aside className="w-64 glass-card border-r border-white/10 fixed h-full z-10 backdrop-blur-xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center neon-glow transition-all group-hover:scale-110">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg gradient-text">Admin Portal</span>
                    </Link>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-white/10">
                    <div className="glass-card p-3 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Logged in as</p>
                        <p className="font-semibold text-sm truncate">{profile?.name || 'Admin'}</p>
                        <p className="text-xs text-green-400 mt-1">● Admin</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? "glass-card bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 font-medium neon-glow"
                                    : "text-muted-foreground hover:glass-card hover:text-foreground"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-green-400' : ''}`} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign Out Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 glass-card transition-all"
                        onClick={() => signOut()}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}
