import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Sparkles, Heart, Zap } from "lucide-react";

interface AdvancedStyleCustomizerProps {
  form: any;
  onStyleUpdate: (preferences: any) => void;
}

const personalityTraits = [
  { id: "adventurous", name: "모험적인", icon: "🌟" },
  { id: "elegant", name: "우아한", icon: "👑" },
  { id: "playful", name: "장난기 많은", icon: "🎈" },
  { id: "sophisticated", name: "세련된", icon: "💎" },
  { id: "romantic", name: "로맨틱한", icon: "💕" },
  { id: "edgy", name: "개성 있는", icon: "⚡" },
  { id: "minimalist", name: "미니멀한", icon: "▫️" },
  { id: "artistic", name: "예술적인", icon: "🎨" },
  { id: "confident", name: "자신감 있는", icon: "💪" },
  { id: "dreamy", name: "몽환적인", icon: "✨" },
];

const colorHarmonyOptions = [
  { id: "monochromatic", name: "모노크로매틱", description: "같은 색상의 다양한 명도" },
  { id: "complementary", name: "보색 조화", description: "대비되는 색상 조합" },
  { id: "triadic", name: "삼색 조화", description: "균등한 간격의 세 색상" },
  { id: "analogous", name: "유사 색상", description: "인접한 색상들의 조화" },
];

const patternPreferences = [
  { id: "solid", name: "단색", description: "단일 색상으로 깔끔하게" },
  { id: "gradient", name: "그라데이션", description: "부드러운 색상 변화" },
  { id: "pattern", name: "패턴", description: "반복적인 무늬와 디자인" },
  { id: "mixed", name: "믹스", description: "다양한 요소의 조합" },
];

export default function AdvancedStyleCustomizer({ form, onStyleUpdate }: AdvancedStyleCustomizerProps) {
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  
  const handleTraitToggle = (traitId: string) => {
    const newTraits = selectedTraits.includes(traitId)
      ? selectedTraits.filter(t => t !== traitId)
      : [...selectedTraits, traitId];
    
    setSelectedTraits(newTraits);
    form.setValue("personalityTraits", newTraits);
    onStyleUpdate({ personalityTraits: newTraits });
  };

  return (
    <div className="space-y-6">
      {/* Personality-Based Design */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-500" />
            성격 기반 디자인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            당신의 성격을 가장 잘 표현하는 특성을 선택해주세요
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {personalityTraits.map((trait) => (
              <Button
                key={trait.id}
                type="button"
                variant={selectedTraits.includes(trait.id) ? "default" : "outline"}
                className={`h-auto p-3 flex flex-col items-center space-y-1 ${
                  selectedTraits.includes(trait.id) 
                    ? "bg-pink-500 hover:bg-pink-600 text-white" 
                    : "hover:bg-pink-50"
                }`}
                onClick={() => handleTraitToggle(trait.id)}
              >
                <span className="text-lg">{trait.icon}</span>
                <span className="text-xs text-center">{trait.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Harmony */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2 text-purple-500" />
            색상 조화 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="colorHarmony"
            render={({ field }) => (
              <FormItem>
                <FormLabel>색상 조합 스타일</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="색상 조화 방식을 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colorHarmonyOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex flex-col">
                          <span>{option.name}</span>
                          <span className="text-xs text-gray-500">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Pattern Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
            패턴 선호도
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="patternPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>패턴 스타일</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {patternPreferences.map((pattern) => (
                    <Button
                      key={pattern.id}
                      type="button"
                      variant={field.value === pattern.id ? "default" : "outline"}
                      className={`h-auto p-4 flex flex-col space-y-2 ${
                        field.value === pattern.id 
                          ? "bg-blue-500 hover:bg-blue-600 text-white" 
                          : "hover:bg-blue-50"
                      }`}
                      onClick={() => {
                        field.onChange(pattern.id);
                        onStyleUpdate({ patternPreference: pattern.id });
                      }}
                    >
                      <span className="font-medium">{pattern.name}</span>
                      <span className="text-xs text-center opacity-80">{pattern.description}</span>
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Design Intensity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            디자인 강도
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="intensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>디자인 임팩트 레벨</FormLabel>
                <div className="space-y-3">
                  {[
                    { value: "subtle", label: "은은함", desc: "자연스럽고 절제된" },
                    { value: "moderate", label: "적당함", desc: "균형 잡힌 중간 강도" },
                    { value: "bold", label: "강렬함", desc: "눈에 띄고 임팩트 있는" },
                    { value: "dramatic", label: "드라마틱", desc: "극적이고 화려한" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        field.value === option.value
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-gray-200 hover:border-yellow-300"
                      }`}
                      onClick={() => {
                        field.onChange(option.value);
                        onStyleUpdate({ intensity: option.value });
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{option.label}</span>
                          <p className="text-sm text-gray-600">{option.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full ${
                          field.value === option.value ? "bg-yellow-500" : "bg-gray-300"
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Inspiration Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>영감 키워드</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="inspirationKeywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>디자인 영감을 주는 단어들</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="예: 봄날의 벚꽃, 바다의 파도, 도시의 네온사인, 빈티지 레이스 등"
                    className="resize-none"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onStyleUpdate({ inspirationKeywords: e.target.value });
                    }}
                  />
                </FormControl>
                <p className="text-xs text-gray-500">
                  AI가 이 키워드들을 참고하여 더욱 개성 있는 디자인을 생성합니다
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}