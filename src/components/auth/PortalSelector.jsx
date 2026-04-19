import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Storefront, Briefcase, ArrowRight } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const portals = [
    {
        id: "restaurant",
        title: "Restaurant Portal",
        description: "Manage donations, schedule pickups, and track your impact",
        icon: Storefront,
        color: "from-orange-400 to-red-600",
        path: "/login",
    },
    {
        id: "worker",
        title: "Volunteer Portal",
        description: "Find delivery routes, log hours, and see your contribution",
        icon: Briefcase,
        color: "from-green-400 to-emerald-600",
        path: "/login",
    },
    {
        id: "public",
        title: "Customer Portal",
        description: "Request food assistance, find nearby centers, and track orders",
        icon: User,
        color: "from-purple-400 to-pink-600",
        path: "/login",
    },

];

export function PortalSelector({ children, onOpenChange }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
        onOpenChange?.(newOpen);
    };

    const handleSelect = (portalId) => {
        // Save selected role to localStorage
        localStorage.setItem('selectedRole', portalId);
        handleOpenChange(false); // Use handleOpenChange to close the dialog
        // Navigate to login page
        navigate('/login');
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="default" className="rgb-ring">
                        Sign In
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] glass-card border-white/10 p-8">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center mb-8 gradient-text">
                        Select Your Portal
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Choose which portal you want to access: Customer Portal, Restaurant Portal, or Volunteer Portal
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portals.map((portal) => (
                        <button
                            key={portal.id}
                            onClick={() => handleSelect(portal.id)}
                            className="group relative flex flex-col items-start p-6 rounded-2xl glass-card hover:bg-white/5 transition-all duration-300 border border-white/10 hover:border-white/20 text-left overflow-hidden"
                        >
                            <div
                                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${portal.color}`}
                            />

                            <div className={`p-3 rounded-xl bg-gradient-to-br ${portal.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <portal.icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {portal.title}
                            </h3>

                            <p className="text-muted-foreground text-sm mb-6 flex-grow">
                                {portal.description}
                            </p>

                            <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                Enter Portal <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
