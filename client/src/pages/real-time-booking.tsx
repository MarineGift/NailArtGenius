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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n';
import { CalendarDays, Clock, Phone, Mail, User, FileText, RefreshCw, CheckCircle } from 'lucide-react';
import { format, addDays, startOfDay, isToday, isFuture, isAfter } from 'date-fns';
import { ko } from 'date-fns/locale';
import Header from "@/components/header";
import Footer from "@/components/footer";

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
  booked?: boolean;
  customerId?: number;
}

interface RealTimeAvailability {
  date: string;
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  timeSlots: TimeSlot[];
  lastUpdated: string;
}

export default function RealTimeBookingPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    phone: '',
    notes: ''
  });

  // Auto-refresh availability every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/real-time-availability'] });
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, queryClient]);

  // Fetch services with real-time duration
  const { data: services = [] } = useQuery({
    queryKey: ['/api/services'],
    select: (data: Service[]) => data,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Fetch real-time availability for selected date
  const { data: availability, isLoading: availabilityLoading, refetch: refetchAvailability } = useQuery({
    queryKey: ['/api/real-time-availability', selectedDate?.toISOString().split('T')[0]],
    enabled: !!selectedDate,
    refetchInterval: autoRefresh ? 30000 : false, // Auto-refresh every 30 seconds
    select: (data: RealTimeAvailability) => data
  });

  // Create appointment mutation with real-time conflict detection
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      return apiRequest('/api/real-time-appointments', 'POST', appointmentData);
    },
    onMutate: async (newAppointment) => {
      // Optimistically update availability
      await queryClient.cancelQueries({ queryKey: ['/api/real-time-availability'] });
      
      const previousAvailability = queryClient.getQueryData(['/api/real-time-availability', selectedDate?.toISOString().split('T')[0]]);
      
      // Update the cache optimistically
      queryClient.setQueryData(
        ['/api/real-time-availability', selectedDate?.toISOString().split('T')[0]], 
        (old: RealTimeAvailability | undefined) => {
          if (!old) return old;
          
          return {
            ...old,
            availableSlots: old.availableSlots - 1,
            bookedSlots: old.bookedSlots + 1,
            timeSlots: old.timeSlots.map(slot => 
              slot.time === newAppointment.timeSlot 
                ? { ...slot, available: false, booked: true }
                : slot
            ),
            lastUpdated: new Date().toISOString()
          };
        }
      );
      
      return { previousAvailability };
    },
    onError: (err, newAppointment, context) => {
      // Revert optimistic update on error
      if (context?.previousAvailability) {
        queryClient.setQueryData(
          ['/api/real-time-availability', selectedDate?.toISOString().split('T')[0]], 
          context.previousAvailability
        );
      }
      
      toast({
        title: t('booking.error_title'),
        description: err.message || t('booking.error_message'),
        variant: "destructive"
      });
    },
    onSuccess: (data) => {
      toast({
        title: t('booking.success_title'),
        description: t('booking.success_message'),
      });
      
      // Reset form
      setSelectedService(null);
      setSelectedTimeSlot('');
      setCustomerInfo({ phone: '', notes: '' });
      
      // Refresh availability
      refetchAvailability();
    },
    onSettled: () => {
      // Always refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['/api/real-time-availability'] });
    }
  });

  const handleBooking = () => {
    if (!selectedService || !selectedTimeSlot || !customerInfo.phone) {
      toast({
        title: t('booking.validation_error'),
        description: t('booking.required_fields'),
        variant: "destructive"
      });
      return;
    }

    const selectedServiceData = services.find(s => s.id === selectedService);
    
    const appointmentData = {
      appointmentDate: selectedDate.toISOString().split('T')[0],
      timeSlot: selectedTimeSlot,
      serviceId: selectedService,
      serviceName: selectedServiceData?.name,
      duration: selectedServiceData?.duration || 60,
      price: selectedServiceData?.price || 0,
      customer: customerInfo,
      realTimeBooking: true
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const selectedDay = startOfDay(date);
    
    // Disable past dates and today (same day booking not allowed)
    if (!isAfter(selectedDay, today)) return true;
    
    // Disable Sundays (assuming salon is closed)
    if (date.getDay() === 0) return true;
    
    return false;
  };

  const getAvailabilityStatus = () => {
    if (!availability) return 'loading';
    
    const ratio = availability.availableSlots / availability.totalSlots;
    if (ratio > 0.7) return 'high';
    if (ratio > 0.3) return 'medium';
    if (ratio > 0) return 'low';
    return 'full';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      case 'full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'high': return '예약 가능';
      case 'medium': return '일부 시간 예약 가능';
      case 'low': return '마감 임박';
      case 'full': return '예약 마감';
      default: return '확인 중...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Real-Time Booking
          </h1>
          <p className="text-gray-600">
            Please select an available date and time to make your reservation
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-4">Simple Booking Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold mb-2">1</div>
                <div className="font-medium text-gray-900 mb-1">Select Service</div>
                <div className="text-sm text-gray-600">Choose your desired nail, spa, or waxing service</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mb-2">2</div>
                <div className="font-medium text-gray-900 mb-1">Select Date & Time</div>
                <div className="text-sm text-gray-600">Then enter phone number and additional notes</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mb-2">3</div>
                <div className="font-medium text-gray-900 mb-1">Visit Store</div>
                <div className="text-sm text-gray-600">Visit at your scheduled time for quick service</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Select Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full p-3 rounded-md border text-left transition-colors ${
                      selectedService === service.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white hover:bg-blue-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{service.name}</span>
                      <span className={`text-sm ${
                        selectedService === service.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        ${service.price} • {service.duration}min
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-2" />
                {t('booking.select_date')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={isDateDisabled}
                locale={ko}
                className="rounded-md border"
              />
              
              {availability && (
                <div className="mt-4 p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t('realtime.availability_status')}</span>
                    <Badge className={getStatusColor(getAvailabilityStatus())}>
                      {getStatusText(getAvailabilityStatus())}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>{t('realtime.total_slots').replace('{count}', availability.totalSlots.toString())}</div>
                    <div>{t('realtime.available_slots').replace('{count}', availability.availableSlots.toString())}</div>
                    <div>{t('realtime.booked_slots').replace('{count}', availability.bookedSlots.toString())}</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {t('realtime.last_updated')}: {format(new Date(availability.lastUpdated), 'HH:mm:ss')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time Selection */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {t('booking.select_time')}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchAvailability()}
                  disabled={availabilityLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${availabilityLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {t('realtime.auto_refresh')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {availabilityLoading ? (
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : availability?.timeSlots ? (
                <div className="space-y-2">
                  {availability.timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                      className={`w-full justify-start ${
                        !slot.available 
                          ? 'opacity-50 cursor-not-allowed' 
                          : slot.booked 
                          ? 'border-red-200 text-red-600'
                          : 'border-green-200 text-green-600'
                      }`}
                      disabled={!slot.available}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{slot.time}</span>
                        <div className="flex items-center">
                          {slot.available ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                              {t('realtime.booked_label')}
                            </span>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    {t('realtime.no_availability')}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number * <span className="text-xs text-gray-500">(회원가입 되지 않은 고객은 회원가입 후 사용하세요.)</span>
              </label>
              <Input
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Notes
              </label>
              <Textarea
                value={customerInfo.notes}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requests or notes..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking Summary and Confirmation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('booking.confirm_booking')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">{t('realtime.booking_summary')}</h4>
              <div className="space-y-1 text-sm">
                <div>{t('realtime.service_label')}: {services.find(s => s.id === selectedService)?.name || t('realtime.not_selected')}</div>
                <div>{t('realtime.date_label')}: {selectedDate ? format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko }) : t('realtime.not_selected')}</div>
                <div>{t('realtime.time_label')}: {selectedTimeSlot || t('realtime.not_selected')}</div>
                <div>Customer Phone: {customerInfo.phone || 'Not entered'}</div>
                <div>{t('realtime.contact_label')}: {customerInfo.phone || t('realtime.not_entered')}</div>
              </div>
            </div>
            
            <Button 
              onClick={handleBooking}
              disabled={createAppointmentMutation.isPending || !selectedService || !selectedTimeSlot || !customerInfo.phone}
              className="w-full"
            >
              {createAppointmentMutation.isPending ? t('booking.submitting') : t('booking.confirm_booking')}
            </Button>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}