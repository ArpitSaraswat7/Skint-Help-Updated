import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('admin' | 'restaurant' | 'worker' | 'public' | 'customer')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
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
    if (allowedRoles && profile && !allowedRoles.includes(profile.role || 'public')) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}
