import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 bg-skint-green-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-7xl md:text-9xl font-bold mb-4 text-skint-green-600">404</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">Oops! The page you're looking for can't be found.</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-skint-green-600 hover:bg-skint-green-700 px-6 py-5 text-lg"
          >
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
