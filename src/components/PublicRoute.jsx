import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CircleNotch } from '@phosphor-icons/react';

export function PublicRoute({ children }) {
    const { user, profile, loading } = useAuth();

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

    // If user is logged in, redirect to their dashboard
    if (user && profile) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
