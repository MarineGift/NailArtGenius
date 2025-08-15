import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check } from 'lucide-react';

interface NailDesign {
  id: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  reviews: number;
  duration: number;
  category: string;
  image: string;
  emoji: string;
}

interface NailArtDesignSelectionProps {
  onDesignSelect: (design: NailDesign) => void;
}

export function NailArtDesignSelection({ onDesignSelect }: NailArtDesignSelectionProps) {
  const [selectedDesignId, setSelectedDesignId] = useState<number | null>(null);

  const designs: NailDesign[] = [
    {
      id: 1,
      name: "클래식 프렌치 매니큐어",
      price: 45,
      description: "전통적인 프렌치 매니큐어 스타일",
      rating: 4.8,
      reviews: 127,
      duration: 45,
      category: "classic",
      image: "/images/french-manicure.jpg",
      emoji: "💅"
    },
    {
      id: 2, 
      name: "플로럴 디자인",
      price: 65,
      description: "섬세한 꽃 무늬 네일아트",
      rating: 4.9,
      reviews: 89,
      duration: 90,
      category: "floral",
      image: "/images/floral-design.jpg",
      emoji: "🌸"
    },
    {
      id: 3,
      name: "지오메트릭 패턴",
      price: 55,
      description: "모던한 기하학적 패턴",
      rating: 4.7,
      reviews: 156,
      duration: 60,
      category: "modern",
      image: "/images/geometric-pattern.jpg",
      emoji: "⚡"
    },
    {
      id: 4,
      name: "글리터 & 스파클",
      price: 70,
      description: "화려한 글리터 네일아트",
      rating: 4.6,
      reviews: 92,
      duration: 75,
      category: "glamour",
      image: "/images/glitter-sparkle.jpg",
      emoji: "✨"
    },
    {
      id: 5,
      name: "미니멀리스트 스타일",
      price: 40,
      description: "심플하고 세련된 미니멀 디자인",
      rating: 4.8,
      reviews: 134,
      duration: 30,
      category: "minimalist",
      image: "/images/minimalist-style.jpg",
      emoji: "🤍"
    },
    {
      id: 6,
      name: "시즌 디자인",
      price: 60,
      description: "계절감 있는 특별 디자인",
      rating: 4.7,
      reviews: 78,
      duration: 60,
      category: "seasonal",
      image: "/images/seasonal-design.jpg",
      emoji: "🍂"
    }
  ];

  const handleDesignSelect = (design: NailDesign) => {
    setSelectedDesignId(design.id);
    onDesignSelect(design);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-lg text-gray-700">
          AI 분석 결과에 맞는 네일아트 디자인을 선택해 주세요
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map((design) => (
          <Card 
            key={design.id} 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedDesignId === design.id 
                ? 'border-2 border-purple-500 shadow-lg' 
                : 'border border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => handleDesignSelect(design)}
          >
            <div className="relative">
              <div className="h-40 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <span className="text-6xl">{design.emoji}</span>
              </div>
              <Badge className="absolute top-2 right-2 bg-purple-600 text-white text-xs">
                {design.category}
              </Badge>
              {selectedDesignId === design.id && (
                <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{design.name}</h3>
              <p className="text-2xl font-bold text-purple-600 mb-2">${design.price}</p>
              <p className="text-gray-600 text-sm mb-3">{design.description}</p>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{design.rating}</span>
                  <span className="ml-1 text-sm text-gray-500">({design.reviews})</span>
                </div>
                <span className="text-sm text-gray-600">{design.duration}분</span>
              </div>
              
              <Button 
                className={`w-full ${
                  selectedDesignId === design.id 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                }`}
              >
                {selectedDesignId === design.id ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    선택됨
                  </>
                ) : (
                  '선택하기'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}