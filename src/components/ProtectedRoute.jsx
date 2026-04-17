import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardForRole } from '@/lib/role-routes';

export function ProtectedRoute({ children, allowedRoles }) {
    const { user, profile, loading, isSigningOut } = useAuth();

    // During sign-out transition, render nothing (navigation already happening)
    if (isSigningOut) return null;

    // Wait until everything loads
    if (loading || !user || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    // Role check
    if (allowedRoles) {
        const userRole = profile.role || 'public';
        if (!allowedRoles.includes(userRole)) {
            return <Navigate to={getDashboardForRole(userRole)} replace />;
        }
    }

    return <>{children}</>;
}
