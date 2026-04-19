import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { User, Lock, Eye, EyeOff, Loader2, Mail, ArrowRight, Sparkles, Shield, Utensils, Users as UsersIcon, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
    // Get portal type from URL params
    const { portalType } = useParams();
    const navigate = useNavigate();
    const { signIn, signUp } = useAuth();

    // Portal Selection State
    const [selectedPortal, setSelectedPortal] = useState(portalType || null);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Refs
    const cardRef = useRef(null);

    // Auth Handler
    const handleAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isSignUp) {
                try {
                    await signUp(email, password, { role: selectedPortal || 'public' });
                    // If we get here, signup was successful and email confirmation is disabled
                    toast.success('Account created successfully! You can now sign in.');
                    setTimeout(() => {
                        setIsSignUp(false);
                        setEmail('');
                        setPassword('');
                    }, 1000);
                } catch (signupError) {
                    // Check if it's an email confirmation error using stable code
                    if (signupError.code === 'EMAIL_CONFIRMATION_REQUIRED') {
                        toast.info(signupError.message, { duration: 6000 });
                        toast.info('After confirming, return here to sign in.', { duration: 6000 });
                        setIsSignUp(false);
                        setPassword(''); // Clear password
                    } else {
                        throw signupError;
                    }
                }
            } else {
                await signIn(email, password);
                toast.success('Welcome back!');
                // Navigate to role-specific dashboard
                setTimeout(() => {
                    const roleRoutes = {
                        'admin': '/sysadmin/dashboard',
                        'restaurant': '/restaurant/dashboard',
                        'worker': '/worker/dashboard',
                        'public': '/customer/dashboard'
                    };
                    const finalRole = selectedPortal === 'owner' ? 'admin' : selectedPortal;
                    const redirectPath = roleRoutes[finalRole] || '/';
                    navigate(redirectPath);
                }, 500);
            }
        } catch (error) {
            toast.error(error.message || 'Authentication failed');
            setIsLoading(false);
        }
    };


    // Update selected portal if URL param changes
    useEffect(() => {
        if (portalType) {
            setSelectedPortal(portalType);
        }
    }, [portalType]);

    const portals = [
        {
            id: 'restaurant',
            name: 'Restaurant Portal',
            icon: <Utensils className="w-10 h-10" />,
            description: 'Manage donations, schedule pickups, and track your impact',
            color: 'from-orange-500 to-red-500',
            shadow: 'shadow-orange-500/20',
            glow: 'group-hover:shadow-orange-500/50'
        },
        {
            id: 'worker',
            name: 'Volunteer Portal',
            icon: <MapPin className="w-10 h-10" />,
            description: 'Find delivery routes, log hours, and see your contribution',
            color: 'from-green-500 to-emerald-500',
            shadow: 'shadow-green-500/20',
            glow: 'group-hover:shadow-green-500/50'
        },
        {
            id: 'public',
            name: 'Customer Portal',
            icon: <UsersIcon className="w-10 h-10" />,
            description: 'Request food assistance, find nearby centers, and track orders',
            color: 'from-purple-500 to-pink-500',
            shadow: 'shadow-purple-500/20',
            glow: 'group-hover:shadow-purple-500/50'
        },
    ];

    const handlePortalSelect = (portalId) => {
        if (!portalId) {
            toast.error('Invalid portal selected');
            return;
        }
        setSelectedPortal(portalId);
    };

    const handleBackToPortals = () => {
        setSelectedPortal(null);
    };

    const currentPortal = portals.find(p => p.id === (selectedPortal === 'owner' ? 'admin' : selectedPortal));

    if (selectedPortal && !currentPortal) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Portal Not Found</h2>
                    <Button onClick={() => setSelectedPortal(null)} className="bg-white/10 hover:bg-white/20">
                        Back to Portal Selection
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0a]">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
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
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-1000 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <AnimatePresence mode="wait">
                    {!selectedPortal ? (
                        /* VIEW 1: Portal Selection */
                        <motion.div
                            key="portal-selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="text-center mb-12">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-block"
                                >
                                    <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/80 backdrop-blur-md mb-4 inline-block">
                                        Welcome to Skint Help
                                    </span>
                                </motion.div>
                                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                                    Choose Your <span className="text-[#DBEBC0]">Portal</span>
                                </h1>
                                <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">
                                    Select your role to access the dedicated dashboard and tools.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {portals.map((portal, index) => (
                                    <motion.div
                                        key={portal.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 + 0.3 }}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        className="perspective-1000"
                                    >
                                        <button
                                            onClick={() => handlePortalSelect(portal.id)}
                                            className={`w-full h-full text-left group relative`}
                                        >
                                            <div className={`
                        relative h-full p-8 rounded-3xl border border-white/10 
                        backdrop-blur-xl bg-black/40 overflow-hidden transition-all duration-500
                        ${portal.glow} hover:border-white/20 hover:bg-white/5
                      `}>
                                                {/* Hover Gradient Background */}
                                                <div className={`
                          absolute inset-0 bg-gradient-to-br ${portal.color} opacity-0 
                          group-hover:opacity-10 transition-opacity duration-500
                        `} />

                                                <div className={`
                          w-16 h-16 rounded-2xl bg-gradient-to-br ${portal.color} 
                          flex items-center justify-center text-white mb-6
                          shadow-lg group-hover:scale-110 transition-transform duration-500
                        `}>
                                                    {portal.icon}
                                                </div>

                                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                                                    {portal.name}
                                                </h3>
                                                <p className="text-white/50 text-sm leading-relaxed">
                                                    {portal.description}
                                                </p>

                                                <div className="mt-6 flex items-center text-sm font-medium text-white/40 group-hover:text-white transition-colors">
                                                    Enter Portal <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        /* VIEW 2: Login Form */
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-md mx-auto"
                        >
                            <div className="mb-8">
                                <button
                                    onClick={handleBackToPortals}
                                    className="text-white/50 hover:text-white flex items-center gap-2 transition-colors"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" /> Back to Portals
                                </button>
                            </div>

                            <div className="relative group perspective-1000">
                                {/* Neon Glow under card */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${currentPortal?.color || 'from-white to-gray-500'} rounded-3xl opacity-20 group-hover:opacity-40 blur transition duration-500`} />

                                <div
                                    ref={cardRef}
                                    className="relative p-8 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10"
                                >
                                    <div className="text-center mb-8">
                                        <div className={`
                      w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${currentPortal?.color} 
                      flex items-center justify-center text-white mb-6 shadow-xl
                    `}>
                                            {currentPortal?.icon}
                                        </div>
                                        <h2 className="text-3xl font-bold text-white mb-2">{currentPortal?.name}</h2>
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
                                            className={`w-full h-14 mt-4 text-base font-bold bg-gradient-to-r ${currentPortal?.color} hover:opacity-90 transition-all rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
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

                                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                        <button
                                            onClick={() => setIsSignUp(!isSignUp)}
                                            className="text-white/60 hover:text-white text-sm transition-colors"
                                        >
                                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
