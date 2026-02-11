import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarCheck, Clock, ForkKnife } from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
    foodType: z.string().min(2, { message: "Please specify the type of food." }),
    quantity: z.string().min(1, { message: "Please specify the quantity." }),
    packagingType: z.string({ required_error: "Please select packaging type." }),
    pickupDate: z.date({ required_error: "Please select a pickup date." }),
    pickupTime: z.string().min(1, { message: "Please specify pickup time." }),
    specialInstructions: z.string().optional(),
    dietaryInfo: z.string().min(1, { message: "Please provide dietary information." }),
});



export function FoodDonationForm() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            foodType: "",
            quantity: "",
            packagingType: "",
            pickupTime: "",
            specialInstructions: "",
            dietaryInfo: "",
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(values) {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('donations')
                .insert([
                    {
                        food_type: values.foodType,
                        quantity: values.quantity,
                        packaging_type: values.packagingType,
                        pickup_date: values.pickupDate,
                        pickup_time: values.pickupTime,
                        special_instructions: values.specialInstructions,
                        dietary_info: values.dietaryInfo,
                    },
                ]);

            if (error) {
                toast.error('Failed to submit: ' + error.message);
            } else {
                toast.success('Food donation details submitted successfully!');
                form.reset();
            }
        } catch (error) {
            toast.error('Failed to submit: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="foodType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Food Type</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <ForkKnife className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input placeholder="e.g., Cooked meals, Fresh produce" className="pl-10" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 20 servings, 5kg" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="packagingType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Packaging Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select packaging type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="containers">Food Containers</SelectItem>
                                    <SelectItem value="bags">Paper/Plastic Bags</SelectItem>
                                    <SelectItem value="boxes">Cardboard Boxes</SelectItem>
                                    <SelectItem value="foil">Aluminum Foil Trays</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pickupDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Pickup Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarCheck className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                        className="pointer-events-auto"
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pickupTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preferred Pickup Time</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="time"
                                        className="pl-10"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dietaryInfo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dietary Information</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Vegetarian, Contains nuts"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Special Instructions (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Any special handling instructions or notes"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full bg-skint-green-600 hover:bg-skint-green-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Donation Details"}
                </Button>
            </form>
        </Form>
    );
}
