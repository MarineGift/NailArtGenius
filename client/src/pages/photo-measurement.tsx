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
  
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [sessionId] = useState(() => `photo_${Date.now()}`);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  // AI analysis mutation
  const analyzePhotosMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/photos/analyze", "POST", { sessionId });
    },
    onSuccess: (data) => {
      setIsAnalyzing(false);
      toast({
        title: "분석 완료",
        description: "손톱 측정이 완료되었습니다. AI 디자인 생성으로 이동합니다.",
      });
      setLocation(`/design-generation?session=${sessionId}`);
    },
    onError: (error: Error) => {
      setIsAnalyzing(false);
      toast({
        title: "분석 실패",
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
    analyzePhotosMutation.mutate();
  };

  const canProceedToAnalysis = uploadedPhotos.length === FINGER_TYPES.length;
  const progress = (uploadedPhotos.length / FINGER_TYPES.length) * 100;

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

        {/* Analysis Button */}
        {canProceedToAnalysis && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">
                  AI 손톱 분석 시작
                </h3>
                <p className="text-gray-600 mb-6">
                  카드를 기준으로 정확한 손톱 크기와 모양을 분석합니다.
                </p>
                <Button
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing || analyzePhotosMutation.isPending}
                  size="lg"
                  className="w-full max-w-md"
                >
                  {isAnalyzing || analyzePhotosMutation.isPending ? (
                    "분석 중..."
                  ) : (
                    <>
                      분석 시작
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