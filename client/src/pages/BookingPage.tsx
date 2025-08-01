// Booking page component
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { insertBookingSchema } from '@shared/schema';
import type { Service } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const bookingFormSchema = insertBookingSchema.extend({
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

const BookingPage = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      serviceId: '',
      appointmentDate: '',
      notes: '',
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      // First create or get user
      const userData = {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
      };

      let user;
      try {
        user = await apiRequest('/api/users', {
          method: 'POST',
          body: JSON.stringify(userData),
        });
      } catch (error) {
        // User might already exist, try to get them
        user = await apiRequest(`/api/users/${data.customerEmail}`);
      }

      // Create booking
      const bookingData = {
        userId: user.id,
        serviceId: data.serviceId,
        appointmentDate: new Date(data.appointmentDate),
        notes: data.notes,
        status: 'pending',
      };

      return apiRequest('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: 'Booking Confirmed!',
        description: 'Your appointment has been successfully scheduled.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    bookingMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-green-700">
            We'll send you a confirmation email shortly with all the details.
          </p>
          <Button 
            className="mt-6" 
            onClick={() => {
              setIsSubmitted(false);
              form.reset();
            }}
          >
            Book Another Appointment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Book Your Appointment</h1>
        <p className="text-gray-600">
          Schedule your nail care session with us
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {servicesLoading ? (
                            <SelectItem value="loading" disabled>Loading services...</SelectItem>
                          ) : (
                            services?.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} - ${(service.price / 100).toFixed(2)} ({service.duration} min)
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Date & Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        min={new Date().toISOString().slice(0, 16)}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special requests or notes for your appointment..."
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={bookingMutation.isPending}
              >
                {bookingMutation.isPending ? 'Booking...' : 'Book Appointment'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPage;