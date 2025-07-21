import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { CheckCircle, Clock, Printer, Star } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function PrintingStatus() {
  const { toast } = useToast();
  
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  const { data: order, isLoading } = useQuery({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
    refetchInterval: 10000, // Refresh every 10 seconds to check status
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "인증 만료",
          description: "다시 로그인해주세요...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    }
  });

  const { data: design } = useQuery({
    queryKey: ["/api/designs", order?.designId],
    enabled: !!order?.designId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600">주문을 찾을 수 없습니다.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusSteps = [
    {
      id: "payment",
      label: "결제 확인 완료",
      time: "2024-01-15 14:30",
      icon: CheckCircle,
      status: order.paymentStatus === "paid" ? "completed" : "waiting"
    },
    {
      id: "preparation",
      label: "프린터 준비 중",
      time: "예상 시작시간: 14:35",
      icon: Printer,
      status: order.printStatus === "printing" || order.printStatus === "completed" ? "completed" : 
              order.paymentStatus === "paid" ? "processing" : "waiting"
    },
    {
      id: "printing",
      label: "프린팅 진행 중",
      time: "약 5분 소요 예정",
      icon: Clock,
      status: order.printStatus === "completed" ? "completed" :
              order.printStatus === "printing" ? "processing" : "waiting"
    },
    {
      id: "completed",
      label: "완료",
      time: "픽업 준비",
      icon: Star,
      status: order.printStatus === "completed" ? "completed" : "waiting"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
            <CheckCircle className="text-success text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 완료!</h2>
          <p className="text-gray-600">네일아트 프린팅이 시작됩니다</p>
        </div>

        {/* Printer Job Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>프린팅 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      step.status === "completed" ? "bg-success" :
                      step.status === "processing" ? "bg-secondary animate-pulse" :
                      "bg-gray-300"
                    }`}>
                      <Icon className={`text-sm ${
                        step.status === "completed" || step.status === "processing" ? "text-white" : "text-gray-500"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        step.status === "completed" ? "text-success" :
                        step.status === "processing" ? "text-secondary" :
                        "text-gray-500"
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-gray-600">{step.time}</p>
                    </div>
                    {step.status === "processing" && (
                      <Badge variant="secondary" className="animate-pulse">
                        진행 중
                      </Badge>
                    )}
                    {step.status === "completed" && (
                      <Badge className="bg-success hover:bg-success">
                        완료
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>주문 상세 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">주문 번호</p>
                <p className="font-mono text-sm">#{order.id.toString().padStart(8, '0')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">주문 일시</p>
                <p className="text-sm">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString('ko-KR') : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">선택 디자인</p>
                <p className="text-sm">{design?.name || "네일아트 디자인"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">결제 금액</p>
                <p className="text-sm font-semibold text-secondary">
                  ₩{order.totalAmount ? parseFloat(order.totalAmount).toLocaleString() : "30,000"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">결제 상태</p>
                <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                  {order.paymentStatus === "paid" ? "결제완료" : "결제대기"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">프린팅 상태</p>
                <Badge variant={
                  order.printStatus === "completed" ? "default" :
                  order.printStatus === "printing" ? "secondary" : "outline"
                }>
                  {order.printStatus === "completed" ? "완료" :
                   order.printStatus === "printing" ? "진행중" : "대기"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {order.printStatus === "completed" && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 프린팅 완료!</h3>
            <p className="text-green-700">
              네일아트가 완성되었습니다. 매장에서 픽업해주세요.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
