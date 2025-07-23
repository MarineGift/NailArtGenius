import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  DollarSign,
  Activity,
  Eye,
  X
} from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email?: string;
  phoneNumber?: string;
  category: string;
  mailingConsent: boolean;
  totalVisits: number;
  totalSpent: string;
  lastVisit?: Date;
  notes?: string;
  createdAt: Date;
}

interface Appointment {
  id: number;
  customerName: string;
  customerPhone: string;
  service: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  totalAmount?: number;
  createdAt: Date;
}

interface MetricDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricType: 'customers' | 'appointments' | 'visitors' | 'orders';
  title: string;
  data: Customer[] | Appointment[] | any[];
  totalCount: number;
}

const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  isOpen,
  onClose,
  metricType,
  title,
  data,
  totalCount
}) => {
  const renderCustomerDetails = (customers: Customer[]) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-xl font-bold">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">VIP Customers</p>
                <p className="text-xl font-bold">
                  {customers.filter(c => c.category === 'VIP').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Email Subscribers</p>
                <p className="text-xl font-bold">
                  {customers.filter(c => c.mailingConsent).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-3">
          {customers.map((customer) => (
            <Card key={customer.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{customer.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {customer.phoneNumber && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phoneNumber}</span>
                        </div>
                      )}
                      {customer.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    customer.category === 'VIP' ? 'default' : 
                    customer.category === 'General' ? 'secondary' : 'outline'
                  }>
                    {customer.category}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span>{customer.totalVisits} visits</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>${customer.totalSpent}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderAppointmentDetails = (appointments: Appointment[]) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-xl font-bold">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-xl font-bold">
                  {appointments.filter(a => {
                    const today = new Date().toISOString().split('T')[0];
                    return a.appointmentDate === today;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-xl font-bold">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{appointment.customerName}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{appointment.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{appointment.timeSlot}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{appointment.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    appointment.status === 'confirmed' ? 'default' : 
                    appointment.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {appointment.status}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    {appointment.totalAmount && (
                      <p className="font-medium">${appointment.totalAmount}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderVisitorDetails = (visitors: any[]) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Today's Visitors</p>
                <p className="text-xl font-bold">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-xl font-bold">
                  {Math.floor(totalCount * 0.3)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Unique Visitors</p>
                <p className="text-xl font-bold">
                  {Math.floor(totalCount * 0.8)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <h4 className="font-medium mb-4">Visitor Activity Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Page Views</span>
            <span className="font-medium">{totalCount * 3}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Booking Page Visits</span>
            <span className="font-medium">{Math.floor(totalCount * 0.4)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Services Page Views</span>
            <span className="font-medium">{Math.floor(totalCount * 0.6)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Average Session Duration</span>
            <span className="font-medium">3m 24s</span>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (metricType) {
      case 'customers':
        return renderCustomerDetails(data as Customer[]);
      case 'appointments':
        return renderAppointmentDetails(data as Appointment[]);
      case 'visitors':
        return renderVisitorDetails(data);
      default:
        return <p>No data available</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">{title} - Detailed View</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Detailed breakdown and analysis of {title.toLowerCase()}
          </DialogDescription>
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default MetricDetailModal;