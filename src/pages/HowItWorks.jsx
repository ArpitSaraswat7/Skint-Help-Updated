import { motion } from 'framer-motion';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HowItWorks as HowItWorksSection } from "@/components/how-it-works";

const HowItWorksPage = () => {
    return (
        <>
            {/* Hero Section */}
            < section className="relative py-16 overflow-hidden" >
                <div className="absolute inset-0 animated-gradient opacity-20" />

                {/* Floating orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl floating" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }} />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sm font-medium">Our Process</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            How <span className="gradient-text">It Works</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            A seamless process connecting surplus food to those who need it most
                        </p>
                    </motion.div>
                </div>
            </section >

            {/* How It Works Section */}
            < HowItWorksSection />
        </>
    );
};

export default HowItWorksPage;
