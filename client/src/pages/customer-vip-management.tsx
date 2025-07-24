import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Users, 
  Star, 
  TrendingUp, 
  Award,
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  Gift
} from 'lucide-react';
import Header from "@/components/header";
import Footer from "@/components/footer";

interface VIPCustomer {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  vipLevel: 'regular' | 'silver' | 'gold' | 'platinum' | 'diamond';
  loyaltyPoints: number;
  lifetimeValue: number;
  totalVisits: number;
  lastVisit: string;
  preferences: string[];
  satisfactionRating: number;
}

export default function CustomerVIPManagement() {
  const [customers, setCustomers] = useState<VIPCustomer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<VIPCustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVIPLevel, setSelectedVIPLevel] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalVIPCustomers: 0,
    diamondCustomers: 0,
    platinumCustomers: 0,
    goldCustomers: 0,
    silverCustomers: 0,
    averageLifetimeValue: 0,
    totalLoyaltyPoints: 0
  });

  useEffect(() => {
    loadCustomersData();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, selectedVIPLevel, customers]);

  const loadCustomersData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/customers/enhanced', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        calculateAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = (customersData: VIPCustomer[]) => {
    const analytics = {
      totalVIPCustomers: customersData.length,
      diamondCustomers: customersData.filter(c => c.vipLevel === 'diamond').length,
      platinumCustomers: customersData.filter(c => c.vipLevel === 'platinum').length,
      goldCustomers: customersData.filter(c => c.vipLevel === 'gold').length,
      silverCustomers: customersData.filter(c => c.vipLevel === 'silver').length,
      averageLifetimeValue: customersData.reduce((sum, c) => sum + c.lifetimeValue, 0) / customersData.length,
      totalLoyaltyPoints: customersData.reduce((sum, c) => sum + c.loyaltyPoints, 0)
    };
    setAnalytics(analytics);
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedVIPLevel !== 'all') {
      filtered = filtered.filter(customer => customer.vipLevel === selectedVIPLevel);
    }

    setFilteredCustomers(filtered);
  };

  const getVIPBadgeColor = (level: string) => {
    switch (level) {
      case 'diamond': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'platinum': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getVIPIcon = (level: string) => {
    switch (level) {
      case 'diamond': return <Award className="h-4 w-4" />;
      case 'platinum': return <Crown className="h-4 w-4" />;
      case 'gold': return <Star className="h-4 w-4" />;
      case 'silver': return <Gift className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const upgradeVIPLevel = async (customerId: number, newLevel: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/customers/${customerId}/vip-level`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vipLevel: newLevel })
      });

      if (response.ok) {
        loadCustomersData();
      }
    } catch (error) {
      console.error('Failed to upgrade VIP level:', error);
    }
  };

  const addLoyaltyPoints = async (customerId: number, points: number, reason: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/customers/${customerId}/loyalty-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ points, reason })
      });

      if (response.ok) {
        loadCustomersData();
      }
    } catch (error) {
      console.error('Failed to add loyalty points:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Header />
        <main className="flex items-center justify-center px-4 py-16">
          <div className="text-lg text-gray-600">Loading VIP customer data...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            VIP Customer Management
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Advanced customer relationship management with VIP levels and loyalty programs
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-diamond-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Diamond VIP</p>
                  <p className="text-2xl font-bold text-blue-900">{analytics.diamondCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Crown className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Platinum VIP</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.platinumCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Star className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Gold VIP</p>
                  <p className="text-2xl font-bold text-yellow-900">{analytics.goldCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Lifetime Value</p>
                  <p className="text-2xl font-bold text-purple-900">
                    ${Math.round(analytics.averageLifetimeValue).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-500 h-4 w-4" />
                <select
                  value={selectedVIPLevel}
                  onChange={(e) => setSelectedVIPLevel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All VIP Levels</option>
                  <option value="diamond">Diamond</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="regular">Regular</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>VIP Customers ({filteredCustomers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">VIP Level</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Loyalty Points</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Lifetime Value</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Total Visits</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Last Visit</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-600">{customer.phoneNumber}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`${getVIPBadgeColor(customer.vipLevel)} flex items-center space-x-1 w-fit`}>
                          {getVIPIcon(customer.vipLevel)}
                          <span className="capitalize">{customer.vipLevel}</span>
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{customer.loyaltyPoints.toLocaleString()}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addLoyaltyPoints(customer.id, 100, 'Manual addition')}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">${customer.lifetimeValue.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span>{customer.totalVisits} visits</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {new Date(customer.lastVisit).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <select
                            value={customer.vipLevel}
                            onChange={(e) => upgradeVIPLevel(customer.id, e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="regular">Regular</option>
                            <option value="silver">Silver</option>
                            <option value="gold">Gold</option>
                            <option value="platinum">Platinum</option>
                            <option value="diamond">Diamond</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}