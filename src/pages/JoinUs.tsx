import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Utensils, Users, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function JoinUs() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

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

  return (
    <section className="relative py-16 overflow-hidden">
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

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="input-3d">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                    />
                  </div>
                  <div className="input-3d">
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                    />
                  </div>
                </div>

                <div className="input-3d">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                  />
                </div>

                <div className="input-3d">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                  />
                </div>

                {selectedRole === 'restaurant' && (
                  <>
                    <div className="input-3d">
                      <input
                        type="text"
                        placeholder="Restaurant Name"
                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                      />
                    </div>
                    <div className="input-3d">
                      <input
                        type="text"
                        placeholder="Restaurant Address"
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
                        placeholder="Organization Name"
                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                      />
                    </div>
                    <div className="input-3d">
                      <input
                        type="text"
                        placeholder="Facility Address"
                        className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                      />
                    </div>
                  </>
                )}

                <div className="input-3d">
                  <textarea
                    placeholder="Tell us why you want to join..."
                    rows={4}
                    className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3 resize-none"
                  />
                </div>

                <Button className="w-full rgb-ring h-14 text-lg font-semibold group">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Submit Application
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

interface RoleCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  benefits: string[];
  isSelected: boolean;
  onSelect: () => void;
}

function RoleCard({ icon, title, description, color, benefits, isSelected, onSelect }: RoleCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`depth-card p-6 h-full text-left transition-all ${isSelected ? 'ring-2 ring-green-500 neon-glow' : ''
        }`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 neon-glow`}
      >
        {icon}
      </motion.div>

      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 text-sm">{description}</p>

      <ul className="space-y-2">
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
          className="mt-4 pt-4 border-t border-white/10"
        >
          <span className="text-sm font-medium text-green-400">✓ Selected</span>
        </motion.div>
      )}
    </motion.button>
  );
}
