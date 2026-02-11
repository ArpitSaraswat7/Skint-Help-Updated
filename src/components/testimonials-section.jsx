import { motion } from 'framer-motion';
import { Quotes, Star, UsersThree } from "@phosphor-icons/react";

export function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Restaurant Owner",
            image: "👩‍🍳",
            rating: 5,
            text: "Skint Help has transformed how we handle surplus food. Instead of waste, we're now feeding families in need. It's incredibly rewarding!",
            color: "from-purple-500 to-pink-500"
        },
        {
            name: "Michael Chen",
            role: "Community Volunteer",
            image: "🙋‍♂️",
            rating: 5,
            text: "Being part of this platform has been amazing. The coordination is seamless, and seeing the impact we make together is truly inspiring.",
            color: "from-cyan-500 to-blue-500"
        },
        {
            name: "Priya Patel",
            role: "Food Recipient",
            image: "👩",
            rating: 5,
            text: "This service has been a lifeline for my family. The food is fresh, the process is dignified, and the volunteers are wonderful.",
            color: "from-green-500 to-emerald-500"
        },
        {
            name: "David Martinez",
            role: "Restaurant Manager",
            image: "👨‍💼",
            rating: 5,
            text: "The platform makes it so easy to donate our excess food. We love knowing it's going to people who need it instead of the landfill.",
            color: "from-orange-500 to-red-500"
        },
        {
            name: "Emily Wilson",
            role: "NGO Coordinator",
            image: "👩‍💻",
            rating: 5,
            text: "Skint Help has streamlined our food distribution efforts. The real-time tracking and coordination features are game-changers.",
            color: "from-yellow-500 to-orange-500"
        },
        {
            name: "James Thompson",
            role: "Volunteer Driver",
            image: "🚗",
            rating: 5,
            text: "I love how organized everything is. Pick-ups are scheduled perfectly, and I always know exactly where to go and when.",
            color: "from-indigo-500 to-purple-500"
        }
    ];

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl floating" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl floating" style={{ animationDelay: '1.5s' }} />
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
                        <UsersThree className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium">Community Voices</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                        What People <span className="gradient-text">Say</span>
                    </h2>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Hear from our community members about their experience with Skint Help
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            testimonial={testimonial}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ testimonial, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5 }}
            className="depth-card p-6 group relative overflow-hidden"
        >
            {/* Quote Icon Background */}
            <div className="absolute top-4 right-4 opacity-10">
                <Quotes className="w-20 h-20 text-white" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                    ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-white/80 mb-6 leading-relaxed">
                    "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-2xl neon-glow`}
                    >
                        {testimonial.image}
                    </motion.div>
                    <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                </div>
            </div>

            {/* Hover Effect */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />
        </motion.div>
    );
}
