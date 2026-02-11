import { motion } from 'framer-motion';
import { MapPin, Package, Clock, Bell, Sparkles, Navigation, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PublicFoodMap() {
    const [email, setEmail] = useState('');

    const handleNotifyMe = (e) => {
        e.preventDefault();
        if (email) {
            toast.success('Thanks! We\'ll notify you when the food map launches.');
            setEmail('');
        }
    };

    const upcomingFeatures = [
        {
            icon: <MapPin className="w-6 h-6" />,
            title: 'Real-Time Location Tracking',
            description: 'See available food centers on an interactive map',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: <Package className="w-6 h-6" />,
            title: 'Live Inventory Updates',
            description: 'Know exactly how many meals are available',
            color: 'from-cyan-500 to-blue-500',
        },
        {
            icon: <Navigation className="w-6 h-6" />,
            title: 'Smart Navigation',
            description: 'Get directions to the nearest food center',
            color: 'from-orange-500 to-red-500',
        },
        {
            icon: <Search className="w-6 h-6" />,
            title: 'Advanced Filters',
            description: 'Filter by food type, distance, and availability',
            color: 'from-purple-500 to-pink-500',
        },
    ];

    return (
        <section className="relative py-24 overflow-hidden min-h-screen flex items-center">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl floating" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    {/* Coming Soon Badge */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block mb-6"
                    >
                        <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full border border-[#DBEBC0]/20">
                            <Sparkles className="w-5 h-5 text-[#DBEBC0]" />
                            <span className="text-sm font-bold text-[#DBEBC0] uppercase tracking-wider">Coming Soon</span>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-7xl font-bold mb-6 text-white"
                    >
                        Interactive <span className="gradient-text">Food Map</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-white/60 max-w-3xl mx-auto mb-12"
                    >
                        We're building an amazing real-time food map to help you find available meals near you instantly.
                        Get notified when we launch!
                    </motion.p>

                    {/* Notification Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onSubmit={handleNotifyMe}
                        className="max-w-md mx-auto mb-20"
                    >
                        <div className="glass-card p-2 rounded-2xl flex gap-2">
                            <div className="relative flex-1">
                                <Bell className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-14 pl-12 bg-white/5 border-0 text-white placeholder:text-white/30 focus:bg-white/10 rounded-xl"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="h-14 px-8 bg-gradient-to-r from-[#DBEBC0] to-yellow-600 hover:opacity-90 text-black font-bold rounded-xl"
                            >
                                Notify Me
                            </Button>
                        </div>
                    </motion.form>
                </motion.div>

                {/* Preview Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-16"
                >
                    <div className="depth-card p-8 rounded-3xl relative overflow-hidden">
                        {/* Map Preview Background */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-cyan-500/20" />
                            <svg className="w-full h-full">
                                <defs>
                                    <pattern id="preview-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#preview-grid)" />
                            </svg>
                        </div>

                        {/* Animated Map Markers Preview */}
                        <div className="relative h-[400px] flex items-center justify-center">
                            {[
                                { top: '20%', left: '25%', delay: 0 },
                                { top: '40%', left: '55%', delay: 0.2 },
                                { top: '65%', left: '30%', delay: 0.4 },
                                { top: '25%', left: '70%', delay: 0.6 },
                                { top: '70%', left: '60%', delay: 0.8 },
                            ].map((pos, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 0.6, scale: 1 }}
                                    transition={{ delay: pos.delay + 0.8, duration: 0.5 }}
                                    className="absolute"
                                    style={{ top: pos.top, left: pos.left }}
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: pos.delay }}
                                        className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 blur-md"
                                    />
                                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                </motion.div>
                            ))}

                            {/* Center Message */}
                            <div className="text-center z-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center"
                                >
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                        <MapPin className="w-12 h-12 text-white" />
                                    </div>
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">Interactive Map Preview</h3>
                                <p className="text-white/60">Real-time food availability coming soon</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Upcoming Features */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
                        What's <span className="gradient-text">Coming</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {upcomingFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="depth-card p-6 group"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                                <p className="text-white/60 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Live Indicator Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="fixed bottom-8 right-8 glass-card px-4 py-3 rounded-full flex items-center gap-3 shadow-xl"
                >
                    <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-[#DBEBC0] animate-pulse" />
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#DBEBC0] animate-ping" />
                    </div>
                    <span className="text-sm font-medium text-white">In Development</span>
                </motion.div>
            </div>
        </section>
    );
}
