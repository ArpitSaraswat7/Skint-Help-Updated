import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from '@supabase/supabase-js';

const formSchema = z.object({
  restaurantName: z.string().min(2, { message: "Please enter your restaurant name." }),
  contactName: z.string().min(2, { message: "Please enter the contact person's name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  cuisineType: z.string({ required_error: "Please select your cuisine type." }),
  donationFrequency: z.string({ required_error: "Please select donation frequency." }),
  foodTypes: z.string().min(1, { message: "Please specify the types of food you can donate." }),
  storageCapacity: z.string().min(1, { message: "Please specify your storage capacity." }),
  additionalInfo: z.string().optional(),
});

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export function RestaurantForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      cuisineType: "",
      donationFrequency: "",
      foodTypes: "",
      storageCapacity: "",
      additionalInfo: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    supabase
      .from('restaurants')
      .insert([
        {
          name: values.restaurantName,
          contact_name: values.contactName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          cuisine_type: values.cuisineType,
          donation_frequency: values.donationFrequency,
          food_types: values.foodTypes,
          storage_capacity: values.storageCapacity,
          additional_info: values.additionalInfo,
        },
      ])
      .then(({ error }) => {
        if (error) {
          toast.error('Failed to submit: ' + error.message);
        } else {
          toast.success('Restaurant registration submitted successfully!');
          form.reset();
        }
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="restaurantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Green Plate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person</FormLabel>
              <FormControl>
                <Input placeholder="Full name of the contact person" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@restaurant.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant Address</FormLabel>
              <FormControl>
                <Input placeholder="Full street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cuisineType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuisine Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="donationFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donation Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="occasional">Occasional</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="foodTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Types of Food Available for Donation</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g., Prepared meals, Fresh produce, Packaged goods"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storageCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Storage Capacity</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., 100 meals, 50kg of food"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any other information you'd like to share"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-skint-green-600 hover:bg-skint-green-700">
          Register Restaurant
        </Button>
      </form>
    </Form>
  );
}
