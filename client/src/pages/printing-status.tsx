import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Printer, Calendar, Home, Phone, Download, FileText } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useLocation } from "wouter";
import Header from "@/components/header";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { generateNailDesignPDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";

export default function PrintingStatus() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { 
      id: 'confirmed', 
      title: '예약 확정', 
      description: '예약이 확정되었습니다',
      icon: CheckCircle,
      status: 'completed'
    },
    { 
      id: 'preparing', 
      title: '디자인 준비', 
      description: '네일 디자인을 준비하고 있습니다',
      icon: Printer,
      status: 'in-progress'
    },
    { 
      id: 'printing', 
      title: '네일 프린팅', 
      description: 'AI 자동 프린팅이 진행중입니다',
      icon: Printer,
      status: 'pending'
    },
    { 
      id: 'completed', 
      title: '완료 대기', 
      description: '시술이 완료되어 픽업 대기중입니다',
      icon: CheckCircle,
      status: 'pending'
    }
  ];

  // Simulate progress animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev < 60) return prev + 2;
        return prev;
      });
    }, 200);

    // Simulate step progression
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 1) return prev + 1;
        return prev;
      });
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, []);

  const mockBooking = {
    id: "NK2025-001",
    design: "클래식 프렌치",
    appointmentDate: new Date("2025-01-22"),
    appointmentTime: "14:30",
    estimatedCompletion: new Date("2025-01-22T15:30:00"),
    status: "in-progress",
    customerName: "김사용자",
    price: 35000,
    category: "프렌치"
  };

  const { toast } = useToast();

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'in-progress';
    return 'pending';
  };

  const handleDownloadPDF = async () => {
    try {
      const designData = {
        id: mockBooking.id,
        name: mockBooking.design,
        price: mockBooking.price,
        orderNumber: mockBooking.id,
        customerName: mockBooking.customerName,
        appointmentDate: format(mockBooking.appointmentDate, "yyyy년 M월 d일", { locale: ko }),
        appointmentTime: mockBooking.appointmentTime,
        designCategory: mockBooking.category
      };

      await generateNailDesignPDF(designData);
      
      toast({
        title: "PDF 다운로드 완료",
        description: "네일 디자인 가이드 PDF가 생성되었습니다.",
      });
    } catch (error) {
      toast({
        title: "PDF 생성 실패",
        description: "PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">네일 프린팅 진행상황</h1>
          <p className="text-gray-600">실시간으로 진행상황을 확인할 수 있습니다</p>
          <Badge className="mt-2 bg-blue-100 text-blue-800">
            주문번호: {mockBooking.id}
          </Badge>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">전체 진행률</h3>
              <span className="text-2xl font-bold text-pink-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full h-3 mb-2" />
            <p className="text-sm text-gray-600">
              예상 완료 시간: {format(mockBooking.estimatedCompletion, "HH:mm", { locale: ko })}
            </p>
          </CardContent>
        </Card>

        {/* Step-by-step Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>단계별 진행상황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                const StepIcon = step.icon;
                
                return (
                  <div key={step.id} className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${status === 'completed' ? 'bg-green-100 text-green-600' : 
                          status === 'in-progress' ? 'bg-blue-100 text-blue-600' : 
                          'bg-gray-100 text-gray-400'}
                      `}>
                        <StepIcon className="h-5 w-5" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`
                          w-0.5 h-12 mx-auto mt-2
                          ${status === 'completed' ? 'bg-green-300' : 'bg-gray-200'}
                        `} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${
                          status === 'completed' ? 'text-green-700' :
                          status === 'in-progress' ? 'text-blue-700' :
                          'text-gray-500'
                        }`}>
                          {step.title}
                        </h3>
                        <Badge variant={
                          status === 'completed' ? 'default' :
                          status === 'in-progress' ? 'secondary' :
                          'outline'
                        } className={
                          status === 'completed' ? 'bg-green-100 text-green-800' :
                          status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                        }>
                          {status === 'completed' ? '완료' :
                           status === 'in-progress' ? '진행중' : '대기'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      {status === 'in-progress' && (
                        <div className="mt-2">
                          <div className="flex items-center text-sm text-blue-600">
                            <Clock className="h-4 w-4 mr-1" />
                            진행중...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                예약 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">디자인</span>
                <span className="font-medium">{mockBooking.design}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">예약 날짜</span>
                <span className="font-medium">
                  {format(mockBooking.appointmentDate, "M월 d일 (eee)", { locale: ko })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">예약 시간</span>
                <span className="font-medium">{mockBooking.appointmentTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">상태</span>
                <Badge className="bg-blue-100 text-blue-800">시술 진행중</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                연락처 및 안내
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">AI Nail Studio 강남점</h4>
                <p className="text-sm text-gray-600">📞 02-1234-5678</p>
                <p className="text-sm text-gray-600">📍 서울시 강남구 테헤란로 123</p>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <p className="font-medium mb-1">💡 안내사항</p>
                <ul className="space-y-1">
                  <li>• 시술 완료 시 SMS로 알림이 발송됩니다</li>
                  <li>• 완료 후 24시간 이내 픽업 부탁드립니다</li>
                  <li>• 문의사항은 매장으로 연락해주세요</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PDF Download Section */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <FileText className="h-5 w-5 mr-2" />
              네일 디자인 가이드 다운로드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">
              시술 시 참고할 수 있는 네일 디자인 가이드를 PDF로 다운로드하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                시술 가이드 PDF 다운로드
              </Button>
              <div className="text-xs text-green-600 self-center">
                • 주문정보, 디자인 미리보기, 시술 안내사항 포함
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => window.location.href = "tel:02-1234-5678"}>
              <Phone className="h-4 w-4 mr-2" />
              매장에 연락하기
            </Button>
            <Button onClick={() => setLocation("/")}>
              <Home className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </div>
          
          <p className="text-sm text-gray-500">
            실시간 알림을 받으시려면 브라우저 알림 허용을 설정해주세요
          </p>
        </div>
      </div>
    </div>
  );
}