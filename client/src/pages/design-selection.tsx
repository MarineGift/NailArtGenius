import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, ShoppingCart, Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useLocation } from "wouter";
import Header from "@/components/header";

interface Design {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isPopular?: boolean;
  isNew?: boolean;
}

export default function DesignSelection() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: "all", name: "전체" },
    { id: "classic", name: "클래식" },
    { id: "french", name: "프렌치" },
    { id: "gradient", name: "그라데이션" },
    { id: "glitter", name: "글리터" },
    { id: "floral", name: "플로럴" },
    { id: "geometric", name: "기하학" },
  ];

  const designs: Design[] = [
    {
      id: "1",
      name: "클래식 프렌치",
      price: 35000,
      image: "/api/placeholder/200/200",
      category: "french",
      rating: 4.8,
      isPopular: true,
    },
    {
      id: "2", 
      name: "로즈 골드 글리터",
      price: 42000,
      image: "/api/placeholder/200/200",
      category: "glitter",
      rating: 4.9,
      isNew: true,
    },
    {
      id: "3",
      name: "벚꽃 아트",
      price: 48000,
      image: "/api/placeholder/200/200",
      category: "floral",
      rating: 4.7,
      isPopular: true,
    },
    {
      id: "4",
      name: "그라데이션 핑크",
      price: 38000,
      image: "/api/placeholder/200/200",
      category: "gradient",
      rating: 4.6,
    },
    {
      id: "5",
      name: "지오메트릭 블랙",
      price: 45000,
      image: "/api/placeholder/200/200",
      category: "geometric",
      rating: 4.5,
      isNew: true,
    },
    {
      id: "6",
      name: "화이트 마블",
      price: 40000,
      image: "/api/placeholder/200/200",
      category: "classic",
      rating: 4.8,
    },
  ];

  const filteredDesigns = selectedCategory === "all" 
    ? designs 
    : designs.filter(design => design.category === selectedCategory);

  const toggleFavorite = (designId: string) => {
    setFavorites(prev => 
      prev.includes(designId) 
        ? prev.filter(id => id !== designId)
        : [...prev, designId]
    );
  };

  const selectedDesignData = designs.find(d => d.id === selectedDesign);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => setLocation("/processing")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">네일 디자인 선택</h1>
            <p className="text-gray-600">마음에 드는 네일 디자인을 선택해주세요</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-pink-600 text-white" : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Design Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDesigns.map((design) => (
            <Card 
              key={design.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedDesign === design.id ? 'ring-2 ring-pink-600 border-pink-300' : ''
              }`}
              onClick={() => setSelectedDesign(design.id)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <div 
                    className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-t-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${
                        design.category === 'french' ? '#fdf2f8, #fce7f3' :
                        design.category === 'glitter' ? '#fef3c7, #fde68a' :
                        design.category === 'floral' ? '#ecfdf5, #d1fae5' :
                        design.category === 'gradient' ? '#fdf4ff, #f3e8ff' :
                        design.category === 'geometric' ? '#f1f5f9, #e2e8f0' :
                        '#f8fafc, #f1f5f9'
                      })`
                    }}
                  >
                    <span className="text-4xl">💅</span>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {design.isPopular && (
                      <Badge className="bg-red-500 text-white text-xs">인기</Badge>
                    )}
                    {design.isNew && (
                      <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(design.id);
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(design.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                      }`} 
                    />
                  </Button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{design.name}</h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-pink-600">
                      ₩{design.price.toLocaleString()}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">{design.rating}</span>
                    </div>
                  </div>

                  {selectedDesign === design.id && (
                    <Badge className="w-full justify-center bg-pink-100 text-pink-700">
                      선택됨
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Design Summary */}
        {selectedDesignData && (
          <Card className="mb-8 border-pink-200 bg-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">선택된 디자인</h3>
                  <p className="text-gray-600">{selectedDesignData.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-pink-600">
                    ₩{selectedDesignData.price.toLocaleString()}
                  </p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">{selectedDesignData.rating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setLocation("/processing")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <Button 
            disabled={!selectedDesign}
            className="bg-pink-600 hover:bg-pink-700"
            onClick={() => setLocation("/payment")}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            결제하기
          </Button>
        </div>
      </div>
    </div>
  );
}