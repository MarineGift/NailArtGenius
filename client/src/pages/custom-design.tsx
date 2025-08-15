import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Sparkles, Wand2, Eye, Download, Heart, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";

interface GenerationProgress {
  step: number;
  total: number;
  message: string;
}

export default function CustomDesign() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedBaseDesign, setSelectedBaseDesign] = useState<number | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [generatedDesigns, setGeneratedDesigns] = useState<any[]>([]);

  // Fetch user's style preferences
  const { data: stylePreferences } = useQuery({
    queryKey: ["/api/style-preferences"],
    enabled: isAuthenticated,
  });

  // Fetch base designs for customization
  const { data: baseDesigns = [] } = useQuery({
    queryKey: ["/api/designs"],
  });

  // Fetch user's nail analysis results
  const { data: nailAnalysis } = useQuery({
    queryKey: ["/api/ai-nails"],
    enabled: isAuthenticated,
  });

  // Generate custom design mutation
  const generateDesignMutation = useMutation({
    mutationFn: async (designData: any) => {
      return await apiRequest("/api/custom-designs/generate", "POST", designData);
    },
    onSuccess: (data) => {
      setGeneratedDesigns(prev => [...prev, data]);
      setGenerationProgress(null);
      toast({
        title: "디자인 생성 완료",
        description: "새로운 맞춤형 디자인이 생성되었습니다!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/custom-designs"] });
    },
    onError: (error: any) => {
      setGenerationProgress(null);
      toast({
        title: "생성 실패",
        description: error.message || "디자인 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Fetch user's existing custom designs
  const { data: existingDesigns = [] } = useQuery({
    queryKey: ["/api/custom-designs"],
    enabled: isAuthenticated,
  });

  // Save design mutation
  const saveDesignMutation = useMutation({
    mutationFn: async (designId: number) => {
      return await apiRequest(`/api/custom-designs/${designId}/save`, "POST");
    },
    onSuccess: () => {
      toast({
        title: "디자인 저장 완료",
        description: "디자인이 저장되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/custom-designs"] });
    },
  });

  const handleGenerateDesign = () => {
    if (!stylePreferences) {
      toast({
        title: "스타일 선호도 필요",
        description: "먼저 스타일 선호도를 설정해주세요.",
        variant: "destructive",
      });
      setLocation("/style-preferences");
      return;
    }

    const designData = {
      customPrompt,
      baseDesignId: selectedBaseDesign,
      stylePreferencesId: stylePreferences.id,
      nailAnalysis: nailAnalysis?.results,
    };

    setGenerationProgress({ step: 1, total: 4, message: "AI 프롬프트 생성 중..." });
    
    // Simulate progress steps
    setTimeout(() => {
      setGenerationProgress({ step: 2, total: 4, message: "디자인 이미지 생성 중..." });
    }, 1000);
    
    setTimeout(() => {
      setGenerationProgress({ step: 3, total: 4, message: "개인화 적용 중..." });
    }, 3000);
    
    setTimeout(() => {
      setGenerationProgress({ step: 4, total: 4, message: "최종 처리 중..." });
    }, 5000);

    generateDesignMutation.mutate(designData);
  };

  const generateSmartPrompt = () => {
    if (!stylePreferences) return;

    const colors = stylePreferences.preferredColors?.join(", ") || "";
    const styles = stylePreferences.preferredStyles?.join(", ") || "";
    const occasions = stylePreferences.occasions?.join(", ") || "";
    
    const smartPrompt = `${styles} 스타일의 네일 디자인, ${colors} 색상 사용, ${occasions} 상황에 적합한, ${stylePreferences.complexity} 복잡도`;
    
    setCustomPrompt(smartPrompt);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>로그인 필요</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">맞춤형 디자인 생성을 위해 먼저 로그인해주세요.</p>
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
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Wand2 className="h-8 w-8 mr-3 text-purple-600" />
            AI 맞춤형 디자인 생성
          </h1>
          <p className="text-gray-600">당신만의 독특한 네일 아트 디자인을 AI로 생성해보세요</p>
        </div>

        {/* Style Preferences Status */}
        {!stylePreferences && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-yellow-800">스타일 선호도 설정 필요</h3>
                  <p className="text-yellow-700 text-sm">더 정확한 맞춤형 디자인을 위해 선호도를 설정해주세요.</p>
                </div>
                <Button onClick={() => setLocation("/style-preferences")} className="bg-yellow-600 hover:bg-yellow-700">
                  설정하기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Design Generation Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Custom Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  디자인 요청
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-prompt">원하는 디자인을 설명해주세요</Label>
                  <Textarea
                    id="custom-prompt"
                    placeholder="예: 봄을 연상시키는 파스텔 톤의 플로럴 패턴, 작은 나비 포인트가 있는 우아한 디자인"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>
                
                {stylePreferences && (
                  <Button 
                    variant="outline" 
                    onClick={generateSmartPrompt}
                    className="w-full"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    내 선호도로 자동 생성
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Base Design Selection */}
            <Card>
              <CardHeader>
                <CardTitle>베이스 디자인 (선택사항)</CardTitle>
                <p className="text-sm text-gray-600">기존 디자인을 기반으로 커스터마이즈할 수 있습니다</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {baseDesigns.slice(0, 8).map((design: any) => (
                    <div
                      key={design.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedBaseDesign === design.id
                          ? "border-purple-500 ring-2 ring-purple-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedBaseDesign(
                        selectedBaseDesign === design.id ? null : design.id
                      )}
                    >
                      <img
                        src={design.imageUrl}
                        alt={design.name}
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{design.name}</p>
                      </div>
                      {selectedBaseDesign === design.id && (
                        <div className="absolute top-1 right-1">
                          <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generation Button */}
            <Card>
              <CardContent className="pt-6">
                {generationProgress ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Sparkles className="h-8 w-8 mx-auto text-purple-600 animate-spin" />
                      <p className="mt-2 font-medium">{generationProgress.message}</p>
                    </div>
                    <Progress 
                      value={(generationProgress.step / generationProgress.total) * 100} 
                      className="w-full"
                    />
                    <p className="text-sm text-gray-600 text-center">
                      {generationProgress.step} / {generationProgress.total} 단계
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleGenerateDesign}
                    disabled={!customPrompt.trim() || generateDesignMutation.isPending}
                    className="w-full h-12 text-lg"
                  >
                    <Wand2 className="h-5 w-5 mr-2" />
                    AI 디자인 생성하기
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Style Preferences Summary */}
          <div className="space-y-6">
            {stylePreferences && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">내 스타일 선호도</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">선호 색상</h4>
                    <div className="flex flex-wrap gap-1">
                      {stylePreferences.preferredColors?.map((color: string) => (
                        <Badge key={color} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">선호 스타일</h4>
                    <div className="flex flex-wrap gap-1">
                      {stylePreferences.preferredStyles?.map((style: string) => (
                        <Badge key={style} variant="outline" className="text-xs">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">사용 상황</h4>
                    <div className="flex flex-wrap gap-1">
                      {stylePreferences.occasions?.map((occasion: string) => (
                        <Badge key={occasion} variant="default" className="text-xs">
                          {occasion}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setLocation("/style-preferences")}
                      className="w-full"
                    >
                      선호도 수정
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nail Analysis Summary */}
            {nailAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">네일 분석 결과</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nailAnalysis.results?.map((result: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="capitalize">{result.fingerType}</span>
                        <span className="text-gray-600">{result.shape}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setLocation("/ai-processing")}
                    className="w-full mt-3"
                  >
                    다시 분석하기
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Generated Designs */}
        {(generatedDesigns.length > 0 || existingDesigns.length > 0) && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">생성된 디자인</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...generatedDesigns, ...existingDesigns].map((design: any) => (
                <Card key={design.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={design.generatedImageUrl}
                      alt="Generated design"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {design.designPrompt}
                        </p>
                      </div>
                      
                      {design.price && (
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-pink-600">
                            ₩{Number(design.price).toLocaleString()}
                          </span>
                          <Badge variant="outline">맞춤형</Badge>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setLocation(`/design-preview/${design.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          미리보기
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => saveDesignMutation.mutate(design.id)}
                        >
                          주문하기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}