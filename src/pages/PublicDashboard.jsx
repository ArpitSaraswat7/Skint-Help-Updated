import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Package, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicDashboard() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock available food data
    const availableFood = [
        {
            id: '1',
            restaurant: 'Green Leaf Restaurant',
            foodType: 'Vegetarian',
            quantity: 25,
            location: 'Downtown Center',
            distance: '2.3 km',
            availableUntil: '8:00 PM',
            status: 'available'
        },
        {
            id: '2',
            restaurant: 'Spice Kitchen',
            foodType: 'Mixed',
            quantity: 15,
            location: 'North Center',
            distance: '3.1 km',
            availableUntil: '7:30 PM',
            status: 'available'
        },
        {
            id: '3',
            restaurant: 'Ocean Breeze Cafe',
            foodType: 'Non-Vegetarian',
            quantity: 20,
            location: 'East Center',
            distance: '1.8 km',
            availableUntil: '9:00 PM',
            status: 'available'
        },
    ];

    const [myRequests, setMyRequests] = useState([
        {
            id: '1',
            restaurant: 'Green Leaf Restaurant',
            quantity: 2,
            status: 'pending',
            requestedAt: new Date().toISOString(),
        }
    ]);

    const handleRequest = (foodId, restaurant) => {
        const newRequest = {
            id: Date.now().toString(),
            restaurant,
            quantity: 1,
            status: 'pending',
            requestedAt: new Date().toISOString(),
        };
        setMyRequests([...myRequests, newRequest]);
        toast.success('Food request submitted successfully!');
    };

    const filteredFood = availableFood.filter(food =>
        food.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.foodType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="relative py-16 overflow-hidden">
            <div className="absolute inset-0 animated-gradient opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Button
                        onClick={() => navigate('/customer/dashboard')}
                        variant="ghost"
                        className="mb-4 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Public <span className="gradient-text">Portal</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Welcome, {profile?.name || profile?.email || 'User'}! Find available food near you
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-3xl mb-8"
                >
                    <div className="flex gap-4">
                        <div className="flex-1 input-3d">
                            <div className="flex items-center gap-3">
                                <Search className="w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search for food..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted-foreground py-3"
                                />
                            </div>
                        </div>
                        <Button className="rgb-ring h-12 px-6 font-semibold">
                            <span className="relative z-10 flex items-center gap-2 text-white">
                                <MapPin className="w-5 h-5" />
                                Near Me
                            </span>
                        </Button>
                    </div>
                </motion.div>

                {/* Available Food */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8 rounded-3xl mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6">Available Food</h2>

                    {filteredFood.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            No food available at the moment
                        </p>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredFood.map((food, index) => (
                                <motion.div
                                    key={food.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="depth-card p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                            {food.status}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">{food.restaurant}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {food.quantity} meals • {food.foodType}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <MapPin className="w-4 h-4" />
                                        {food.location} ({food.distance})
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                        <Clock className="w-3 h-3" />
                                        Available until {food.availableUntil}
                                    </div>

                                    <Button
                                        onClick={() => handleRequest(food.id, food.restaurant)}
                                        className="w-full rgb-ring h-10 font-semibold"
                                    >
                                        <span className="relative z-10 text-white">Request Food</span>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* My Requests */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-8 rounded-3xl"
                >
                    <h2 className="text-2xl font-bold mb-6">My Requests</h2>

                    {myRequests.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            No requests yet
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {myRequests.map((request, index) => (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="depth-card p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{request.restaurant}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {request.quantity} meals
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Requested: {new Date(request.requestedAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                            request.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
