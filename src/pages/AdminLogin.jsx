import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock, Eye, EyeOff, Loader2, ShieldCheck,
    AlertTriangle, User, Timer
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─── constants ────────────────────────────────────────────────────────────────
const MAX_ATTEMPTS  = 3;
const LOCKOUT_KEY   = '_sh_adm_lock';
const ATTEMPTS_KEY  = '_sh_adm_att';

// ─── helpers ──────────────────────────────────────────────────────────────────
function getLockoutRemaining() {
    const until = sessionStorage.getItem(LOCKOUT_KEY);
    if (!until) return 0;
    const ms = parseInt(until, 10) - Date.now();
    return ms > 0 ? Math.ceil(ms / 1000) : 0;
}

function getAttempts() {
    return parseInt(sessionStorage.getItem(ATTEMPTS_KEY) || '0', 10);
}

// ─── component ────────────────────────────────────────────────────────────────
export default function AdminLogin() {
    const navigate  = useNavigate();
    const { signInAsAdmin, profile } = useAuth();

    const [adminId,      setAdminId]      = useState('');
    const [password,     setPassword]     = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading,    setIsLoading]    = useState(false);
    const [error,        setError]        = useState('');
    const [shake,        setShake]        = useState(false);
    const [attempts,     setAttempts]     = useState(getAttempts);
    const [lockSecs,     setLockSecs]     = useState(getLockoutRemaining);

    const idRef  = useRef(null);
    const isLocked = lockSecs > 0;

    // If already authenticated, redirect immediately
    useEffect(() => {
        if (profile?.role === 'admin') {
            navigate('/sysadmin/dashboard', { replace: true });
        }
    }, [profile, navigate]);

    // Focus the ID field on mount
    useEffect(() => {
        idRef.current?.focus();
    }, []);

    // Countdown timer for lockout
    useEffect(() => {
        if (!isLocked) return;
        const id = setInterval(() => {
            const remaining = getLockoutRemaining();
            setLockSecs(remaining);
            if (remaining <= 0) {
                clearInterval(id);
                setAttempts(0);
                setError('');
            }
        }, 1000);
        return () => clearInterval(id);
    }, [isLocked]);

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 600);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!adminId.trim() || !password.trim() || isLocked) return;

        setIsLoading(true);
        setError('');

        try {
            await signInAsAdmin(adminId.trim(), password);
            // On success AuthContext sets profile — the useEffect above navigates
        } catch (err) {
            const msg = err.message || 'Authentication failed';
            setError(msg);
            setAttempts(getAttempts());
            setLockSecs(getLockoutRemaining());
            setPassword('');
            triggerShake();
        } finally {
            setIsLoading(false);
        }
    };

    const attemptsLeft = Math.max(0, MAX_ATTEMPTS - attempts);

    // ── render ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#080810] relative overflow-hidden">

            {/* ── Subtle background grid ── */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                }}
            />

            {/* ── Glow orbs ── */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-600/4 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] bg-blue-700/5 rounded-full blur-2xl pointer-events-none" />

            {/* ── Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0,  scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[420px] relative z-10"
            >
                <motion.div
                    animate={shake ? { x: [-10, 10, -7, 7, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/8"
                        style={{ background: 'rgba(12, 12, 20, 0.92)', backdropFilter: 'blur(24px)' }}
                    >
                        {/* Top accent stripe */}
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent" />

                        <div className="px-9 pt-9 pb-8 space-y-7">

                            {/* ── Header ── */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center border border-cyan-500/25"
                                    style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(37,99,235,0.15))' }}
                                >
                                    <ShieldCheck className="w-7 h-7 text-cyan-400" />
                                </div>
                                <h1 className="text-xl font-semibold text-white tracking-tight">
                                    System Access
                                </h1>
                                <p className="text-white/35 text-xs mt-1.5 leading-relaxed">
                                    Restricted area — authorised personnel only
                                </p>
                            </div>

                            {/* ── Lockout banner ── */}
                            <AnimatePresence>
                                {isLocked && (
                                    <motion.div
                                        key="lockout"
                                        initial={{ opacity: 0, y: -6, height: 0 }}
                                        animate={{ opacity: 1, y: 0,  height: 'auto' }}
                                        exit={{   opacity: 0, y: -6, height: 0 }}
                                        className="flex items-center gap-3 p-3.5 rounded-xl border border-amber-500/25 bg-amber-500/10"
                                    >
                                        <Timer className="w-4 h-4 text-amber-400 shrink-0" />
                                        <div>
                                            <p className="text-xs font-semibold text-amber-400">Access Locked</p>
                                            <p className="text-xs text-amber-400/70 mt-0.5">
                                                Try again in{' '}
                                                <span className="font-mono font-bold">
                                                    {Math.floor(lockSecs / 60)}:{String(lockSecs % 60).padStart(2, '0')}
                                                </span>
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── Form ── */}
                            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

                                {/* Admin ID */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
                                        Admin ID
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-white/25 pointer-events-none" />
                                        <Input
                                            ref={idRef}
                                            type="text"
                                            value={adminId}
                                            onChange={(e) => { setAdminId(e.target.value); setError(''); }}
                                            placeholder="Enter your admin ID"
                                            className="h-11 pl-10 bg-white/4 border-white/10 text-white text-sm placeholder:text-white/20 focus:border-cyan-500/50 rounded-xl transition-all"
                                            disabled={isLoading || isLocked}
                                            autoComplete="off"
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/25 pointer-events-none" />
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                            placeholder="Enter your password"
                                            className="h-11 pl-10 pr-11 bg-white/4 border-white/10 text-white text-sm placeholder:text-white/20 focus:border-cyan-500/50 rounded-xl transition-all"
                                            disabled={isLoading || isLocked}
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(v => !v)}
                                            className="absolute right-3.5 top-3.5 text-white/25 hover:text-white/60 transition-colors"
                                            tabIndex={-1}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword
                                                ? <EyeOff className="w-4 h-4" />
                                                : <Eye    className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error / attempts warning */}
                                <AnimatePresence>
                                    {error && !isLocked && (
                                        <motion.div
                                            key="error"
                                            initial={{ opacity: 0, y: -6, height: 0 }}
                                            animate={{ opacity: 1, y: 0,  height: 'auto' }}
                                            exit={{   opacity: 0, y: -6, height: 0 }}
                                            className="flex items-start gap-2.5 p-3 rounded-xl border border-red-500/20 bg-red-500/8"
                                        >
                                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-xs text-red-400 leading-relaxed">{error}</p>
                                                {attempts > 0 && attemptsLeft > 0 && (
                                                    <div className="flex gap-1 mt-2">
                                                        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`h-1 flex-1 rounded-full transition-colors ${
                                                                    i < attemptsLeft
                                                                        ? 'bg-red-400/60'
                                                                        : 'bg-white/10'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    disabled={isLoading || isLocked || !adminId.trim() || !password.trim()}
                                    className="w-full h-11 font-semibold text-sm rounded-xl transition-all shadow-lg disabled:opacity-35 disabled:cursor-not-allowed mt-1"
                                    style={{
                                        background: 'linear-gradient(135deg, #0891b2, #1d4ed8)',
                                        boxShadow: '0 4px 24px rgba(6,182,212,0.2)',
                                    }}
                                >
                                    {isLoading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : isLocked
                                            ? 'Access Locked'
                                            : 'Sign In'
                                    }
                                </Button>
                            </form>
                        </div>

                        {/* Bottom rule */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    </div>

                    {/* Back link — intentionally unlabelled */}
                    <p className="text-center mt-5">
                        <button
                            onClick={() => navigate('/')}
                            className="text-white/18 hover:text-white/40 text-xs transition-colors"
                        >
                            ← Return
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
