import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { ENV } from "@/lib/env";

const AuthContext = createContext(undefined);

// DEMO ACCOUNTS - Only available when explicitly enabled
export const DEMO_ACCOUNTS = ENV.ENABLE_DEMO_MODE ? {
    'admin@skinthelp.com': {
        password: 'admin123',
        profile: {
            id: 'admin-001',
            email: 'admin@skinthelp.com',
            name: 'Admin User',
            role: 'admin',
        }
    },
    'restaurant@skinthelp.com': {
        password: 'rest123',
        profile: {
            id: 'rest-001',
            email: 'restaurant@skinthelp.com',
            name: 'Restaurant Owner',
            role: 'restaurant',
            restaurant_id: 'restaurant-001',
        }
    },
    'worker@skinthelp.com': {
        password: 'worker123',
        profile: {
            id: 'worker-001',
            email: 'worker@skinthelp.com',
            name: 'Collection Worker',
            role: 'worker',
            center_id: 'center-001',
        }
    },
    'public@skinthelp.com': {
        password: 'public123',
        profile: {
            id: 'public-001',
            email: 'public@skinthelp.com',
            name: 'Public User',
            role: 'public',
        }
    },
} : {};

// Valid roles for OAuth/OTP role assignment
const VALID_ROLES = ['admin', 'restaurant', 'worker', 'public'];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [emailConfirmed, setEmailConfirmed] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();

        // Check for demo mode session on mount
        const demoMode = localStorage.getItem('demo_mode');
        const demoProfile = localStorage.getItem('demo_profile');

        if (demoMode === 'true' && demoProfile) {
            try {
                const profile = JSON.parse(demoProfile);
                setProfile(profile);
                setUser({
                    id: profile.id,
                    email: profile.email,
                    user_metadata: { role: profile.role }
                });
                setLoading(false);
                // Don't return early - continue to register auth listener
            } catch (e) {
                logger.error('Failed to restore demo session:', e);
                localStorage.removeItem('demo_mode');
                localStorage.removeItem('demo_profile');
            }
        }

        // Check for existing session from Supabase
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (abortController.signal.aborted) return;

            logger.debug('Auth state changed:', event, session?.user?.email);

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                // Check email confirmation status
                const isConfirmed = session.user.email_confirmed_at !== null;
                setEmailConfirmed(isConfirmed);

                // Fetch profile
                await fetchProfile(session.user);
            } else {
                setProfile(null);
                setEmailConfirmed(true);
            }
            setLoading(false);
        });

        return () => {
            abortController.abort();
            subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (currentUser, retryCount = 0) => {
        try {
            // First try to get from user_metadata (most reliable for simple role storage)
            const metaRole = currentUser.user_metadata?.role;
            const metaName = currentUser.user_metadata?.name;

            logger.debug('Fetching profile for user:', currentUser.email, 'Role:', metaRole);

            if (metaRole) {
                const userProfile = {
                    id: currentUser.id,
                    email: currentUser.email,
                    name: metaName || currentUser.email?.split('@')[0],
                    role: metaRole,
                    // Add other fields if stored in metadata
                };
                setProfile(userProfile);
                logger.debug('Profile set:', userProfile);
                return;
            }

            // If no role in metadata and this is a new user, retry a few times
            // (metadata might not be immediately available)
            if (retryCount < 3) {
                logger.debug(`No role found, retrying... (${retryCount + 1}/3)`);
                await new Promise(resolve => setTimeout(resolve, 500));

                // Refresh user data
                const { data: { user: refreshedUser } } = await supabase.auth.getUser();
                if (refreshedUser) {
                    await fetchProfile(refreshedUser, retryCount + 1);
                    return;
                }
            }

            // If still no role after retries, default to 'public'
            logger.debug('No role found after retries, defaulting to public');
            const defaultProfile = {
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.email?.split('@')[0],
                role: 'public',
            };
            setProfile(defaultProfile);

        } catch (error) {
            console.error("Error fetching profile:", error);
            // Set a default profile even on error with all required fields
            setProfile({
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.email?.split('@')[0] || '',
                role: 'public',
            });
        }
    };

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            // Check for demo accounts FIRST (only in dev mode)
            if (import.meta.env.DEV) {
                const demoAccount = DEMO_ACCOUNTS[email.toLowerCase()];
                if (demoAccount && demoAccount.password === password) {
                    // Use demo login logic (mock)
                    const mockProfile = { ...demoAccount.profile };
                    setProfile(mockProfile);
                    setUser({
                        id: mockProfile.id,
                        email: mockProfile.email,
                        user_metadata: { role: mockProfile.role }
                    });
                    // Persist demo session
                    localStorage.setItem('demo_mode', 'true');
                    localStorage.setItem('demo_profile', JSON.stringify(mockProfile));
                    setLoading(false);
                    return;
                }
            }

            // Normal Supabase Login
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

        } catch (error) {
            console.error('Sign in error:', error);
            throw new Error(error.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email, password, userData) => {
        setLoading(true);
        try {
            const { error, data } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: userData?.role || 'public',
                        name: userData?.name || email.split('@')[0],
                        ...userData // store other custom data in metadata
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) throw error;

            // Check if email confirmation is required
            if (data.user && !data.session) {
                // Email confirmation required
                setEmailConfirmed(false);
                const error = new Error('Please check your email to confirm your account before signing in.');
                error.code = 'EMAIL_CONFIRMATION_REQUIRED';
                throw error;
            }

            if (data.user && data.session) {
                // Auto-login successful (email confirmation disabled)
                setEmailConfirmed(true);
                // Profile update will be handled by onAuthStateChange
            }

        } catch (error) {
            console.error('Sign up error:', error);
            throw new Error(error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();

            // Clear all auth-related storage
            localStorage.removeItem('demo_mode');
            localStorage.removeItem('demo_profile');
            localStorage.removeItem('selectedRole');
            localStorage.removeItem('pendingRole');

            // Clear state
            setProfile(null);
            setUser(null);
            setSession(null);
            setLoading(false);

            // Navigation will be handled by the calling component
            // This prevents breaking browser history
        } catch (error) {
            console.error('Sign out error:', error);
            setLoading(false);
            throw new Error('Failed to sign out');
        }
    };

    const signInWithGoogle = async () => {
        try {
            const selectedRole = localStorage.getItem('selectedRole') || 'public';

            // Validate role against allowlist to prevent tampering
            const validatedRole = VALID_ROLES.includes(selectedRole) ? selectedRole : 'public';

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) throw error;

            // Store validated role for callback to use
            localStorage.setItem('pendingRole', validatedRole);
        } catch (error) {
            console.error('Google sign in error:', error);
            throw new Error(error.message || 'Failed to sign in with Google');
        }
    };

    const signInWithPhone = async (phone) => {
        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone,
            });

            if (error) throw error;
            toast.success('OTP sent to your phone!');
        } catch (error) {
            console.error('Phone sign in error:', error);
            throw new Error(error.message || 'Failed to send OTP');
        }
    };

    const verifyOTP = async (phone, otp) => {
        try {
            const selectedRole = localStorage.getItem('selectedRole') || 'public';

            // Validate role against allowlist
            const validatedRole = VALID_ROLES.includes(selectedRole) ? selectedRole : 'public';

            const { error: verifyError } = await supabase.auth.verifyOtp({
                phone,
                token: otp,
                type: 'sms',
            });

            if (verifyError) throw verifyError;

            // Update user metadata with validated role
            const { error: updateError } = await supabase.auth.updateUser({
                data: { role: validatedRole }
            });

            if (updateError) {
                console.error('Failed to update user role:', updateError);
                toast.error('Verification succeeded but role assignment failed');
            } else {
                toast.success('Phone verified successfully!');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            throw new Error(error.message || 'Failed to verify OTP');
        }
    };

    const updateProfile = async (data) => {
        if (!user) throw new Error('No user logged in');

        try {
            // Update Supabase user metadata
            const { error } = await supabase.auth.updateUser({
                data: data
            });

            if (error) throw error;

            // Update local state
            if (profile) {
                setProfile({ ...profile, ...data });
            }

        } catch (error) {
            console.error('Update profile error:', error);
            throw new Error('Failed to update profile');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            session,
            loading,
            emailConfirmed,
            signIn,
            signUp,
            signInWithGoogle,
            signInWithPhone,
            verifyOTP,
            signOut,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
