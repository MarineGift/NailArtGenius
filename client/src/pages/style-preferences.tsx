import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Palette, Sparkles, Upload, X } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/header";

// Style preferences form schema
const stylePreferencesSchema = z.object({
  preferredColors: z.array(z.string()).min(1, "최소 하나의 색상을 선택해주세요"),
  preferredStyles: z.array(z.string()).min(1, "최소 하나의 스타일을 선택해주세요"),
  occasions: z.array(z.string()).min(1, "최소 하나의 상황을 선택해주세요"),
  complexity: z.enum(["simple", "medium", "complex"]),
  budget: z.enum(["low", "medium", "high"]),
  skinTone: z.enum(["fair", "medium", "tan", "deep"]).optional(),
  lifestyle: z.string().optional(),
  notes: z.string().optional(),
});

type StylePreferencesFormData = z.infer<typeof stylePreferencesSchema>;

// Predefined options
const colorOptions = [
  { id: "red", name: "빨강", hex: "#EF4444" },
  { id: "pink", name: "분홍", hex: "#EC4899" },
  { id: "purple", name: "보라", hex: "#8B5CF6" },
  { id: "blue", name: "파랑", hex: "#3B82F6" },
  { id: "green", name: "초록", hex: "#10B981" },
  { id: "yellow", name: "노랑", hex: "#F59E0B" },
  { id: "orange", name: "주황", hex: "#F97316" },
  { id: "black", name: "검정", hex: "#1F2937" },
  { id: "white", name: "흰색", hex: "#F9FAFB" },
  { id: "nude", name: "누드", hex: "#D4B5A0" },
  { id: "gold", name: "골드", hex: "#D97706" },
  { id: "silver", name: "실버", hex: "#6B7280" },
];

const styleOptions = [
  { id: "minimalist", name: "미니멀" },
  { id: "floral", name: "플로럴" },
  { id: "geometric", name: "기하학적" },
  { id: "gradient", name: "그라데이션" },
  { id: "glitter", name: "글리터" },
  { id: "marble", name: "마블" },
  { id: "animal_print", name: "애니멀 프린트" },
  { id: "vintage", name: "빈티지" },
  { id: "modern", name: "모던" },
  { id: "cute", name: "큐트" },
  { id: "elegant", name: "우아한" },
  { id: "bold", name: "대담한" },
];

const occasionOptions = [
  { id: "daily", name: "일상" },
  { id: "work", name: "직장" },
  { id: "party", name: "파티" },
  { id: "wedding", name: "웨딩" },
  { id: "date", name: "데이트" },
  { id: "vacation", name: "휴가" },
  { id: "special_event", name: "특별한 행사" },
];

export default function StylePreferences() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [inspirationImages, setInspirationImages] = useState<string[]>([]);

  const form = useForm<StylePreferencesFormData>({
    resolver: zodResolver(stylePreferencesSchema),
    defaultValues: {
      preferredColors: [],
      preferredStyles: [],
      occasions: [],
      complexity: "medium",
      budget: "medium",
      skinTone: undefined,
      lifestyle: "",
      notes: "",
    },
  });

  // Fetch existing preferences
  const { data: existingPreferences } = useQuery({
    queryKey: ["/api/style-preferences"],
    enabled: isAuthenticated,
  });

  // Load existing preferences into form
  useEffect(() => {
    if (existingPreferences) {
      form.reset({
        preferredColors: existingPreferences.preferredColors || [],
        preferredStyles: existingPreferences.preferredStyles || [],
        occasions: existingPreferences.occasions || [],
        complexity: existingPreferences.complexity || "medium",
        budget: existingPreferences.budget || "medium",
        skinTone: existingPreferences.skinTone,
        lifestyle: existingPreferences.lifestyle || "",
        notes: existingPreferences.notes || "",
      });
      setInspirationImages(existingPreferences.inspirationImages || []);
    }
  }, [existingPreferences, form]);

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: async (data: StylePreferencesFormData) => {
      const requestData = {
        ...data,
        inspirationImages,
      };
      return await apiRequest("/api/style-preferences", "POST", requestData);
    },
    onSuccess: () => {
      toast({
        title: "스타일 선호도 저장 완료",
        description: "선호도가 성공적으로 저장되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/style-preferences"] });
      setLocation("/custom-design");
    },
    onError: (error: any) => {
      toast({
        title: "저장 실패",
        description: error.message || "선호도 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setInspirationImages(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeInspirationImage = (index: number) => {
    setInspirationImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  const onSubmit = (data: StylePreferencesFormData) => {
    savePreferencesMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>로그인 필요</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">스타일 선호도를 설정하려면 먼저 로그인해주세요.</p>
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
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Palette className="h-8 w-8 mr-3 text-pink-600" />
            스타일 선호도 설정
          </h1>
          <p className="text-gray-600">AI가 당신만의 맞춤형 네일 디자인을 생성할 수 있도록 선호도를 설정해주세요</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Preferred Colors */}
            <Card>
              <CardHeader>
                <CardTitle>선호하는 색상</CardTitle>
                <p className="text-sm text-gray-600">좋아하는 색상들을 선택해주세요 (복수 선택 가능)</p>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="preferredColors"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                          {colorOptions.map((color) => (
                            <div
                              key={color.id}
                              className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                field.value.includes(color.id)
                                  ? "border-pink-500 bg-pink-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => field.onChange(toggleArrayValue(field.value, color.id))}
                            >
                              <div
                                className="w-8 h-8 rounded-full border-2 border-gray-300 mb-2"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-xs text-center">{color.name}</span>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Preferred Styles */}
            <Card>
              <CardHeader>
                <CardTitle>선호하는 스타일</CardTitle>
                <p className="text-sm text-gray-600">좋아하는 네일 아트 스타일을 선택해주세요</p>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="preferredStyles"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {styleOptions.map((style) => (
                            <div
                              key={style.id}
                              className={`p-3 rounded-lg border-2 cursor-pointer text-center transition-all ${
                                field.value.includes(style.id)
                                  ? "border-pink-500 bg-pink-50 text-pink-700"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => field.onChange(toggleArrayValue(field.value, style.id))}
                            >
                              {style.name}
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Occasions */}
            <Card>
              <CardHeader>
                <CardTitle>주요 사용 상황</CardTitle>
                <p className="text-sm text-gray-600">네일을 주로 언제 사용하시는지 선택해주세요</p>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="occasions"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {occasionOptions.map((occasion) => (
                            <div
                              key={occasion.id}
                              className={`p-3 rounded-lg border-2 cursor-pointer text-center transition-all ${
                                field.value.includes(occasion.id)
                                  ? "border-pink-500 bg-pink-50 text-pink-700"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => field.onChange(toggleArrayValue(field.value, occasion.id))}
                            >
                              {occasion.name}
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Additional Preferences */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>복잡도</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="complexity"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="복잡도 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="simple">심플</SelectItem>
                              <SelectItem value="medium">보통</SelectItem>
                              <SelectItem value="complex">복잡</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>예산 범위</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="예산 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">경제적 (2-4만원)</SelectItem>
                              <SelectItem value="medium">보통 (4-8만원)</SelectItem>
                              <SelectItem value="high">프리미엄 (8만원 이상)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Skin Tone & Lifestyle */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>피부 톤</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="skinTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="피부 톤 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fair">밝은 톤</SelectItem>
                              <SelectItem value="medium">중간 톤</SelectItem>
                              <SelectItem value="tan">어두운 톤</SelectItem>
                              <SelectItem value="deep">깊은 톤</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>라이프스타일</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="lifestyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="예: 직장인, 학생, 예술가 등" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Inspiration Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  영감 이미지
                </CardTitle>
                <p className="text-sm text-gray-600">참고하고 싶은 네일 디자인 이미지를 업로드해주세요</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  
                  {inspirationImages.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {inspirationImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`영감 이미지 ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeInspirationImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>추가 요청사항</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="AI가 알았으면 하는 추가 정보나 특별한 요청사항을 입력해주세요..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setLocation("/")}>
                취소
              </Button>
              <Button type="submit" disabled={savePreferencesMutation.isPending}>
                {savePreferencesMutation.isPending ? "저장 중..." : "선호도 저장"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}