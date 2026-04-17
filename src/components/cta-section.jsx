import { motion } from 'framer-motion';
import { ArrowRight, Sparkle } from "@phosphor-icons/react";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Meteors } from '@/components/ui/meteors';

export function CtaSection() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl floating" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "100px" }}
                    transition={{ duration: 0.8 }}
                    className="glass-premium gradient-border gradient-border-animated rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
                >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-orange-500/10 pointer-events-none" />

                    {/* Content */}
                    <div className="relative z-10 max-w-3xl mx-auto">
                        {/* Icon */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "100px" }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-center mb-6"
                        >
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center neon-glow"
                            >
                                <Sparkle className="w-10 h-10 text-green-400" />
                            </motion.div>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "100px" }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-6xl font-bold mb-6"
                        >
                            Ready to Make a{' '}
                            <span className="gradient-text text-glow">Difference?</span>
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "100px" }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                        >
                            Join thousands of restaurants, volunteers, and community members who are fighting food waste and feeding communities every day.
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "100px" }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto"
                        >
                            <div className="glass-card p-4 rounded-xl soft-glow-hover transition-all duration-300 hover-lift relative overflow-hidden">
                                <div className="text-3xl font-bold gradient-text relative z-10">50K+</div>
                                <div className="text-sm text-muted-foreground relative z-10">Meals Saved</div>
                                <Meteors number={6} />
                            </div>
                            <div className="glass-card p-4 rounded-xl soft-glow-hover transition-all duration-300 hover-lift relative overflow-hidden">
                                <div className="text-3xl font-bold gradient-text relative z-10">500+</div>
                                <div className="text-sm text-muted-foreground relative z-10">Partners</div>
                                <Meteors number={6} />
                            </div>
                            <div className="glass-card p-4 rounded-xl soft-glow-hover transition-all duration-300 hover-lift relative overflow-hidden">
                                <div className="text-3xl font-bold gradient-text relative z-10">25</div>
                                <div className="text-sm text-muted-foreground relative z-10">Cities</div>
                                <Meteors number={6} />
                            </div>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "100px" }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap gap-4 justify-center"
                        >
                            <Link to="/join-us">
                                <Button size="lg" className="rgb-ring h-14 px-8 text-lg font-semibold group text-white">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Join Us Today
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 px-8 text-lg font-semibold glass-card border-white/20 hover:bg-white/10"
                                >
                                    Contact Us
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                </motion.div>
            </div>
        </section>
    );
}
