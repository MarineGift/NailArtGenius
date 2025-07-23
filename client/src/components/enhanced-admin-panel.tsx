import { useState, useEffect } from 'react';
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
import { Mail, Users, Calendar, DollarSign, Send, Filter, Edit, Trash2, UserPlus, Image } from 'lucide-react';
import { CustomerNailImageManagement } from './customer-nail-image-management';

interface Customer {
  id: number;
  name: string;
  phoneNumber: string;
  email?: string;
  visitType: string;
  category: 'mailing' | 'general' | 'booking';
  mailingConsent: boolean;
  totalVisits: number;
  totalSpent: string;
  lastVisit?: string;
  notes?: string;
  createdAt: string;
}

interface EmailTemplate {
  subject: string;
  content: string;
}

export function EnhancedAdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>({
    subject: '',
    content: ''
  });
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);

  // Fetch customers
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['/api/customers'],
  });

  // Customer categorization stats
  const customerStats = {
    total: customers.length,
    mailing: customers.filter((c: Customer) => c.category === 'mailing').length,
    general: customers.filter((c: Customer) => c.category === 'general').length,
    booking: customers.filter((c: Customer) => c.category === 'booking').length,
  };

  // Update customer category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ customerId, category }: { customerId: number; category: string }) =>
      apiRequest(`/api/customers/${customerId}/category`, {
        method: 'PATCH',
        body: JSON.stringify({ category })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      toast({
        title: '성공',
        description: '고객 분류가 업데이트되었습니다.'
      });
    }
  });

  // Send email mutation
  const sendEmailMutation = useMutation({
    mutationFn: ({ customerIds, subject, content }: { customerIds: number[]; subject: string; content: string }) =>
      apiRequest('/api/admin/send-email', {
        method: 'POST',
        body: JSON.stringify({ customerIds, subject, content })
      }),
    onSuccess: () => {
      toast({
        title: '이메일 전송 완료',
        description: `${selectedCustomers.length}명의 고객에게 이메일이 전송되었습니다.`
      });
      setSelectedCustomers([]);
      setEmailTemplate({ subject: '', content: '' });
    },
    onError: () => {
      toast({
        title: '전송 실패',
        description: '이메일 전송 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  });

  // Filter customers by category
  const filteredCustomers = customers.filter((customer: Customer) => {
    if (selectedCategory === 'all') return true;
    return customer.category === selectedCategory;
  });

  const handleCategoryUpdate = (customerId: number, newCategory: string) => {
    updateCategoryMutation.mutate({ customerId, category: newCategory });
  };

  const handleSendEmail = () => {
    if (!emailTemplate.subject.trim() || !emailTemplate.content.trim()) {
      toast({
        title: '입력 오류',
        description: '제목과 내용을 모두 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    if (selectedCustomers.length === 0) {
      toast({
        title: '선택 오류',
        description: '이메일을 보낼 고객을 선택해주세요.',
        variant: 'destructive'
      });
      return;
    }

    sendEmailMutation.mutate({
      customerIds: selectedCustomers,
      subject: emailTemplate.subject,
      content: emailTemplate.content
    });
  };

  const toggleCustomerSelection = (customerId: number) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const selectAllMailingCustomers = () => {
    const mailingCustomers = customers
      .filter((c: Customer) => c.category === 'mailing' && c.email && c.mailingConsent)
      .map((c: Customer) => c.id);
    setSelectedCustomers(mailingCustomers);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{customerStats.total}</p>
                <p className="text-gray-600">전체 고객</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{customerStats.mailing}</p>
                <p className="text-gray-600">메일링 고객</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{customerStats.booking}</p>
                <p className="text-gray-600">예약 고객</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{customerStats.general}</p>
                <p className="text-gray-600">일반 고객</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">고객 관리</TabsTrigger>
          <TabsTrigger value="nail-images">네일 이미지</TabsTrigger>
          <TabsTrigger value="email">이메일 발송</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
        </TabsList>

        {/* Customer Management Tab */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>고객 목록</CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="mailing">메일링 고객</SelectItem>
                      <SelectItem value="booking">예약 고객</SelectItem>
                      <SelectItem value="general">일반 고객</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.map((customer: Customer) => (
                  <div key={customer.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{customer.name}</h3>
                        <div className="flex gap-2 text-sm text-gray-600">
                          <span>{customer.phoneNumber}</span>
                          {customer.email && <span>• {customer.email}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge 
                          variant={
                            customer.category === 'mailing' ? 'default' :
                            customer.category === 'booking' ? 'secondary' : 'outline'
                          }
                        >
                          {customer.category === 'mailing' && '메일링'}
                          {customer.category === 'booking' && '예약'}
                          {customer.category === 'general' && '일반'}
                        </Badge>
                        <Select
                          value={customer.category}
                          onValueChange={(value) => handleCategoryUpdate(customer.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mailing">메일링</SelectItem>
                            <SelectItem value="booking">예약</SelectItem>
                            <SelectItem value="general">일반</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">총 방문</p>
                        <p className="font-medium">{customer.totalVisits}회</p>
                      </div>
                      <div>
                        <p className="text-gray-500">총 금액</p>
                        <p className="font-medium">${customer.totalSpent}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">가입 경로</p>
                        <p className="font-medium">{customer.visitType}</p>
                      </div>
                    </div>

                    {customer.notes && (
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-sm text-gray-600">{customer.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Email Composition */}
            <Card>
              <CardHeader>
                <CardTitle>이메일 작성</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">제목</label>
                  <Input
                    value={emailTemplate.subject}
                    onChange={(e) => setEmailTemplate(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="이메일 제목을 입력하세요"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">내용</label>
                  <Textarea
                    value={emailTemplate.content}
                    onChange={(e) => setEmailTemplate(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="이메일 내용을 입력하세요"
                    rows={8}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={selectAllMailingCustomers} variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    메일링 고객 전체 선택
                  </Button>
                  <Button 
                    onClick={handleSendEmail}
                    disabled={selectedCustomers.length === 0 || sendEmailMutation.isPending}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sendEmailMutation.isPending ? '전송 중...' : `선택된 고객(${selectedCustomers.length})에게 전송`}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle>수신자 선택</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {customers
                    .filter((c: Customer) => c.email && c.category === 'mailing')
                    .map((customer: Customer) => (
                      <div key={customer.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => toggleCustomerSelection(customer.id)}
                          className="rounded border-gray-300"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                        {customer.mailingConsent && (
                          <Badge variant="outline" className="text-xs">동의</Badge>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>고객 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">카테고리별 분포</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>메일링 고객</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(customerStats.mailing / customerStats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{customerStats.mailing}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>예약 고객</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(customerStats.booking / customerStats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{customerStats.booking}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>일반 고객</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(customerStats.general / customerStats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{customerStats.general}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">최근 활동</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">이메일 동의 고객: {customers.filter((c: Customer) => c.mailingConsent).length}명</p>
                    <p className="text-sm text-gray-600">이번 달 신규 가입: {customers.filter((c: Customer) => {
                      const createdDate = new Date(c.createdAt);
                      const thisMonth = new Date();
                      return createdDate.getMonth() === thisMonth.getMonth() && 
                             createdDate.getFullYear() === thisMonth.getFullYear();
                    }).length}명</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Nail Images Tab */}
        <TabsContent value="nail-images">
          <CustomerNailImageManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}