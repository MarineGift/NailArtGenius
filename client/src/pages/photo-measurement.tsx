import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Camera, Upload, Check, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";

const FINGER_TYPES = [
  { id: "reference_card", name: "참조 카드", description: "85.60mm x 53.98mm 카드를 손가락과 함께 촬영" },
  { id: "thumb", name: "엄지손가락", description: "엄지손가락을 카드와 함께 촬영" },
  { id: "index", name: "검지손가락", description: "검지손가락을 카드와 함께 촬영" },
  { id: "middle", name: "중지손가락", description: "중지손가락을 카드와 함께 촬영" },
  { id: "ring", name: "약지손가락", description: "약지손가락을 카드와 함께 촬영" },
  { id: "pinky", name: "새끼손가락", description: "새끼손가락을 카드와 함께 촬영" },
];

const CARD_DIMENSIONS = {
  width: 85.60, // mm
  height: 53.98, // mm
  thickness: 0.76 // mm
};

export default function PhotoMeasurement() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showGuide, setShowGuide] = useState(true);
  const [showPreparation, setShowPreparation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [sessionId] = useState(() => `photo_${Date.now()}`);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  // Photo upload mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest("/api/photos/upload", "POST", formData);
    },
    onSuccess: (data) => {
      setUploadedPhotos(prev => [...prev, data.imageUrl]);
      toast({
        title: "사진 업로드 완료",
        description: `${FINGER_TYPES[currentStep].name} 사진이 업로드되었습니다.`,
      });
      
      if (currentStep < FINGER_TYPES.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "업로드 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // AI analysis and nail art generation mutation
  const analyzePhotosMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/photos/analyze-and-generate", "POST", { sessionId });
    },
    onSuccess: (data) => {
      setIsAnalyzing(false);
      setIsGeneratingPDF(false);
      toast({
        title: "AI 손톱 아트 생성 완료",
        description: "10개 손가락 이미지가 생성되고 PDF로 저장되었습니다. 디자인 선택으로 이동합니다.",
      });
      setLocation(`/design-selection?session=${sessionId}&pdf=${data.pdfUrl}`);
    },
    onError: (error: Error) => {
      setIsAnalyzing(false);
      setIsGeneratingPDF(false);
      toast({
        title: "생성 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "잘못된 파일 형식",
        description: "이미지 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "파일 크기 초과",
        description: "10MB 이하의 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('sessionId', sessionId);
    formData.append('fingerType', FINGER_TYPES[currentStep].id);
    formData.append('photoType', currentStep === 0 ? 'card_reference' : 'finger_with_card');

    uploadPhotoMutation.mutate(formData);
  }, [currentStep, sessionId, uploadPhotoMutation, toast]);

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setIsGeneratingPDF(true);
    analyzePhotosMutation.mutate();
  };

  const handleStartShooting = () => {
    setShowGuide(false);
    setShowPreparation(true);
  };

  const handleStartUpload = () => {
    setShowPreparation(false);
  };

  const canProceedToAnalysis = uploadedPhotos.length === FINGER_TYPES.length;
  const progress = (uploadedPhotos.length / FINGER_TYPES.length) * 100;

  // 촬영 안내 화면
  if (showGuide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI 네일아트 촬영 안내
            </h1>
            <p className="text-gray-600">
              정확한 AI 네일아트 생성을 위한 촬영 방법을 안내해드립니다.
            </p>
          </div>

          <div className="space-y-6">
            {/* 촬영 개요 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-blue-600">
                  📸 촬영 개요
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-4">
                    총 <span className="text-blue-600">6장의 사진</span>을 촬영합니다
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-semibold text-blue-700">1. 참조 카드</div>
                      <div>크기 기준용</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="font-semibold text-green-700">2. 엄지손가락</div>
                      <div>카드와 함께</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="font-semibold text-yellow-700">3. 검지손가락</div>
                      <div>카드와 함께</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="font-semibold text-purple-700">4. 중지손가락</div>
                      <div>카드와 함께</div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <div className="font-semibold text-pink-700">5. 약지손가락</div>
                      <div>카드와 함께</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="font-semibold text-red-700">6. 새끼손가락</div>
                      <div>카드와 함께</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 촬영 방법 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">
                  🎯 정확한 촬영 방법
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">✅ 올바른 방법</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• 신용카드나 명함 사용 (85.60mm x 53.98mm)</li>
                      <li>• 카드와 손가락을 같은 평면에 배치</li>
                      <li>• 충분한 조명 확보</li>
                      <li>• 손가락과 카드가 모두 선명하게</li>
                      <li>• 카메라와 수직으로 촬영</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">❌ 피해야 할 방법</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• 카드와 손가락이 다른 높이</li>
                      <li>• 흐릿하거나 어두운 사진</li>
                      <li>• 비스듬한 각도로 촬영</li>
                      <li>• 카드가 가려지거나 잘림</li>
                      <li>• 손가락이 구부러진 상태</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 카드 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">
                  💳 기준 카드 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-center text-lg font-semibold mb-2">
                    표준 크기: 85.60mm × 53.98mm × 0.76mm
                  </p>
                  <p className="text-center text-sm text-gray-600">
                    신용카드, 직불카드, 명함 등 사용 가능
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 다음 단계 버튼 */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Button
                    onClick={handleStartShooting}
                    size="lg"
                    className="w-full max-w-md bg-blue-600 hover:bg-blue-700"
                  >
                    촬영 준비하기
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // 촬영 준비 화면
  if (showPreparation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setShowGuide(true)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              촬영 안내로 돌아가기
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              촬영 준비
            </h1>
            <p className="text-gray-600">
              촬영 전 아래 사항들을 확인해주세요.
            </p>
          </div>

          <div className="space-y-6">
            {/* 준비물 체크리스트 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">
                  📋 준비물 체크리스트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>신용카드 또는 명함 (85.60mm × 53.98mm)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>충분한 조명 (자연광 또는 밝은 실내등)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>깨끗한 손과 손톱</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>평평한 촬영 표면 (테이블, 책상 등)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>카메라 또는 스마트폰</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>안정적인 인터넷 연결</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 촬영 팁 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-yellow-600">
                  💡 촬영 팁
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 font-bold text-xs">1</span>
                    </div>
                    <span>카드와 손가락을 같은 높이에 나란히 배치하세요.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 font-bold text-xs">2</span>
                    </div>
                    <span>카메라를 수직으로 유지하고 정면에서 촬영하세요.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 font-bold text-xs">3</span>
                    </div>
                    <span>손가락은 자연스럽게 펴고, 손톱이 완전히 보이도록 하세요.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 font-bold text-xs">4</span>
                    </div>
                    <span>각 사진마다 손가락과 카드가 선명하게 나오는지 확인하세요.</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 촬영 시작 버튼 */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="mb-4 text-gray-600">
                    준비가 완료되면 촬영을 시작해주세요.
                  </p>
                  <Button
                    onClick={handleStartUpload}
                    size="lg"
                    className="w-full max-w-md bg-green-600 hover:bg-green-700"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    촬영 시작하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setShowPreparation(true)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            촬영 준비로 돌아가기
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            손톱 측정을 위한 사진 촬영
          </h1>
          <p className="text-gray-600">
            정확한 네일아트 디자인을 위해 카드와 함께 손가락 사진을 촬영해주세요.
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>촬영 진행률</span>
              <Badge variant={canProceedToAnalysis ? "default" : "secondary"}>
                {uploadedPhotos.length}/{FINGER_TYPES.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">
              {canProceedToAnalysis 
                ? "모든 사진 촬영이 완료되었습니다!" 
                : `${FINGER_TYPES.length - uploadedPhotos.length}장의 사진이 더 필요합니다.`
              }
            </p>
          </CardContent>
        </Card>

        {/* Card Reference Information */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              참조 카드 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-blue-700">
                <strong>카드 크기:</strong> 가로 {CARD_DIMENSIONS.width}mm × 세로 {CARD_DIMENSIONS.height}mm
              </p>
              <p className="text-blue-700">
                <strong>촬영 방법:</strong> 신용카드나 명함을 손가락 옆에 놓고 함께 촬영해주세요.
              </p>
              <p className="text-blue-700">
                <strong>주의사항:</strong> 카드와 손가락이 같은 평면에 있어야 정확한 측정이 가능합니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        {!canProceedToAnalysis && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{FINGER_TYPES[currentStep].name} 촬영</span>
                <Badge variant="outline">
                  {currentStep + 1}/{FINGER_TYPES.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                {FINGER_TYPES[currentStep].description}
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleCameraCapture}
                  disabled={uploadPhotoMutation.isPending}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  {uploadPhotoMutation.isPending ? "업로드 중..." : "사진 촬영"}
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Uploaded Photos Grid */}
        {uploadedPhotos.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>촬영된 사진</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedPhotos.map((photoUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photoUrl}
                      alt={`${FINGER_TYPES[index].name} 사진`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                    />
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      <Check className="w-3 h-3 mr-1" />
                      {FINGER_TYPES[index].name}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Analysis and PDF Generation */}
        {canProceedToAnalysis && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">
                  AI 손톱 아트 생성
                </h3>
                <p className="text-gray-600 mb-2">
                  카드를 기준으로 정확한 손톱 크기와 모양을 분석한 후,
                </p>
                <p className="text-gray-600 mb-6">
                  <strong className="text-blue-600">10개 손가락의 네일아트 이미지를 생성하고 PDF로 저장</strong>합니다.
                </p>
                
                {(isAnalyzing || isGeneratingPDF) && (
                  <div className="mb-6">
                    <div className="text-center">
                      {isAnalyzing && !isGeneratingPDF && (
                        <div>
                          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                          <p className="text-blue-600">사진 분석 중...</p>
                        </div>
                      )}
                      {isGeneratingPDF && (
                        <div>
                          <div className="animate-pulse w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
                          <p className="text-green-600">AI 네일아트 이미지 생성 중...</p>
                          <p className="text-sm text-gray-500 mt-1">10개 손가락 이미지를 생성하고 PDF로 저장하는 중입니다.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing || analyzePhotosMutation.isPending}
                  size="lg"
                  className="w-full max-w-md"
                >
                  {isAnalyzing || analyzePhotosMutation.isPending ? (
                    isGeneratingPDF ? "AI 네일아트 생성 중..." : "분석 중..."
                  ) : (
                    <>
                      AI 네일아트 생성 시작
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}