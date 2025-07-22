import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Wand2, 
  Palette, 
  Sparkles, 
  RotateCcw, 
  Download,
  Eye,
  Heart,
  ShoppingCart,
  Zap
} from "lucide-react";
import Header from "@/components/header";
import AdvancedStyleCustomizer from "@/components/AdvancedStyleCustomizer";
import { useForm } from "react-hook-form";

interface DesignRecommendation {
  recommendations: string[];
  colorSuggestions: string[];
  styleSuggestions: string[];
  warnings: string[];
}

export default function AdvancedDesignStudio() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [generatedDesign, setGeneratedDesign] = useState<string>("");
  const [designVariations, setDesignVariations] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<string>("");
  const [designRecommendations, setDesignRecommendations] = useState<DesignRecommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Advanced preferences form
  const form = useForm({
    defaultValues: {
      preferredColors: [],
      preferredStyles: [],
      occasions: [],
      complexity: "medium",
      budget: "medium",
      intensity: "moderate",
      patternPreference: "gradient",
      colorHarmony: "complementary",
      personalityTraits: [],
      inspirationKeywords: "",
      finishType: [],
    }
  });

  // Get URL parameters for session ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('sessionId');
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, []);

  // Fetch existing style preferences
  const { data: stylePreferences } = useQuery({
    queryKey: ["/api/style-preferences"],
    enabled: isAuthenticated,
  });

  // Load style preferences into form
  useEffect(() => {
    if (stylePreferences) {
      form.reset(stylePreferences);
    }
  }, [stylePreferences, form]);

  // Fetch nail measurements for this session
  const { data: measurements, isLoading: measurementsLoading } = useQuery({
    queryKey: ["/api/measurements", currentSessionId],
    enabled: !!currentSessionId,
  });

  // Generate advanced design mutation
  const generateDesignMutation = useMutation({
    mutationFn: async (preferences: any) => {
      const response = await apiRequest("/api/designs/generate-advanced", "POST", {
        sessionId: currentSessionId,
        customPrompt,
        advancedPreferences: preferences
      });
      return response;
    },
    onSuccess: (data) => {
      setGeneratedDesign(data.designUrl);
      setSelectedDesign(data.designUrl);
      toast({
        title: "디자인 생성 완료",
        description: "맞춤형 네일아트 디자인이 생성되었습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "디자인 생성 실패",
        description: error.message || "디자인 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Generate design variations mutation
  const generateVariationsMutation = useMutation({
    mutationFn: async (preferences: any) => {
      const response = await apiRequest("/api/designs/generate-variations", "POST", {
        sessionId: currentSessionId,
        advancedPreferences: preferences,
        variationCount: 3
      });
      return response;
    },
    onSuccess: (data) => {
      setDesignVariations(data.designUrls);
      toast({
        title: "디자인 변형 생성 완료",
        description: `${data.variationCount}개의 디자인 변형이 생성되었습니다.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "변형 생성 실패",
        description: error.message || "디자인 변형 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Analyze recommendations mutation
  const analyzeRecommendationsMutation = useMutation({
    mutationFn: async (preferences: any) => {
      const response = await apiRequest("/api/designs/analyze-recommendations", "POST", {
        sessionId: currentSessionId,
        advancedPreferences: preferences
      });
      return response;
    },
    onSuccess: (data) => {
      setDesignRecommendations(data.analysis);
    },
    onError: (error: any) => {
      toast({
        title: "분석 실패",
        description: error.message || "디자인 분석 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateDesign = async () => {
    if (!currentSessionId) {
      toast({
        title: "세션 오류",
        description: "손톱 측정이 필요합니다. 먼저 사진을 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const preferences = form.getValues();
      
      // First, analyze recommendations
      await analyzeRecommendationsMutation.mutateAsync(preferences);
      
      // Then generate the main design
      await generateDesignMutation.mutateAsync(preferences);
      
      setGenerationProgress(100);
    } finally {
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  const handleGenerateVariations = async () => {
    const preferences = form.getValues();
    await generateVariationsMutation.mutateAsync(preferences);
  };

  const handleStyleUpdate = (updatedPreferences: any) => {
    // Real-time style preference updates
    console.log("Style updated:", updatedPreferences);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>로그인 필요</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">고급 디자인 스튜디오를 이용하려면 먼저 로그인해주세요.</p>
            <Button onClick={() => window.location.href = "/api/login"} className="w-full">
              로그인
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Wand2 className="h-8 w-8 mr-3 text-purple-600" />
            고급 AI 네일아트 디자인 스튜디오
          </h1>
          <p className="text-gray-600">
            정밀한 손톱 측정 데이터와 고급 스타일 선호도를 바탕으로 완전히 맞춤화된 네일아트 디자인을 생성합니다
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Style Customization */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-pink-500" />
                  스타일 커스터마이제이션
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">기본 설정</TabsTrigger>
                    <TabsTrigger value="advanced">고급 설정</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">커스텀 요청사항</label>
                      <Textarea
                        placeholder="원하는 디자인을 자세히 설명해주세요..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="resize-none"
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4">
                    <AdvancedStyleCustomizer 
                      form={form} 
                      onStyleUpdate={handleStyleUpdate}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Measurement Summary */}
            {measurements && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">측정 데이터 요약</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {measurements.slice(0, 4).map((measurement: any, index: number) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{measurement.fingerType}</span>
                        <span>{measurement.nailWidth?.toFixed(1)}×{measurement.nailLength?.toFixed(1)}mm</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleGenerateDesign}
                disabled={isGenerating || !currentSessionId}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    디자인 생성 중...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    고급 디자인 생성
                  </>
                )}
              </Button>

              {generatedDesign && (
                <Button 
                  onClick={handleGenerateVariations}
                  disabled={generateVariationsMutation.isPending}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  변형 디자인 생성
                </Button>
              )}
            </div>

            {/* Generation Progress */}
            {isGenerating && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>디자인 생성 진행률</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Recommendations */}
            {designRecommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    AI 디자인 분석 및 추천
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="recommendations" className="w-full">
                    <TabsList>
                      <TabsTrigger value="recommendations">추천사항</TabsTrigger>
                      <TabsTrigger value="colors">색상 제안</TabsTrigger>
                      <TabsTrigger value="styles">스타일 제안</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="recommendations" className="space-y-2">
                      {designRecommendations.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">{rec}</p>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="colors" className="space-y-2">
                      {designRecommendations.colorSuggestions.map((color, index) => (
                        <div key={index} className="p-3 bg-pink-50 rounded-lg">
                          <p className="text-sm text-pink-800">{color}</p>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="styles" className="space-y-2">
                      {designRecommendations.styleSuggestions.map((style, index) => (
                        <div key={index} className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-800">{style}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Generated Design */}
            {generatedDesign && (
              <Card>
                <CardHeader>
                  <CardTitle>생성된 맞춤형 디자인</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative group">
                      <img 
                        src={generatedDesign} 
                        alt="Generated nail design"
                        className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                          <Button size="sm" variant="secondary">
                            <Eye className="w-4 h-4 mr-1" />
                            확대보기
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Download className="w-4 h-4 mr-1" />
                            다운로드
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-pink-600 hover:bg-pink-700"
                        onClick={() => setLocation(`/order?design=${encodeURIComponent(selectedDesign)}`)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        주문하기
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Design Variations */}
            {designVariations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>디자인 변형</CardTitle>
                  <p className="text-sm text-gray-600">다양한 스타일 강도로 생성된 변형 디자인들</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {designVariations.map((variation, index) => (
                      <div key={index} className="relative group cursor-pointer">
                        <img 
                          src={variation} 
                          alt={`Design variation ${index + 1}`}
                          className="w-full rounded-lg shadow hover:shadow-lg transition-shadow"
                          onClick={() => setSelectedDesign(variation)}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100"
                            onClick={() => setSelectedDesign(variation)}
                          >
                            선택하기
                          </Button>
                        </div>
                        {selectedDesign === variation && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-purple-600">선택됨</Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!generatedDesign && !isGenerating && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Wand2 className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    AI 디자인 생성 준비 완료
                  </h3>
                  <p className="text-gray-500 text-center mb-6">
                    정밀한 손톱 측정 데이터를 바탕으로<br />
                    완전히 맞춤화된 네일아트 디자인을 생성해드립니다
                  </p>
                  {!currentSessionId && (
                    <Button onClick={() => setLocation("/photo-measurement")}>
                      먼저 손톱 측정하기
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}