import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { signInAsAdmin } = useAuth();

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            await signInAsAdmin(password);
            toast.success('Access granted');
            navigate('/cp/dashboard', { replace: true });
        } catch (err) {
            setError(err.message || 'Authentication failed');
            setShake(true);
            setPassword('');
            setTimeout(() => setShake(false), 600);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0f] relative overflow-hidden">
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10"
            >
                <motion.div
                    animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Card */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl">
                        {/* Top accent line */}
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent" />

                        <div className="p-10">
                            {/* Icon */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                                    <ShieldCheck className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">System Access</h1>
                                <p className="text-white/40 text-sm mt-1">Restricted area — authorised personnel only</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                                        Access Key
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                                        <Input
                                            ref={inputRef}
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="Enter access key"
                                            className="h-12 pl-11 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:bg-white/8 transition-all rounded-xl"
                                            disabled={isLoading}
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-3.5 text-white/30 hover:text-white/70 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -8, height: 0 }}
                                            className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                                        >
                                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                            <p className="text-xs text-red-400 leading-relaxed">{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Button
                                    type="submit"
                                    disabled={isLoading || !password.trim()}
                                    className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/25"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Authenticate'
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* Bottom accent */}
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    </div>

                    {/* Subtle back link — no label hinting at what this is */}
                    <p className="text-center mt-6">
                        <button
                            onClick={() => navigate('/')}
                            className="text-white/20 hover:text-white/40 text-xs transition-colors"
                        >
                            ← Return
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
