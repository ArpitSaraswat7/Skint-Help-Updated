import { motion } from 'framer-motion';
import { MapPin, Sparkle, Bell } from "@phosphor-icons/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export function MapSection() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNotifyMe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            // TODO: Replace with your actual notification endpoint
            const response = await fetch('/api/notify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to subscribe');
            }

            toast.success('Thanks! We\'ll notify you when the heat map launches.');
            setEmail('');
        } catch (error) {
            logger.error('Notification subscription error:', error);
            toast.error('Failed to subscribe. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 animated-gradient opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    {/* Coming Soon Badge */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ delay: 0.2 }}
                        className="inline-block mb-4"
                    >
                        <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full border border-[#DBEBC0]/20">
                            <Sparkle className="w-5 h-5 text-[#DBEBC0]" />
                            <span className="text-sm font-bold text-[#DBEBC0] uppercase tracking-wider">Coming Soon</span>
                        </div>
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                        Food <span className="gradient-text">Heat Map</span>
                    </h2>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
                        Real-time view of food availability across our collection centers
                    </p>

                    {/* Notification Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ delay: 0.4 }}
                        onSubmit={handleNotifyMe}
                        className="max-w-md mx-auto"
                    >
                        <div className="glass-card p-2 rounded-2xl flex gap-2">
                            <div className="relative flex-1">
                                <Bell className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <Input
                                    type="email"
                                    placeholder="Get notified when we launch"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 pl-12 bg-white/5 border-0 text-white placeholder:text-white/30 focus:bg-white/10 rounded-xl"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-12 px-6 bg-gradient-to-r from-[#DBEBC0] to-yellow-600 hover:opacity-90 text-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Subscribing...' : 'Notify Me'}
                            </Button>
                        </div>
                    </motion.form>
                </motion.div>

                {/* Map Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="depth-card p-8 h-[500px] relative overflow-hidden">
                        {/* Map Background */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-cyan-500/20" />
                            {/* Grid lines */}
                            <svg className="w-full h-full">
                                <defs>
                                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                        </div>

                        {/* Animated Preview Markers */}
                        <div className="relative h-full flex items-center justify-center">
                            {[
                                { top: '30%', left: '25%', delay: 0, color: 'from-green-500 to-emerald-500' },
                                { top: '50%', left: '40%', delay: 0.2, color: 'from-orange-500 to-yellow-500' },
                                { top: '40%', left: '70%', delay: 0.4, color: 'from-green-500 to-emerald-500' },
                                { top: '20%', left: '55%', delay: 0.6, color: 'from-red-500 to-pink-500' },
                                { top: '70%', left: '50%', delay: 0.8, color: 'from-orange-500 to-yellow-500' },
                            ].map((marker, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 0.5, scale: 1 }}
                                    viewport={{ once: true, margin: "100px" }}
                                    transition={{ delay: marker.delay + 0.5, duration: 0.5 }}
                                    className="absolute"
                                    style={{ top: marker.top, left: marker.left }}
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: marker.delay }}
                                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${marker.color} blur-md`}
                                    />
                                    <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${marker.color} flex items-center justify-center shadow-lg`}>
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
                                <h3 className="text-2xl font-bold text-white mb-2">Live Heat Map Preview</h3>
                                <p className="text-white/60">Real-time availability tracking coming soon</p>
                            </div>
                        </div>

                        {/* In Development Badge */}
                        <div className="absolute top-4 right-4 glass-card px-4 py-2 rounded-full flex items-center gap-2">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-[#DBEBC0] animate-pulse" />
                                <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#DBEBC0] animate-ping" />
                            </div>
                            <span className="text-xs font-medium text-white">In Development</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
