import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import ElectricBorder from '@/components/ui/ElectricBorder';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Restaurant Owner',
      image: '👩‍🍳',
      rating: 5,
      text: 'Skint Help has transformed how we handle surplus food. Instead of waste, we now create impact. The platform is incredibly easy to use!',
      color: 'from-orange-500 to-red-500',
      electricColor: '#ff6b35',
    },
    {
      name: 'Michael Chen',
      role: 'Volunteer Driver',
      image: '🚗',
      rating: 5,
      text: 'Being a volunteer has been so rewarding. The route optimization saves time, and seeing the direct impact on families is priceless.',
      color: 'from-green-500 to-emerald-500',
      electricColor: '#10b981',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Collection Center Manager',
      image: '👩‍💼',
      rating: 5,
      text: 'The inventory management system is brilliant. We can track everything in real-time and ensure food safety standards are always met.',
      color: 'from-cyan-500 to-blue-500',
      electricColor: '#06b6d4',
    },
    {
      name: 'David Park',
      role: 'Community Leader',
      image: '👨‍🏫',
      rating: 5,
      text: 'Skint Help has brought our community together. The transparency and impact metrics show real change happening every day.',
      color: 'from-purple-500 to-pink-500',
      electricColor: '#a855f7',
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl floating" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }} />
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
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            What Our <span className="gradient-text">Community</span> Says
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from restaurants, volunteers, and community members
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
  color: string;
  electricColor: string;
}

function TestimonialCard({ name, role, image, rating, text, color, electricColor }: TestimonialCardProps) {
  return (
    <ElectricBorder
      color={electricColor}
      speed={0.6}
      chaos={0.08}
      borderRadius={16}
      thickness={2}
    >
      <div className="depth-card p-6 h-full relative group">
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Quote className="w-16 h-16" />
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl flex-shrink-0 neon-glow`}
          >
            {image}
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{role}</p>
            {/* Rating Stars */}
            <div className="flex gap-1">
              {[...Array(rating)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial Text */}
        <p className="text-muted-foreground leading-relaxed relative z-10">
          "{text}"
        </p>

        {/* Gradient Overlay on Hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${color})` }}
        />
      </div>
    </ElectricBorder>
  );
}
