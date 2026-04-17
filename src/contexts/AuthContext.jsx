import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { ENV } from "@/lib/env";
import { sanitizeRole } from "@/lib/role-routes";

const AuthContext = createContext(undefined);

// Valid roles for OAuth/OTP role assignment
const VALID_ROLES = ['admin', 'restaurant', 'worker', 'public'];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [emailConfirmed, setEmailConfirmed] = useState(true);
    // Track sign-out in progress to prevent layouts from rendering stale state
    const [isSigningOut, setIsSigningOut] = useState(false);
    // Track if initial session check is complete
    const [isSessionChecked, setIsSessionChecked] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();

        const initializeAuth = async () => {
            try {
                // Check for admin session on mount
                const adminSession = sessionStorage.getItem('_sh_admin_auth');
                if (adminSession === 'authenticated') {
                    const adminProfile = {
                        id: 'admin-session',
                        email: 'admin@skinthelp.com',
                        name: 'Administrator',
                        role: 'admin',
                    };
                    setProfile(adminProfile);
                    setUser({
                        id: adminProfile.id,
                        email: adminProfile.email,
                        user_metadata: { role: 'admin' }
                    });
                    setLoading(false);
                    setIsSessionChecked(true);
                    return;
                }

                // Check for existing Supabase session
                try {
                    const { data: { session: existingSession }, error } = await supabase.auth.getSession();
                    if (error) {
                        logger.error('Failed to fetch session:', error);
                    }
                    if (existingSession?.user) {
                        setSession(existingSession);
                        setUser(existingSession.user);
                        await fetchProfile(existingSession.user);
                        // fetchProfile now calls setLoading(false) internally,
                        // but call it here too as a safety net
                        setLoading(false);
                    } else {
                        setLoading(false);
                    }
                } catch (err) {
                    logger.error('Session check error:', err);
                    setLoading(false);
                }
                setIsSessionChecked(true);
            } catch (error) {
                logger.error('Auth initialization error:', error);
                setLoading(false);
                setIsSessionChecked(true);
            }
        };

        initializeAuth();

        // Register Supabase auth listener for ongoing changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (abortController.signal.aborted) return;

            // If admin session is active, ignore Supabase auth changes
            const adminSession = sessionStorage.getItem('_sh_admin_auth');
            if (adminSession === 'authenticated') {
                logger.debug('Admin session active, ignoring Supabase auth event:', event);
                return;
            }

            // If signing out, handle the SIGNED_OUT event but ignore others
            if (event === 'SIGNED_OUT') {
                setProfile(null);
                setUser(null);
                setSession(null);
                setEmailConfirmed(true);
                setLoading(false);
                return;
            }

            logger.debug('Auth state changed:', event, currentSession?.user?.email);

            setSession(currentSession);
            setUser(currentSession?.user ?? null);

            if (currentSession?.user) {
                const isConfirmed = currentSession.user.email_confirmed_at !== null;
                setEmailConfirmed(isConfirmed);
                await fetchProfile(currentSession.user);
                // Safety net: ensure loading is cleared even if fetchProfile
                // had an early return that didn't explicitly call setLoading(false)
                setLoading(false);
            } else {
                setProfile(null);
                setEmailConfirmed(true);
                setLoading(false);
            }
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
                    role: sanitizeRole(metaRole),
                };
                setProfile(userProfile);
                // Store role in localStorage for persistence
                localStorage.setItem('userRole', metaRole);
                logger.debug('Profile set:', userProfile);
                // ✅ FIXED: clear loading so routes/layouts stop spinning
                setLoading(false);
                return;
            }

            // If no role in metadata and this is a new user, retry a few times
            if (retryCount < 3) {
                logger.debug(`No role found, retrying... (${retryCount + 1}/3)`);
                await new Promise(resolve => setTimeout(resolve, 500));
                const { data: { user: refreshedUser } } = await supabase.auth.getUser();
                if (refreshedUser) {
                    await fetchProfile(refreshedUser, retryCount + 1);
                    return;
                }
            }

            // If still no role after retries, check localStorage for pending role
            const pendingRole = localStorage.getItem('selectedRole') || localStorage.getItem('pendingRole') || localStorage.getItem('userRole');
            const finalRole = sanitizeRole(pendingRole || 'public');

            logger.debug('No role found after retries, using:', finalRole);
            const defaultProfile = {
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.email?.split('@')[0],
                role: finalRole,
            };
            setProfile(defaultProfile);
            // Store role in localStorage for persistence
            localStorage.setItem('userRole', finalRole);

            // Also update the user metadata so it persists
            try {
                await supabase.auth.updateUser({ data: { role: finalRole } });
            } catch (e) {
                logger.error('Failed to persist role to user metadata:', e);
            }

            // ✅ FIXED: ensure loading is cleared after fallback profile is set
            setLoading(false);

        } catch (error) {
            console.error("Error fetching profile:", error);
            const defaultRole = localStorage.getItem('userRole') || 'public';
            setProfile({
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.email?.split('@')[0] || '',
                role: defaultRole,
            });
            // ✅ FIXED: ensure loading clears even on error so UI doesn't hang
            setLoading(false);
        }
    };

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            // Normal Supabase Login
            // First, get the selected role from localStorage (set during portal selection)
            const selectedRole = localStorage.getItem('selectedRole');

            const { error, data } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // If login succeeded and we have a selected role, update user metadata
            // This ensures the Supabase session reflects the portal the user chose
            if (selectedRole && data?.user) {
                const currentRole = data.user.user_metadata?.role;
                if (currentRole !== selectedRole) {
                    logger.debug('Updating user role from', currentRole, 'to', selectedRole);
                    await supabase.auth.updateUser({
                        data: { role: selectedRole }
                    });
                }
                // Also store the role in localStorage for persistence
                localStorage.setItem('userRole', selectedRole);
            }

            // NOTE: Do NOT set loading=false here for Supabase login!
            // The onAuthStateChange handler will set loading=false AFTER fetchProfile completes.
            // Setting it here causes a race condition where the layout sees loading=false
            // but profile is still null, causing an unwanted redirect.

        } catch (error) {
            // Only set loading=false on error — success is handled by onAuthStateChange
            setLoading(false);
            console.error('Sign in error:', error);
            throw new Error(error.message || 'Failed to sign in');
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
                        ...userData
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) throw error;

            if (data.user && !data.session) {
                setEmailConfirmed(false);
                const confirmError = new Error('Please check your email to confirm your account before signing in.');
                confirmError.code = 'EMAIL_CONFIRMATION_REQUIRED';
                throw confirmError;
            }

            if (data.user && data.session) {
                setEmailConfirmed(true);
            }

        } catch (error) {
            console.error('Sign up error:', error);
            throw new Error(error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        // Set signing-out flag FIRST so layouts know not to render stale UI
        setIsSigningOut(true);

        try {
            // Clear state synchronously BEFORE async Supabase call
            // This ensures React re-renders with null state immediately
            setProfile(null);
            setUser(null);
            setSession(null);
            setLoading(false);

            // Sign out from Supabase (ignore errors if no real session)
            try {
                await supabase.auth.signOut();
            } catch (e) {
                logger.debug('Supabase signOut error:', e);
            }

            // Clear all auth-related storage
            sessionStorage.removeItem('_sh_admin_auth');
            localStorage.removeItem('selectedRole');
            localStorage.removeItem('pendingRole');
            localStorage.removeItem('userRole');

            // Also clear any supabase-related keys from localStorage
            const supabaseKeys = Object.keys(localStorage).filter(
                key => key.startsWith('sb-') || key.startsWith('supabase.')
            );
            supabaseKeys.forEach(key => localStorage.removeItem(key));

        } catch (error) {
            console.error('Sign out error:', error);
            // Still clear state even on error so the user isn't stuck
            setProfile(null);
            setUser(null);
            setSession(null);
            setLoading(false);
            throw new Error('Failed to sign out');
        } finally {
            setIsSigningOut(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const selectedRole = localStorage.getItem('selectedRole') || 'public';
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

            localStorage.setItem('pendingRole', validatedRole);
        } catch (error) {
            console.error('Google sign in error:', error);
            throw new Error(error.message || 'Failed to sign in with Google');
        }
    };

    const signInWithPhone = async (phone) => {
        try {
            const { error } = await supabase.auth.signInWithOtp({ phone });
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
            const validatedRole = VALID_ROLES.includes(selectedRole) ? selectedRole : 'public';

            const { error: verifyError } = await supabase.auth.verifyOtp({
                phone, token: otp, type: 'sms',
            });

            if (verifyError) throw verifyError;

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
            const { error } = await supabase.auth.updateUser({ data });
            if (error) throw error;

            if (profile) {
                setProfile({ ...profile, ...data });
            }
        } catch (error) {
            console.error('Update profile error:', error);
            throw new Error('Failed to update profile');
        }
    };

    /**
     * Single-owner admin sign-in.
     * Checks VITE_ADMIN_ID and VITE_ADMIN_PASSWORD from env.
     * No signup, no database, no multi-user — only one admin exists.
     *
     * Security:
     *  - Max 3 failed attempts → 10-minute lockout (stored in sessionStorage)
     *  - Session stored in sessionStorage (auto-clears on tab/browser close)
     *  - Credentials never logged or stored anywhere
     */
    const signInAsAdmin = async (adminId, password) => {
        const LOCKOUT_KEY  = '_sh_adm_lock';
        const ATTEMPTS_KEY = '_sh_adm_att';
        const MAX_ATTEMPTS = 3;
        const LOCKOUT_MS   = 10 * 60 * 1000; // 10 minutes

        // ── Lockout check ──────────────────────────────────────────
        const lockoutUntil = sessionStorage.getItem(LOCKOUT_KEY);
        if (lockoutUntil && Date.now() < parseInt(lockoutUntil, 10)) {
            const remaining = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 60000);
            throw new Error(`Too many failed attempts. Try again in ${remaining} minute(s).`);
        }

        // ── Credential validation ───────────────────────────────────
        const validId  = ENV.ADMIN_ID;
        const validPwd = ENV.ADMIN_PASSWORD;

        if (!validId || !validPwd) {
            throw new Error('Admin credentials are not configured on this server.');
        }

        const credentialsMatch = (adminId === validId) && (password === validPwd);

        if (!credentialsMatch) {
            const prev     = parseInt(sessionStorage.getItem(ATTEMPTS_KEY) || '0', 10);
            const attempts = prev + 1;
            sessionStorage.setItem(ATTEMPTS_KEY, String(attempts));

            if (attempts >= MAX_ATTEMPTS) {
                // Trigger lockout
                sessionStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS));
                sessionStorage.removeItem(ATTEMPTS_KEY);
                throw new Error(`Maximum attempts reached. Access locked for 10 minutes.`);
            }

            const left = MAX_ATTEMPTS - attempts;
            throw new Error(`Invalid credentials. ${left} attempt${left === 1 ? '' : 's'} remaining.`);
        }

        // ── Success ─────────────────────────────────────────────────
        sessionStorage.removeItem(ATTEMPTS_KEY);
        sessionStorage.removeItem(LOCKOUT_KEY);

        // Store session — cleared automatically on tab close
        sessionStorage.setItem('_sh_admin_auth', 'authenticated');

        const adminProfile = {
            id:    'admin-owner',
            email: 'admin@skinthelp.com',
            name:  'Administrator',
            role:  'admin',
        };

        setProfile(adminProfile);
        setUser({
            id:             adminProfile.id,
            email:          adminProfile.email,
            user_metadata:  { role: 'admin' },
        });
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            session,
            loading,
            emailConfirmed,
            isSigningOut,
            isSessionChecked,
            signIn,
            signUp,
            signInWithGoogle,
            signInWithPhone,
            verifyOTP,
            signOut,
            updateProfile,
            signInAsAdmin,
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
