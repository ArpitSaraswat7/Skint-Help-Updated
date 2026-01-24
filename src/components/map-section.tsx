import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Clock, Package } from 'lucide-react';
import { useState } from 'react';

export function MapSection() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const locations = [
    {
      id: 1,
      name: 'Downtown Center',
      address: '123 Main St',
      available: 45,
      status: 'high',
      position: { top: '30%', left: '25%' },
    },
    {
      id: 2,
      name: 'Westside Hub',
      address: '456 West Ave',
      available: 28,
      status: 'medium',
      position: { top: '50%', left: '40%' },
    },
    {
      id: 3,
      name: 'East District',
      address: '789 East Blvd',
      available: 62,
      status: 'high',
      position: { top: '40%', left: '70%' },
    },
    {
      id: 4,
      name: 'North Point',
      address: '321 North Rd',
      available: 15,
      status: 'low',
      position: { top: '20%', left: '55%' },
    },
    {
      id: 5,
      name: 'South Bay',
      address: '654 South St',
      available: 38,
      status: 'medium',
      position: { top: '70%', left: '50%' },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'from-green-500 to-emerald-500';
      case 'medium':
        return 'from-orange-500 to-yellow-500';
      case 'low':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'high':
        return 'shadow-green-500/50';
      case 'medium':
        return 'shadow-orange-500/50';
      case 'low':
        return 'shadow-red-500/50';
      default:
        return 'shadow-gray-500/50';
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 animated-gradient opacity-20" />

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
            <MapPin className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">Live Availability</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Food <span className="gradient-text">Heat Map</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time view of food availability across our collection centers
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="depth-card p-8 h-[500px] relative overflow-hidden">
              {/* Map Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-cyan-500/20" />
                {/* Grid lines */}
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Location Markers */}
              {locations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute"
                  style={location.position}
                >
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedLocation(location.id)}
                    className={`relative group cursor-pointer`}
                  >
                    {/* Pulsing ring */}
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 rounded-full bg-gradient-to-r ${getStatusColor(location.status)} blur-md`}
                    />

                    {/* Marker */}
                    <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${getStatusColor(location.status)} flex items-center justify-center shadow-lg ${getStatusGlow(location.status)} shadow-2xl`}>
                      <MapPin className="w-6 h-6 text-white" />
                    </div>

                    {/* Tooltip */}
                    {selectedLocation === location.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass-card p-3 rounded-xl min-w-[200px] z-10"
                      >
                        <h4 className="font-semibold mb-1">{location.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{location.address}</p>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium">{location.available} meals available</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                </motion.div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 glass-card p-4 rounded-xl">
                <h4 className="text-sm font-semibold mb-3">Availability Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                    <span className="text-xs text-muted-foreground">High (40+ meals)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500" />
                    <span className="text-xs text-muted-foreground">Medium (20-40 meals)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500" />
                    <span className="text-xs text-muted-foreground">Low (&lt;20 meals)</span>
                  </div>
                </div>
              </div>

              {/* Live Indicator */}
              <div className="absolute top-4 right-4 glass-card px-3 py-2 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium">Live</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <StatCard
              icon={<Package className="w-6 h-6" />}
              label="Total Available"
              value="188 meals"
              color="from-green-500 to-emerald-500"
            />
            <StatCard
              icon={<MapPin className="w-6 h-6" />}
              label="Active Centers"
              value="5 locations"
              color="from-cyan-500 to-blue-500"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              label="Updated"
              value="2 min ago"
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Today's Impact"
              value="127 meals"
              color="from-orange-500 to-red-500"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="depth-card p-4 group cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-xl font-bold gradient-text">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
