import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Crown, 
  Star, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Gift, 
  Phone, 
  Mail, 
  MessageSquare,
  Eye,
  Edit,
  UserPlus,
  Filter,
  Download,
  BarChart3,
  Heart,
  Award
} from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  phoneNumber: string;
  email?: string;
  category: string;
  vipLevel: string;
  loyaltyPoints: number;
  totalVisits: number;
  totalSpent: string;
  lastVisit?: string;
  birthday?: string;
  preferredServices?: string[];
  customerRating?: number;
  lifetimeValue: string;
  createdAt: string;
}

interface CustomerProfile {
  customer: Customer;
  visitHistory: any[];
  preferences: any;
  loyaltyInfo: any;
}

export function AdvancedCustomerManagement() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterVipLevel, setFilterVipLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch customers with enhanced data
  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ['/api/customers/enhanced'],
  });

  // Customer analytics
  const { data: analytics = {} } = useQuery<{
    totalCustomers: number;
    vipCustomers: number;
    avgLifetimeValue: string;
    activeThisMonth: number;
  }>({
    queryKey: ['/api/customers/analytics'],
  });

  // Selected customer detailed profile
  const { data: customerProfile = {} } = useQuery<CustomerProfile>({
    queryKey: ['/api/customers/profile', selectedCustomer?.id],
    enabled: !!selectedCustomer,
  });

  // Filter customers
  const filteredCustomers = customers.filter((customer: Customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phoneNumber.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || customer.category === filterCategory;
    const matchesVip = filterVipLevel === 'all' || customer.vipLevel === filterVipLevel;
    
    return matchesSearch && matchesCategory && matchesVip;
  });

  // Update customer VIP level
  const updateVipLevelMutation = useMutation({
    mutationFn: ({ customerId, vipLevel }: { customerId: number; vipLevel: string }) =>
      fetch(`/api/customers/${customerId}/vip-level`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vipLevel })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers/enhanced'] });
      toast({
        title: 'Success',
        description: 'Customer VIP level updated successfully',
      });
    },
  });

  // Add loyalty points
  const addLoyaltyPointsMutation = useMutation({
    mutationFn: ({ customerId, points, reason }: { customerId: number; points: number; reason: string }) =>
      fetch(`/api/customers/${customerId}/loyalty-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points, reason })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers/enhanced'] });
      toast({
        title: 'Success',
        description: 'Loyalty points added successfully',
      });
    },
  });

  const getVipBadgeColor = (vipLevel: string) => {
    switch (vipLevel) {
      case 'diamond': return 'bg-purple-500 text-white';
      case 'platinum': return 'bg-gray-400 text-white';
      case 'gold': return 'bg-yellow-500 text-white';
      case 'silver': return 'bg-gray-300 text-black';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'VIP': return 'bg-red-500 text-white';
      case 'premium': return 'bg-purple-500 text-white';
      case 'booking': return 'bg-green-500 text-white';
      case 'mailing': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Dashboard */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold">{analytics.totalCustomers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">VIP Customers</p>
                  <p className="text-2xl font-bold">{analytics.vipCustomers}</p>
                </div>
                <Crown className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Lifetime Value</p>
                  <p className="text-2xl font-bold">${analytics.avgLifetimeValue}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active This Month</p>
                  <p className="text-2xl font-bold">{analytics.activeThisMonth}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customer List</TabsTrigger>
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <CardTitle>Customer Management</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="booking">Booking</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="mailing">Mailing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterVipLevel} onValueChange={setFilterVipLevel}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="VIP Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="diamond">Diamond</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setShowAddCustomer(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.map((customer: Customer) => (
                  <div key={customer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{customer.name}</h3>
                          <Badge className={getVipBadgeColor(customer.vipLevel)}>
                            {customer.vipLevel.toUpperCase()}
                          </Badge>
                          <Badge className={getCategoryBadgeColor(customer.category)}>
                            {customer.category}
                          </Badge>
                          {customer.customerRating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{customer.customerRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="font-medium">Phone</p>
                            <p>{customer.phoneNumber}</p>
                          </div>
                          <div>
                            <p className="font-medium">Visits</p>
                            <p>{customer.totalVisits}</p>
                          </div>
                          <div>
                            <p className="font-medium">Total Spent</p>
                            <p>${customer.totalSpent}</p>
                          </div>
                          <div>
                            <p className="font-medium">Loyalty Points</p>
                            <p>{customer.loyaltyPoints}</p>
                          </div>
                        </div>

                        {customer.preferredServices && customer.preferredServices.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-600 mb-1">Preferred Services:</p>
                            <div className="flex flex-wrap gap-1">
                              {customer.preferredServices.map((service, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                        
                        <Select
                          value={customer.vipLevel}
                          onValueChange={(value) => updateVipLevelMutation.mutate({
                            customerId: customer.id,
                            vipLevel: value
                          })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="silver">Silver</SelectItem>
                            <SelectItem value="gold">Gold</SelectItem>
                            <SelectItem value="platinum">Platinum</SelectItem>
                            <SelectItem value="diamond">Diamond</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const points = prompt('Enter loyalty points to add:');
                            const reason = prompt('Reason for adding points:');
                            if (points && reason) {
                              addLoyaltyPointsMutation.mutate({
                                customerId: customer.id,
                                points: parseInt(points),
                                reason
                              });
                            }
                          }}
                        >
                          <Gift className="h-4 w-4 mr-1" />
                          Add Points
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Customer segmentation features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Loyalty program management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Advanced analytics features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Customer Profile Modal */}
      {selectedCustomer && customerProfile && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Profile - {selectedCustomer.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Customer Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-xl">
                          {selectedCustomer.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-semibold">{selectedCustomer.name}</h3>
                      <p className="text-sm text-gray-600">{selectedCustomer.phoneNumber}</p>
                      <div className="flex justify-center gap-2 mt-2">
                        <Badge className={getVipBadgeColor(selectedCustomer.vipLevel)}>
                          {selectedCustomer.vipLevel.toUpperCase()}
                        </Badge>
                        <Badge className={getCategoryBadgeColor(selectedCustomer.category)}>
                          {selectedCustomer.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Visit Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Visits:</span>
                        <span className="font-medium">{selectedCustomer.totalVisits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Spent:</span>
                        <span className="font-medium">${selectedCustomer.totalSpent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. per Visit:</span>
                        <span className="font-medium">
                          ${selectedCustomer.totalVisits > 0 
                            ? (parseFloat(selectedCustomer.totalSpent) / selectedCustomer.totalVisits).toFixed(2)
                            : '0.00'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Lifetime Value:</span>
                        <span className="font-medium">${selectedCustomer.lifetimeValue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Loyalty Program</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Points:</span>
                        <span className="font-medium">{selectedCustomer.loyaltyPoints}</span>
                      </div>
                      {customerProfile.loyaltyInfo && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Tier Level:</span>
                            <span className="font-medium">{customerProfile.loyaltyInfo.tierLevel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Earned:</span>
                            <span className="font-medium">{customerProfile.loyaltyInfo.totalPointsEarned}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Visit History */}
              {customerProfile.visitHistory && customerProfile.visitHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Visit History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {customerProfile.visitHistory.slice(0, 5).map((visit: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{new Date(visit.visitDate).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600">
                              {visit.serviceNames?.join(', ') || 'Service details not available'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${visit.totalAmount}</p>
                            {visit.customerSatisfaction && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm">{visit.customerSatisfaction}/5</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}