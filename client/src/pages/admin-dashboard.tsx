import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
  AlertCircle
} from 'lucide-react';
import Header from "@/components/header";
import Footer from "@/components/footer";

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
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    checkAdminAuth();
    loadDashboardData();
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
      }
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setLocation('/admin-login');
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
            <p className="text-gray-600 mt-2">
              Welcome, {adminUser?.name || adminUser?.username}
            </p>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Customer Management</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Appointment Management</span>
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Mailing</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
                  <p className="text-xs text-muted-foreground">All registered customers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
                  <p className="text-xs text-muted-foreground">All appointment bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.todayAppointments || 0}</div>
                  <p className="text-xs text-muted-foreground">Today's scheduled appointments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                  <p className="text-xs text-muted-foreground">All order transactions</p>
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

          <TabsContent value="emails" className="space-y-6">
            <h2 className="text-2xl font-bold">메일링 관리</h2>
            <Card>
              <CardContent>
                <p className="text-center text-gray-600 py-8">메일링 기능을 준비 중입니다.</p>
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
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}