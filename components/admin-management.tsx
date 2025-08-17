'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { AdminUser, AdminUserForm } from '@/lib/types'
import { getAdminUsers, createAdmin, hasPermission, canManageAdmins } from '@/lib/auth'
import { UserPlus, Edit, Shield, Users, Crown, Eye, Settings } from 'lucide-react'

interface AdminManagementProps {
  currentUser: any
}

export function AdminManagement({ currentUser }: AdminManagementProps) {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<AdminUserForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'editor',
    permissions: [],
    isActive: true
  })

  useEffect(() => {
    if (canManageAdmins(currentUser)) {
      loadAdminUsers()
    }
  }, [currentUser])

  const loadAdminUsers = async () => {
    try {
      const users = await getAdminUsers()
      setAdminUsers(users)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async () => {
    try {
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        return
      }

      const newAdmin = await createAdmin({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
        permissions: formData.permissions
      })

      if (newAdmin) {
        toast({
          title: "Success",
          description: "Admin user created successfully"
        })
        setDialogOpen(false)
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          role: 'editor',
          permissions: [],
          isActive: true
        })
        loadAdminUsers()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive"
      })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'admin':
        return <Shield className="h-4 w-4 text-purple-500" />
      case 'editor':
        return <Edit className="h-4 w-4 text-blue-500" />
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-500" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'admin':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'editor':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
      case 'viewer':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const availablePermissions = [
    { id: 'manage_admins', label: '관리자 관리', description: '관리자 생성, 수정, 삭제' },
    { id: 'manage_bookings', label: '예약 관리', description: '고객 예약 생성, 수정, 취소' },
    { id: 'manage_customers', label: '고객 관리', description: '고객 정보 관리' },
    { id: 'manage_gallery', label: '갤러리 관리', description: '이미지 업로드, 수정, 삭제' },
    { id: 'manage_news', label: '뉴스 관리', description: '뉴스 작성, 수정, 발행' },
    { id: 'manage_products', label: '제품 관리', description: '제품 등록, 수정, 삭제' },
    { id: 'manage_carousel', label: '캐러셀 관리', description: '메인 슬라이드 관리' },
    { id: 'send_communications', label: '고객 연락', description: '이메일, SMS 발송' },
    { id: 'view_reports', label: '리포트 조회', description: '통계 및 리포트 확인' }
  ]

  if (!canManageAdmins(currentUser)) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">관리자 관리 권한이 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            관리자 관리
          </h2>
          <p className="text-gray-500 mt-1">시스템 관리자 계정을 생성하고 권한을 관리합니다.</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              관리자 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                새 관리자 추가
              </DialogTitle>
              <DialogDescription>
                새로운 관리자를 등록하고 권한을 설정합니다.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">이름 *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="홍길동"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">성 *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="홍"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@connienail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호 *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-1234-5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">역할</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">뷰어 - 조회만 가능</SelectItem>
                    <SelectItem value="editor">에디터 - 기본 편집 가능</SelectItem>
                    <SelectItem value="admin">관리자 - 대부분 관리 가능</SelectItem>
                    {currentUser?.role === 'super_admin' && (
                      <SelectItem value="super_admin">슈퍼 관리자 - 모든 권한</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>세부 권한 설정</Label>
                <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto border rounded p-3">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id={permission.id}
                        checked={formData.permissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              permissions: [...formData.permissions, permission.id]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              permissions: formData.permissions.filter(p => p !== permission.id)
                            })
                          }
                        }}
                        className="mt-1"
                      />
                      <div>
                        <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                          {permission.label}
                        </label>
                        <p className="text-xs text-gray-500">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  취소
                </Button>
                <Button
                  onClick={handleCreateAdmin}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  관리자 생성
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">관리자 목록을 불러오는 중...</p>
            </CardContent>
          </Card>
        ) : (
          adminUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-gradient-to-b from-purple-600 to-pink-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {user.firstName?.[0] || user.email[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                        {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span>{user.role}</span>
                        </div>
                      </Badge>
                      
                      {!user.isActive && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          비활성
                        </Badge>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingUser(user)
                            setFormData({
                              email: user.email,
                              firstName: user.firstName || '',
                              lastName: user.lastName || '',
                              phone: user.phone || '',
                              role: user.role,
                              permissions: user.permissions,
                              isActive: user.isActive
                            })
                            setDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {user.permissions.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">권한:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((permission) => {
                          const permissionInfo = availablePermissions.find(p => p.id === permission)
                          return (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permissionInfo?.label || permission}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}