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
import AdminModal from "@/components/AdminModal";
import DirectMetricCard from "@/components/DirectMetricCard";

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
    page: 'main',
    headerText: '',
    detailedDescription: '',
    displayOrder: 0
  });

  // Gallery management state
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [showCreateGalleryForm, setShowCreateGalleryForm] = useState(false);
  const [selectedGalleryFile, setSelectedGalleryFile] = useState<File | null>(null);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    description: '',
    category: 'nail_art',
    tags: '',
    displayOrder: 0
  });

  // AI Nail Art management state
  const [aiNailArtImages, setAiNailArtImages] = useState<any[]>([]);
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState('');
  const [showCreateAiNailForm, setShowCreateAiNailForm] = useState(false);
  const [aiNailFiles, setAiNailFiles] = useState({
    original: null as File | null,
    aiGenerated: null as File | null
  });
  const [newAiNailArt, setNewAiNailArt] = useState({
    customerPhone: '',
    nailPosition: 'left_thumb',
    direction: 'front',
    designPrompt: '',
    nailName: '',
    sessionId: ''
  });

  // Modal state for metric details
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    metricType: 'customers' as 'customers' | 'appointments' | 'visitors' | 'orders',
    title: '',
    data: [] as any[],
    totalCount: 0
  });
  

  


  useEffect(() => {
    checkAdminAuth();
    loadDashboardData();
    loadCarouselImages();
    loadGalleryItems();
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
    console.log('🔥 Card clicked! Metric:', metricType, 'Title:', title, 'Count:', totalCount);
    
    try {
      let data: any[] = [];
      
      // Load real data based on metric type
      if (metricType === 'customers') {
        console.log('📊 Loading customers data...');
        const response = await fetch('/api/admin/customers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          data = await response.json();
          console.log('✅ Customers data loaded:', data.length, 'items');
        } else {
          console.error('❌ Failed to load customers:', response.status);
        }
      } else if (metricType === 'appointments') {
        console.log('📅 Loading appointments data...');
        const response = await fetch('/api/admin/appointments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          data = await response.json();
          console.log('✅ Appointments data loaded:', data.length, 'items');
        } else {
          console.error('❌ Failed to load appointments:', response.status);
        }
      } else {
        // For visitors and orders, use sample data for now
        console.log('📝 Using sample data for:', metricType);
        data = [
          { name: `Sample ${metricType} 1`, phoneNumber: '010-1111-1111', email: 'sample1@example.com' },
          { name: `Sample ${metricType} 2`, phoneNumber: '010-2222-2222', email: 'sample2@example.com' },
          { name: `Sample ${metricType} 3`, phoneNumber: '010-3333-3333', email: 'sample3@example.com' }
        ];
      }

      console.log('🎯 Setting modal state with data:', data.length, 'items');
      
      // Force modal to open with data
      const modalState = {
        isOpen: true,
        metricType,
        title,
        data: data || [],
        totalCount
      };
      
      setDetailModal(modalState);
      
      console.log('✅ Modal state updated:', modalState);
      
    } catch (error) {
      console.error('💥 Error in handleMetricClick:', error);
      
      // Show modal with error message
      setDetailModal({
        isOpen: true,
        metricType,
        title,
        data: [{ name: 'Failed to load data', error: String(error) }],
        totalCount: 1
      });
    }
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

  const loadGalleryItems = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch('/api/admin/gallery', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data);
      }
    } catch (error) {
      console.error('Error loading gallery items:', error);
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

  // Gallery management functions
  const handleCreateGalleryItem = async () => {
    try {
      if (!selectedGalleryFile) {
        setError('Please select an image file.');
        return;
      }

      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('image', selectedGalleryFile);
      formData.append('title', newGalleryItem.title);
      formData.append('description', newGalleryItem.description);
      formData.append('category', newGalleryItem.category);
      formData.append('tags', newGalleryItem.tags);
      formData.append('displayOrder', newGalleryItem.displayOrder.toString());

      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setShowCreateGalleryForm(false);
        setSelectedGalleryFile(null);
        setNewGalleryItem({
          title: '',
          description: '',
          category: 'nail_art',
          tags: '',
          displayOrder: 0
        });
        loadGalleryItems();
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create gallery item.');
      }
    } catch (error) {
      console.error('Error creating gallery item:', error);
      setError('Failed to create gallery item.');
    }
  };

  const handleDeleteGalleryItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadGalleryItems();
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete gallery item.');
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      setError('Failed to delete gallery item.');
    }
  };

  // AI Nail Art management functions
  const loadAiNailArtImages = async (phone: string) => {
    if (!phone.trim()) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/ai-nail-art/${phone}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAiNailArtImages(data);
      }
    } catch (error) {
      console.error('Error loading AI nail art images:', error);
    }
  };

  const handleCreateAiNailArt = async () => {
    try {
      if (!newAiNailArt.customerPhone) {
        setError('Customer phone number is required.');
        return;
      }

      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('customerPhone', newAiNailArt.customerPhone);
      formData.append('nailPosition', newAiNailArt.nailPosition);
      formData.append('direction', newAiNailArt.direction);
      formData.append('designPrompt', newAiNailArt.designPrompt);
      formData.append('nailName', newAiNailArt.nailName);
      formData.append('sessionId', newAiNailArt.sessionId);

      if (aiNailFiles.original) {
        formData.append('originalImage', aiNailFiles.original);
      }
      if (aiNailFiles.aiGenerated) {
        formData.append('aiGeneratedImage', aiNailFiles.aiGenerated);
      }

      const response = await fetch('/api/admin/ai-nail-art', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setShowCreateAiNailForm(false);
        setAiNailFiles({ original: null, aiGenerated: null });
        setNewAiNailArt({
          customerPhone: '',
          nailPosition: 'left_thumb',
          direction: 'front',
          designPrompt: '',
          nailName: '',
          sessionId: ''
        });
        loadAiNailArtImages(selectedCustomerPhone);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create AI nail art record.');
      }
    } catch (error) {
      console.error('Error creating AI nail art:', error);
      setError('Failed to create AI nail art record.');
    }
  };

  const handleDeleteAiNailArt = async (id: number) => {
    if (!confirm('Are you sure you want to delete this AI nail art record?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/ai-nail-art/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadAiNailArtImages(selectedCustomerPhone);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete AI nail art record.');
      }
    } catch (error) {
      console.error('Error deleting AI nail art:', error);
      setError('Failed to delete AI nail art record.');
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



        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>User</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Customer</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Appointment</span>
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
              <span>Carousel</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="ai-nail-art" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>AI Nail Art</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DirectMetricCard
                title="Total Customers"
                value={stats?.totalCustomers || 0}
                description="All registered customers - Click for details"
                iconComponent={<Users className="h-4 w-4 text-gray-500" />}
                borderClass="border-blue-300"
                onClick={() => handleMetricClick('customers', 'Total Customers', stats?.totalCustomers || 0)}
              />

              <DirectMetricCard
                title="Total Appointments"
                value={stats?.totalAppointments || 0}
                description="All appointment bookings - Click for details"
                iconComponent={<Calendar className="h-4 w-4 text-gray-500" />}
                borderClass="border-green-300"
                onClick={() => handleMetricClick('appointments', 'Total Appointments', stats?.totalAppointments || 0)}
              />

              <DirectMetricCard
                title="Today's Visitors"
                value={stats?.todayAppointments || 12}
                description="Today's website visitors - Click for details"
                iconComponent={<Clock className="h-4 w-4 text-gray-500" />}
                borderClass="border-yellow-300"
                onClick={() => handleMetricClick('visitors', "Today's Visitors", stats?.todayAppointments || 12)}
              />

              <DirectMetricCard
                title="Total Orders"
                value={stats?.totalOrders || 0}
                description="All order transactions - Click for details"
                iconComponent={<ShoppingBag className="h-4 w-4 text-gray-500" />}
                borderClass="border-red-300"
                onClick={() => handleMetricClick('orders', 'Total Orders', stats?.totalOrders || 0)}
              />
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
                          <p className="font-medium">Appointment #{appointment.id}</p>
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
              <h2 className="text-2xl font-bold">Customer</h2>
              <div className="flex space-x-2">
                <Button onClick={() => loadCustomers()} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={() => loadCustomers('mailing')} variant="outline">
                  Mailing Customers
                </Button>
                <Button onClick={() => loadCustomers('booking')} variant="outline">
                  Booking Customers
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Visit Count</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Total Spent</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
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
            <h2 className="text-2xl font-bold">Appointment</h2>
            <Card>
              <CardContent>
                <p className="text-center text-gray-600 py-8">Appointment management features are being prepared.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <ContactInquiriesManagement />
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <h2 className="text-2xl font-bold">Email</h2>
            <Card>
              <CardContent>
                <p className="text-center text-gray-600 py-8">Email management features are being prepared.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  User
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

          <TabsContent value="gallery" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gallery</h2>
              <Button onClick={() => setShowCreateGalleryForm(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Gallery Item</span>
              </Button>
            </div>

            {showCreateGalleryForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Gallery Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gallery-title">Title</Label>
                      <Input
                        id="gallery-title"
                        value={newGalleryItem.title}
                        onChange={(e) => setNewGalleryItem({...newGalleryItem, title: e.target.value})}
                        placeholder="Gallery item title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gallery-category">Category</Label>
                      <Select value={newGalleryItem.category} onValueChange={(value) => setNewGalleryItem({...newGalleryItem, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nail_art">Nail Art</SelectItem>
                          <SelectItem value="spa_treatment">Spa Treatment</SelectItem>
                          <SelectItem value="waxing">Waxing</SelectItem>
                          <SelectItem value="massage">Massage</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="gallery-description">Description</Label>
                      <Textarea
                        id="gallery-description"
                        value={newGalleryItem.description}
                        onChange={(e) => setNewGalleryItem({...newGalleryItem, description: e.target.value})}
                        placeholder="Gallery item description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gallery-tags">Tags (comma separated)</Label>
                      <Input
                        id="gallery-tags"
                        value={newGalleryItem.tags}
                        onChange={(e) => setNewGalleryItem({...newGalleryItem, tags: e.target.value})}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gallery-order">Display Order</Label>
                      <Input
                        id="gallery-order"
                        type="number"
                        value={newGalleryItem.displayOrder}
                        onChange={(e) => setNewGalleryItem({...newGalleryItem, displayOrder: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="gallery-image">Image File</Label>
                      <Input
                        id="gallery-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedGalleryFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setShowCreateGalleryForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateGallery}>
                      Create Gallery Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Image</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Tags</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {galleryItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <img src={item.imagePath} alt={item.title} className="w-16 h-16 object-cover rounded" />
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {item.title}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{item.category}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {item.tags?.join(', ') || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {item.displayOrder}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={item.isActive ? 'default' : 'secondary'}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteGalleryItem(item.id)}>
                                <Trash2 className="h-3 w-3" />
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

          <TabsContent value="ai-nail-art" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">AI Nail Art</h2>
              <Button onClick={() => setShowCreateAiNailForm(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add AI Nail Art</span>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search by Customer Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter customer phone number"
                    value={selectedCustomerPhone}
                    onChange={(e) => setSelectedCustomerPhone(e.target.value)}
                  />
                  <Button onClick={() => loadAiNailArtImages(selectedCustomerPhone)}>
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {showCreateAiNailForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New AI Nail Art Record</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ai-phone">Customer Phone Number</Label>
                      <Input
                        id="ai-phone"
                        value={newAiNailArt.customerPhone}
                        onChange={(e) => setNewAiNailArt({...newAiNailArt, customerPhone: e.target.value})}
                        placeholder="010-1234-5678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ai-position">Nail Position</Label>
                      <Select value={newAiNailArt.nailPosition} onValueChange={(value) => setNewAiNailArt({...newAiNailArt, nailPosition: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select nail position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left_thumb">Left Thumb</SelectItem>
                          <SelectItem value="left_index">Left Index</SelectItem>
                          <SelectItem value="left_middle">Left Middle</SelectItem>
                          <SelectItem value="left_ring">Left Ring</SelectItem>
                          <SelectItem value="left_pinky">Left Pinky</SelectItem>
                          <SelectItem value="right_thumb">Right Thumb</SelectItem>
                          <SelectItem value="right_index">Right Index</SelectItem>
                          <SelectItem value="right_middle">Right Middle</SelectItem>
                          <SelectItem value="right_ring">Right Ring</SelectItem>
                          <SelectItem value="right_pinky">Right Pinky</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ai-direction">Direction</Label>
                      <Select value={newAiNailArt.direction} onValueChange={(value) => setNewAiNailArt({...newAiNailArt, direction: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="front">Front</SelectItem>
                          <SelectItem value="side">Side</SelectItem>
                          <SelectItem value="back">Back</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ai-name">Nail Name</Label>
                      <Input
                        id="ai-name"
                        value={newAiNailArt.nailName}
                        onChange={(e) => setNewAiNailArt({...newAiNailArt, nailName: e.target.value})}
                        placeholder="Custom nail name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="ai-prompt">Design Prompt</Label>
                      <Textarea
                        id="ai-prompt"
                        value={newAiNailArt.designPrompt}
                        onChange={(e) => setNewAiNailArt({...newAiNailArt, designPrompt: e.target.value})}
                        placeholder="AI design generation prompt"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ai-original">Original Image</Label>
                      <Input
                        id="ai-original"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAiNailFiles({...aiNailFiles, original: e.target.files?.[0] || null})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ai-generated">AI Generated Image</Label>
                      <Input
                        id="ai-generated"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAiNailFiles({...aiNailFiles, aiGenerated: e.target.files?.[0] || null})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setShowCreateAiNailForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAiNailArt}>
                      Add AI Nail Art
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Nail Position</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Direction</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Original Image</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">AI Generated</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Nail Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {aiNailArtImages.map((nail) => (
                        <tr key={nail.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {nail.customerPhone}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {nail.nailPosition}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {nail.direction}
                          </td>
                          <td className="px-4 py-3">
                            {nail.originalImagePath ? (
                              <img src={nail.originalImagePath} alt="Original" className="w-12 h-12 object-cover rounded" />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {nail.aiGeneratedImagePath ? (
                              <img src={nail.aiGeneratedImagePath} alt="AI Generated" className="w-12 h-12 object-cover rounded" />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {nail.nailName || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteAiNailArt(nail.id)}>
                                <Trash2 className="h-3 w-3" />
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

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Username</Label>
                    <Input value={adminUser?.username || ''} disabled />
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input value={adminUser?.name || ''} disabled />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={adminUser?.email || ''} disabled />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input value={adminUser?.role || ''} disabled />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
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
                      <Label htmlFor="newPassword">New Password</Label>
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
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                      Change Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="carousel" className="space-y-6">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Carousel</h2>
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
                    <CardTitle>Add New Carousel</CardTitle>
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
                <h3 className="text-lg font-semibold">Current Carousel</h3>
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
      


      {/* Admin Metric Modal */}
      <AdminModal
        isOpen={detailModal.isOpen}
        onClose={closeDetailModal}
        title={detailModal.title}
        data={detailModal.data}
        totalCount={detailModal.totalCount}
      />
    </div>
  );
}