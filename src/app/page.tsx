'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, MessageSquare, Image, Newspaper, Settings, LogOut } from 'lucide-react'
import { CustomerInquiries } from '@/components/customer-inquiries'
import { GalleryManager } from '@/components/gallery-manager'
import { NewsManager } from '@/components/news-manager'
import { Login } from '@/components/login'

interface DashboardStats {
  totalInquiries: number
  pendingInquiries: number
  totalGallery: number
  publishedGallery: number
  totalNews: number
  publishedNews: number
}

type ActiveTab = 'dashboard' | 'content-management' | 'user-management' | 'reports-analytics' | 'site-management' | 'banner-management'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      verifyToken(token)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsAuthenticated(true)
        fetchStats(token)
      } else {
        localStorage.removeItem('adminToken')
      }
    } catch (error) {
      localStorage.removeItem('adminToken')
    }
  }

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const statsData = await response.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleLogin = (token: string, userData: any) => {
    localStorage.setItem('adminToken', token)
    setUser(userData)
    setIsAuthenticated(true)
    fetchStats(token)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setUser(null)
    setIsAuthenticated(false)
    setActiveTab('dashboard')
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  const menuItems = [
    { id: 'dashboard' as const, label: 'Content Management', icon: Users, description: 'Manage user data and content' },
    { id: 'content-management' as const, label: 'User Management', icon: MessageSquare, description: 'Manage user accounts and permissions' },
    { id: 'user-management' as const, label: 'Reports & Analytics', icon: Image, description: 'View analytics and reports' },
    { id: 'reports-analytics' as const, label: 'Site Management', icon: Newspaper, description: 'Manage site content and settings' },
    { id: 'site-management' as const, label: 'Banner Management', icon: Settings, description: 'Manage banner content and display' },
  ]

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CustomerInquiries />
      case 'content-management':
        return <GalleryManager />
      case 'user-management':
        return <NewsManager />
      case 'reports-analytics':
        return <div className="p-6 text-center text-muted-foreground">Reports & Analytics - Coming Soon</div>
      case 'site-management':
        return <div className="p-6 text-center text-muted-foreground">Site Management - Coming Soon</div>
      case 'banner-management':
        return <div className="p-6 text-center text-muted-foreground">Banner Management - Coming Soon</div>
      default:
        return <CustomerInquiries />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🏢</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">KICT Group Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Comprehensive management system</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.firstName} {user?.lastName}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg min-h-screen">
          {/* Stats Cards */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats?.totalInquiries || 25}</div>
                  <div className="text-sm text-blue-600">Total Users</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{stats?.pendingInquiries || 8}</div>
                  <div className="text-sm text-red-600">Pending Reviews</div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats?.totalGallery || 20}</div>
                  <div className="text-sm text-purple-600">Gallery Images</div>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats?.publishedNews || 15}</div>
                  <div className="text-sm text-green-600">Posted Updates</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-6 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start text-left h-auto p-4 ${
                  activeTab === item.id 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="flex items-start space-x-3">
                  <item.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs ${activeTab === item.id ? 'text-purple-100' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-6 mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">⚡ Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('dashboard')}
              >
                📝 New Page Creation
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('content-management')}
              >
                📊 Report Generation  
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('user-management')}
              >
                📄 Image Update
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setActiveTab('reports-analytics')}
              >
                🗂️ Menu Status Check
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  )
}