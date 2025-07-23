import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Calendar, 
  ShoppingBag, 
  Mail, 
  Settings, 
  LogOut,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Send,
  UserPlus,
  Activity,
  TrendingUp,
  Clock,
  AlertCircle,
  Upload,
  Image,
  Plus,
  MessageSquare
} from 'lucide-react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ContactInquiriesManagement } from "@/components/contact-inquiries-management";
import MetricDetailModal from "@/components/MetricDetailModal";

interface AdminStats {
  totalCustomers: number;
  totalAppointments: number;
  totalOrders: number;
  totalUsers: number;
  todayAppointments: number;
  recentCustomers: any[];
  recentAppointments: any[];
}

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

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    level: 'Customer'
  });
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Carousel management state
  const [carouselImages, setCarouselImages] = useState<any[]>([]);
  const [showCreateImageForm, setShowCreateImageForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newCarouselImage, setNewCarouselImage] = useState({
    page: 'home',
    headerText: '',
    detailedDescription: '',
    displayOrder: 0
  });

  // Modal state for metric details
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    metricType: 'customers' as 'customers' | 'appointments' | 'visitors' | 'orders',
    title: '',
    data: [] as any[],
    totalCount: 0
  });
  
  // Test modal state
  const [testModalOpen, setTestModalOpen] = useState(false);

  useEffect(() => {
    checkAdminAuth();
    loadDashboardData();
    loadCarouselImages();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      setLocation('/admin-login');
      return;
    }
    
    try {
      setAdminUser(JSON.parse(user));
    } catch (error) {
      console.error('Invalid admin user data:', error);
      setLocation('/admin-login');
    }
  };

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLocation('/admin-login');
        return;
      }

      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setLocation('/admin-login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to load dashboard data.');
      }
    } catch (error) {
      setError('Server connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomers = async (category?: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const url = category ? `/api/admin/customers?category=${category}` : '/api/admin/customers';
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        return data;
      }
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
    return [];
  };

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return [];

      const response = await fetch('/api/admin/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Failed to load appointments:', error);
    }
    return [];
  };

  const handleMetricClick = async (metricType: 'customers' | 'appointments' | 'visitors' | 'orders', title: string, totalCount: number) => {
    console.log('🚀 METRIC CLICK HANDLER CALLED:', metricType, title, totalCount);
    console.log('🚀 Current detailModal state:', detailModal);
    
    let data: any[] = [];
    
    switch (metricType) {
      case 'customers':
        data = await loadCustomers();
        break;
      case 'appointments':
        data = await loadAppointments();
        break;
      case 'visitors':
        // Generate sample visitor data for today
        data = Array.from({ length: totalCount }, (_, i) => ({
          id: i + 1,
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          page: ['/booking', '/services', '/', '/contact'][Math.floor(Math.random() * 4)],
          userAgent: 'Sample Browser',
          sessionId: `session_${i + 1}`
        }));
        break;
      case 'orders':
        // This would load actual order data
        data = [];
        break;
    }

    setDetailModal({
      isOpen: true,
      metricType,
      title,
      data,
      totalCount
    });
    
    console.log('🎯 Modal state set:', { 
      isOpen: true, 
      metricType, 
      title, 
      dataLength: data.length, 
      totalCount 
    });
    
    // Force re-render to ensure modal opens
    setTimeout(() => {
      console.log('🎯 Final modal state check:', detailModal);
      console.log('🎯 State object references:', { detailModal });
    }, 100);
  };

  const closeDetailModal = () => {
    setDetailModal({
      isOpen: false,
      metricType: 'customers',
      title: '',
      data: [],
      totalCount: 0
    });
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setLocation('/admin-login');
    }
  };

  const handleCreateUser = async () => {
    try {
      setError('');
      
      if (!newUser.username || !newUser.password || !newUser.firstName || !newUser.lastName) {
        setError('All required fields must be filled.');
        return;
      }

      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLocation('/admin-login');
        return;
      }

      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();

      if (response.ok) {
        setShowCreateUserForm(false);
        setNewUser({
          username: '',
          password: '',
          firstName: '',
          lastName: '',
          email: '',
          level: 'Customer'
        });
        loadDashboardData(); // Refresh data
        alert('User created successfully!');
      } else {
        setError(data.message || 'Failed to create user.');
      }
    } catch (error) {
      console.error('Create user error:', error);
      setError('Failed to create user.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (response.ok) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setError('');
        alert('Password changed successfully.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to change password.');
      }
    } catch (error) {
      setError('Server connection failed.');
    }
  };

  const loadCarouselImages = async () => {
    try {
      const response = await fetch('/api/admin/carousel-images');
      if (response.ok) {
        const images = await response.json();
        setCarouselImages(images);
      }
    } catch (error) {
      console.error('Error loading carousel images:', error);
    }
  };

  const handleCreateCarouselImage = async () => {
    try {
      if (!selectedFile) {
        setError('Please select an image file.');
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('page', newCarouselImage.page);
      formData.append('headerText', newCarouselImage.headerText);
      formData.append('detailedDescription', newCarouselImage.detailedDescription);
      formData.append('displayOrder', newCarouselImage.displayOrder.toString());

      const response = await fetch('/api/admin/carousel-images', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setShowCreateImageForm(false);
        setSelectedFile(null);
        setNewCarouselImage({
          page: 'home',
          headerText: '',
          detailedDescription: '',
          displayOrder: 0
        });
        loadCarouselImages();
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create carousel image.');
      }
    } catch (error) {
      console.error('Error creating carousel image:', error);
      setError('Failed to create carousel image.');
    }
  };

  const handleDeleteCarouselImage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this carousel image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/carousel-images/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadCarouselImages();
      } else {
        setError('Failed to delete carousel image.');
      }
    } catch (error) {
      console.error('Error deleting carousel image:', error);
      setError('Failed to delete carousel image.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Header />
        <main className="flex items-center justify-center px-4 py-16">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
            <p className="text-lg text-gray-600">Loading admin panel...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Emergency Test Button */}
        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded">
          <h3 className="font-bold text-red-800">Emergency Test Zone</h3>
          <Button 
            onClick={() => {
              console.log('🆘 Emergency test button clicked!');
              setTestModalOpen(true);
              alert('Test click worked!');
            }}
            className="mt-2 bg-red-600 hover:bg-red-700"
          >
            Click Test (Should show alert)
          </Button>
          <p className="mt-2 text-sm text-red-700">
            Modal Debug State: isOpen={detailModal.isOpen ? 'TRUE' : 'FALSE'}, type={detailModal.metricType}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>User Management</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Customer Management</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Appointment Management</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Contact US</span>
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Mailing</span>
            </TabsTrigger>
            <TabsTrigger value="carousel" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Carousel Images</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔥 Customer card clicked! Stats:', stats);
                  handleMetricClick('customers', 'Total Customers', stats?.totalCustomers || 0);
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
                  <p className="text-xs text-muted-foreground">All registered customers - Click for details</p>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔥 Appointments card clicked! Stats:', stats);
                  handleMetricClick('appointments', 'Total Appointments', stats?.totalAppointments || 0);
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
                  <p className="text-xs text-muted-foreground">All appointment bookings - Click for details</p>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-yellow-300"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔥 Visitors card clicked! Stats:', stats);
                  handleMetricClick('visitors', "Today's Visitors", stats?.todayAppointments || 12);
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.todayAppointments || 12}</div>
                  <p className="text-xs text-muted-foreground">Today's website visitors - Click for details</p>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-red-300"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔥 Orders card clicked! Stats:', stats);
                  handleMetricClick('orders', 'Total Orders', stats?.totalOrders || 0);
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                  <p className="text-xs text-muted-foreground">All order transactions - Click for details</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentCustomers?.slice(0, 5).map((customer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.phoneNumber}</p>
                        </div>
                        <Badge variant="outline">{customer.category}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentAppointments?.slice(0, 5).map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">예약 #{appointment.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} {appointment.timeSlot}
                          </p>
                        </div>
                        <Badge 
                          variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">고객 관리</h2>
              <div className="flex space-x-2">
                <Button onClick={() => loadCustomers()} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  새로고침
                </Button>
                <Button onClick={() => loadCustomers('mailing')} variant="outline">
                  메일링 고객
                </Button>
                <Button onClick={() => loadCustomers('booking')} variant="outline">
                  예약 고객
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">이름</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">연락처</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">이메일</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">카테고리</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">방문횟수</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">총 지출</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">작업</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {customer.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {customer.phoneNumber || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {customer.email || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{customer.category}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {customer.totalVisits}회
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            ₩{parseFloat(customer.totalSpent).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <h2 className="text-2xl font-bold">예약 관리</h2>
            <Card>
              <CardContent>
                <p className="text-center text-gray-600 py-8">예약 관리 기능을 준비 중입니다.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <ContactInquiriesManagement />
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <h2 className="text-2xl font-bold">메일링 관리</h2>
            <Card>
              <CardContent>
                <p className="text-center text-gray-600 py-8">메일링 기능을 준비 중입니다.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  User Management
                  <Button 
                    onClick={() => setShowCreateUserForm(!showCreateUserForm)}
                    className="flex items-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Create User</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showCreateUserForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Create New User</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                            placeholder="Enter username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            placeholder="Enter password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                            placeholder="Enter last name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            placeholder="Enter email (optional)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="level">Level</Label>
                          <select
                            id="level"
                            value={newUser.level}
                            onChange={(e) => setNewUser({...newUser, level: e.target.value})}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="Customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setShowCreateUserForm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateUser}>
                          Create User
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="space-y-4">
                  {stats?.totalUsers === 0 ? (
                    <p className="text-gray-500 text-center py-8">No users found. Create your first user above.</p>
                  ) : (
                    <div>Users will be displayed here after implementation.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">관리자 설정</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>관리자 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>사용자명</Label>
                    <Input value={adminUser?.username || ''} disabled />
                  </div>
                  <div>
                    <Label>이름</Label>
                    <Input value={adminUser?.name || ''} disabled />
                  </div>
                  <div>
                    <Label>이메일</Label>
                    <Input value={adminUser?.email || ''} disabled />
                  </div>
                  <div>
                    <Label>역할</Label>
                    <Input value={adminUser?.role || ''} disabled />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>비밀번호 변경</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">현재 비밀번호</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({
                          ...prev,
                          currentPassword: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">새 비밀번호</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({
                          ...prev,
                          newPassword: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({
                          ...prev,
                          confirmPassword: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      비밀번호 변경
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="carousel" className="space-y-6">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Carousel Images Management</h2>
                <Button 
                  onClick={() => setShowCreateImageForm(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Image</span>
                </Button>
              </div>

              {showCreateImageForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Carousel Image</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="page">Page</Label>
                        <Select 
                          value={newCarouselImage.page} 
                          onValueChange={(value) => setNewCarouselImage(prev => ({ ...prev, page: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select page" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="services">Services</SelectItem>
                            <SelectItem value="gallery">Gallery</SelectItem>
                            <SelectItem value="about">About</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="displayOrder">Display Order</Label>
                        <Input
                          id="displayOrder"
                          type="number"
                          value={newCarouselImage.displayOrder}
                          onChange={(e) => setNewCarouselImage(prev => ({ 
                            ...prev, 
                            displayOrder: parseInt(e.target.value) || 0 
                          }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="headerText">Header Text</Label>
                      <Input
                        id="headerText"
                        value={newCarouselImage.headerText}
                        onChange={(e) => setNewCarouselImage(prev => ({ 
                          ...prev, 
                          headerText: e.target.value 
                        }))}
                        placeholder="Enter header text"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="detailedDescription">Detailed Description</Label>
                      <Textarea
                        id="detailedDescription"
                        value={newCarouselImage.detailedDescription}
                        onChange={(e) => setNewCarouselImage(prev => ({ 
                          ...prev, 
                          detailedDescription: e.target.value 
                        }))}
                        placeholder="Enter detailed description"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="imageFile">Image File</Label>
                      <Input
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button onClick={handleCreateCarouselImage}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowCreateImageForm(false);
                          setSelectedFile(null);
                          setNewCarouselImage({
                            page: 'home',
                            headerText: '',
                            detailedDescription: '',
                            displayOrder: 0
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Current Carousel Images</h3>
                {carouselImages.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No carousel images found. Add your first image to get started.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {carouselImages.map((image) => (
                      <Card key={image.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <img 
                                src={image.imagePath} 
                                alt={image.headerText}
                                className="h-16 w-16 object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold">{image.headerText}</h4>
                                <Badge variant="outline">{image.page}</Badge>
                                <Badge variant="secondary">Order: {image.displayOrder}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{image.detailedDescription}</p>
                              <p className="text-xs text-gray-400">
                                Created: {new Date(image.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCarouselImage(image.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
      
      {/* Test Modal */}
      {testModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px'
          }}>
            <h2>Emergency Test Modal</h2>
            <p>If you can see this, React is working!</p>
            <button 
              onClick={() => setTestModalOpen(false)}
              style={{ marginTop: '10px', padding: '10px', backgroundColor: '#dc2626', color: 'white' }}
            >
              Close Test Modal
            </button>
          </div>
        </div>
      )}
      
      {/* Metric Detail Modal */}
      <MetricDetailModal
        isOpen={detailModal.isOpen}
        onClose={closeDetailModal}
        metricType={detailModal.metricType}
        title={detailModal.title}
        data={detailModal.data}
        totalCount={detailModal.totalCount}
      />
    </div>
  );
}