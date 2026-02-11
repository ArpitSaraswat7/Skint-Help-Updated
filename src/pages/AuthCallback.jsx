import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                setStatus('Verifying authentication...');

                // Get the access token and refresh token from URL parameters
                const accessToken = searchParams.get('access_token');
                const refreshToken = searchParams.get('refresh_token');
                const error = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                // Handle OAuth errors
                if (error) {
                    console.error('OAuth error:', error, errorDescription);
                    toast.error(errorDescription || 'Authentication failed');
                    navigate('/select-role');
                    return;
                }

                if (accessToken && refreshToken) {
                    // Set the session with the tokens
                    const { error: sessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                    if (sessionError) throw sessionError;
                }

                // Get current session
                setStatus('Loading your profile...');
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (!session) {
                    toast.error('No active session found. Please sign in again.');
                    navigate('/select-role');
                    return;
                }

                // Get pending role from localStorage (for OAuth flows)
                const pendingRole = localStorage.getItem('pendingRole');

                // If there's a pending role, update user metadata
                if (pendingRole) {
                    const { error: updateError } = await supabase.auth.updateUser({
                        data: { role: pendingRole }
                    });

                    if (updateError) {
                        console.error('Failed to update user role:', updateError);
                    }
                }

                // Wait for user metadata to be available (with retry)
                let userRole = session.user.user_metadata?.role || pendingRole;
                let retryCount = 0;
                const maxRetries = 5;

                while (!userRole && retryCount < maxRetries) {
                    setStatus(`Loading profile... (${retryCount + 1}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, 500));

                    try {
                        const response = await supabase.auth.getUser();

                        // Validate response shape before accessing data
                        if (response.error) {
                            console.error('Error fetching user:', response.error);
                            setStatus(`Retry ${retryCount + 1}/${maxRetries} failed`);
                        } else if (response.data?.user) {
                            userRole = response.data.user.user_metadata?.role;
                        }
                    } catch (error) {
                        console.error('Exception during user fetch:', error);
                        setStatus(`Retry ${retryCount + 1}/${maxRetries} failed`);
                    }

                    retryCount++;
                }

                // Clear pending role
                localStorage.removeItem('pendingRole');
                localStorage.removeItem('selectedRole');

                // Default to 'public' if no role found
                const finalRole = userRole || 'public';

                setStatus('Redirecting to your dashboard...');
                toast.success('Successfully signed in!');

                // Redirect based on role
                switch (finalRole) {
                    case 'admin':
                        navigate('/owner/dashboard', { replace: true });
                        break;
                    case 'restaurant':
                        navigate('/restaurant/dashboard', { replace: true });
                        break;
                    case 'worker':
                        navigate('/worker/dashboard', { replace: true });
                        break;
                    case 'public':
                    case 'customer':
                    default:
                        navigate('/customer/dashboard', { replace: true });
                        break;
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                toast.error(error.message || 'Sign in failed. Please try again.');
                navigate('/select-role');
            }
        };

        handleAuthCallback();
    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#DBEBC0]" />
                <h2 className="text-2xl font-semibold mb-2 text-white">{status}</h2>
                <p className="text-white/60">Please wait while we complete your sign in.</p>
            </div>
        </div>
    );
}
