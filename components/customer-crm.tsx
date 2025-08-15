'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Customer, Booking, Treatment, CustomerCommunication } from '@/lib/types'
import { hasPermission } from '@/lib/auth'
import { Search, Phone, Mail, MessageCircle, Calendar, Scissors, User, Send, Plus, Edit } from 'lucide-react'

interface CustomerCRMProps {
  currentUser: any
}

export function CustomerCRM({ currentUser }: CustomerCRMProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([])
  const [customerTreatments, setCustomerTreatments] = useState<Treatment[]>([])
  const [communications, setCommunications] = useState<CustomerCommunication[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [communicationDialogOpen, setCommunicationDialogOpen] = useState(false)
  const { toast } = useToast()

  const [customerForm, setCustomerForm] = useState({
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    address: '',
    notes: '',
    preferredTechnician: ''
  })

  const [communicationForm, setCommunicationForm] = useState({
    type: 'email',
    subject: '',
    content: ''
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "고객 목록을 불러오는데 실패했습니다.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCustomerDetails = async (customer: Customer) => {
    try {
      setSelectedCustomer(customer)
      
      // Load bookings
      const bookingsResponse = await fetch(`/api/customers/${customer.id}/bookings`)
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setCustomerBookings(bookingsData)
      }

      // Load treatments
      const treatmentsResponse = await fetch(`/api/customers/${customer.id}/treatments`)
      if (treatmentsResponse.ok) {
        const treatmentsData = await treatmentsResponse.json()
        setCustomerTreatments(treatmentsData)
      }

      // Load communications
      const communicationsResponse = await fetch(`/api/customers/${customer.id}/communications`)
      if (communicationsResponse.ok) {
        const communicationsData = await communicationsResponse.json()
        setCommunications(communicationsData)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "고객 정보를 불러오는데 실패했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleCreateCustomer = async () => {
    try {
      if (!customerForm.phone || !customerForm.firstName || !customerForm.lastName) {
        toast({
          title: "Error",
          description: "전화번호, 이름, 성은 필수 입력 항목입니다.",
          variant: "destructive"
        })
        return
      }

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerForm)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "고객이 성공적으로 등록되었습니다."
        })
        setDialogOpen(false)
        resetCustomerForm()
        loadCustomers()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create customer')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "고객 등록에 실패했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleSendCommunication = async () => {
    if (!selectedCustomer) return

    try {
      if (!communicationForm.content) {
        toast({
          title: "Error",
          description: "메시지 내용을 입력해주세요.",
          variant: "destructive"
        })
        return
      }

      const response = await fetch('/api/communications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          type: communicationForm.type,
          subject: communicationForm.subject,
          content: communicationForm.content
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `${communicationForm.type === 'email' ? '이메일' : 'SMS'}이 성공적으로 발송되었습니다.`
        })
        setCommunicationDialogOpen(false)
        setCommunicationForm({ type: 'email', subject: '', content: '' })
        loadCustomerDetails(selectedCustomer)
      } else {
        throw new Error('Failed to send communication')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "메시지 발송에 실패했습니다.",
        variant: "destructive"
      })
    }
  }

  const resetCustomerForm = () => {
    setCustomerForm({
      phone: '',
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      address: '',
      notes: '',
      preferredTechnician: ''
    })
  }

  const filteredCustomers = customers.filter(customer =>
    customer.phone.includes(searchTerm) ||
    customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCommunicationType = (type: string) => {
    switch (type) {
      case 'email':
        return '이메일'
      case 'sms':
        return 'SMS'
      case 'call':
        return '전화'
      case 'note':
        return '메모'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            고객 CRM
          </h2>
          <p className="text-gray-500 mt-1">고객 정보를 관리하고 예약 이력을 확인합니다.</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              고객 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                새 고객 등록
              </DialogTitle>
              <DialogDescription>
                새로운 고객 정보를 등록합니다. 전화번호는 고객의 고유 식별자로 사용됩니다.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">이름 *</Label>
                  <Input
                    id="firstName"
                    value={customerForm.firstName}
                    onChange={(e) => setCustomerForm({ ...customerForm, firstName: e.target.value })}
                    placeholder="길동"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">성 *</Label>
                  <Input
                    id="lastName"
                    value={customerForm.lastName}
                    onChange={(e) => setCustomerForm({ ...customerForm, lastName: e.target.value })}
                    placeholder="홍"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">전화번호 *</Label>
                <Input
                  id="phone"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  placeholder="010-1234-5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  placeholder="customer@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">생년월일</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={customerForm.dateOfBirth}
                  onChange={(e) => setCustomerForm({ ...customerForm, dateOfBirth: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  placeholder="서울시 강남구..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTechnician">선호 네일리스트</Label>
                <Input
                  id="preferredTechnician"
                  value={customerForm.preferredTechnician}
                  onChange={(e) => setCustomerForm({ ...customerForm, preferredTechnician: e.target.value })}
                  placeholder="담당자 이름"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">메모</Label>
                <Textarea
                  id="notes"
                  value={customerForm.notes}
                  onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                  placeholder="고객 관련 메모사항"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => {
                  setDialogOpen(false)
                  resetCustomerForm()
                }}>
                  취소
                </Button>
                <Button
                  onClick={handleCreateCustomer}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  고객 등록
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>고객 목록</span>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="전화번호, 이름으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    고객이 없습니다.
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => loadCustomerDetails(customer)}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedCustomer?.id === customer.id ? 'bg-purple-50 border-purple-200' : ''
                      }`}
                    >
                      <div className="font-medium">
                        {customer.firstName} {customer.lastName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                      {customer.email && (
                        <div className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
                          <Mail className="h-3 w-3" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <Tabs defaultValue="info" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-full grid-cols-4 max-w-md">
                  <TabsTrigger value="info">기본정보</TabsTrigger>
                  <TabsTrigger value="bookings">예약이력</TabsTrigger>
                  <TabsTrigger value="treatments">시술이력</TabsTrigger>
                  <TabsTrigger value="communications">연락내역</TabsTrigger>
                </TabsList>
                
                {hasPermission(currentUser, 'send_communications') && (
                  <Dialog open={communicationDialogOpen} onOpenChange={setCommunicationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>연락하기</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>고객 연락하기</DialogTitle>
                        <DialogDescription>
                          {selectedCustomer.firstName} {selectedCustomer.lastName}님께 메시지를 발송합니다.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>연락 방법</Label>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                value="email"
                                checked={communicationForm.type === 'email'}
                                onChange={(e) => setCommunicationForm({ ...communicationForm, type: e.target.value })}
                              />
                              <span>이메일</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                value="sms"
                                checked={communicationForm.type === 'sms'}
                                onChange={(e) => setCommunicationForm({ ...communicationForm, type: e.target.value })}
                              />
                              <span>SMS</span>
                            </label>
                          </div>
                        </div>

                        {communicationForm.type === 'email' && (
                          <div className="space-y-2">
                            <Label htmlFor="subject">제목</Label>
                            <Input
                              id="subject"
                              value={communicationForm.subject}
                              onChange={(e) => setCommunicationForm({ ...communicationForm, subject: e.target.value })}
                              placeholder="이메일 제목"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="content">내용</Label>
                          <Textarea
                            id="content"
                            value={communicationForm.content}
                            onChange={(e) => setCommunicationForm({ ...communicationForm, content: e.target.value })}
                            placeholder="메시지 내용을 입력하세요"
                            rows={4}
                          />
                        </div>

                        <div className="flex justify-end space-x-3">
                          <Button variant="outline" onClick={() => setCommunicationDialogOpen(false)}>
                            취소
                          </Button>
                          <Button onClick={handleSendCommunication}>
                            발송
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>고객 기본정보</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">이름</Label>
                        <p className="text-lg font-semibold">
                          {selectedCustomer.firstName} {selectedCustomer.lastName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">전화번호</Label>
                        <p className="text-lg">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">이메일</Label>
                        <p className="text-lg">{selectedCustomer.email || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">생년월일</Label>
                        <p className="text-lg">{selectedCustomer.dateOfBirth || '-'}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500">주소</Label>
                      <p className="text-lg">{selectedCustomer.address || '-'}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-500">선호 네일리스트</Label>
                      <p className="text-lg">{selectedCustomer.preferredTechnician || '-'}</p>
                    </div>

                    {selectedCustomer.notes && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">메모</Label>
                        <p className="text-lg bg-gray-50 p-3 rounded-md">{selectedCustomer.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bookings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>예약 이력</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customerBookings.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">예약 이력이 없습니다.</p>
                    ) : (
                      <div className="space-y-3">
                        {customerBookings.map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{booking.service?.name}</p>
                                <p className="text-sm text-gray-500">
                                  {booking.appointmentDate} {booking.appointmentTime}
                                </p>
                                {booking.technicianName && (
                                  <p className="text-sm text-gray-500">담당: {booking.technicianName}</p>
                                )}
                              </div>
                              <Badge className={`${booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                                {booking.status}
                              </Badge>
                            </div>
                            {booking.notes && (
                              <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{booking.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="treatments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Scissors className="h-5 w-5" />
                      <span>시술 이력</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customerTreatments.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">시술 이력이 없습니다.</p>
                    ) : (
                      <div className="space-y-3">
                        {customerTreatments.map((treatment) => (
                          <div key={treatment.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{treatment.serviceName}</p>
                                <p className="text-sm text-gray-500">{treatment.treatmentDate}</p>
                                {treatment.technicianName && (
                                  <p className="text-sm text-gray-500">담당: {treatment.technicianName}</p>
                                )}
                                {treatment.price && (
                                  <p className="text-sm text-gray-500">{treatment.price}원</p>
                                )}
                              </div>
                            </div>
                            {treatment.notes && (
                              <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{treatment.notes}</p>
                            )}
                            {treatment.photos && treatment.photos.length > 0 && (
                              <div className="mt-2 text-sm text-gray-500">
                                📷 {treatment.photos.length}장의 사진
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="communications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5" />
                      <span>연락 내역</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {communications.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">연락 내역이 없습니다.</p>
                    ) : (
                      <div className="space-y-3">
                        {communications.map((comm) => (
                          <div key={comm.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                  {formatCommunicationType(comm.communicationType)}
                                </Badge>
                                <p className="text-sm text-gray-500">
                                  {new Date(comm.sentAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className={`${comm.status === 'sent' ? 'bg-green-100 text-green-800' : 
                                comm.status === 'failed' ? 'bg-red-100 text-red-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                                {comm.status}
                              </Badge>
                            </div>
                            {comm.subject && (
                              <p className="font-medium mt-2">{comm.subject}</p>
                            )}
                            {comm.content && (
                              <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{comm.content}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">고객을 선택해주세요</h3>
                <p className="text-gray-500">왼쪽 목록에서 고객을 선택하면 상세 정보를 확인할 수 있습니다.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}