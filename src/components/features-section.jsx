import MagicBento from '@/components/ui/MagicBento';
import { motion } from 'framer-motion';
import { Sparkle } from "@phosphor-icons/react";

export function FeaturesSection() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl floating" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
                        <Sparkle className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium">Platform Features</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                        Powerful <span className="gradient-text">Features</span>
                    </h2>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Everything you need to manage food rescue and distribution efficiently
                    </p>
                </motion.div>

                {/* Magic Bento Grid */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center"
                >
                    <MagicBento
                        textAutoHide={true}
                        enableStars
                        enableSpotlight
                        enableBorderGlow={true}
                        enableTilt={false}
                        enableMagnetism={false}
                        clickEffect
                        spotlightRadius={400}
                        particleCount={12}
                        glowColor="16, 185, 129"
                        disableAnimations={false}
                    />
                </motion.div>
            </div>
        </section>
    );
}
