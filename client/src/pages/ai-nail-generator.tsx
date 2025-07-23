import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Heart, Share2, Wand2, Palette, Info } from 'lucide-react';

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
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [complexity, setComplexity] = useState('medium');
  const [generatedDesigns, setGeneratedDesigns] = useState<GeneratedDesign[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Style options
  const styleOptions = [
    { value: 'minimalist', label: 'Minimalist', description: 'Simple and elegant style' },
    { value: 'floral', label: 'Floral', description: 'Flower and nature motifs' },
    { value: 'geometric', label: 'Geometric', description: 'Geometric patterns' },
    { value: 'abstract', label: 'Abstract', description: 'Abstract art' },
    { value: 'vintage', label: 'Vintage', description: 'Classic and elegant style' },
    { value: 'modern', label: 'Modern', description: 'Modern and trendy style' },
    { value: 'cute', label: 'Cute', description: 'Cute and lovely design' },
    { value: 'elegant', label: 'Elegant', description: 'Elegant and luxurious style' }
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
        title: 'AI Nail Art Generation Complete!',
        description: 'New design has been generated.',
      });
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: 'Generation Failed',
        description: 'An error occurred during AI nail art generation.',
        variant: 'destructive',
      });
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt Required',
        description: 'Please describe your desired nail art design.',
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
            AI Nail Art Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Create unique nail art designs with AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Design Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Design Description</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Elegant nail art with pastel flower patterns and gold accents"
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Style Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Style</label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Style" />
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
                  <label className="text-sm font-medium">Preferred Colors</label>
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
                  <label className="text-sm font-medium">Complexity</label>
                  <Select value={complexity} onValueChange={setComplexity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple - Minimal and clean</SelectItem>
                      <SelectItem value="medium">Medium - Moderate detail</SelectItem>
                      <SelectItem value="complex">Complex - Intricate and elaborate</SelectItem>
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>

                {/* Quick Prompts */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Prompts</label>
                  <div className="space-y-1">
                    {[
                      'Elegant French manicure',
                      'Glitter gradient sparkle',
                      'Modern geometric pattern',
                      'Romantic rose flower design',
                      'Minimal line art'
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
                  Generated Designs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedDesigns.length === 0 ? (
                  <div className="text-center py-12">
                    <Wand2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No designs generated yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Describe your desired design in the left panel and generate
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
                              Download
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

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Design</h3>
                <p className="text-sm text-gray-600">
                  Advanced artificial intelligence creates unique nail art designs based on your preferences
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Custom Styles</h3>
                <p className="text-sm text-gray-600">
                  Choose from multiple design styles including minimalist, floral, geometric, and abstract
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Instant Download</h3>
                <p className="text-sm text-gray-600">
                  Download your generated designs immediately for inspiration or to show your nail technician
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}