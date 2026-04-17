import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Utensils, Users, MapPin, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Meteors } from '@/components/ui/meteors';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from '@/lib/supabase';

// Initialize EmailJS (do this once when app loads)
emailjs.init('g5r-QCF_54ZoNfzqH');

export default function JoinUs() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        restaurantName: '',
        restaurantAddress: '',
        organizationName: '',
        facilityAddress: '',
        message: '',
    });

    const roles = [
        {
            id: 'restaurant',
            icon: <Utensils className="w-10 h-10" />,
            title: 'Restaurant Partner',
            description: 'Donate surplus food and reduce waste while helping your community',
            color: 'from-orange-500 to-red-500',
            benefits: [
                'Tax deductions for donations',
                'Reduce waste disposal costs',
                'Positive brand image',
                'Easy scheduling system',
                'Impact tracking dashboard',
            ],
        },
        {
            id: 'volunteer',
            icon: <Users className="w-10 h-10" />,
            title: 'Volunteer Driver',
            description: 'Help deliver meals to those in need using our optimized routes',
            color: 'from-green-500 to-emerald-500',
            benefits: [
                'Flexible scheduling',
                'Route optimization',
                'Volunteer rewards program',
                'Community impact',
                'Hour tracking & certificates',
            ],
        },
        {
            id: 'center',
            icon: <MapPin className="w-10 h-10" />,
            title: 'Collection Center',
            description: 'Manage food collection, storage, and distribution in your area',
            color: 'from-cyan-500 to-blue-500',
            benefits: [
                'Inventory management system',
                'QR code verification',
                'Analytics dashboard',
                'Training & support',
                'Community leadership',
            ],
        },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Save to Supabase database
            const { error: dbError } = await supabase
                .from('join_applications')
                .insert([{
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    role: selectedRole,
                    organization_name: selectedRole === 'center' ? formData.organizationName : selectedRole === 'restaurant' ? formData.restaurantName : null,
                    address: selectedRole === 'center' ? formData.facilityAddress : selectedRole === 'restaurant' ? formData.restaurantAddress : null,
                    message: formData.message,
                }]);

            if (dbError) {
                console.error('Supabase Error:', dbError);
                throw new Error('Database error: ' + (dbError.message || 'Failed to save to database. Please check if the table exists.'));
            }

            // 2. Send email notification to ADMIN
            const roleTitle = roles.find(r => r.id === selectedRole)?.title || selectedRole;
            
            try {
                console.log('Sending admin notification...');
                await emailjs.send(
                    'service_li17zan',
                    'template_abjbnct',
                    {
                        from_name: `${formData.firstName} ${formData.lastName}`,
                        from_email: formData.email,
                        phone: formData.phone,
                        role: roleTitle,
                        message: formData.message,
                    }
                );
                console.log('Admin notification sent successfully');
            } catch (adminEmailErr) {
                console.error('Admin email failed:', adminEmailErr);
            }

            // 3. Send CONFIRMATION EMAIL to APPLICANT
            try {
                console.log('Sending applicant confirmation email...');
                await emailjs.send(
                    'service_li17zan',
                    'template_applicant_confirmation', // Different template for applicant
                    {
                        to_email: formData.email, // Send to applicant's email
                        applicant_name: formData.firstName,
                        role: roleTitle,
                    }
                );
                console.log('Applicant confirmation sent successfully');
            } catch (applicantEmailErr) {
                console.error('Applicant confirmation email failed:', applicantEmailErr);
                console.warn('⚠️ Application saved but applicant confirmation email failed');
            }

            // Success!
            setSubmitted(true);
            
            // Store success in localStorage for home page notification
            localStorage.setItem('applicationSubmitted', JSON.stringify({
                submitted: true,
                role: roleTitle,
                name: formData.firstName,
                timestamp: new Date().toISOString()
            }));
            
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                restaurantName: '',
                restaurantAddress: '',
                organizationName: '',
                facilityAddress: '',
                message: '',
            });
            setSelectedRole(null);

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative py-16 overflow-hidden">
            {/* Success Popup Modal */}
            <AnimatePresence>
                {submitted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0, y: 50 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 30 
                            }}
                            className="bg-gradient-to-br from-green-500/95 to-emerald-500/95 backdrop-blur-xl border border-green-400/50 rounded-3xl p-8 shadow-2xl max-w-md text-center"
                        >
                            {/* Animated Checkmark Circle */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                    delay: 0.2,
                                    type: "spring", 
                                    stiffness: 200 
                                }}
                                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <motion.svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="3"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    <motion.path
                                        d="M20 6L9 17L4 12"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </motion.svg>
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl font-bold text-white mb-3"
                            >
                                Perfect! ✨
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-green-100 text-lg mb-6"
                            >
                                Your application has been submitted successfully!
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-green-50 text-sm mb-1"
                            >
                                We'll review your application and contact you soon at:
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-white font-semibold text-sm mb-6 break-all"
                            >
                                {formData.email}
                            </motion.p>

                            {/* Animated Progress Bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.3, duration: 5 }}
                                className="h-1 bg-white/30 rounded-full overflow-hidden"
                            >
                                <motion.div
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 0 }}
                                    transition={{ delay: 4.5, duration: 0.5 }}
                                    className="h-full bg-white"
                                />
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="text-white/70 text-xs mt-4"
                            >
                                Closing in 5 seconds...
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute inset-0 animated-gradient opacity-20" />
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-sm font-medium">Join Our Mission</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Be Part of the <span className="gradient-text">Solution</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose how you want to contribute to fighting food waste and feeding communities
                    </p>
                </motion.div>

                {/* Role Selection Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <RoleCard
                                {...role}
                                isSelected={selectedRole === role.id}
                                onSelect={() => setSelectedRole(role.id)}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Selected Role Form */}
                {selectedRole && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="glass-card p-8 rounded-3xl">
                            <h2 className="text-3xl font-bold mb-6 text-center">
                                Join as a{' '}
                                <span className="gradient-text">
                                    {roles.find(r => r.id === selectedRole)?.title}
                                </span>
                            </h2>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3"
                                >
                                    <AlertCircle className="w-6 h-6 text-red-400" />
                                    <div>
                                        <p className="font-semibold text-red-400">Error</p>
                                        <p className="text-sm text-red-200">{error}</p>
                                    </div>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="input-3d">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                        />
                                    </div>
                                    <div className="input-3d">
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                        />
                                    </div>
                                </div>

                                <div className="input-3d">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                    />
                                </div>

                                <div className="input-3d">
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                    />
                                </div>

                                {selectedRole === 'restaurant' && (
                                    <>
                                        <div className="input-3d">
                                            <input
                                                type="text"
                                                name="restaurantName"
                                                placeholder="Restaurant Name"
                                                value={formData.restaurantName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                            />
                                        </div>
                                        <div className="input-3d">
                                            <input
                                                type="text"
                                                name="restaurantAddress"
                                                placeholder="Restaurant Address"
                                                value={formData.restaurantAddress}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedRole === 'center' && (
                                    <>
                                        <div className="input-3d">
                                            <input
                                                type="text"
                                                name="organizationName"
                                                placeholder="Organization Name"
                                                value={formData.organizationName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                            />
                                        </div>
                                        <div className="input-3d">
                                            <input
                                                type="text"
                                                name="facilityAddress"
                                                placeholder="Facility Address"
                                                value={formData.facilityAddress}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="input-3d">
                                    <textarea
                                        name="message"
                                        placeholder="Tell us why you want to join..."
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={4}
                                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3 resize-none"
                                    />
                                </div>

                                <Button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rgb-ring h-14 text-lg font-semibold group disabled:opacity-50"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {loading ? 'Submitting...' : 'Submit Application'}
                                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </span>
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function RoleCard({ icon, title, description, color, benefits, isSelected, onSelect }) {
    return (
        <motion.button
            onClick={onSelect}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`depth-card p-6 h-full text-left transition-all relative overflow-hidden ${isSelected ? 'ring-2 ring-green-500 neon-glow' : ''
                }`}
        >
            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 neon-glow relative z-10`}
            >
                {icon}
            </motion.div>

            <h3 className="text-2xl font-bold mb-2 relative z-10">{title}</h3>
            <p className="text-muted-foreground mb-4 text-sm relative z-10">{description}</p>

            <ul className="space-y-2 relative z-10">
                {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                    </li>
                ))}
            </ul>

            {isSelected && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 pt-4 border-t border-white/10 relative z-10"
                >
                    <span className="text-sm font-medium text-green-400">✓ Selected</span>
                </motion.div>
            )}
            <Meteors number={8} />
        </motion.button>
    );
}
