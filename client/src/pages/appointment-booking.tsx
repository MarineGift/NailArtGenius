import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AppointmentBooking() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  const { data: order } = useQuery({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  const { data: availableSlots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ["/api/appointments/available-slots", selectedDate?.toISOString()],
    enabled: !!selectedDate,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: t('common.unauthorized'),
          description: t('common.loginRequired'),
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    }
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      const response = await apiRequest("POST", "/api/appointments", appointmentData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('appointment.success'),
        description: t('appointment.successMessage'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setLocation(`/printing?orderId=${orderId}`);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: t('common.unauthorized'),
          description: t('common.loginRequired'),
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: t('appointment.error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: t('appointment.incompleteSelection'),
        description: t('appointment.selectDateAndTime'),
        variant: "destructive",
      });
      return;
    }

    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const appointmentData = {
      orderId: orderId ? parseInt(orderId) : null,
      appointmentDate: appointmentDateTime.toISOString(),
      timeSlot: selectedTimeSlot,
      status: "scheduled",
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (hour < 17 || (hour === 17 && minute === 0)) {
          slots.push(timeSlot);
        }
      }
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('appointment.title')}</h2>
          <p className="text-gray-600">{t('appointment.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendar Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-secondary" />
                {t('appointment.selectDate')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Time Slot Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-secondary" />
                {t('appointment.selectTime')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <p className="text-gray-500 text-center py-8">
                  {t('appointment.selectDateFirst')}
                </p>
              ) : slotsLoading ? (
                <p className="text-center py-8">{t('common.loading')}</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {allTimeSlots.map((slot) => {
                    const isAvailable = availableSlots.includes(slot);
                    const isSelected = selectedTimeSlot === slot;
                    
                    return (
                      <Button
                        key={slot}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        disabled={!isAvailable}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`${
                          isSelected ? "bg-secondary hover:bg-pink-600" : ""
                        } ${
                          !isAvailable ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {slot}
                      </Button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Appointment Summary */}
        {selectedDate && selectedTimeSlot && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t('appointment.summary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('appointment.date')}</span>
                  <Badge variant="secondary">
                    {selectedDate.toLocaleDateString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('appointment.time')}</span>
                  <Badge variant="secondary">{selectedTimeSlot}</Badge>
                </div>
                {order && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('appointment.orderNumber')}</span>
                    <Badge variant="outline">#{order.id}</Badge>
                  </div>
                )}
              </div>
              
              <Button
                className="w-full mt-6 bg-secondary text-white hover:bg-pink-600"
                onClick={handleBookAppointment}
                disabled={createAppointmentMutation.isPending}
              >
                {createAppointmentMutation.isPending 
                  ? t('appointment.booking') 
                  : t('appointment.confirmBooking')
                }
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}