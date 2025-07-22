import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n';
import { CalendarDays, Clock, Phone, Mail, User, FileText } from 'lucide-react';
import { format, addDays, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookingPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  // Fetch services
  const { data: services = [] } = useQuery({
    queryKey: ['/api/services'],
    select: (data: Service[]) => data
  });

  // Fetch availability for selected date
  const { data: availability, refetch: refetchAvailability } = useQuery({
    queryKey: ['/api/availability', selectedDate?.toISOString().split('T')[0]],
    enabled: !!selectedDate,
    select: (data: { availableSlots: string[] }) => data.availableSlots || []
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      return apiRequest('/api/appointments', 'POST', appointmentData);
    },
    onSuccess: () => {
      toast({
        title: t('booking.success_title'),
        description: t('booking.success_message'),
      });
      
      // Reset form
      setSelectedService(null);
      setSelectedTimeSlot('');
      setCustomerInfo({ name: '', phone: '', email: '', notes: '' });
      setSelectedDate(addDays(new Date(), 1));
      
      // Refetch availability
      refetchAvailability();
    },
    onError: (error: any) => {
      toast({
        title: t('booking.error_title'),
        description: error.message || t('booking.error_message'),
        variant: 'destructive',
      });
    }
  });

  // Group services by category
  const servicesByCategory = services.reduce((acc: { [key: string]: Service[] }, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  // Generate time slots with availability
  const timeSlots = availability?.map((slot: string) => ({
    time: slot,
    available: true
  })) || [];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedTimeSlot || !customerInfo.name || !customerInfo.phone) {
      toast({
        title: t('booking.validation_error'),
        description: t('booking.required_fields'),
        variant: 'destructive',
      });
      return;
    }

    const selectedServiceData = services.find(s => s.id === selectedService);
    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    createAppointmentMutation.mutate({
      serviceId: selectedService,
      appointmentDate: appointmentDateTime.toISOString(),
      timeSlot: selectedTimeSlot,
      duration: selectedServiceData?.duration || 60,
      price: selectedServiceData?.price || 0,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email || null,
      serviceDetails: selectedServiceData?.name,
      notes: customerInfo.notes || null,
      status: 'scheduled'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('booking.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('booking.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t('booking.select_service')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-lg capitalize">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryServices.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedService === service.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{service.name}</h4>
                        <Badge variant="secondary">
                          ₩{service.price.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {service.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration}분
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              {t('booking.select_date')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setSelectedTimeSlot(''); // Reset time slot when date changes
                  }
                }}
                disabled={(date) => date < startOfDay(new Date())}
                locale={ko}
                className="rounded-md border"
              />
            </div>
            {selectedDate && (
              <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                {t('booking.selected_date')}: {format(selectedDate, 'yyyy년 M월 d일 (EEE)', { locale: ko })}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Time Slot Selection */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t('booking.select_time')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeSlots.length === 0 ? (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('booking.no_slots_available')}
                </p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      type="button"
                      variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('booking.customer_info')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('booking.name')} *</label>
                <Input
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('booking.name_placeholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('booking.phone')} *</label>
                <Input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="010-1234-5678"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('booking.email')}</label>
              <Input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="example@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('booking.notes')}</label>
              <Textarea
                value={customerInfo.notes}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={t('booking.notes_placeholder')}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto px-8 py-3"
            disabled={createAppointmentMutation.isPending || !selectedService || !selectedTimeSlot}
          >
            {createAppointmentMutation.isPending ? t('booking.submitting') : t('booking.confirm_booking')}
          </Button>
        </div>
      </form>
    </div>
  );
}