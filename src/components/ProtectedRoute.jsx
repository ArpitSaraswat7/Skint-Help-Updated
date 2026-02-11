import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CircleNotch } from '@phosphor-icons/react';

// Helper to get correct dashboard for a role
function getDashboardForRole(role) {
    const dashboards = {
        'admin': '/owner/dashboard',
        'restaurant': '/restaurant/dashboard',
        'worker': '/worker/dashboard',
        'public': '/customer/dashboard',
        'customer': '/customer/dashboard'
    };
    return dashboards[role] || '/';
}

export function ProtectedRoute({ children, allowedRoles }) {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <CircleNotch className="w-12 h-12 animate-spin mx-auto mb-4 text-green-400" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Not logged in - redirect to role selection
        return <Navigate to="/select-role" replace />;
    }

    // Check role-based access
    if (allowedRoles && profile) {
        // Check if user's role is in allowed roles
        const userRole = profile.role || 'public';
        if (!allowedRoles.includes(userRole)) {
            // Redirect to the user's correct dashboard instead of select-role
            const correctDashboard = getDashboardForRole(userRole);
            return <Navigate to={correctDashboard} replace />;
        }
    }

    // If profile is missing but user exists, wait for it (show loading)
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <CircleNotch className="w-12 h-12 animate-spin mx-auto mb-4 text-green-400" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
