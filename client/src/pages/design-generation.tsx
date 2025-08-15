import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Sparkles, Download, Eye } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";

export default function DesignGeneration() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedDesign, setGeneratedDesign] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Get session ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session');

  // Redirect if not authenticated or no session
  if (!isAuthenticated || !sessionId) {
    setLocation("/");
    return null;
  }

  // Fetch nail measurements for this session
  const { data: measurements, isLoading: measurementsLoading } = useQuery({
    queryKey: ['/api/ai/measurements', sessionId],
    queryFn: () => apiRequest(`/api/ai/measurements/${sessionId}`, "GET"),
    retry: false,
  });

  // Generate design mutation
  const generateDesignMutation = useMutation({
    mutationFn: async (prompt: string) => {
      return apiRequest("/api/designs/generate-with-measurements", "POST", {
        sessionId,
        customPrompt: prompt
      });
    },
    onSuccess: (data) => {
      setGeneratedDesign(data.designUrl);
      setIsGenerating(false);
      toast({
        title: "디자인 생성 완료!",
        description: "정확한 손톱 크기에 맞춘 네일아트 디자인이 생성되었습니다.",
      });
    },
    onError: (error: Error) => {
      setIsGenerating(false);
      toast({
        title: "디자인 생성 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleGenerateDesign = () => {
    if (!customPrompt.trim()) {
      toast({
        title: "입력 필요",
        description: "원하는 네일아트 디자인을 설명해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    generateDesignMutation.mutate(customPrompt);
  };

  const handleSaveDesign = () => {
    // Implement save design functionality
    toast({
      title: "디자인 저장됨",
      description: "네일아트 디자인이 저장되었습니다.",
    });
  };

  const handleOrderDesign = () => {
    // Navigate to order page
    setLocation(`/order?session=${sessionId}&design=${encodeURIComponent(generatedDesign || "")}`);
  };

  if (measurementsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">손톱 측정 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!measurements || measurements.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">측정 데이터를 찾을 수 없습니다</h2>
              <p className="text-gray-600 mb-6">
                먼저 손톱 측정을 완료해주세요.
              </p>
              <Button onClick={() => setLocation("/photo-measurement")}>
                손톱 측정하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
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
            AI 네일아트 디자인 생성
          </h1>
          <p className="text-gray-600">
            측정된 손톱 크기에 맞춘 맞춤형 네일아트 디자인을 생성합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Measurements and Input */}
          <div className="space-y-6">
            {/* Nail Measurements Display */}
            <Card>
              <CardHeader>
                <CardTitle>측정된 손톱 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {measurements.map((measurement: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{measurement.fingerType}</h4>
                        <Badge variant={measurement.measurementConfidence > 80 ? "default" : "secondary"}>
                          {measurement.measurementConfidence}% 정확도
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <span>폭: {parseFloat(measurement.nailWidth).toFixed(1)}mm</span>
                        <span>길이: {parseFloat(measurement.nailLength).toFixed(1)}mm</span>
                        <span>모양: {measurement.shapeCategory}</span>
                        <span>곡률: {parseFloat(measurement.nailCurvature).toFixed(1)}mm</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Design Input */}
            <Card>
              <CardHeader>
                <CardTitle>네일아트 디자인 요청</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="원하는 네일아트 디자인을 자세히 설명해주세요. 예: 핑크와 화이트 그라데이션, 작은 꽃무늬, 글리터 포인트 등"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={4}
                    className="w-full"
                  />
                  
                  <Button
                    onClick={handleGenerateDesign}
                    disabled={isGenerating || !customPrompt.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        AI 디자인 생성 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        맞춤형 디자인 생성
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Generated Design */}
          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>생성된 네일아트 디자인</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedDesign ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 aspect-square flex items-center justify-center">
                      <img
                        src={generatedDesign}
                        alt="생성된 네일아트 디자인"
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSaveDesign}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                      
                      <Button
                        onClick={() => window.open(generatedDesign, '_blank')}
                        variant="outline"
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        확대보기
                      </Button>
                    </div>
                    
                    <Button
                      onClick={handleOrderDesign}
                      className="w-full"
                      size="lg"
                    >
                      이 디자인으로 주문하기
                    </Button>
                    
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <strong>디자인 정보:</strong>
                      <br />
                      측정된 손톱 크기에 맞춰 정확한 비율로 생성된 디자인입니다.
                      각 손가락의 크기와 모양이 고려되어 완벽한 핏을 제공합니다.
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 aspect-square flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>원하는 디자인을 설명하고<br />생성 버튼을 눌러주세요</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}