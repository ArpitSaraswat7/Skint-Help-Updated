import { motion } from 'framer-motion';
import { TrendingUp, Users, Utensils, MapPin, Award, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ImpactSection() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 animated-gradient opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium">Real Impact</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        Our <span className="gradient-text">Impact</span> So Far
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Together, we're making a real difference in fighting food waste and hunger
                    </p>
                </motion.div>

                {/* Impact Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <ImpactCard
                        icon={<Utensils className="w-8 h-8" />}
                        value={50000}
                        suffix="+"
                        label="Meals Saved"
                        color="from-orange-500 to-red-500"
                        delay={0}
                    />
                    <ImpactCard
                        icon={<Users className="w-8 h-8" />}
                        value={15000}
                        suffix="+"
                        label="People Fed"
                        color="from-green-500 to-emerald-500"
                        delay={0.1}
                    />
                    <ImpactCard
                        icon={<MapPin className="w-8 h-8" />}
                        value={500}
                        suffix="+"
                        label="Restaurants"
                        color="from-cyan-500 to-blue-500"
                        delay={0.2}
                    />
                    <ImpactCard
                        icon={<Heart className="w-8 h-8" />}
                        value={1000}
                        suffix="+"
                        label="Volunteers"
                        color="from-purple-500 to-pink-500"
                        delay={0.3}
                    />
                    <ImpactCard
                        icon={<Award className="w-8 h-8" />}
                        value={25}
                        label="Cities"
                        color="from-yellow-500 to-orange-500"
                        delay={0.4}
                    />
                    <ImpactCard
                        icon={<TrendingUp className="w-8 h-8" />}
                        value={98}
                        suffix="%"
                        label="Success Rate"
                        color="from-green-500 to-cyan-500"
                        delay={0.5}
                    />
                </div>

                {/* Impact Visualization */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="glass-card p-8 rounded-3xl"
                >
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        {/* Left - Stats Breakdown */}
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold mb-6">Breaking Down Our Impact</h3>

                            <StatBar
                                label="Food Waste Reduced"
                                percentage={85}
                                color="from-green-500 to-emerald-500"
                            />
                            <StatBar
                                label="Hunger Relief"
                                percentage={92}
                                color="from-orange-500 to-red-500"
                            />
                            <StatBar
                                label="Community Engagement"
                                percentage={78}
                                color="from-cyan-500 to-blue-500"
                            />
                            <StatBar
                                label="Environmental Impact"
                                percentage={88}
                                color="from-purple-500 to-pink-500"
                            />
                        </div>

                        {/* Right - Highlights */}
                        <div className="space-y-4">
                            <HighlightCard
                                title="Carbon Footprint Reduced"
                                value="120 tons"
                                description="Equivalent to planting 2,000 trees"
                                icon={<TrendingUp className="w-6 h-6" />}
                            />
                            <HighlightCard
                                title="Community Reach"
                                value="25 cities"
                                description="Across 5 states and growing"
                                icon={<MapPin className="w-6 h-6" />}
                            />
                            <HighlightCard
                                title="Volunteer Hours"
                                value="50,000+"
                                description="Dedicated to fighting hunger"
                                icon={<Heart className="w-6 h-6" />}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function ImpactCard({ icon, value, suffix = '', label, color, delay }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value, isVisible]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onViewportEnter={() => setIsVisible(true)}
            transition={{ duration: 0.5, delay }}
            className="depth-card p-6 group"
        >
            <div className="flex items-start justify-between mb-4">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white neon-glow`}
                >
                    {icon}
                </motion.div>
                <div className="text-right">
                    <div className="text-4xl font-bold gradient-text">
                        {count.toLocaleString()}{suffix}
                    </div>
                </div>
            </div>
            <p className="text-muted-foreground font-medium">{label}</p>
        </motion.div>
    );
}

function StatBar({ label, percentage, color }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <div className="h-3 glass-card rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${color} rounded-full relative`}
                >
                    <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                </motion.div>
            </div>
        </div>
    );
}

function HighlightCard({ title, value, description, icon }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-4 rounded-xl flex items-start gap-4 group cursor-pointer"
        >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <h4 className="font-semibold mb-1">{title}</h4>
                <div className="text-2xl font-bold gradient-text mb-1">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </motion.div>
    );
}
