import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Utensils, Users as UsersIcon, MapPin, ArrowRight, Home } from 'lucide-react';

export default function SelectRole() {
    const navigate = useNavigate();

    const portals = [
        {
            id: 'public',
            name: 'Public Receiver',
            icon: <UsersIcon className="w-10 h-10" />,
            description: 'Find food & help community',
            color: 'from-green-500 to-emerald-500',
            glow: 'group-hover:shadow-green-500/50'
        },
        {
            id: 'restaurant',
            name: 'Restaurant Partner',
            icon: <Utensils className="w-10 h-10" />,
            description: 'Donate food & reduce waste',
            color: 'from-orange-500 to-red-500',
            glow: 'group-hover:shadow-orange-500/50'
        },
        {
            id: 'worker',
            name: 'Delivery Worker',
            icon: <MapPin className="w-10 h-10" />,
            description: 'Pickup & drop-off logistics',
            color: 'from-cyan-500 to-blue-500',
            glow: 'group-hover:shadow-cyan-500/50'
        },
        {
            id: 'admin',
            name: 'Admin / Owner',
            icon: <Shield className="w-10 h-10" />,
            description: 'Platform management',
            color: 'from-purple-500 to-pink-500',
            glow: 'group-hover:shadow-purple-500/50'
        }
    ];

    const handlePortalSelect = (portalId) => {
        // Save selected role to localStorage
        localStorage.setItem('selectedRole', portalId);
        // Navigate to login page
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0a] noise-overlay">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-white/10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-1000 pointer-events-none" />

            {/* Floating Home Button */}
            <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => navigate('/')}
                className="fixed top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all backdrop-blur-md group"
            >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Home</span>
            </motion.button>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block"
                        >
                            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/80 backdrop-blur-md mb-4 inline-block">
                                Welcome to Skint Help
                            </span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                            Choose Your <span className="text-[#DBEBC0] text-glow">Portal</span>
                        </h1>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">
                            Select your role to access the dedicated dashboard and tools.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {portals.map((portal, index) => (
                            <motion.div
                                key={portal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
                                className="perspective-1000"
                            >
                                <button
                                    onClick={() => handlePortalSelect(portal.id)}
                                    className="w-full h-full text-left group relative"
                                >
                                    <div className={`
                    relative h-full p-8 rounded-3xl border border-white/10 
                    backdrop-blur-xl bg-black/40 overflow-hidden transition-all duration-500
                    ${portal.glow} hover:border-white/20 hover:bg-white/5
                    gradient-border gradient-border-animated
                  `}>
                                        {/* Hover Gradient Background */}
                                        <div className={`
                      absolute inset-0 bg-gradient-to-br ${portal.color} opacity-0 
                      group-hover:opacity-10 transition-opacity duration-500
                    `} />

                                        <div className={`
                      w-16 h-16 rounded-2xl bg-gradient-to-br ${portal.color} 
                      flex items-center justify-center text-white mb-6
                      shadow-lg group-hover:scale-110 transition-transform duration-500
                    `}>
                                            {portal.icon}
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                                            {portal.name}
                                        </h3>
                                        <p className="text-white/50 text-sm leading-relaxed">
                                            {portal.description}
                                        </p>

                                        <div className="mt-6 flex items-center text-sm font-medium text-white/40 group-hover:text-white transition-colors">
                                            Enter Portal <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div >
        </div >
    );
}
