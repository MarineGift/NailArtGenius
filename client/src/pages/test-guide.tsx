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
  PlayCircle, 
  CheckCircle, 
  Camera, 
  Cpu, 
  BarChart3, 
  CreditCard,
  Eye,
  Upload,
  Download,
  Settings
} from "lucide-react";
import { Link } from "wouter";

interface TestStep {
  id: string;
  title: string;
  description: string;
  action: string;
  route: string;
  duration: string;
  status: 'pending' | 'testing' | 'completed';
}

export default function TestGuide() {
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const testSteps: TestStep[] = [
    {
      id: "photo_guide",
      title: "촬영 가이드 확인",
      description: "12장 사진 촬영 방법과 카드 기준점 설정 방법을 확인합니다",
      action: "상세 가이드 보기",
      route: "/photo-guide",
      duration: "2-3분",
      status: 'pending'
    },
    {
      id: "photo_upload",
      title: "사진 업로드 테스트",
      description: "실제 사진을 업로드하여 시스템 동작을 확인합니다",
      action: "정밀 측정 시작",
      route: "/photo-measurement",
      duration: "5-10분",
      status: 'pending'
    },
    {
      id: "ai_analysis",
      title: "AI 분석 테스트",
      description: "OpenAI Vision API로 카드 기준 손톱 크기 측정을 테스트합니다",
      action: "분석 실행",
      route: "/design-generation",
      duration: "3-5분",
      status: 'pending'
    },
    {
      id: "nail_art_generation",
      title: "네일아트 생성 테스트",
      description: "DALL-E 3으로 10개 손가락별 맞춤형 이미지 생성을 테스트합니다",
      action: "디자인 생성",
      route: "/design-generation",
      duration: "5-8분",
      status: 'pending'
    },
    {
      id: "analytics_check",
      title: "분석 대시보드 확인",
      description: "생성된 데이터와 사용자 분석 결과를 확인합니다",
      action: "분석 보기",
      route: "/analytics",
      duration: "2-3분",
      status: 'pending'
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            시스템 테스트를 위해 로그인이 필요합니다.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 시스템 테스트 가이드
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            AI 네일아트 생성 시스템의 모든 기능을 단계별로 테스트해보세요
          </p>
        </div>

        {/* Test Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center">
                <Camera className="mr-2 h-5 w-5" />
                사진 처리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 text-sm">
                12장 사진 업로드 및 카드 기준점 인식 테스트
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Cpu className="mr-2 h-5 w-5" />
                AI 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 text-sm">
                OpenAI Vision API 정밀 측정 및 DALL-E 3 이미지 생성
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                결과 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 text-sm">
                생성 결과 확인 및 사용자 행동 분석 대시보드
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Test Steps */}
        <Tabs defaultValue="steps" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="steps">단계별 테스트</TabsTrigger>
            <TabsTrigger value="quick">빠른 테스트</TabsTrigger>
            <TabsTrigger value="results">테스트 결과</TabsTrigger>
          </TabsList>

          <TabsContent value="steps" className="space-y-6">
            {testSteps.map((step, index) => (
              <Card key={step.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-3">
                        {index + 1}
                      </Badge>
                      <span>{step.title}</span>
                      <Badge variant="secondary" className="ml-2">
                        {step.duration}
                      </Badge>
                    </div>
                    <PlayCircle className="h-5 w-5 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      예상 소요 시간: {step.duration}
                    </div>
                    <Button asChild>
                      <Link href={step.route}>
                        {step.action}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="quick" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  빠른 테스트 모드
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-orange-200 bg-orange-50">
                  <Eye className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>주의:</strong> 빠른 테스트는 실제 OpenAI API를 사용하므로 비용이 발생할 수 있습니다.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    size="lg" 
                    className="h-20 flex-col"
                    asChild
                  >
                    <Link href="/photo-measurement">
                      <Upload className="h-6 w-6 mb-2" />
                      사진 업로드만 테스트
                    </Link>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    className="h-20 flex-col"
                    variant="outline"
                    asChild
                  >
                    <Link href="/design-generation">
                      <Cpu className="h-6 w-6 mb-2" />
                      AI 분석만 테스트
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  테스트 결과 확인
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">최근 테스트 세션</h4>
                      <p className="text-sm text-gray-600">업로드된 사진과 생성된 결과를 확인하세요</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/analytics">
                        <Download className="mr-2 h-4 w-4" />
                        결과 보기
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">PDF 다운로드</h4>
                      <p className="text-sm text-gray-600">생성된 네일아트 이미지를 PDF로 저장</p>
                    </div>
                    <Button variant="outline" disabled>
                      <Download className="mr-2 h-4 w-4" />
                      PDF 생성
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Important Notes */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-600">성공적인 테스트를 위한 팁</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">준비된 신용카드 사용</p>
                  <p className="text-sm text-gray-600">표준 크기 신용카드를 미리 준비해주세요</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">충분한 조명 확보</p>
                  <p className="text-sm text-gray-600">자연광 또는 밝은 실내 조명을 사용하세요</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">순서대로 테스트</p>
                  <p className="text-sm text-gray-600">단계별로 진행하여 각 기능을 확인하세요</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-600">시스템 사양 확인</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">OpenAI API</span>
                <Badge variant="outline" className="text-green-600">연결됨</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Vision API</span>
                <Badge variant="outline" className="text-green-600">활성</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">DALL-E 3</span>
                <Badge variant="outline" className="text-green-600">활성</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">이미지 처리</span>
                <Badge variant="outline" className="text-green-600">Sharp 설치됨</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">데이터베이스</span>
                <Badge variant="outline" className="text-green-600">PostgreSQL</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}