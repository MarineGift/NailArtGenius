import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wand2, ShoppingCart, RefreshCw, Download } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useLocation } from "wouter";
import Header from "@/components/header";
import { generateDesignPreviewPDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";

export default function DesignPreview() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [previewReady, setPreviewReady] = useState(false);
  const { toast } = useToast();

  // Mock design data - in real app this would come from state/props
  const selectedDesign = {
    id: "1",
    name: "클래식 프렌치",
    price: 35000,
    category: "french"
  };

  // Simulate AI processing
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev < 95) {
          return prev + Math.random() * 10;
        }
        return prev;
      });
    }, 500);

    const completeTimer = setTimeout(() => {
      setProgress(100);
      setIsGenerating(false);
      setPreviewReady(true);
      clearInterval(timer);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, []);

  const regeneratePreview = () => {
    setIsGenerating(true);
    setPreviewReady(false);
    setProgress(0);
  };

  const handleDownloadPreview = async () => {
    try {
      const fileName = `nail_preview_${selectedDesign.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      await generateDesignPreviewPDF('preview-container', fileName);
      
      toast({
        title: "미리보기 저장 완료",
        description: "디자인 미리보기 PDF가 다운로드되었습니다.",
      });
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "PDF 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
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
            <h1 className="text-2xl font-bold text-gray-900">AI 디자인 미리보기</h1>
            <p className="text-gray-600">선택한 디자인이 회원님의 손톱에 어떻게 보일지 확인해보세요</p>
          </div>
        </div>

        {/* Selected Design Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{selectedDesign.name}</h3>
                <p className="text-gray-600">선택된 네일 디자인</p>
              </div>
              <Badge className="bg-pink-100 text-pink-800">
                ₩{selectedDesign.price.toLocaleString()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Processing Status */}
        {isGenerating && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand2 className="h-5 w-5 mr-2 animate-spin" />
                AI가 디자인을 생성하고 있습니다
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>진행상황</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full h-3" />
                </div>
                <div className="text-sm text-gray-600">
                  {progress < 30 && "업로드한 손톱 이미지를 분석하고 있습니다..."}
                  {progress >= 30 && progress < 60 && "손톱 형태와 크기를 측정하고 있습니다..."}
                  {progress >= 60 && progress < 90 && "선택하신 디자인을 적용하고 있습니다..."}
                  {progress >= 90 && "최종 이미지를 완성하고 있습니다..."}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Results */}
        {previewReady && (
          <div className="space-y-6">
            <Card id="preview-container">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>AI 생성 결과</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={regeneratePreview}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  다시 생성
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before */}
                  <div>
                    <h4 className="font-medium mb-3 text-center">적용 전</h4>
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center text-gray-500">
                        <span className="text-4xl block mb-2">🖐️</span>
                        <p className="text-sm">원본 손톱 이미지</p>
                      </div>
                    </div>
                  </div>

                  {/* After */}
                  <div>
                    <h4 className="font-medium mb-3 text-center">적용 후</h4>
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center border-2 border-pink-200">
                      <div className="text-center">
                        <span className="text-4xl block mb-2">💅</span>
                        <p className="text-sm text-pink-700 font-medium">클래식 프렌치 적용</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    💡 실제 시술 결과와 차이가 있을 수 있습니다. 참고용으로만 사용해주세요.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">디자인 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">디자인명</span>
                    <span className="font-medium">{selectedDesign.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">예상 소요시간</span>
                    <span className="font-medium">60분</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">지속 기간</span>
                    <span className="font-medium">7-10일</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">가격</span>
                    <span className="font-bold text-pink-600">₩{selectedDesign.price.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">다음 단계</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    onClick={() => setLocation("/payment")}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    결제 진행하기
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setLocation("/designs")}
                  >
                    다른 디자인 선택
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full"
                    onClick={handleDownloadPreview}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    미리보기 PDF 저장
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}