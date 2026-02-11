import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Contact() {
    const contactInfo = [
        {
            icon: <Mail className="w-6 h-6" />,
            title: 'Email Us',
            value: 'arpitsaraswat80@gmail.com',
            link: 'mailto:arpitsaraswat80@gmail.com',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: <Phone className="w-6 h-6" />,
            title: 'Call Us',
            value: '+91 7668703965',
            link: 'tel:+917668703965',
            color: 'from-cyan-500 to-blue-500',
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: 'Visit Us',
            value: 'Mathura, Uttar Pradesh, India',
            link: '#',
            color: 'from-orange-500 to-red-500',
        },
    ];

    return (
        <section className="relative py-16 overflow-hidden">
            <div className="absolute inset-0 animated-gradient opacity-20" />

            {/* Floating orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl floating" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
                        <MessageSquare className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium">Get In Touch</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Let's <span className="gradient-text">Connect</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="glass-card p-8 rounded-3xl">
                            <h2 className="text-3xl font-bold mb-6 text-white">Send us a Message</h2>

                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="input-3d">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                            required
                                        />
                                    </div>
                                    <div className="input-3d">
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-3d">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                        required
                                    />
                                </div>

                                <div className="input-3d">
                                    <input
                                        type="tel"
                                        placeholder="Phone Number (Optional)"
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                    />
                                </div>

                                <div className="input-3d">
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                        required
                                    />
                                </div>

                                <div className="input-3d">
                                    <textarea
                                        placeholder="Your Message"
                                        rows={6}
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3 resize-none"
                                        required
                                    />
                                </div>

                                <Button className="w-full rgb-ring h-14 text-lg font-semibold group text-white">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Send Message
                                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact Info & Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        {/* Contact Cards */}
                        {contactInfo.map((info, index) => (
                            <motion.a
                                key={index}
                                href={info.link}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="depth-card p-6 flex items-start gap-4 group cursor-pointer block"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    {info.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">{info.title}</h3>
                                    <p className="text-muted-foreground">{info.value}</p>
                                </div>
                            </motion.a>
                        ))}

                        {/* Map Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="depth-card p-6 h-64 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-cyan-500/10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-16 h-16 mx-auto mb-4 text-green-400" />
                                    <h3 className="text-xl font-bold mb-2">Find Us</h3>
                                    <p className="text-muted-foreground">Mathura, Uttar Pradesh, India</p>
                                </div>
                            </div>
                            {/* Grid overlay */}
                            <svg className="absolute inset-0 w-full h-full opacity-10">
                                <defs>
                                    <pattern id="contact-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#contact-grid)" />
                            </svg>
                        </motion.div>

                        {/* FAQ Prompt */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <h3 className="font-bold mb-2">Looking for quick answers?</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Check out our FAQ section for common questions and instant answers.
                            </p>
                            <Button variant="outline" className="glass-card border-white/20 hover:bg-white/10">
                                View FAQ
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
