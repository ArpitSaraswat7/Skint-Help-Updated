import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EnvelopeSimple, Phone, MapPin, Heart, FacebookLogo, TwitterLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'How It Works', path: '/how-it-works' },
            { name: 'Impact', path: '/impact' },
            { name: 'Food Map', path: '/food-map' },
            { name: 'Join Us', path: '/join-us' },
            { name: 'Contact', path: '/contact' },
        ],
        company: [
            { name: 'About Us' },
            { name: 'Our Team' },
            { name: 'Careers' },
            { name: 'Press' },
        ],
        resources: [
            { name: 'Blog' },
            { name: 'Help Center' },
            { name: 'Privacy Policy' },
            { name: 'Terms of Service' },
        ],
    };

    const socialLinks = [
        { icon: <FacebookLogo className="w-5 h-5" />, url: '#', name: 'Facebook' },
        { icon: <TwitterLogo className="w-5 h-5" />, url: '#', name: 'Twitter' },
        { icon: <InstagramLogo className="w-5 h-5" />, url: '#', name: 'Instagram' },
        { icon: <LinkedinLogo className="w-5 h-5" />, url: '#', name: 'LinkedIn' },
    ];

    return (
        <footer className="relative mt-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Main Footer Content */}
                <div className="glass-premium rounded-3xl p-8 md:p-12 mb-8 noise-overlay">
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <Link to="/" className="flex items-center gap-3 mb-4 group">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-black/20"
                                >
                                    <img
                                        src="/New logo.png"
                                        alt="Skint Help Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                <span className="text-2xl font-bold gradient-text">Skint Help</span>
                            </Link>
                            <p className="text-white mb-6 max-w-sm">
                                Connecting restaurants with surplus food to people in need through our network of collection centers and volunteers.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <a href="mailto:arpitsaraswat80@gmail.com" className="flex items-center gap-3 text-sm text-white hover:text-white/80 transition-colors group">
                                    <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center group-hover:neon-glow transition-all">
                                        <EnvelopeSimple className="w-4 h-4 text-white" />
                                    </div>
                                    arpitsaraswat80@gmail.com
                                </a>
                                <a href="tel:+917668703965" className="flex items-center gap-3 text-sm text-white hover:text-white/80 transition-colors group">
                                    <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center group-hover:neon-glow transition-all">
                                        <Phone className="w-4 h-4 text-white" />
                                    </div>
                                    +91 7668703965
                                </a>
                                <div className="flex items-center gap-3 text-sm text-white">
                                    <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-white" />
                                    </div>
                                    Mathura, Uttar Pradesh, India
                                </div>
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div>
                            <h3 className="font-semibold mb-4 text-white">Product</h3>
                            <ul className="space-y-2">
                                {footerLinks.product.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-sm text-white hover:text-white/80 hover:translate-x-1 inline-block transition-all"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-white">Company</h3>
                            <ul className="space-y-2">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <span className="text-sm text-white/40 cursor-default">
                                            {link.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-white">Resources</h3>
                            <ul className="space-y-2">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <span className="text-sm text-white/40 cursor-default">
                                            {link.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[#DBEBC0]/30 to-transparent mb-8" />

                    {/* Bottom Row */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <p className="text-sm text-white flex items-center gap-2">
                            © {currentYear} Skint Help. Made with{' '}
                            <Heart className="w-4 h-4 text-red-500" weight="fill" />
                            for a better world
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-lg glass-card flex items-center justify-center soft-glow-hover transition-all group"
                                    aria-label={social.name}
                                >
                                    <span className="text-white group-hover:text-white/80 transition-colors">
                                        {social.icon}
                                    </span>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "100px" }}
                    className="text-center pb-8"
                >
                    <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-white">
                            Proudly fighting food waste since 2024
                        </span>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
