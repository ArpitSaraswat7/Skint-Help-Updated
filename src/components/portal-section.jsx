import { motion } from 'framer-motion';
import { ForkKnife, UsersThree, MapPin, ArrowRight, Heart } from "@phosphor-icons/react";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ElectricBorder from '@/components/ui/ElectricBorder';

export function PortalSection() {
    const portals = [
        {
            icon: <ForkKnife className="w-8 h-8" />,
            title: 'Restaurant Portal',
            description: 'Manage donations, schedule pickups, and track your impact',
            color: 'from-orange-500 to-red-500',
            electricColor: '#ff6b35',
            features: ['Smart scheduling', 'Tax benefits', 'Impact dashboard'],
            link: '/join-us',
        },
        {
            icon: <UsersThree className="w-8 h-8" />,
            title: 'Volunteer Portal',
            description: 'Find delivery routes, log hours, and see your contribution',
            color: 'from-green-500 to-emerald-500',
            electricColor: '#10b981',
            features: ['Route optimizer', 'Hour tracking', 'Rewards program'],
            link: '/join-us',
        },
        {
            icon: <MapPin className="w-8 h-8" />,
            title: 'Collection Center',
            description: 'Manage inventory, coordinate pickups, and track distribution',
            color: 'from-cyan-500 to-blue-500',
            electricColor: '#06b6d4',
            features: ['Inventory system', 'QR verification', 'Analytics'],
            link: '/join-us',
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: 'Customer Portal',
            description: 'Request food assistance, find nearby centers, and track orders',
            color: 'from-purple-500 to-pink-500',
            electricColor: '#a855f7',
            features: ['Food requests', 'Center locator', 'Order tracking'],
            link: '/public-dashboard',
        },
    ];

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-500/30 to-cyan-500/30 rounded-full blur-3xl" />
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
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-sm font-medium">Access Portals</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        Choose Your <span className="gradient-text">Portal</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Dedicated dashboards for restaurants, volunteers, collection centers, and customers
                    </p>
                </motion.div>

                {/* Portals Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {portals.map((portal, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <PortalCard {...portal} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PortalCard({ icon, title, description, color, electricColor, features, link }) {
    return (
        <ElectricBorder
            color={electricColor}
            speed={0.8}
            chaos={0.1}
            borderRadius={16}
            thickness={2}
        >
            <div className="depth-card p-6 h-full flex flex-col group">
                {/* Icon */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 neon-glow`}
                >
                    {icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">{description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color}`} />
                            <span className="text-muted-foreground">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                <Link to={link} className="mt-auto">
                    <Button
                        variant="outline"
                        className="w-full glass-card border-white/20 hover:bg-white/10 group/btn"
                    >
                        <span className="flex items-center justify-center gap-2">
                            Access Portal
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                    </Button>
                </Link>

                {/* Gradient overlay on hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${color})` }}
                />
            </div>
        </ElectricBorder>
    );
}
