import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Meteors } from '@/components/ui/meteors';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { logger } from '@/lib/logger';

const faqData = [
    {
        question: 'What is Skint Help?',
        answer: 'Skint Help is a food rescue platform that connects restaurants with surplus food to communities in need. We reduce food waste while fighting hunger by coordinating pickups, deliveries, and distribution through our network of volunteers and collection centers.',
    },
    {
        question: 'How can I donate food through Skint Help?',
        answer: 'If you\'re a restaurant or food business, you can sign up as a Restaurant Partner through our portal. Once registered, you can schedule food pickups, track your donations, and see the real-time impact of your contributions on your dashboard.',
    },
    {
        question: 'How do I receive food from Skint Help?',
        answer: 'Sign up as a Public Receiver through our portal. You\'ll be able to see available food near you on our interactive map (coming soon), visit collection centers, and request deliveries based on availability in your area.',
    },
    {
        question: 'Is there a cost to use Skint Help?',
        answer: 'No! Skint Help is completely free for both food donors and receivers. Our mission is to eliminate food waste and ensure everyone has access to nutritious meals.',
    },
    {
        question: 'How can I volunteer as a delivery driver?',
        answer: 'You can join as a Volunteer Driver through our portal. We provide optimized delivery routes, flexible scheduling, and a rewards program. You\'ll also receive hour tracking and certificates for your community service.',
    },
    {
        question: 'What areas does Skint Help currently cover?',
        answer: 'We are currently operating in 25 cities across India, with our primary base in Mathura, Uttar Pradesh. We\'re expanding rapidly — check our Food Map page for the latest coverage areas.',
    },
    {
        question: 'How is the food kept safe during transport?',
        answer: 'All our partner restaurants follow strict food safety guidelines. Our volunteer drivers are trained in safe food handling, and we use temperature-monitored containers for transport. Each delivery is tracked and verified via QR codes.',
    },
    {
        question: 'Can I track my impact on the platform?',
        answer: 'Absolutely! Every user gets access to an impact dashboard showing meals saved, CO₂ reduced, and communities served. Restaurant partners can also download impact reports for tax deduction purposes.',
    },
];

export default function Contact() {
    const [showFaq, setShowFaq] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formError, setFormError] = useState(null);
    const [contactForm, setContactForm] = useState({
        firstName: '', lastName: '', email: '', phone: '', subject: '', message: ''
    });

    const handleContactChange = (e) => {
        setContactForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);
        try {
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            if (!serviceId || !templateId || !publicKey) {
                throw new Error('EmailJS configuration is missing. Please contact support.');
            }

            await emailjs.send(
                serviceId,
                templateId,
                {
                    from_name: `${contactForm.firstName} ${contactForm.lastName}`,
                    from_email: contactForm.email,
                    phone: contactForm.phone,
                    role: `Contact: ${contactForm.subject}`,
                    message: contactForm.message,
                },
                publicKey
            );
            setFormSuccess(true);
            setContactForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
            setTimeout(() => setFormSuccess(false), 5000);
        } catch (err) {
            logger.error('Contact form error:', err);
            setFormError('Failed to send message. Please try again or email us directly.');
        } finally {
            setFormLoading(false);
        }
    };
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

                            {formSuccess && (
                                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3">
                                    <Send className="w-5 h-5 text-green-400" />
                                    <p className="text-green-300 text-sm">Message sent successfully! We'll get back to you soon.</p>
                                </div>
                            )}

                            {formError && (
                                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                                    <p className="text-red-300 text-sm">{formError}</p>
                                </div>
                            )}

                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="input-3d">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            aria-label="First Name"
                                            value={contactForm.firstName}
                                            onChange={handleContactChange}
                                            className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                            required
                                        />
                                    </div>
                                    <div className="input-3d">
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            aria-label="Last Name"
                                            value={contactForm.lastName}
                                            onChange={handleContactChange}
                                            className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-3d">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        aria-label="Email Address"
                                        value={contactForm.email}
                                        onChange={handleContactChange}
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                        required
                                    />
                                </div>

                                <div className="input-3d">
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number (Optional)"
                                        aria-label="Phone Number"
                                        value={contactForm.phone}
                                        onChange={handleContactChange}
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                    />
                                </div>

                                <div className="input-3d">
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder="Subject"
                                        aria-label="Subject"
                                        value={contactForm.subject}
                                        onChange={handleContactChange}
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                        required
                                    />
                                </div>

                                <div className="input-3d">
                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        aria-label="Your Message"
                                        rows={6}
                                        value={contactForm.message}
                                        onChange={handleContactChange}
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3 resize-none"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full rgb-ring h-14 text-lg font-semibold group text-white disabled:opacity-50"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {formLoading ? 'Sending...' : formSuccess ? 'Sent!' : 'Send Message'}
                                        {!formLoading && <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
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
                                className="depth-card p-6 flex items-start gap-4 group cursor-pointer block relative overflow-hidden"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform relative z-10`}>
                                    {info.icon}
                                </div>
                                <div className="relative z-10">
                                    <h3 className="font-semibold mb-1">{info.title}</h3>
                                    <p className="text-muted-foreground">{info.value}</p>
                                </div>
                                <Meteors number={6} />
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
                            className="glass-card p-6 rounded-2xl relative overflow-hidden"
                        >
                            <h3 className="font-bold mb-2 relative z-10">Looking for quick answers?</h3>
                            <p className="text-sm text-muted-foreground mb-4 relative z-10">
                                Check out our FAQ section for common questions and instant answers.
                            </p>
                            <Button
                                variant="outline"
                                className="glass-card border-white/20 hover:bg-white/10 relative z-10"
                                onClick={() => setShowFaq(!showFaq)}
                            >
                                {showFaq ? 'Hide FAQ' : 'View FAQ'}
                            </Button>
                            <Meteors number={6} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* FAQ Section */}
                {showFaq && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto mt-16"
                    >
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
                                <HelpCircle className="w-4 h-4 text-green-400" />
                                <span className="text-sm font-medium">FAQ</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Frequently Asked <span className="gradient-text">Questions</span>
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Everything you need to know about Skint Help and how it works.
                            </p>
                        </div>

                        <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
                            <Accordion type="single" collapsible className="space-y-2">
                                {faqData.map((faq, index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`faq-${index}`}
                                        className="border-white/10 rounded-xl overflow-hidden"
                                    >
                                        <AccordionTrigger className="text-left text-base font-semibold text-white hover:text-[#DBEBC0] hover:no-underline px-4 py-4">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground px-4 text-sm leading-relaxed">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                            <Meteors number={10} />
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
