import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { CustomerReservationForm } from '@/components/customer-reservation-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AppointmentBookingNew() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      return apiRequest('/api/appointments', 'POST', appointmentData);
    },
    onSuccess: (data, variables) => {
      // Show success message with booking details  
      const appointmentDateTime = new Date(`${variables.appointmentDate}T${variables.timeSlot}`);
      const formattedDate = appointmentDateTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const formattedTime = appointmentDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      toast({
        title: "Booking Confirmed!",
        description: `${variables.customerPhone}, your appointment has been successfully booked for ${formattedDate} at ${formattedTime}.`,
        duration: 6000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
        variant: 'destructive',
      });
    }
  });

  const handleReservationSubmit = (formData: any) => {
    const appointmentData = {
      serviceId: 1, // Default service - can be updated based on selection
      appointmentDate: formData.appointmentDate,
      timeSlot: formData.timeSlot,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: '', // Not required
      notes: formData.notes,
      visitReason: 'General visit'
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📞 Booking Information</h1>
          <p className="text-gray-600">Please enter your details to book an appointment</p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-xl">New Appointment Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerReservationForm 
              onReservationSubmit={handleReservationSubmit}
            />
          </CardContent>
        </Card>

        {/* Loading state */}
        {createAppointmentMutation.isPending && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Booking your appointment...</p>
              </div>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}