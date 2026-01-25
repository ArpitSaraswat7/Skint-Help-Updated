import { motion } from 'framer-motion';
import { Utensils, MapPin, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

export function HowItWorks() {
    const steps = [
        {
            icon: <Utensils className="w-8 h-8" />,
            title: 'Restaurants Donate',
            description: 'Partner restaurants notify us about surplus food through our smart dashboard.',
            color: 'from-orange-500 to-red-500',
            features: [
                'Real-time notifications',
                'Easy scheduling',
                'Tax benefits tracking',
            ],
        },
        {
            icon: <MapPin className="w-8 h-8" />,
            title: 'Collection Centers',
            description: 'Food is collected, sorted, and stored safely at our network of centers.',
            color: 'from-green-500 to-emerald-500',
            features: [
                'Quality verification',
                'Safe storage',
                'Inventory management',
            ],
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: 'Volunteers Deliver',
            description: 'Our dedicated volunteers deliver meals to people in need using optimized routes.',
            color: 'from-cyan-500 to-blue-500',
            features: [
                'Route optimization',
                'Real-time tracking',
                'Impact reporting',
            ],
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'Impact Measured',
            description: 'Every meal is tracked, creating transparency and measurable social impact.',
            color: 'from-purple-500 to-pink-500',
            features: [
                'Analytics dashboard',
                'Impact metrics',
                'Community reports',
            ],
        },
    ];

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl" />
            </div>

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
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-sm font-medium">Our Process</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        How <span className="gradient-text">Skint Help</span> Works
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A seamless four-step process connecting surplus food to those who need it most
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <StepCard {...step} number={index + 1} />
                        </motion.div>
                    ))}
                </div>




                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center"
                >
                    <div className="glass-card p-8 rounded-3xl inline-block">
                        <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            Join our network of restaurants, volunteers, and collection centers
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="rgb-ring px-8 py-4 rounded-xl font-semibold text-lg group inline-flex items-center gap-2"
                        >
                            <span className="relative z-10 flex items-center gap-2 text-white">
                                Get Started Today
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function StepCard({ icon, title, description, color, features, number }) {
    return (
        <div className="depth-card p-6 h-full relative group">
            {/* Step Number */}
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full glass-card flex items-center justify-center font-bold text-xl gradient-text neon-glow">
                {number}
            </div>

            {/* Icon */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 neon-glow`}
            >
                {icon}
            </motion.div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4 text-sm">{description}</p>

            {/* Features */}
            <ul className="space-y-2">
                {features.map((feature, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 text-sm"
                    >
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                    </motion.li>
                ))}
            </ul>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${color})` }} />
        </div>
    );
}
