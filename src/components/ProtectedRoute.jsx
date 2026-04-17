import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardForRole } from '@/lib/role-routes';

export function ProtectedRoute({ children, allowedRoles }) {
    const { user, profile, loading, isSigningOut } = useAuth();

    // During sign-out transition, render nothing (navigation already happening)
    if (isSigningOut) return null;

    // Wait until loading is finished
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    // If completely unauthenticated, immediately bounce them out.
    // This prevents the "back button" from showing cached protected content after logout.
    if (!user || !profile) {
        // If they were trying to access admin, send to admin login. Otherwise send to public role selector.
        const isAdminRoute = window.location.pathname.startsWith('/sysadmin');
        return <Navigate to={isAdminRoute ? '/sysadmin' : '/select-role'} replace />;
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
