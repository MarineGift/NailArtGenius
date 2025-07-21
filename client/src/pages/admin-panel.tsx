import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import Header from "@/components/header";
import { Users, Package, Calendar as CalendarIcon, BarChart3 } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Appointment {
  id: number;
  userId: string;
  orderId: number;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  notes?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  order?: {
    totalAmount: string;
    paymentStatus: string;
  };
}

interface Order {
  id: number;
  userId: string;
  totalAmount: string;
  paymentStatus: string;
  printStatus: string;
  createdAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export default function AdminPanel() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/admin/appointments", selectedDate.toISOString()],
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "권한 없음",
          description: "관리자만 접근할 수 있습니다.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    }
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "권한 없음",
          description: "관리자만 접근할 수 있습니다.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
      case 'scheduled':
        return 'default';
      case 'pending':
      case 'printing':
        return 'secondary';
      case 'failed':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'paid': '결제완료',
      'pending': '결제대기',
      'failed': '결제실패',
      'waiting': '대기',
      'printing': '진행중',
      'completed': '완료',
      'scheduled': '예약됨',
      'cancelled': '취소됨'
    };
    return statusMap[status] || status;
  };

  // Statistics
  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate).toDateString() === new Date().toDateString()
  ).length;
  const totalRevenue = orders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
  const pendingOrders = orders.filter(order => order.paymentStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('admin.title')}</h2>
          <p className="text-gray-600">고객 예약과 주문을 관리하세요</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{todayAppointments}</p>
                  <p className="text-sm text-gray-600">오늘 예약</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
                  <p className="text-sm text-gray-600">전체 예약</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                  <p className="text-sm text-gray-600">대기 주문</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">₩{totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">총 매출</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appointments">{t('admin.appointments')}</TabsTrigger>
            <TabsTrigger value="orders">{t('admin.orders')}</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>날짜 선택</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedDate.toLocaleDateString('ko-KR')} 예약 목록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appointmentsLoading ? (
                    <p className="text-center py-8">{t('common.loading')}</p>
                  ) : appointments.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">예약이 없습니다</p>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment: Appointment) => (
                        <div key={appointment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">
                                {appointment.user?.firstName || appointment.user?.email || '고객'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {appointment.timeSlot} | 주문 #{appointment.orderId}
                              </p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(appointment.status)}>
                              {getStatusText(appointment.status)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>이메일: {appointment.user?.email}</p>
                            {appointment.notes && (
                              <p>메모: {appointment.notes}</p>
                            )}
                            {appointment.order && (
                              <p>결제 금액: ₩{parseFloat(appointment.order.totalAmount).toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>주문 관리</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <p className="text-center py-8">{t('common.loading')}</p>
                ) : orders.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">주문이 없습니다</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">주문 번호</th>
                          <th className="text-left py-2">고객</th>
                          <th className="text-left py-2">금액</th>
                          <th className="text-left py-2">결제 상태</th>
                          <th className="text-left py-2">프린팅 상태</th>
                          <th className="text-left py-2">주문 일시</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order: Order) => (
                          <tr key={order.id} className="border-b">
                            <td className="py-3">#{order.id}</td>
                            <td className="py-3">
                              <div>
                                <p className="font-medium">
                                  {order.user?.firstName || order.user?.email || '고객'}
                                </p>
                                <p className="text-sm text-gray-600">{order.user?.email}</p>
                              </div>
                            </td>
                            <td className="py-3">₩{parseFloat(order.totalAmount).toLocaleString()}</td>
                            <td className="py-3">
                              <Badge variant={getStatusBadgeVariant(order.paymentStatus)}>
                                {getStatusText(order.paymentStatus)}
                              </Badge>
                            </td>
                            <td className="py-3">
                              <Badge variant={getStatusBadgeVariant(order.printStatus)}>
                                {getStatusText(order.printStatus)}
                              </Badge>
                            </td>
                            <td className="py-3 text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleString('ko-KR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}