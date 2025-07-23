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
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
        title: "Booking Successful",
        description: "Your appointment has been booked successfully!",
      });
      
      // Reset form
      setSelectedService(null);
      setSelectedTimeSlot('');
      setCustomerInfo({ name: '', phone: '', email: '', notes: '' });
      setSelectedDate(null);
      
      // Refetch availability
      refetchAvailability();
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedTimeSlot || !selectedDate || !customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
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
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email,
      notes: customerInfo.notes,
      visitReason: selectedServiceData?.name || 'General visit'
    });
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
          <p className="text-gray-600">Choose your preferred date and time for your visit</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Date & Time Selection */}
          <div className="space-y-6">
            {/* Date Selection */}
            <Card>
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
            <Card>
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
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Select Service</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedService?.toString() || ''} onValueChange={(value) => setSelectedService(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-sm font-semibold text-gray-500 uppercase">
                          {category}
                        </div>
                        {categoryServices.map(service => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            <div className="flex justify-between items-center w-full">
                              <span>{service.name}</span>
                              <span className="text-sm text-gray-500 ml-2">${service.price}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
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
                    Email Address
                  </label>
                  <Input
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    type="email"
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-green-600">
                      {selectedService ? `$${services.find(s => s.id === selectedService)?.price}` : '$0'}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={createAppointmentMutation.isPending || !selectedDate || !selectedTimeSlot || !selectedService || !customerInfo.name || !customerInfo.phone}
                  className="w-full"
                  size="lg"
                >
                  {createAppointmentMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Booking...
                    </>
                  ) : (
                    'Book Appointment'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}