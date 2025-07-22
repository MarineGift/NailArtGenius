import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { 
  Camera, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Hand,
  ArrowRight,
  Eye,
  Ruler
} from "lucide-react";
import { Link } from "wouter";

interface PhotoStep {
  id: string;
  title: string;
  description: string;
  fingerType: string;
  photoType: string;
  required: boolean;
  tips: string[];
  warnings: string[];
}

export default function EnhancedPhotoGuide() {
  const { isAuthenticated } = useAuth();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const photoSteps: PhotoStep[] = [
    {
      id: "card_reference",
      title: "카드 기준점 설정",
      description: "신용카드만 단독으로 촬영하여 측정 기준을 설정합니다",
      fingerType: "reference_card",
      photoType: "card_reference",
      required: true,
      tips: [
        "신용카드를 평평한 표면에 놓고 촬영",
        "카드가 프레임을 가득 채우도록 근접 촬영",
        "카드의 모든 모서리가 선명하게 보이도록",
        "조명이 균등하게 비추도록 설정"
      ],
      warnings: [
        "카드가 휘어지거나 왜곡되지 않도록 주의",
        "그림자가 카드 위에 생기지 않도록",
        "카드 표면의 반사를 최소화"
      ]
    },
    {
      id: "left_thumb",
      title: "왼손 엄지손가락",
      description: "왼손 엄지손가락을 신용카드 위에 올려놓고 촬영",
      fingerType: "left_thumb",
      photoType: "finger_with_card",
      required: true,
      tips: [
        "엄지손가락을 카드 중앙에 평평하게 놓기",
        "손톱 전체와 첫 번째 관절까지 포함",
        "손가락과 카드가 모두 선명하게 보이도록",
        "90도 수직으로 촬영"
      ],
      warnings: [
        "손가락을 누르지 말고 자연스럽게",
        "손톱의 굴곡이 보이도록",
        "카드와 손가락이 같은 높이에"
      ]
    },
    {
      id: "left_index",
      title: "왼손 검지손가락",
      description: "왼손 검지손가락을 신용카드 위에 올려놓고 촬영",
      fingerType: "left_index",
      photoType: "finger_with_card",
      required: true,
      tips: [
        "검지손가락을 카드 위에 똑바로 놓기",
        "첫 번째와 두 번째 관절 사이까지 포함",
        "손톱의 모양이 명확히 보이도록"
      ],
      warnings: [
        "다른 손가락이 프레임에 들어가지 않도록",
        "손가락이 카드를 완전히 가리지 않도록"
      ]
    },
    {
      id: "left_middle",
      title: "왼손 중지손가락",
      description: "왼손 중지손가락을 신용카드 위에 올려놓고 촬영",
      fingerType: "left_middle",
      photoType: "finger_with_card",
      required: true,
      tips: [
        "가장 긴 손가락이므로 전체가 잘 보이도록",
        "손톱의 길이와 폭을 정확히 측정할 수 있도록"
      ],
      warnings: [
        "손가락이 구부러지지 않도록",
        "카드 끝을 넘어가도 괜찮음"
      ]
    },
    {
      id: "left_ring",
      title: "왼손 약지손가락",
      description: "왼손 약지손가락을 신용카드 위에 올려놓고 촬영",
      fingerType: "left_ring",
      photoType: "finger_with_card",
      required: true,
      tips: [
        "반지가 있다면 제거 후 촬영",
        "손톱의 자연스러운 모양 유지"
      ],
      warnings: [
        "중지와 새끼손가락에 가리지 않도록",
        "손가락 간격을 적절히 유지"
      ]
    },
    {
      id: "left_pinky",
      title: "왼손 새끼손가락",
      description: "왼손 새끼손가락을 신용카드 위에 올려놓고 촬영",
      fingerType: "left_pinky",
      photoType: "finger_with_card",
      required: true,
      tips: [
        "가장 작은 손가락이므로 근접 촬영",
        "손톱이 작아도 정확한 측정이 가능하도록"
      ],
      warnings: [
        "약지에 가려지지 않도록 주의",
        "카드의 기준점이 보이도록"
      ]
    },
    {
      id: "right_hand_set",
      title: "오른손 전체 (5개 손가락)",
      description: "오른손 엄지, 검지, 중지, 약지, 새끼손가락을 각각 촬영",
      fingerType: "right_hand",
      photoType: "finger_with_card",
      required: true,
      tips: [
        "왼손과 동일한 방법으로 각 손가락별 개별 촬영",
        "총 5장의 사진 (right_thumb, right_index, right_middle, right_ring, right_pinky)"
      ],
      warnings: [
        "각 손가락을 별도로 촬영해야 함",
        "왼손과 같은 조건으로 촬영"
      ]
    },
    {
      id: "curvature_left",
      title: "왼손 측면 곡률",
      description: "왼손을 측면에서 촬영하여 손가락의 자연스러운 굴곡 측정",
      fingerType: "left_side",
      photoType: "finger_curvature",
      required: true,
      tips: [
        "손을 자연스럽게 펴고 측면에서 촬영",
        "모든 손가락의 굴곡이 보이도록",
        "45도 각도에서 촬영 권장"
      ],
      warnings: [
        "손가락을 억지로 펴지 말고 자연스럽게",
        "손목부터 손가락 끝까지 전체 포함"
      ]
    },
    {
      id: "curvature_right",
      title: "오른손 측면 곡률",
      description: "오른손을 측면에서 촬영하여 손가락의 자연스러운 굴곡 측정",
      fingerType: "right_side",
      photoType: "finger_curvature",
      required: true,
      tips: [
        "왼손과 동일한 방법으로 촬영",
        "반대편 각도에서 촬영하여 대칭성 확인"
      ],
      warnings: [
        "조명 조건을 왼손과 동일하게 유지",
        "같은 거리에서 촬영"
      ]
    }
  ];

  const requiredSteps = photoSteps.filter(step => step.required);
  const completionRate = (completedSteps.size / requiredSteps.length) * 100;

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            로그인이 필요한 서비스입니다.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            정밀 네일 측정 촬영 가이드
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            AI가 정확한 손톱 크기와 모양을 분석할 수 있도록 단계별로 사진을 촬영해주세요
          </p>
          
          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">촬영 진행률</span>
              <span className="text-sm font-medium text-blue-600">
                {completedSteps.size}/{requiredSteps.length} 완료
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <Lightbulb className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>중요:</strong> 정확한 AI 분석을 위해 반드시 표준 신용카드(85.60mm × 53.98mm)를 
            기준점으로 사용해주세요. 모든 사진에서 카드가 선명하게 보여야 합니다.
          </AlertDescription>
        </Alert>

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">전체 과정</TabsTrigger>
            <TabsTrigger value="preparation">촬영 준비</TabsTrigger>
            <TabsTrigger value="steps">단계별 가이드</TabsTrigger>
            <TabsTrigger value="tips">촬영 팁</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  촬영 개요
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">총 필요 사진 수: 12장</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        카드 기준점: 1장
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        개별 손가락: 10장 (각 손가락별)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        측면 곡률: 2장 (양손 측면)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">예상 소요 시간</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 준비 시간: 5분</li>
                      <li>• 촬영 시간: 15-20분</li>
                      <li>• AI 분석 시간: 3-5분</li>
                      <li>• <strong>총 소요 시간: 25-30분</strong></li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preparation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  촬영 전 준비사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-600">필수 준비물</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CreditCard className="h-4 w-4 text-blue-500 mr-2" />
                          표준 신용카드 (85.60mm × 53.98mm)
                        </li>
                        <li className="flex items-center">
                          <Camera className="h-4 w-4 text-blue-500 mr-2" />
                          스마트폰 또는 카메라
                        </li>
                        <li className="flex items-center">
                          <Lightbulb className="h-4 w-4 text-blue-500 mr-2" />
                          충분한 자연광 또는 조명
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">환경 설정</h4>
                      <ul className="space-y-2">
                        <li>• 평평하고 깨끗한 표면</li>
                        <li>• 단색 배경 (흰색 또는 밝은 색상)</li>
                        <li>• 그림자가 없는 균등한 조명</li>
                        <li>• 손떨림 방지를 위한 안정적인 자세</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>팁:</strong> 손톱에 매니큐어나 네일아트가 있어도 측정 가능합니다. 
                      다만 투명하거나 자연스러운 색상일 때 더 정확한 분석이 가능합니다.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="steps" className="space-y-6">
            {photoSteps.map((step, index) => (
              <Card key={step.id} className={`${completedSteps.has(step.id) ? 'border-green-500 bg-green-50' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant={completedSteps.has(step.id) ? "default" : "secondary"} className="mr-3">
                        {index + 1}
                      </Badge>
                      <span>{step.title}</span>
                      {step.required && (
                        <Badge variant="destructive" className="ml-2">필수</Badge>
                      )}
                    </div>
                    {completedSteps.has(step.id) && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-green-600 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        촬영 팁
                      </h5>
                      <ul className="text-sm space-y-1">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-gray-600">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-amber-600 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        주의사항
                      </h5>
                      <ul className="text-sm space-y-1">
                        {step.warnings.map((warning, warningIndex) => (
                          <li key={warningIndex} className="text-gray-600">• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => markStepComplete(step.id)}
                    disabled={completedSteps.has(step.id)}
                    className="w-full"
                  >
                    {completedSteps.has(step.id) ? "완료됨" : "촬영 완료 표시"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">성공적인 촬영을 위한 팁</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <Camera className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">조명 최적화</p>
                      <p className="text-sm text-gray-600">자연광이 가장 좋으며, 인공조명 사용 시 여러 방향에서 비춰주세요</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Hand className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">자연스러운 자세</p>
                      <p className="text-sm text-gray-600">손가락을 억지로 펴지 말고 자연스러운 상태를 유지하세요</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Ruler className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">일정한 거리 유지</p>
                      <p className="text-sm text-gray-600">모든 사진을 비슷한 거리에서 촬영하여 일관성을 유지하세요</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">흔한 실수 방지</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">카드 왜곡</p>
                      <p className="text-sm text-gray-600">카드가 휘어지거나 기울어지면 측정 오차가 발생합니다</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">그림자 생성</p>
                      <p className="text-sm text-gray-600">손이나 카드에 그림자가 생기지 않도록 주의하세요</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">흔들린 사진</p>
                      <p className="text-sm text-gray-600">선명하지 않은 사진은 정확한 분석이 어렵습니다</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/photo-measurement">
              <Camera className="mr-2 h-4 w-4" />
              촬영 시작하기
            </Link>
          </Button>
          
          {completionRate === 100 && (
            <Button asChild>
              <Link href="/design-generation">
                <ArrowRight className="mr-2 h-4 w-4" />
                AI 분석 및 디자인 생성
              </Link>
            </Button>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}