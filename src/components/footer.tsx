import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'How It Works', path: '/how-it-works' },
      { name: 'Impact', path: '/impact' },
      { name: 'Join Us', path: '/join-us' },
      { name: 'Contact', path: '/contact' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Team', path: '/team' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
    ],
    resources: [
      { name: 'Blog', path: '/blog' },
      { name: 'Help Center', path: '/help' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, url: '#', name: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, url: '#', name: 'Twitter' },
    { icon: <Instagram className="w-5 h-5" />, url: '#', name: 'Instagram' },
    { icon: <Linkedin className="w-5 h-5" />, url: '#', name: 'LinkedIn' },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center neon-glow"
                >
                  <Sparkles className="w-7 h-7 text-white" />
                </motion.div>
                <span className="text-2xl font-bold gradient-text">Skint Help</span>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Connecting restaurants with surplus food to people in need through our network of collection centers and volunteers.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a href="mailto:hello@skinthelp.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                  <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center group-hover:neon-glow transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  hello@skinthelp.com
                </a>
                <a href="tel:+1234567890" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                  <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center group-hover:neon-glow transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  +1 (234) 567-890
                </a>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  San Francisco, CA
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 inline-block transition-all"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 inline-block transition-all"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 inline-block transition-all"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              © {currentYear} Skint Help. Made with{' '}
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              for a better world
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:neon-glow transition-all group"
                  aria-label={social.name}
                >
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {social.icon}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pb-8"
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-muted-foreground">
              Proudly fighting food waste since 2024
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
