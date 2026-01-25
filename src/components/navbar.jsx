import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PortalSelector } from '@/components/auth/PortalSelector';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
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
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'
                }`}
        >
            <div className="container mx-auto px-4">
                <div
                    className={`glass-card rounded-2xl px-6 py-4 transition-all duration-300 ${isScrolled ? 'neon-glow' : ''
                        }`}
                >
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center neon-glow"
                            >
                                <Sparkles className="w-6 h-6 text-white" />
                            </motion.div>
                            <span className="text-2xl font-bold gradient-text">Skint Help</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="relative group"
                                >
                                    <span
                                        className={`text-sm font-medium transition-colors ${location.pathname === link.path
                                            ? 'text-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {link.name}
                                    </span>
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
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
                                        <User className="w-4 h-4 text-green-400" />
                                        <span className="text-sm font-medium">{user.email}</span>
                                    </div>
                                    <Button
                                        onClick={() => signOut()}
                                        variant="outline"
                                        size="sm"
                                        className="glass-card border-white/20 hover:bg-white/10"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <PortalSelector>
                                    <Button className="rgb-ring h-10 px-6 font-semibold group">
                                        <span className="relative z-10 flex items-center gap-2 text-white">
                                            Sign In
                                            <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
                                <Menu className="w-6 h-6" />
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
                                                <User className="w-4 h-4 text-green-400" />
                                                <span className="text-sm font-medium">{user.email}</span>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    signOut();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                variant="outline"
                                                className="w-full glass-card border-white/20 hover:bg-white/10"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Sign Out
                                            </Button>
                                        </div>
                                    ) : (
                                        <PortalSelector>
                                            <Button className="w-full rgb-ring h-12 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
                                                <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                                                    Sign In
                                                    <User className="w-4 h-4" />
                                                </span>
                                            </Button>
                                        </PortalSelector>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
