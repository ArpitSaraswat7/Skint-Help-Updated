import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { logger } from "@/lib/logger";

const NotFound = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        logger.warn(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-7xl md:text-9xl font-bold mb-4 gradient-text">404</h1>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-8">Oops! The page you're looking for can't be found.</p>
                    <Button
                        onClick={() => navigate("/")}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-5 text-lg"
                    >
                        Return Home
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
