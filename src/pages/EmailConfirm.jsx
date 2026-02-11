import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmailConfirm() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            try {
                // Get the current session after email confirmation
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (session?.user) {
                    // Explicitly check if email is confirmed
                    const emailConfirmedAt = session.user.email_confirmed_at || session.user.confirmed_at;

                    if (emailConfirmedAt) {
                        setStatus('success');
                        setMessage('Email verified successfully!');
                        toast.success('Email verified! You can now sign in.');

                        // Wait a moment then redirect to login
                        const timerId = setTimeout(() => {
                            navigate('/select-role', { replace: true });
                        }, 2000);

                        // Cleanup function to clear timeout on unmount
                        return () => clearTimeout(timerId);
                    } else {
                        // Session exists but email not confirmed
                        setStatus('error');
                        setMessage('Email not verified yet. Please check your email and click the confirmation link.');
                    }
                } else {
                    // No session means the link might be expired or invalid
                    setStatus('error');
                    setMessage('Verification link expired or invalid. Please try signing up again.');
                }
            } catch (error) {
                console.error('Email confirmation error:', error);
                setStatus('error');
                setMessage(error.message || 'Failed to verify email. Please try again.');
            }
        };

        handleEmailConfirmation();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
            <div className="max-w-md w-full">
                <div className="glass-card p-8 rounded-3xl text-center">
                    {status === 'verifying' && (
                        <>
                            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-[#DBEBC0]" />
                            <h2 className="text-2xl font-bold mb-2 text-white">{message}</h2>
                            <p className="text-white/60">Please wait while we confirm your email address.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                            <h2 className="text-2xl font-bold mb-2 text-white">{message}</h2>
                            <p className="text-white/60 mb-6">Redirecting you to login...</p>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse" style={{ width: '100%' }} />
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                            <h2 className="text-2xl font-bold mb-2 text-white">Verification Failed</h2>
                            <p className="text-white/60 mb-6">{message}</p>
                            <Button
                                onClick={() => navigate('/select-role')}
                                className="w-full bg-gradient-to-r from-[#DBEBC0] to-yellow-600 hover:opacity-90 text-black font-bold"
                            >
                                Go to Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
