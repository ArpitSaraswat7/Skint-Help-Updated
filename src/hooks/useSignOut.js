import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Shared hook for handling sign-out across all portals
 * Provides consistent error handling and navigation
 */
export function useSignOut() {
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/select-role', { replace: true });
        } catch (error) {
            console.error('Sign out error:', error);
            toast.error('Failed to sign out. Please try again.');
        }
    };

    return handleSignOut;
}
