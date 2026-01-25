import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children, allowedRoles }) {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-400" />
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
    if (allowedRoles) {
        // If profile is still loading or missing, treat as unauthorized
        if (!profile) {
            return <Navigate to="/unauthorized" replace />;
        }
        // Check if user's role is in allowed roles
        if (!allowedRoles.includes(profile.role || 'public')) {
            return <Navigate to="/unauthorized" replace />;
        }
    }


    return <>{children}</>;
}
