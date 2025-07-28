import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, CreditCard, Shield } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useLocation } from "wouter";
import Header from "@/components/header";

export default function Payment() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<string>("paypal");

  // Mock order data - in real app this would come from state/API
  const orderSummary = {
    design: "클래식 프렌치",
    price: 35000,
    tax: 3500,
    total: 38500
  };

  const handlePayment = () => {
    // In real implementation, this would integrate with PayPal SDK
    alert("PayPal 결제 처리 중...");
    setTimeout(() => {
      setLocation("/booking");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => setLocation("/designs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">결제</h1>
            <p className="text-gray-600">안전한 결제를 위해 PayPal을 사용합니다</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  결제 방법
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'paypal' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold mr-3">
                          PayPal
                        </div>
                        <div>
                          <h3 className="font-semibold">PayPal</h3>
                          <p className="text-sm text-gray-600">빠르고 안전한 온라인 결제</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'paypal' && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all opacity-50 ${
                      paymentMethod === 'card' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <h3 className="font-semibold text-gray-400">신용카드/체크카드</h3>
                          <p className="text-sm text-gray-400">준비중</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2">안전한 결제</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• SSL 암호화로 개인정보 보호</li>
                      <li>• PayPal의 구매자 보호 정책 적용</li>
                      <li>• 카드 정보는 저장되지 않음</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>주문 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">선택된 디자인</span>
                  <span className="font-semibold">{orderSummary.design}</span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>디자인 비용</span>
                    <span>₩{orderSummary.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>부가세</span>
                    <span>₩{orderSummary.tax.toLocaleString()}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>총 결제금액</span>
                  <span className="text-pink-600">₩{orderSummary.total.toLocaleString()}</span>
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  onClick={handlePayment}
                >
                  PayPal로 결제하기
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  결제 완료 후 예약 일정을 선택할 수 있습니다
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}