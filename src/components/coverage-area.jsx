import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Utensils, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Sample data - In a real app, this would come from your backend
const coverageAreas = [
    {
        id: 1,
        name: "Delhi NCR",
        activeVolunteers: 245,
        mealsDelivered: 12500,
        activeHours: "24/7",
        coordinates: { lat: 28.6139, lng: 77.2090 },
        color: "from-blue-500 to-blue-600",
    },
    {
        id: 2,
        name: "Mumbai",
        activeVolunteers: 180,
        mealsDelivered: 9800,
        activeHours: "24/7",
        coordinates: { lat: 19.0760, lng: 72.8777 },
        color: "from-green-500 to-green-600",
    },
    {
        id: 3,
        name: "Bangalore",
        activeVolunteers: 150,
        mealsDelivered: 8200,
        activeHours: "24/7",
        coordinates: { lat: 12.9716, lng: 77.5946 },
        color: "from-purple-500 to-purple-600",
    },
    {
        id: 4,
        name: "Chennai",
        activeVolunteers: 120,
        mealsDelivered: 6500,
        activeHours: "24/7",
        coordinates: { lat: 13.0827, lng: 80.2707 },
        color: "from-orange-500 to-orange-600",
    },
];

export function CoverageArea() {
    const [selectedArea, setSelectedArea] = useState(coverageAreas[0]);
    const [isMapLoading, setIsMapLoading] = useState(true);

    useEffect(() => {
        // Simulate map loading
        const timer = setTimeout(() => {
            setIsMapLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-skint-green-600 to-skint-green-700 bg-clip-text text-transparent">
                        Our Coverage Areas
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We are actively serving multiple cities across India, connecting surplus food with those in need.
                        Our network of volunteers and partners ensures efficient food distribution in these areas.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Map Section */}
                    <Card className="p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
                        {isMapLoading ? (
                            <div className="h-[400px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skint-green-600" />
                            </div>
                        ) : (
                            <div className="h-[400px] relative">
                                <iframe
                                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${selectedArea.coordinates.lat},${selectedArea.coordinates.lng}&zoom=12`}
                                    className="w-full h-full rounded-lg shadow-lg"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                                    <p className="text-sm font-medium text-gray-700">
                                        Currently viewing: {selectedArea.name}
                                    </p>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Stats Section */}
                    <div className="space-y-6">
                        {coverageAreas.map((area) => (
                            <motion.div
                                key={area.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: area.id * 0.1 }}
                            >
                                <Card
                                    className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedArea.id === area.id
                                            ? "border-2 border-skint-green-500"
                                            : "hover:border-skint-green-200"
                                        }`}
                                    onClick={() => setSelectedArea(area)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${area.color} flex items-center justify-center`}>
                                                    <MapPin className="h-4 w-4 text-white" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900">{area.name}</h3>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm text-gray-600">
                                                        {area.activeVolunteers} Volunteers
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Utensils className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm text-gray-600">
                                                        {area.mealsDelivered} Meals
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm text-gray-600">
                                                        {area.activeHours}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`transition-transform duration-300 ${selectedArea.id === area.id ? "rotate-90" : ""
                                                }`}
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Real-time Stats */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-gradient-to-r from-skint-green-500 to-skint-green-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Total Coverage</p>
                                <h3 className="text-2xl font-bold mt-1">4 Major Cities</h3>
                            </div>
                            <MapPin className="h-8 w-8 opacity-80" />
                        </div>
                    </Card>
                    <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Active Volunteers</p>
                                <h3 className="text-2xl font-bold mt-1">695+</h3>
                            </div>
                            <Users className="h-8 w-8 opacity-80" />
                        </div>
                    </Card>
                    <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80">Meals Delivered</p>
                                <h3 className="text-2xl font-bold mt-1">37,000+</h3>
                            </div>
                            <Utensils className="h-8 w-8 opacity-80" />
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
} 
