import { motion } from 'framer-motion';
import { ArrowRight, Utensils, Users, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const [count, setCount] = useState(0);
  const targetCount = 50000;

  // Animated counter
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = targetCount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-30" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl floating" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium">Connecting Food to People</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              End Food Waste,
              <br />
              <span className="gradient-text">Feed Communities</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-xl"
            >
              Skint Help bridges the gap between restaurants with surplus food and people in need through our network of collection centers and dedicated volunteers.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="glass-card p-4 rounded-xl text-center">
                <div className="text-3xl font-bold gradient-text">{count.toLocaleString()}+</div>
                <div className="text-sm text-muted-foreground mt-1">Meals Saved</div>
              </div>
              <div className="glass-card p-4 rounded-xl text-center">
                <div className="text-3xl font-bold gradient-text">500+</div>
                <div className="text-sm text-muted-foreground mt-1">Restaurants</div>
              </div>
              <div className="glass-card p-4 rounded-xl text-center">
                <div className="text-3xl font-bold gradient-text">1000+</div>
                <div className="text-sm text-muted-foreground mt-1">Volunteers</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/join-us">
                <Button size="lg" className="rgb-ring h-14 px-8 text-lg font-semibold group">
                  <span className="relative z-10 flex items-center gap-2 text-white">
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold glass-card border-white/20 hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Animated Pipeline Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[600px] hidden lg:block"
          >
            {/* Pipeline Flow */}
            <div className="relative h-full flex flex-col justify-between">
              {/* Restaurant Node */}
              <PipelineNode
                icon={<Utensils className="w-8 h-8" />}
                title="Restaurants"
                description="Surplus food donated"
                color="from-orange-500 to-red-500"
                delay={0}
              />



              {/* Collection Center Node */}
              <PipelineNode
                icon={<MapPin className="w-8 h-8" />}
                title="Collection Centers"
                description="Food sorted & stored"
                color="from-green-500 to-emerald-500"
                delay={0.3}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />

              {/* People Node */}
              <PipelineNode
                icon={<Users className="w-8 h-8" />}
                title="People in Need"
                description="Meals delivered"
                color="from-cyan-500 to-blue-500"
                delay={0.6}
                className="self-end"
              />
            </div>

            {/* Impact Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute top-4 right-4 glass-card p-4 rounded-2xl neon-glow"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text">98%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-gradient-to-b from-green-400 to-transparent rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Pipeline Node Component
interface PipelineNodeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
  className?: string;
}

function PipelineNode({ icon, title, description, color, delay, className = '' }: PipelineNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`depth-card p-6 max-w-xs ${className}`}
    >
      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 neon-glow`}
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
