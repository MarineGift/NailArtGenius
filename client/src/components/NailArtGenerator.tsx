import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Download, Eye, Palette, Wand2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface NailArtGeneratorProps {
  sessionId: string;
  stylePreferences: any;
  onArtGenerated?: (generatedArt: any[]) => void;
}

interface GeneratedNailArt {
  fingerType: string;
  imageUrl: string;
  designDescription: string;
  appliedMeasurements: any;
}

export default function NailArtGenerator({ sessionId, stylePreferences, onArtGenerated }: NailArtGeneratorProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [generatedArt, setGeneratedArt] = useState<GeneratedNailArt[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);

  const generateNailArtMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/ai/generate-nail-art", "POST", {
        sessionId,
        stylePreferences,
      });
    },
    onSuccess: (data) => {
      setGeneratedArt(data.generatedArt);
      setGenerationProgress(100);
      onArtGenerated?.(data.generatedArt);
      toast({
        title: "네일아트 생성 완료",
        description: "AI가 맞춤형 네일아트 디자인을 생성했습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "생성 실패",
        description: error.message || "네일아트 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      setGenerationProgress(0);
    },
  });

  const combineDesignMutation = useMutation({
    mutationFn: async ({ fingerType, designImagePath }: { fingerType: string; designImagePath: string }) => {
      return await apiRequest("/api/ai/combine-design", "POST", {
        sessionId,
        fingerType,
        designImagePath,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "이미지 결합 완료",
        description: "고객님의 손톱에 디자인을 적용했습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "결합 실패",
        description: error.message || "이미지 결합 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateArt = () => {
    setGenerationProgress(0);
    generateNailArtMutation.mutate();
  };

  const handleCombineDesign = (fingerType: string, designImagePath: string) => {
    combineDesignMutation.mutate({ fingerType, designImagePath });
  };

  const getFingerDisplayName = (fingerType: string) => {
    const names = {
      'thumb': '엄지',
      'index': '검지',
      'middle': '중지',
      'ring': '약지',
      'pinky': '새끼손가락'
    };
    return names[fingerType] || fingerType;
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI 네일아트 생성
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">성격:</span>
              <p className="text-muted-foreground">{stylePreferences.personality}</p>
            </div>
            <div>
              <span className="font-medium">색상 조화:</span>
              <p className="text-muted-foreground">{stylePreferences.colorHarmony}</p>
            </div>
            <div>
              <span className="font-medium">패턴:</span>
              <p className="text-muted-foreground">{stylePreferences.patternPreference}</p>
            </div>
            <div>
              <span className="font-medium">강도:</span>
              <p className="text-muted-foreground">{stylePreferences.designIntensity}</p>
            </div>
          </div>

          {stylePreferences.inspirationKeywords?.length > 0 && (
            <div>
              <span className="font-medium text-sm">영감 키워드:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {stylePreferences.inspirationKeywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {generateNailArtMutation.isPending && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 animate-spin" />
                AI가 맞춤형 네일아트를 생성하고 있습니다...
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          <Button 
            onClick={handleGenerateArt}
            disabled={generateNailArtMutation.isPending}
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {generateNailArtMutation.isPending ? "생성 중..." : "AI 네일아트 생성"}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Nail Art Results */}
      {generatedArt.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              생성된 네일아트 ({generatedArt.length}개)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedArt.map((art, index) => (
                <div key={index} className="space-y-3">
                  <div className="aspect-square relative rounded-lg overflow-hidden border">
                    <img
                      src={art.imageUrl}
                      alt={`${getFingerDisplayName(art.fingerType)} 네일아트`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{getFingerDisplayName(art.fingerType)}</h4>
                      <Badge variant="outline">
                        {art.appliedMeasurements.shapeCategory}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {art.designDescription}
                    </p>
                    
                    <div className="text-xs text-muted-foreground">
                      크기: {art.appliedMeasurements.nailWidth}mm × {art.appliedMeasurements.nailLength}mm
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCombineDesign(art.fingerType, art.imageUrl)}
                        disabled={combineDesignMutation.isPending}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        실제 적용 보기
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = art.imageUrl;
                          link.download = `nail_art_${art.fingerType}.png`;
                          link.click();
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        다운로드
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {generatedArt.length === 0 && !generateNailArtMutation.isPending && (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">네일아트를 생성해보세요</h3>
            <p className="text-muted-foreground mb-4">
              AI가 측정된 손톱 크기와 스타일 선호도를 바탕으로<br />
              완벽한 맞춤형 네일아트를 생성합니다
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}