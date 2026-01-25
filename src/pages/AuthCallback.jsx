import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Get the access token and refresh token from URL parameters
                const accessToken = searchParams.get('access_token');
                const refreshToken = searchParams.get('refresh_token');

                if (accessToken && refreshToken) {
                    // Set the session with the tokens
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                    if (error) throw error;

                    // Get pending role from localStorage
                    const pendingRole = localStorage.getItem('pendingRole') || 'public';

                    // Update user metadata with role
                    const { error: updateError } = await supabase.auth.updateUser({
                        data: { role: pendingRole }
                    });

                    if (updateError) {
                        console.error('Failed to update user role:', updateError);
                        toast.error('Sign in succeeded but role assignment failed');
                    }

                    // Clear pending role
                    localStorage.removeItem('pendingRole');
                    localStorage.removeItem('selectedRole');

                    toast.success('Successfully signed in!');
                    navigate('/dashboard');
                } else {
                    // If no tokens in URL, check the current session
                    const { data: { session }, error } = await supabase.auth.getSession();

                    if (error) throw error;

                    if (session) {
                        toast.success('Successfully signed in!');
                        navigate('/dashboard');
                    } else {
                        toast.error('Sign in failed. Please try again.');
                        navigate('/select-role');
                    }
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                toast.error('Sign in failed. Please try again.');
                navigate('/select-role');
            }
        };

        handleAuthCallback();
    }, [navigate, searchParams]);

    return (
        <div className="container flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Completing sign in...</h2>
                <p className="text-gray-600">Please wait while we complete your sign in.</p>
            </div>
        </div>
    );
}
