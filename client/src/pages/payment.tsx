import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";
import PayPalButton from "@/components/PayPalButton";
import { Lock } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Payment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  const { data: order, isLoading } = useQuery({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">결제하기</h2>
              <p className="text-gray-600 font-normal">안전한 PayPal 결제로 주문을 완료하세요</p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">주문 요약</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">네일아트 디자인</span>
                  <span>{design?.name || "선택된 디자인"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI 네일 분석</span>
                  <span>₩5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">디자인 프린팅</span>
                  <span>₩{design?.price ? parseInt(design.price).toLocaleString() : "25,000"}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>총 결제금액</span>
                  <span className="text-secondary">
                    ₩{order.totalAmount ? parseFloat(order.totalAmount).toLocaleString() : "30,000"}
                  </span>
                </div>
              </div>
            </div>

            {/* PayPal Payment Button */}
            <div className="text-center">
              <div className="mb-4">
                <PayPalButton
                  amount={order.totalAmount || "30000"}
                  currency="KRW"
                  intent="capture"
                />
              </div>
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <Lock className="mr-1 h-3 w-3" />
                SSL 암호화로 보호되는 안전한 결제
              </p>
            </div>

            {/* Alternative payment info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm text-center">
                PayPal 계정이 없어도 신용카드로 직접 결제 가능합니다
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
