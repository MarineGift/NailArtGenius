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
    name: '',
    phone: '',
    email: '',
    visitType: 'first-time',
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
      setCustomerInfo({ name: '', phone: '', email: '', visitType: 'first-time', notes: '' });
      
      // Refresh availability
      refetchAvailability();
    },
    onSettled: () => {
      // Always refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['/api/real-time-availability'] });
    }
  });

  const handleBooking = () => {
    if (!selectedService || !selectedTimeSlot || !customerInfo.name || !customerInfo.phone) {
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
            {t('booking.title')} - 실시간 예약
          </h1>
          <p className="text-gray-600">
            실시간 예약 현황을 확인하고 즉시 예약하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                {t('booking.select_service')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedService?.toString() || ''} onValueChange={(value) => setSelectedService(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="서비스를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-sm text-gray-500">
                          ${service.price} • {service.duration}분
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    <span className="text-sm font-medium">예약 현황</span>
                    <Badge className={getStatusColor(getAvailabilityStatus())}>
                      {getStatusText(getAvailabilityStatus())}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>총 {availability.totalSlots}개 슬롯</div>
                    <div>예약 가능: {availability.availableSlots}개</div>
                    <div>예약됨: {availability.bookedSlots}개</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    마지막 업데이트: {format(new Date(availability.lastUpdated), 'HH:mm:ss')}
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
                  자동 새로고침
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
                              예약됨
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
                    해당 날짜의 예약 시간을 불러올 수 없습니다.
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
              {t('booking.customer_info')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('booking.name')} *
              </label>
              <Input
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('booking.name_placeholder')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('booking.phone')} *
              </label>
              <Input
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="전화번호를 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('booking.email')}
              </label>
              <Input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="이메일을 입력하세요 (선택사항)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('booking.visit_type')}
              </label>
              <Select value={customerInfo.visitType} onValueChange={(value) => setCustomerInfo(prev => ({ ...prev, visitType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first-time">첫 방문</SelectItem>
                  <SelectItem value="returning">재방문</SelectItem>
                  <SelectItem value="regular">단골 고객</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                {t('booking.notes')}
              </label>
              <Textarea
                value={customerInfo.notes}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={t('booking.notes_placeholder')}
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
              <h4 className="font-medium mb-2">예약 요약</h4>
              <div className="space-y-1 text-sm">
                <div>서비스: {services.find(s => s.id === selectedService)?.name || '선택되지 않음'}</div>
                <div>날짜: {selectedDate ? format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko }) : '선택되지 않음'}</div>
                <div>시간: {selectedTimeSlot || '선택되지 않음'}</div>
                <div>고객명: {customerInfo.name || '입력되지 않음'}</div>
                <div>연락처: {customerInfo.phone || '입력되지 않음'}</div>
              </div>
            </div>
            
            <Button 
              onClick={handleBooking}
              disabled={createAppointmentMutation.isPending || !selectedService || !selectedTimeSlot || !customerInfo.name || !customerInfo.phone}
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