import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Phone, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomerReservationFormProps {
  onReservationSubmit: (data: any) => void;
}

export function CustomerReservationForm({ onReservationSubmit }: CustomerReservationFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerPhone: '',
    customerName: '',
    appointmentDate: '',
    timeSlot: '',
    notes: ''
  });

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerPhone || !formData.customerName || !formData.appointmentDate || !formData.timeSlot) {
      toast({
        title: "Input Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Show success message with booking details
    const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.timeSlot}`);
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
      description: `${formData.customerPhone}, your appointment has been successfully booked for ${formattedDate} at ${formattedTime}.`,
      duration: 5000,
    });

    onReservationSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-lg text-gray-700">
          Please enter customer information and preferred appointment date and time for your booking
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="customerPhone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Customer Phone Number *
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="(123) 456-7890"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="customerName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Name *
            </Label>
            <Input
              id="customerName"
              type="text"
              placeholder="John Smith"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="appointmentDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Preferred Appointment Date *
            </Label>
            <Input
              id="appointmentDate"
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
              className="mt-1"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label htmlFor="timeSlot" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Preferred Appointment Time *
            </Label>
            <select
              id="timeSlot"
              value={formData.timeSlot}
              onChange={(e) => handleInputChange('timeSlot', e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Please select a time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Additional Notes
        </Label>
        <Textarea
          id="notes"
          placeholder="Please enter any special requests or allergy information"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm">ℹ</span>
            </div>
            <div>
              <p className="text-blue-800 font-medium mb-1">Booking Information</p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• AI nail art is pre-made after payment, reducing treatment time during your visit</li>
                <li>• Please contact us at least 1 day in advance for appointment changes after confirmation</li>
                <li>• Business hours: Monday-Friday 10:00-19:00 (Closed weekends)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          type="submit" 
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-3"
        >
          Book Appointment
        </Button>
      </div>
    </form>
  );
}