import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Phone, MapPin, DollarSign } from 'lucide-react';

interface Booking {
  id: number;
  bookingDate: string;
  timeSlot: string;
  status: string;
  visitReason: string;
  serviceDetails: string;
  price: string;
  duration: number;
  notes: string | null;
  createdAt: string;
}

interface Customer {
  id: number;
  name: string;
  phoneNumber: string;
  email: string | null;
  category: string;
  totalVisits: number;
  totalSpent: string;
}

interface BookingHistoryData {
  customer: Customer;
  bookings: Booking[];
  totalBookings: number;
}

export default function BookingHistory() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookingData, setBookingData] = useState<BookingHistoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const searchCustomerBookings = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/customer/${phoneNumber}/booking-history`);
      if (response.ok) {
        const data = await response.json();
        setBookingData(data);
        setActiveTab('all');
      } else {
        setError('Customer not found or no booking history');
        setBookingData(null);
      }
    } catch (error) {
      console.error('Error fetching booking history:', error);
      setError('Failed to fetch booking history');
      setBookingData(null);
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterBookings = (bookings: Booking[], filter: string) => {
    if (filter === 'all') return bookings;
    return bookings.filter(booking => booking.status.toLowerCase() === filter);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="mb-4 hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-purple-700">
            {booking.serviceDetails}
          </CardTitle>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(booking.bookingDate)}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {booking.timeSlot} ({booking.duration}분)
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            ${booking.price}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Visit Reason:</span>
            <p className="text-gray-600">{booking.visitReason}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Booking ID:</span>
            <p className="text-gray-600">#{booking.id}</p>
          </div>
        </div>
        
        {booking.notes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="font-medium text-gray-700">Notes:</span>
            <p className="text-gray-600 mt-1">{booking.notes}</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          Booking created: {formatDate(booking.createdAt)}
        </div>
      </CardContent>
    </Card>
  );

  const getBookingStats = (bookings: Booking[]) => {
    const total = bookings.length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const upcoming = bookings.filter(b => b.status === 'scheduled' || b.status === 'confirmed').length;
    const totalSpent = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + parseFloat(b.price || '0'), 0);

    return { total, completed, upcoming, totalSpent };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            🗓️ Booking History
          </h1>
          <p className="text-gray-600 text-lg">
            Search customer booking history by phone number
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-purple-600" />
              Customer Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                type="tel"
                placeholder="Enter phone number (e.g., 010-1234-5678)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && searchCustomerBookings()}
              />
              <Button 
                onClick={searchCustomerBookings}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Searching...' : 'Search Bookings'}
              </Button>
            </div>
            {error && (
              <p className="text-red-600 mt-2">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Customer Information and Booking Data */}
        {bookingData && (
          <div className="space-y-6">
            {/* Customer Summary */}
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center text-purple-800">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Contact Details</h3>
                    <p className="text-lg font-medium">{bookingData.customer.name}</p>
                    <p className="text-gray-600">{bookingData.customer.phoneNumber}</p>
                    {bookingData.customer.email && (
                      <p className="text-gray-600">{bookingData.customer.email}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Customer Status</h3>
                    <Badge variant="outline" className="mb-2">
                      {bookingData.customer.category.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Total Visits: {bookingData.customer.totalVisits}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Booking Statistics</h3>
                    {(() => {
                      const stats = getBookingStats(bookingData.bookings);
                      return (
                        <div className="space-y-1 text-sm">
                          <p>Total Bookings: {stats.total}</p>
                          <p>Completed: {stats.completed}</p>
                          <p>Upcoming: {stats.upcoming}</p>
                          <p className="font-medium">Total Spent: ${stats.totalSpent.toFixed(2)}</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  Booking History ({bookingData.totalBookings} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All ({bookingData.bookings.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-6">
                    <div className="space-y-4">
                      {bookingData.bookings.length > 0 ? (
                        bookingData.bookings.map(renderBookingCard)
                      ) : (
                        <p className="text-center text-gray-500 py-8">No bookings found</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  {['completed', 'scheduled', 'confirmed', 'cancelled'].map(status => (
                    <TabsContent key={status} value={status} className="mt-6">
                      <div className="space-y-4">
                        {(() => {
                          const filtered = filterBookings(bookingData.bookings, status);
                          return filtered.length > 0 ? (
                            filtered.map(renderBookingCard)
                          ) : (
                            <p className="text-center text-gray-500 py-8">
                              No {status} bookings found
                            </p>
                          );
                        })()}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}