import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X, UserCircle, SignOut } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PortalSelector } from '@/components/auth/PortalSelector';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Food Map', path: '/food-map' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'Impact', path: '/impact' },
        { name: 'Join Us', path: '/join-us' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 py-4"
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-black/20"
                        >
                            <img
                                src="/New logo.png"
                                alt="Skint Help Logo"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <span className="text-2xl font-bold gradient-text">Skint Help</span>
                    </Link>


                    {/* Desktop Navigation - Dock Style */}
                    <div className="hidden lg:flex items-center gap-2 bg-black/20 backdrop-blur-xl backdrop-saturate-150 border border-white/10 rounded-2xl px-4 py-2 shadow-[0px_0.5px_1px_0px_rgba(255,255,255,0.1)_inset,0px_1px_0px_0px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/15">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="relative group px-4 py-2 rounded-xl transition-all duration-200 hover:bg-white/10"
                            >
                                <span
                                    className={`text-sm font-medium transition-all duration-300 ${location.pathname === link.path
                                        ? 'text-[#DBEBC0] text-glow'
                                        : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </span>
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="activeNavIndicator"
                                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-[#DBEBC0] to-[#a8d48a] rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
                                    <UserCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-sm font-medium">{user.email}</span>
                                </div>
                                <Button
                                    onClick={async () => {
                                        await signOut();
                                        navigate('/select-role', { replace: true });
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="glass-card border-white/20 hover:bg-white/10"
                                >
                                    <SignOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <PortalSelector>
                                <Button className="rgb-ring h-10 px-6 font-semibold group">
                                    <span className="relative z-10 flex items-center gap-2 text-white">
                                        Sign In
                                        <UserCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </span>
                                </Button>
                            </PortalSelector>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden glass-card p-2 rounded-lg"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <List className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden mt-4 glass-card rounded-2xl overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.path}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block py-2 px-4 rounded-lg transition-colors ${location.pathname === link.path
                                            ? 'bg-white/10 text-foreground font-semibold'
                                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="pt-4 border-t border-white/10">
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="glass-card px-4 py-3 rounded-lg flex items-center gap-2">
                                            <UserCircle className="w-4 h-4 text-green-400" />
                                            <span className="text-sm font-medium">{user.email}</span>
                                        </div>
                                        <Button
                                            onClick={async () => {
                                                await signOut();
                                                setIsMobileMenuOpen(false);
                                                navigate('/select-role', { replace: true });
                                            }}
                                            variant="outline"
                                            className="w-full glass-card border-white/20 hover:bg-white/10"
                                        >
                                            <SignOut className="w-4 h-4 mr-2" />
                                            Sign Out
                                        </Button>
                                    </div>
                                ) : (
                                    <PortalSelector onOpenChange={(isOpen) => {
                                        if (!isOpen) setIsMobileMenuOpen(false);
                                    }}>
                                        <Button className="w-full rgb-ring h-12 font-semibold">
                                            <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                                                Sign In
                                                <UserCircle className="w-4 h-4" />
                                            </span>
                                        </Button>
                                    </PortalSelector>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
