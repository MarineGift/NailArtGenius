import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { Phone, Hand, Palette, Clock, Sparkles, Camera, Bot, Calendar, ShoppingBag, Eye, User } from 'lucide-react';
import type { CustomerNailInfo, Customer, Appointment } from '@shared/schema';

interface CustomerComprehensiveData {
  customer: Customer;
  appointments: Appointment[];
  nailInfo: CustomerNailInfo[];
  aiNailArt: any[];
  purchases: any[];
  visits: any[];
  summary: {
    totalAppointments: number;
    totalNailSessions: number;
    totalAiNailArt: number;
    totalPurchases: number;
    totalVisits: number;
    totalSpent: string;
    lastVisit: string | null;
  };
}

export function CustomerNailInfo() {
  const [location, setLocation] = useLocation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerData, setCustomerData] = useState<CustomerComprehensiveData | null>(null);
  const [nailInfo, setNailInfo] = useState<CustomerNailInfo[]>([]);
  const [latestSession, setLatestSession] = useState<CustomerNailInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  const fingerNames = {
    'left_thumb': 'Left Thumb',
    'left_index': 'Left Index',
    'left_middle': 'Left Middle',
    'left_ring': 'Left Ring',
    'left_pinky': 'Left Pinky',
    'right_thumb': 'Right Thumb',
    'right_index': 'Right Index',
    'right_middle': 'Right Middle',
    'right_ring': 'Right Ring',
    'right_pinky': 'Right Pinky'
  };

  const searchCustomerNails = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get comprehensive customer information
      const comprehensiveResponse = await fetch(`/api/customer/${phoneNumber}/comprehensive`);
      if (comprehensiveResponse.ok) {
        const comprehensiveData = await comprehensiveResponse.json();
        setCustomerData(comprehensiveData);
        setActiveTab('overview');
      } else {
        setError('Customer not found');
        return;
      }

      // Get all nail info for this customer
      const response = await fetch(`/api/customer/${phoneNumber}/nail-info`);
      if (response.ok) {
        const data = await response.json();
        setNailInfo(data);
      }

      // Get latest session nail info
      const latestResponse = await fetch(`/api/customer/${phoneNumber}/nail-info/latest`);
      if (latestResponse.ok) {
        const latestData = await latestResponse.json();
        setLatestSession(latestData);
      }
    } catch (error) {
      console.error('Error fetching customer info:', error);
      setError('Failed to fetch customer information');
    }

    setLoading(false);
  };

  const renderNailCard = (nail: CustomerNailInfo) => (
    <Card key={nail.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-purple-700">
            {fingerNames[nail.fingerPosition as keyof typeof fingerNames]}
          </CardTitle>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {nail.designStyle}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600">
          Session: {nail.sessionId}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Images */}
        <div className="grid grid-cols-2 gap-2">
          {nail.originalImagePath && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">Original</p>
              <img 
                src={nail.originalImagePath} 
                alt="Original nail" 
                className="w-full h-20 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          {nail.aiGeneratedImagePath && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">AI Design</p>
              <img 
                src={nail.aiGeneratedImagePath} 
                alt="AI generated design" 
                className="w-full h-20 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Nail Information */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Hand className="h-4 w-4 text-purple-500" />
            <span className="font-medium">Shape:</span>
            <span className="text-gray-600">{nail.nailShape}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Length:</span>
            <span className="text-gray-600">{nail.nailLength}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Condition:</span>
            <span className="text-gray-600">{nail.nailCondition}</span>
          </div>
        </div>

        {/* Color Preferences */}
        {nail.colorPreferences && nail.colorPreferences.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Colors:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {nail.colorPreferences.map((color, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {color}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Design Prompt */}
        {nail.designPrompt && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">AI Prompt:</span>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {nail.designPrompt}
            </p>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Created: {nail.createdAt ? new Date(nail.createdAt).toLocaleDateString() : 'Unknown'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Nail Information</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View your nail art designs and information stored in our AI system. 
            Enter your phone number to access your nail profile.
          </p>
        </div>

        {/* Phone Number Search */}
        <Card className="max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-purple-600" />
              <span>Find Your Nail Info</span>
            </CardTitle>
            <CardDescription>
              Enter your phone number to view your nail art history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="010-1234-5678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchCustomerNails()}
            />
            <Button 
              onClick={searchCustomerNails} 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Searching...' : 'Search Nail Info'}
            </Button>
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {customerData && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-4xl mx-auto">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Appointments ({customerData.summary.totalAppointments})</span>
              </TabsTrigger>
              <TabsTrigger value="nails" className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Nail Art ({customerData.summary.totalNailSessions})</span>
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Purchases ({customerData.summary.totalPurchases})</span>
              </TabsTrigger>
              <TabsTrigger value="visits" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Visits ({customerData.summary.totalVisits})</span>
              </TabsTrigger>
            </TabsList>

            {/* Customer Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{customerData.customer.name}</h2>
                <p className="text-lg text-gray-600">{customerData.customer.phoneNumber}</p>
                <Badge className="mt-2" variant={customerData.customer.category === 'VIP' ? 'default' : 'secondary'}>
                  {customerData.customer.category}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span>Appointments</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{customerData.summary.totalAppointments}</div>
                    <p className="text-sm text-gray-600">Total bookings</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Hand className="h-5 w-5 text-purple-500" />
                      <span>Nail Sessions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{customerData.summary.totalNailSessions}</div>
                    <p className="text-sm text-gray-600">AI designs created</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <ShoppingBag className="h-5 w-5 text-green-500" />
                      <span>Purchases</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${customerData.summary.totalSpent}</div>
                    <p className="text-sm text-gray-600">Total spent</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-orange-500" />
                      <span>Visits</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{customerData.summary.totalVisits}</div>
                    <p className="text-sm text-gray-600">Store visits</p>
                  </CardContent>
                </Card>
              </div>

              {customerData.customer.lastVisit && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Last Visit</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{new Date(customerData.customer.lastVisit).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Appointment History</h3>
              {customerData.appointments.length > 0 ? (
                <div className="space-y-4">
                  {customerData.appointments.map((appointment, index) => (
                    <Card key={appointment.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{appointment.serviceDetails}</CardTitle>
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.timeSlot}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Visit Reason:</p>
                            <p className="text-sm text-gray-600">{appointment.visitReason}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Price:</p>
                            <p className="text-sm text-gray-600">${appointment.price}</p>
                          </div>
                        </div>
                        {appointment.notes && (
                          <div className="mt-4">
                            <p className="text-sm font-medium">Notes:</p>
                            <p className="text-sm text-gray-600">{appointment.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No appointments found</p>
                </div>
              )}
            </TabsContent>

            {/* Nail Art Tab */}
            <TabsContent value="nails" className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Nail Art History</h3>
              {customerData.nailInfo.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {customerData.nailInfo.map(renderNailCard)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No nail art sessions found</p>
                </div>
              )}
            </TabsContent>

            {/* Purchases Tab */}
            <TabsContent value="purchases" className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Purchase History</h3>
              {customerData.purchases.length > 0 ? (
                <div className="space-y-4">
                  {customerData.purchases.map((purchase, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{purchase.productName || 'Service Purchase'}</CardTitle>
                          <Badge variant="default">
                            ${purchase.amount}
                          </Badge>
                        </div>
                        <CardDescription>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Payment Method:</p>
                            <p className="text-sm text-gray-600">{purchase.paymentMethod || 'Cash'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Quantity:</p>
                            <p className="text-sm text-gray-600">{purchase.quantity || 1}</p>
                          </div>
                        </div>
                        {purchase.notes && (
                          <div className="mt-4">
                            <p className="text-sm font-medium">Notes:</p>
                            <p className="text-sm text-gray-600">{purchase.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No purchases found</p>
                </div>
              )}
            </TabsContent>

            {/* Visits Tab */}
            <TabsContent value="visits" className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Visit History</h3>
              {customerData.visits.length > 0 ? (
                <div className="space-y-4">
                  {customerData.visits.map((visit, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{visit.visitType}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {visit.satisfaction && (
                              <Badge variant="outline">
                                {'★'.repeat(visit.satisfaction)} ({visit.satisfaction}/5)
                              </Badge>
                            )}
                            <Badge variant="default">
                              ${visit.totalAmount}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>
                          {new Date(visit.visitDate).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Services Received:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {visit.servicesReceived?.map((service, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {service}
                                </Badge>
                              )) || <span className="text-sm text-gray-600">None specified</span>}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Payment Method:</p>
                            <p className="text-sm text-gray-600">{visit.paymentMethod}</p>
                          </div>
                        </div>
                        {visit.visitNotes && (
                          <div className="mt-4">
                            <p className="text-sm font-medium">Visit Notes:</p>
                            <p className="text-sm text-gray-600">{visit.visitNotes}</p>
                          </div>
                        )}
                        {visit.nextAppointment && (
                          <div className="mt-4">
                            <p className="text-sm font-medium">Next Appointment:</p>
                            <p className="text-sm text-gray-600">{new Date(visit.nextAppointment).toLocaleDateString()}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No visit history found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* No Results State */}
        {!customerData && phoneNumber && !loading && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Hand className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Customer Information Found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any information for this phone number.
            </p>
            <Button onClick={() => setLocation('/')} variant="outline">
              Return Home
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}