import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Clock, Phone, Mail, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
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
}

export default function BookingPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    phone: '',
    notes: ''
  });
  const [onlineBookingDiscount] = useState(0.10); // 10% discount for online booking
  const [isOnlinePayment, setIsOnlinePayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [completedBookingDetails, setCompletedBookingDetails] = useState<{
    service: number;
    date: Date;
    timeSlot: string;
    phone: string;
  } | null>(null);

  // Reset booking completed state when form changes
  const resetBookingState = () => {
    if (bookingCompleted) {
      setBookingCompleted(false);
      setCompletedBookingDetails(null);
    }
  };

  // Add useEffect to reset booking when form fields change - but only if user actively changes them
  useEffect(() => {
    // Only reset if user is actively making changes (not on initial load or automatic resets)
    if (selectedService || selectedDate || selectedTimeSlot || customerInfo.phone.trim()) {
      resetBookingState();
    }
  }, [selectedService, selectedDate, selectedTimeSlot, customerInfo.phone]);

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
    onSuccess: (data, variables) => {
      // Show success message with booking details
      const appointmentDateTime = new Date(variables.appointmentDate);
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

      // Format success message in Korean style as requested: "전화번호님 날짜 시간에 예약이 완료되었습니다"
      const message = `${variables.customerPhone}, your appointment has been successfully booked for ${formattedDate} at ${formattedTime}.`;
      const paymentInfo = variables.isOnlinePayment ? ` Payment of $${variables.finalPrice} processed with 10% discount.` : '';
      
      toast({
        title: "Booking Confirmed!",
        description: message + paymentInfo,
        duration: 6000,
      });
      
      // Mark booking as completed and store booking details - CRITICAL: Do this BEFORE form reset
      setBookingCompleted(true);
      setCompletedBookingDetails({
        service: variables.serviceId,
        date: new Date(variables.appointmentDate),
        timeSlot: variables.timeSlot,
        phone: variables.customerPhone
      });
      
      console.log('Booking completed, Payment button should activate:', {
        bookingCompleted: true,
        completedBookingDetails: {
          service: variables.serviceId,
          date: variables.appointmentDate,
          timeSlot: variables.timeSlot,
          phone: variables.customerPhone
        }
      });
      
      // Don't reset form immediately - this was causing the payment button issue
      // Instead, only reset when user starts a new booking
      setTimeout(() => {
        setSelectedService(null);
        setSelectedTimeSlot('');
        setCustomerInfo({ phone: '', notes: '' });
        setSelectedDate(null);
      }, 100);
      
      // Refetch availability
      refetchAvailability();
    },
    onError: (error: any) => {
      console.error('Booking error:', error);
      let errorMessage = "Failed to book appointment. Please try again.";
      
      if (error.message && (error.message.includes("already booked") || error.message.includes("fully booked"))) {
        errorMessage = "Sorry, this time slot is fully booked. Please select a different time.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
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

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Generate time slots
  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ];

  // Scroll to first missing field
  const scrollToMissingField = () => {
    let targetElement = null;
    
    if (!selectedService) {
      targetElement = document.querySelector('[data-section="services"]');
    } else if (!selectedDate) {
      targetElement = document.querySelector('[data-section="calendar"]');
    } else if (!selectedTimeSlot) {
      targetElement = document.querySelector('[data-section="time-slots"]');
    } else if (!customerInfo.phone.trim()) {
      targetElement = document.querySelector('[data-section="customer-info"]');
    }
    
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Add highlight effect
      targetElement.style.transition = 'all 0.3s ease';
      targetElement.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
      targetElement.style.borderRadius = '8px';
      
      // Remove highlight after 2 seconds
      setTimeout(() => {
        targetElement.style.boxShadow = '';
      }, 2000);
    }
  };

  // Handle form submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!selectedService || !selectedTimeSlot || !selectedDate || !customerInfo.phone.trim()) {
      scrollToMissingField();
      toast({
        title: "Please complete all required fields",
        description: "We've highlighted the section that needs your attention.",
        variant: 'destructive',
      });
      return;
    }

    const selectedServiceData = services.find(s => s.id === selectedService);
    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const finalPrice = isOnlinePayment 
      ? (selectedServiceData?.price || 0) * (1 - onlineBookingDiscount)
      : selectedServiceData?.price || 0;

    createAppointmentMutation.mutate({
      serviceId: selectedService,
      appointmentDate: appointmentDateTime.toISOString(),
      timeSlot: selectedTimeSlot,
      customerName: customerInfo.phone, // Using phone as identifier
      customerPhone: customerInfo.phone,
      customerEmail: '', // Not required anymore
      notes: customerInfo.notes,
      visitReason: selectedServiceData?.name || 'General visit',
      isOnlinePayment,
      finalPrice: Number(finalPrice).toFixed(2)
    });
  };

  // Handle online payment
  const handleOnlinePayment = () => {
    if (!bookingCompleted || !completedBookingDetails) {
      toast({
        title: "Booking Required",
        description: "Please complete your booking first before making payment.",
        variant: 'destructive',
      });
      return;
    }

    const selectedServiceData = services.find(s => s.id === completedBookingDetails.service);
    if (!selectedServiceData) {
      toast({
        title: "Service Not Found",
        description: "Unable to find service details for payment.",
        variant: 'destructive',
      });
      return;
    }

    // Calculate pricing with 10% discount
    const originalPrice = selectedServiceData.price;
    const discountedPrice = Math.round(originalPrice * 0.9 * 100) / 100; // 10% discount

    // Store booking details for payment page
    const paymentData = {
      service: completedBookingDetails.service,
      date: completedBookingDetails.date,
      timeSlot: completedBookingDetails.timeSlot,
      phone: completedBookingDetails.phone,
      originalPrice,
      discountedPrice
    };

    sessionStorage.setItem('pendingBookingPayment', JSON.stringify(paymentData));
    
    toast({
      title: "Redirecting to Payment",
      description: "Opening secure Stripe checkout with card scanning functionality...",
    });
    
    // Redirect to Stripe checkout page using wouter navigation
    setTimeout(() => {
      console.log('Redirecting to /checkout with payment data:', paymentData);
      setLocation('/checkout');
    }, 1000);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => addDays(startOfMonth(prev), -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addDays(endOfMonth(prev), 1));
  };

  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Please select an available date and time to make your reservation</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-4">Simple Booking Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold mb-2">1</div>
                <div className="font-medium text-gray-900 mb-1">Select Date & Time</div>
                <div className="text-sm text-gray-600">Choose your desired appointment date and time</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mb-2">2</div>
                <div className="font-medium text-gray-900 mb-1">Select Service</div>
                <div className="text-sm text-gray-600">Choose your preferred nail art service</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold mb-2">3</div>
                <div className="font-medium text-gray-900 mb-1">Customer Information</div>
                <div className="text-sm text-gray-600">Enter phone number and additional notes</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mb-2">4</div>
                <div className="font-medium text-gray-900 mb-1">Visit Store</div>
                <div className="text-sm text-gray-600">Visit at your scheduled time for quick service</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Date & Time Selection */}
          <div className="space-y-6">
            {/* Date Selection */}
            <Card data-section="calendar">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="w-5 h-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevMonth}
                    className="p-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <h3 className="text-lg font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h3>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextMonth}
                    className="p-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isCurrentDay = isToday(date);
                    const isSelectable = isDateSelectable(date);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => isSelectable && setSelectedDate(date)}
                        disabled={!isSelectable}
                        className={`
                          h-10 w-full text-sm rounded-md transition-colors
                          ${isSelected 
                            ? 'bg-blue-600 text-white' 
                            : isCurrentDay 
                              ? 'bg-blue-100 text-blue-600' 
                              : isSelectable
                                ? 'hover:bg-gray-100 text-gray-900'
                                : 'text-gray-300 cursor-not-allowed'
                          }
                        `}
                      >
                        {format(date, 'd')}
                      </button>
                    );
                  })}
                </div>
                
                {selectedDate && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800 font-medium">
                      Selected Date: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card data-section="time-slots">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5" />
                  Select Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedDate ? (
                  <p className="text-gray-500 text-center py-8">Please select a date first</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => {
                      const isAvailable = availability?.includes(time) !== false;
                      const isSelected = selectedTimeSlot === time;
                      
                      return (
                        <button
                          key={time}
                          onClick={() => isAvailable && setSelectedTimeSlot(time)}
                          disabled={!isAvailable}
                          className={`
                            p-3 text-sm font-medium rounded-md border transition-colors
                            ${isSelected
                              ? 'bg-blue-600 text-white border-blue-600'
                              : isAvailable
                                ? 'bg-white hover:bg-blue-50 border-gray-300 text-gray-900'
                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            }
                          `}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Service & Customer Info */}
          <div className="space-y-6">
            {/* Service Selection */}
            <Card data-section="services">
              <CardHeader className="pb-4">
                <CardTitle>Select Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                    <div key={category}>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {categoryServices.map(service => (
                          <button
                            key={service.id}
                            onClick={() => setSelectedService(service.id)}
                            className={`w-full p-2 rounded-md border text-left transition-colors ${
                              selectedService === service.id
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white hover:bg-blue-50 border-gray-300 text-gray-900'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{service.name}</span>
                              <span className={`text-xs ${
                                selectedService === service.id ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                ${service.price}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card data-section="customer-info">
              <CardHeader className="pb-4">
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number * <span className="text-xs text-gray-500">(Non-members must register before using the service.)</span>
                  </label>
                  <Input
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <Textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special requests or notes..."
                    rows={3}
                    className="w-full resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Booking Summary & Submit */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">
                      {selectedService ? services.find(s => s.id === selectedService)?.name : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedTimeSlot || 'Not selected'}</span>
                  </div>
                  
                  {/* Pricing Section */}
                  {selectedService && (
                    <>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Price:</span>
                          <span className="font-medium">
                            ${services.find(s => s.id === selectedService)?.price || 0}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-green-600">
                          <span>Online Booking Discount (10%):</span>
                          <span className="font-medium">
                            -${((services.find(s => s.id === selectedService)?.price || 0) * onlineBookingDiscount).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                          <span className="text-gray-900">Final Price:</span>
                          <span className="text-green-600">
                            ${((services.find(s => s.id === selectedService)?.price || 0) * (1 - onlineBookingDiscount)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={createAppointmentMutation.isPending || !selectedDate || !selectedTimeSlot || !selectedService || !customerInfo.phone.trim() || bookingCompleted}
                    className={`w-full ${!selectedDate || !selectedTimeSlot || !selectedService || !customerInfo.phone.trim() || bookingCompleted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    size="lg"
                  >
                    {createAppointmentMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Booking...
                      </>
                    ) : bookingCompleted ? (
                      'Booking Completed'
                    ) : (
                      'Book Appointment'
                    )}
                  </Button>
                  
                  {/* Online Payment Discount Message */}
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 text-center font-medium">
                      Online payment provides an additional 10% discount benefit.
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleOnlinePayment}
                    disabled={!bookingCompleted || !completedBookingDetails}
                    className={`w-full ${(bookingCompleted && completedBookingDetails) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    size="lg"
                  >
                    Online Payment Discount (10%)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Online Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-center text-green-600">Payment Processing</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600">온라인 결제 처리중...</p>
                <p className="text-xs text-gray-500">Processing your online payment...</p>
                <p className="text-sm text-green-600 font-medium">
                  💳 10% 할인 적용! ${((services.find(s => s.id === completedBookingDetails?.service)?.price || 0) * onlineBookingDiscount).toFixed(2)} 절약
                </p>
                <p className="text-xs text-green-500">
                  10% discount applied! You're saving ${((services.find(s => s.id === completedBookingDetails?.service)?.price || 0) * onlineBookingDiscount).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}