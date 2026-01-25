import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Heart, CreditCard, Banknote, Gift } from "lucide-react";
import { toast } from "sonner";

const donationAmounts = [
    { value: "10", label: "₹10" },
    { value: "50", label: "₹50" },
    { value: "100", label: "₹100" },
    { value: "500", label: "₹500" },
    { value: "1000", label: "₹1000" },
    { value: "custom", label: "Custom Amount" },
];

export function DonationForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAmountChange = (value) => {
        setSelectedOption(value);
        if (value === "custom") {
            setIsCustomAmount(true);
            setAmount("");
        } else {
            setIsCustomAmount(false);
            setAmount(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Here you would typically integrate with a payment gateway
            // For now, we'll just simulate a successful donation
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.success("Thank you for your donation! Your contribution will help feed those in need.");
            setIsOpen(false);

            // Reset form
            setAmount("");
            setSelectedOption("");
            setName("");
            setEmail("");
            setIsCustomAmount(false);
        } catch (error) {
            toast.error("Failed to process donation. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-skint-green-500 to-skint-green-600 hover:from-skint-green-600 hover:to-skint-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    <Heart className="mr-2 h-4 w-4" />
                    Donate Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-skint-green-600" />
                        Make a Donation
                    </DialogTitle>
                    <DialogDescription>
                        Your contribution helps us provide meals to those in need. Every donation makes a difference.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Amount</Label>
                        <Select value={selectedOption} onValueChange={handleAmountChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an amount" />
                            </SelectTrigger>
                            <SelectContent>
                                {donationAmounts.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isCustomAmount && (
                            <div className="relative">
                                <Banknote className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-10"
                                    min="1"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Your Name</Label>
                        <div className="relative">
                            <Gift className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-skint-green-500 to-skint-green-600 hover:from-skint-green-600 hover:to-skint-green-700"
                        disabled={isLoading || !amount || !name || !email}
                    >
                        {isLoading ? "Processing..." : `Donate ₹${amount || "0"}`}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
} 
