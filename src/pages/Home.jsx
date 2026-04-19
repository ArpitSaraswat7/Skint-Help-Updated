import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { ImpactSection } from "@/components/impact-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CoverageArea } from "@/components/coverage-area";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import { logger } from "@/lib/logger";

export default function Home() {
    const [showNotification, setShowNotification] = useState(false);
    const [submissionData, setSubmissionData] = useState(null);

    useEffect(() => {
        // Check if application was just submitted
        const appSubmitted = localStorage.getItem('applicationSubmitted');
        if (appSubmitted) {
            try {
                const data = JSON.parse(appSubmitted);
                setSubmissionData(data);
                setShowNotification(true);
                
                // Clear localStorage
                localStorage.removeItem('applicationSubmitted');
                
                // Auto-hide after 6 seconds
                const timer = setTimeout(() => {
                    setShowNotification(false);
                }, 6000);
                
                return () => clearTimeout(timer);
            } catch (e) {
                logger.error('Error parsing submission data:', e);
            }
        }
    }, []);

    return (
        <main>
            {/* Success Notification */}
            <AnimatePresence>
                {showNotification && submissionData && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-xl border border-green-400/50 rounded-2xl p-6 shadow-2xl max-w-md">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >
                                        <CheckCircle className="w-8 h-8 text-white" />
                                    </motion.div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">
                                        Application Submitted! 🎉
                                    </h3>
                                    <p className="text-green-100 text-sm">
                                        Thanks {submissionData.name}, your {submissionData.role} application has been received. We'll review it and get back to you soon!
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowNotification(false)}
                                    className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <HeroSection />
            <HowItWorks />
            <CoverageArea />
            <ImpactSection />
            <TestimonialsSection />
        </main>
    );
}
