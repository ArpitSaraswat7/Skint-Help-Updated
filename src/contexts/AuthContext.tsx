import { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'restaurant' | 'worker' | 'public' | 'customer';
  phone?: string;
  center_id?: string;
  restaurant_id?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// DEMO ACCOUNTS - Retained for dev/testing fallback if Supabase fails or specific demo login is used
export const DEMO_ACCOUNTS = {
  'admin@skinthelp.com': {
    password: 'admin123',
    profile: {
      id: 'admin-001',
      email: 'admin@skinthelp.com',
      name: 'Admin User',
      role: 'admin' as const,
    }
  },
  'restaurant@skinthelp.com': {
    password: 'rest123',
    profile: {
      id: 'rest-001',
      email: 'restaurant@skinthelp.com',
      name: 'Restaurant Owner',
      role: 'restaurant' as const,
      restaurant_id: 'restaurant-001',
    }
  },
  'worker@skinthelp.com': {
    password: 'worker123',
    profile: {
      id: 'worker-001',
      email: 'worker@skinthelp.com',
      name: 'Collection Worker',
      role: 'worker' as const,
      center_id: 'center-001',
    }
  },
  'public@skinthelp.com': {
    password: 'public123',
    profile: {
      id: 'public-001',
      email: 'public@skinthelp.com',
      name: 'Public User',
      role: 'public' as const,
    }
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for existing session from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch profile
        await fetchProfile(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (currentUser: User) => {
    try {
      // First try to get from user_metadata (most reliable for simple role storage)
      const metaRole = currentUser.user_metadata?.role;
      const metaName = currentUser.user_metadata?.name;

      if (metaRole) {
        setProfile({
          id: currentUser.id,
          email: currentUser.email!,
          name: metaName,
          role: metaRole,
          // Add other fields if stored in metadata
        });
        return;
      }

      // If not in metadata, could fetch from a 'profiles' table if it existed
      // For now, we'll default to 'public' if no role is found
      setProfile({
        id: currentUser.id,
        email: currentUser.email!,
        role: 'public',
      });

    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Check for demo accounts FIRST for dev ease
      const demoAccount = DEMO_ACCOUNTS[email.toLowerCase() as keyof typeof DEMO_ACCOUNTS];
      if (demoAccount && demoAccount.password === password) {
        // Use demo login logic (mock)
        const mockProfile = { ...demoAccount.profile };
        setProfile(mockProfile);
        setUser({
          id: mockProfile.id,
          email: mockProfile.email,
          user_metadata: { role: mockProfile.role }
        } as User);
        localStorage.setItem('demo_mode', 'true');
        setLoading(false);
        return;
      }

      // Normal Supabase Login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
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
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Profile update will be handled by onAuthStateChange
      }

    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();

      // Clear all auth-related storage
      localStorage.removeItem('demo_mode');
      localStorage.removeItem('selectedRole');
      setProfile(null);
      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const selectedRole = localStorage.getItem('selectedRole') || 'public';

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

      // Store role for callback to use
      localStorage.setItem('pendingRole', selectedRole);
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;
      toast.success('OTP sent to your phone!');
    } catch (error: any) {
      console.error('Phone sign in error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const selectedRole = localStorage.getItem('selectedRole') || 'public';

      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      // Update user metadata with role
      await supabase.auth.updateUser({
        data: { role: selectedRole }
      });

      toast.success('Phone verified successfully!');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      throw new Error(error.message || 'Failed to verify OTP');
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
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

    } catch (error: any) {
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
