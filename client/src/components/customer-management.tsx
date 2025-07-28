import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Phone, DollarSign, Calendar, TrendingUp, Users, Send, History } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, queryClient as queryClientInstance } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: number;
  name: string;
  phoneNumber: string;
  email?: string;
  category: string;
  totalVisits: number;
  totalSpent: string;
  lastVisit?: Date;
  createdAt: Date;
}

interface CustomerPurchase {
  id: number;
  serviceName: string;
  amount: string;
  paymentMethod: string;
  paymentStatus: string;
  purchaseDate: Date;
  notes?: string;
}

interface SMSTemplate {
  id: number;
  name: string;
  type: string;
  template: string;
  isActive: boolean;
}

export function CustomerManagement() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [smsMessage, setSmsMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 고객 목록 조회
  const { data: customers = [] } = useQuery({
    queryKey: ['/api/customers'],
  });

  // 선택된 고객의 구매내역 조회
  const { data: purchases = [] } = useQuery({
    queryKey: ['/api/customer-purchases', selectedCustomer?.id],
    enabled: !!selectedCustomer,
  });

  // SMS 템플릿 목록 조회
  const { data: templates = [] } = useQuery({
    queryKey: ['/api/sms-templates'],
  });

  // SMS 발송 히스토리 조회
  const { data: smsHistory = [] } = useQuery({
    queryKey: ['/api/sms-history', selectedCustomer?.id],
    enabled: !!selectedCustomer,
  });

  // 구매내역 추가 뮤테이션
  const addPurchaseMutation = useMutation({
    mutationFn: async (purchase: Omit<CustomerPurchase, 'id' | 'purchaseDate'>) => {
      const response = await fetch('/api/customer-purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchase),
      });
      if (!response.ok) throw new Error('Failed to add purchase');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customer-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      toast({ title: '구매내역이 추가되었습니다' });
    },
  });

  // SMS 발송 뮤테이션
  const sendSMSMutation = useMutation({
    mutationFn: async (data: { customerId: number; templateId?: number; message?: string }) => {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to send SMS');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sms-history'] });
      setSmsMessage('');
      setSelectedTemplate('');
      toast({ title: 'SMS가 발송되었습니다' });
    },
  });

  const handleAddPurchase = (purchase: Omit<CustomerPurchase, 'id' | 'purchaseDate'>) => {
    if (selectedCustomer) {
      addPurchaseMutation.mutate({
        ...purchase,
        customerId: selectedCustomer.id
      } as any);
    }
  };

  const handleSendSMS = () => {
    if (!selectedCustomer) return;

    if (selectedTemplate) {
      sendSMSMutation.mutate({
        customerId: selectedCustomer.id,
        templateId: parseInt(selectedTemplate)
      });
    } else if (smsMessage.trim()) {
      sendSMSMutation.mutate({
        customerId: selectedCustomer.id,
        message: smsMessage
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 고객 목록 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              고객 목록
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="max-h-96 overflow-y-auto">
              {Array.isArray(customers) && customers.map((customer: Customer) => (
                <div
                  key={customer.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedCustomer?.id === customer.id
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-500">{customer.phoneNumber}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {customer.category}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      방문 {customer.totalVisits}회
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 고객 상세 정보 */}
        {selectedCustomer && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  {selectedCustomer.name} 고객 관리
                  <div className="text-sm font-normal text-gray-500 mt-1">
                    {selectedCustomer.phoneNumber}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{selectedCustomer.category}</Badge>
                  <Badge variant="secondary">
                    총 {selectedCustomer.totalSpent}원
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="purchases" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="purchases">구매내역</TabsTrigger>
                  <TabsTrigger value="sms">SMS 관리</TabsTrigger>
                  <TabsTrigger value="history">SMS 기록</TabsTrigger>
                </TabsList>

                {/* 구매내역 탭 */}
                <TabsContent value="purchases" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">구매내역</h3>
                    <PurchaseDialog 
                      customerId={selectedCustomer.id}
                      onAddPurchase={handleAddPurchase}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    {Array.isArray(purchases) && purchases.map((purchase: CustomerPurchase) => (
                      <div key={purchase.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{purchase.serviceName}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(purchase.purchaseDate).toLocaleDateString('ko-KR')} • {purchase.paymentMethod}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{purchase.amount}원</div>
                          <Badge 
                            variant={purchase.paymentStatus === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {purchase.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {purchases.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        구매내역이 없습니다.
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* SMS 관리 탭 */}
                <TabsContent value="sms" className="space-y-4">
                  <div>
                    <Label>템플릿 선택</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="SMS 템플릿을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template: SMSTemplate) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name} ({template.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>직접 메시지 입력</Label>
                    <Textarea
                      value={smsMessage}
                      onChange={(e) => setSmsMessage(e.target.value)}
                      placeholder="직접 SMS 메시지를 입력하세요..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleSendSMS}
                    disabled={!selectedTemplate && !smsMessage.trim() || sendSMSMutation.isPending}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    SMS 발송
                  </Button>
                </TabsContent>

                {/* SMS 기록 탭 */}
                <TabsContent value="history" className="space-y-4">
                  <h3 className="text-lg font-medium">SMS 발송 기록</h3>
                  <div className="space-y-2">
                    {Array.isArray(smsHistory) && smsHistory.map((sms: any) => (
                      <div key={sms.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline">{sms.type}</Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(sms.sentAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                        <div className="text-sm">{sms.message}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant={sms.status === 'sent' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {sms.status}
                          </Badge>
                          {sms.deliveryStatus && (
                            <Badge variant="secondary" className="text-xs">
                              {sms.deliveryStatus}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {(Array.isArray(smsHistory) && smsHistory.length === 0) && (
                      <div className="text-center text-gray-500 py-8">
                        SMS 발송 기록이 없습니다.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// 구매내역 추가 다이얼로그
function PurchaseDialog({ 
  customerId, 
  onAddPurchase 
}: { 
  customerId: number; 
  onAddPurchase: (purchase: Omit<CustomerPurchase, 'id' | 'purchaseDate'>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    amount: '',
    paymentMethod: 'cash',
    paymentStatus: 'completed',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPurchase({
      ...formData,
      customerId
    } as any);
    setOpen(false);
    setFormData({
      serviceName: '',
      amount: '',
      paymentMethod: 'cash',
      paymentStatus: 'completed',
      notes: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <DollarSign className="h-4 w-4 mr-2" />
          구매내역 추가
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>구매내역 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>서비스명</Label>
            <Input
              value={formData.serviceName}
              onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
              placeholder="서비스명을 입력하세요"
              required
            />
          </div>
          
          <div>
            <Label>결제 금액</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="금액을 입력하세요"
              required
            />
          </div>

          <div>
            <Label>결제 방법</Label>
            <Select 
              value={formData.paymentMethod} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">현금</SelectItem>
                <SelectItem value="card">카드</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="transfer">계좌이체</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>결제 상태</Label>
            <Select 
              value={formData.paymentStatus} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentStatus: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="pending">대기</SelectItem>
                <SelectItem value="refunded">환불</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>메모</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="추가 메모가 있다면 입력하세요"
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit">추가</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}