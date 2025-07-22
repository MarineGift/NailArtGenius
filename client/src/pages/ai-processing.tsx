import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Camera, CreditCard, Info } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useLocation } from "wouter";
import Header from "@/components/header";
import cardImage1 from "@assets/KakaoTalk_20250721_192903601_1753140740907.jpg";
import cardImage2 from "@assets/KakaoTalk_20250721_192953866_1753140740907.jpg";

export default function AiProcessing() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "촬영 안내",
      content: "네 손톱, 엄지 손톱",
      image: cardImage1,
      description: "카메라와 카드가 수평이 되도록 촬영해 주세요."
    },
    {
      title: "촬영 준비",
      content: "정확한 손톱 형상 측정을 위해\n네일아트를 제거하시고 촬영해주세요",
      description: "어떤 카드를 준비하면 될까요?",
      image: cardImage2,
      cardTypes: [
        "신용/체크/교통/멤버십 카드",
        "학생/주민/면허증"
      ],
      note: "민감한 개인정보는 가려주세요.",
      cardSpec: "카드 규격은 가로 8.6cm 세로 5.35cm로 국제규격을 따르고 있는 모든 카드를 쓸 수 있습니다.",
      warning: "측정이 불가능한 카드 - 명함 등"
    }
  ];

  useEffect(() => {
    // Auto-advance through steps
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentStep, steps.length]);

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => setLocation("/upload")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h1>
          </div>
        </div>

        {currentStep === 0 && (
          <>
            <Alert className="mb-6 border-red-200 bg-red-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-red-700">
                아래 촬영 예시를 꼭 확인해 주세요.
              </AlertDescription>
            </Alert>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{currentStepData.content}</h2>
                
                <div className="mb-6">
                  <img
                    src={currentStepData.image}
                    alt="촬영 가이드"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>

                <div className="text-center">
                  <p className="text-gray-700 font-medium">{currentStepData.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">네 손톱, 엄지 손톱 곡률</h3>
                <div className="text-center">
                  <div className="inline-block bg-pink-100 rounded-lg p-4 mb-4">
                    <Camera className="h-12 w-12 text-pink-600 mx-auto" />
                  </div>
                  <p className="text-gray-700">손톱 곡률을 정면에서 촬영해 주세요.</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {currentStep === 1 && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 font-medium">{currentStepData.content}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentStepData.description}</h3>
              
              <div className="space-y-3 mb-6">
                {currentStepData.cardTypes?.map((type, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                    <span className="text-gray-700">{type}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-900 text-white rounded-lg p-4 text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-sm">VISA</div>
                  <div className="text-xs mt-1">0000 0000 0000 0000</div>
                  <div className="text-xs">iNail</div>
                </div>
                <div className="bg-green-400 text-white rounded-lg p-4 text-center relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-green-500 text-xs">♻️</span>
                    </div>
                  </div>
                  <div className="text-xs">CLIMATE CARD</div>
                </div>
              </div>

              <p className="text-center text-gray-600 text-sm mb-4">{currentStepData.note}</p>
              
              <div className="text-xs text-gray-500 mb-4">
                * {currentStepData.cardSpec}
              </div>

              <Alert className="border-red-200 bg-red-50 mb-6">
                <AlertDescription className="text-red-700">
                  🚫 {currentStepData.warning}
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">카드가 왜 필요한가요?</h4>
                <p className="text-sm text-gray-600">
                  손톱 크기를 측정하기 위해서 기준이 되는 카드가 필요합니다. 아이네일에서 
                  자체개발한 인공지능 소프트웨어로 손톱의 크기를 측정해 드리겠습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setLocation("/design-selection")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-pink-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <Button 
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => setLocation("/booking")}
          >
            예약하기
          </Button>
        </div>
      </div>
    </div>
  );
}