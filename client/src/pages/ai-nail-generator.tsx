import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Heart, Share2, Wand2, Palette, Upload } from 'lucide-react';

interface GeneratedDesign {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  colors: string[];
  complexity: string;
  timestamp: Date;
}

export default function AITailGenerator() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [complexity, setComplexity] = useState('medium');
  const [generatedDesigns, setGeneratedDesigns] = useState<GeneratedDesign[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Style options
  const styleOptions = [
    { value: 'minimalist', label: 'Minimalist', description: '심플하고 세련된 스타일' },
    { value: 'floral', label: 'Floral', description: '꽃과 자연 모티브' },
    { value: 'geometric', label: 'Geometric', description: '기하학적 패턴' },
    { value: 'abstract', label: 'Abstract', description: '추상적 아트' },
    { value: 'vintage', label: 'Vintage', description: '클래식하고 우아한 스타일' },
    { value: 'modern', label: 'Modern', description: '현대적이고 트렌디한 스타일' },
    { value: 'cute', label: 'Cute', description: '귀엽고 사랑스러운 디자인' },
    { value: 'elegant', label: 'Elegant', description: '우아하고 고급스러운 스타일' }
  ];

  // Color options
  const colorOptions = [
    '#FF6B9D', '#8B5CF6', '#06B6D4', '#10B981', 
    '#F59E0B', '#EF4444', '#EC4899', '#6366F1',
    '#000000', '#FFFFFF', '#9CA3AF', '#F3F4F6'
  ];

  // Generate AI nail art
  const generateNailArt = useMutation({
    mutationFn: async (params: {
      prompt: string;
      style: string;
      colors: string[];
      complexity: string;
    }) => {
      setIsGenerating(true);
      const response = await apiRequest('/api/ai/generate-nail-art', 'POST', params);
      return response;
    },
    onSuccess: (data) => {
      const newDesign: GeneratedDesign = {
        id: Date.now().toString(),
        imageUrl: data.imageUrl,
        prompt,
        style: selectedStyle,
        colors: selectedColors,
        complexity,
        timestamp: new Date()
      };
      
      setGeneratedDesigns(prev => [newDesign, ...prev]);
      setIsGenerating(false);
      
      toast({
        title: 'AI 네일아트 생성 완료!',
        description: '새로운 디자인이 생성되었습니다.',
      });
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: '생성 실패',
        description: 'AI 네일아트 생성 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: '프롬프트 필요',
        description: '원하는 네일아트 디자인을 설명해 주세요.',
        variant: 'destructive',
      });
      return;
    }

    generateNailArt.mutate({
      prompt: prompt.trim(),
      style: selectedStyle,
      colors: selectedColors,
      complexity
    });
  };

  const downloadDesign = (design: GeneratedDesign) => {
    // Create download link
    const link = document.createElement('a');
    link.href = design.imageUrl;
    link.download = `nail-art-${design.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <Sparkles className="inline-block w-8 h-8 mr-2 text-purple-500" />
            AI 네일아트 생성기
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            AI 기술로 당신만의 독특한 네일아트 디자인을 만들어보세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  디자인 생성
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">디자인 설명</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예: 파스텔 톤의 꽃 무늬와 골드 액센트가 있는 우아한 네일아트"
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Style Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">스타일</label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="스타일 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          <div>
                            <div className="font-medium">{style.label}</div>
                            <div className="text-xs text-gray-500">{style.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">선호 색상</label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          if (selectedColors.includes(color)) {
                            setSelectedColors(prev => prev.filter(c => c !== color));
                          } else {
                            setSelectedColors(prev => [...prev, color]);
                          }
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColors.includes(color) 
                            ? 'border-blue-500 scale-110' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {selectedColors.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedColors.map((color) => (
                        <Badge key={color} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Complexity */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">복잡도</label>
                  <Select value={complexity} onValueChange={setComplexity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple - 간단하고 미니멀</SelectItem>
                      <SelectItem value="medium">Medium - 적당한 디테일</SelectItem>
                      <SelectItem value="complex">Complex - 복잡하고 화려한</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI로 생성하기
                    </>
                  )}
                </Button>

                {/* Quick Prompts */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">빠른 프롬프트</label>
                  <div className="space-y-1">
                    {[
                      '우아한 프렌치 매니큐어',
                      '화려한 글리터 그라데이션',
                      '모던한 기하학 패턴',
                      '로맨틱한 장미 꽃무늬',
                      '미니멀 라인 아트'
                    ].map((quickPrompt) => (
                      <Button
                        key={quickPrompt}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => setPrompt(quickPrompt)}
                      >
                        {quickPrompt}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Designs Gallery */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  생성된 디자인
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedDesigns.length === 0 ? (
                  <div className="text-center py-12">
                    <Wand2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      아직 생성된 디자인이 없습니다
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      왼쪽 패널에서 원하는 디자인을 설명하고 생성해보세요
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedDesigns.map((design) => (
                      <Card key={design.id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <img
                            src={design.imageUrl}
                            alt={design.prompt}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-black/70 text-white">
                              {design.style}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {design.prompt}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {design.complexity}
                            </Badge>
                            {design.colors.length > 0 && (
                              <div className="flex gap-1">
                                {design.colors.slice(0, 3).map((color, idx) => (
                                  <div
                                    key={idx}
                                    className="w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadDesign(design)}
                              className="flex-1"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              다운로드
                            </Button>
                            <Button variant="outline" size="sm">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}