import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Utensils, Users as UsersIcon, MapPin, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Login() {
    const navigate = useNavigate();
    const { signIn, signUp, signInWithGoogle, signInWithPhone, verifyOTP } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    // Load selected role from localStorage
    useEffect(() => {
        const role = localStorage.getItem('selectedRole');
        if (!role) {
            // If no role selected, redirect to role selection
            navigate('/select-role');
            return;
        }
        setSelectedRole(role);
    }, [navigate]);

    const portals = [
        {
            id: 'public',
            name: 'Public Receiver',
            icon: <UsersIcon className="w-10 h-10" />,
            color: 'from-green-500 to-emerald-500',
        },
        {
            id: 'restaurant',
            name: 'Restaurant Partner',
            icon: <Utensils className="w-10 h-10" />,
            color: 'from-orange-500 to-red-500',
        },
        {
            id: 'worker',
            name: 'Delivery Worker',
            icon: <MapPin className="w-10 h-10" />,
            color: 'from-cyan-500 to-blue-500',
        },
        {
            id: 'admin',
            name: 'Admin / Owner',
            icon: <Shield className="w-10 h-10" />,
            color: 'from-purple-500 to-pink-500',
        }
    ];

    const currentPortal = portals.find(p => p.id === selectedRole);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }
        if (password.length < 3) {
            toast.error('Password must be at least 3 characters long');
            return;
        }

        setIsLoading(true);
        try {
            if (isSignUp) {
                // Map portal type to role
                const mappedRole = selectedRole === 'owner' ? 'admin' : selectedRole;
                await signUp(email, password, { role: mappedRole as any });
                toast.success('Account created successfully!');
            } else {
                await signIn(email, password);
                toast.success('Welcome back!');
            }

            // Clear selected role from localStorage after successful login
            localStorage.removeItem('selectedRole');

            // Redirect to dashboard
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } catch (error: any) {
            toast.error(error.message || 'Authentication failed. Please try again.');
            setIsLoading(false);
        }
    };

    const quickLogin = async () => {
        if (!selectedRole) return;

        const demoCredentials: Record<string, { email: string; password: string }> = {
            admin: { email: 'admin@skinthelp.com', password: 'admin123' },
            restaurant: { email: 'restaurant@skinthelp.com', password: 'rest123' },
            worker: { email: 'worker@skinthelp.com', password: 'worker123' },
            public: { email: 'public@skinthelp.com', password: 'public123' },
        };

        const creds = demoCredentials[selectedRole];
        if (!creds) return;

        setIsLoading(true);
        try {
            await signIn(creds.email, creds.password);
            toast.success('Welcome!');
            localStorage.removeItem('selectedRole');
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } catch (error: any) {
            toast.error('Login failed');
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            // Redirect happens automatically via OAuth
        } catch (error: any) {
            toast.error(error.message || 'Google sign-in failed');
            setIsLoading(false);
        }
    };

    const handlePhoneSignIn = async (phone: string) => {
        setIsLoading(true);
        try {
            await signInWithPhone(phone);
            setIsLoading(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to send OTP');
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        localStorage.removeItem('selectedRole');
        navigate('/select-role');
    };

    if (!currentPortal) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-white/40 animate-spin mx-auto mb-4" />
                    <p className="text-white/50">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0a]">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-white/10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse delay-1000 pointer-events-none" />

            {/* Floating Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={handleBack}
                className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all backdrop-blur-md group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Portals</span>
            </motion.button>

            {/* Floating Home Button */}
            <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => navigate('/')}
                className="fixed top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all backdrop-blur-md group"
            >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Home</span>
            </motion.button>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-md mx-auto"
                >
                    <div className="relative group perspective-1000">
                        {/* Neon Glow under card */}
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${currentPortal.color} rounded-3xl opacity-20 group-hover:opacity-40 blur transition duration-500`} />

                        <div className="relative p-8 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10">
                            <div className="text-center mb-8">
                                <div className={`
                  w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${currentPortal.color} 
                  flex items-center justify-center text-white mb-6 shadow-xl
                `}>
                                    {currentPortal.icon}
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">{currentPortal.name}</h2>
                                <p className="text-white/50">{isSignUp ? 'Create your account' : 'Sign in to dashboard'}</p>
                            </div>

                            <form onSubmit={handleAuth} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">Email</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-white/40 group-focus-within/input:text-white transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/30 focus:bg-white/10 transition-all rounded-xl"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/60 uppercase tracking-wider ml-1">Password</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-white/40 group-focus-within/input:text-white transition-colors" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/30 focus:bg-white/10 transition-all rounded-xl"
                                            required
                                            disabled={isLoading}
                                            minLength={3}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-3.5 text-white/40 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full h-14 mt-4 text-base font-bold bg-gradient-to-r ${currentPortal.color} hover:opacity-90 transition-all rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            {isSignUp ? 'Create Account' : 'Access Portal'}
                                            <ArrowRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            {/* Google Sign-In Option - Temporarily disabled until OAuth is configured */}
                            {/* Uncomment after setting up Google OAuth in Supabase Dashboard */}
                            {/* 
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-black/80 px-2 text-white/40">Or continue with</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading}
                                    className="mt-4 w-full h-12 flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Sign in with Google
                                </button>
                            </div>
                            */}

                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-white/60 hover:text-white text-sm transition-colors"
                                    disabled={isLoading}
                                >
                                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                                </button>
                            </div>
                        </div>

                        {/* Quick Demo Login Option for Testing */}
                        {!isSignUp && (
                            <div className="mt-8 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                                <p className="text-xs text-center text-white/40 mb-3 uppercase tracking-widest">Dev / Demo Mode</p>
                                <button
                                    type="button"
                                    onClick={quickLogin}
                                    disabled={isLoading}
                                    className="w-full py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-medium transition-all disabled:opacity-50"
                                >
                                    Auto-fill & Login as {currentPortal.name}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
