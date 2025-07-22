import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, ShoppingCart, Star, Eye, Info } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useLocation } from "wouter";
import Header from "@/components/header";

// Import nail art design images
import nailart1 from "@assets/nailart1_1753154093464.jpg";
import nailart2 from "@assets/nailart2_1753154093464.jpg";
import nailart3 from "@assets/nailart3_1753154093464.jpg";
import nailart4 from "@assets/nailart4_1753154093465.jpg";
import nailart5 from "@assets/nailart5_1753154093465.jpg";
import nailart6 from "@assets/nailart6_1753154093465.jpg";

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
      name: "다이아몬드 홀로그램",
      price: 45000,
      image: nailart1,
      category: "glitter",
      rating: 4.8,
      isPopular: true,
    },
    {
      id: "2", 
      name: "오로라 3D 젤네일",
      price: 42000,
      image: nailart2,
      category: "glitter",
      rating: 4.9,
      isNew: true,
    },
    {
      id: "3",
      name: "네온라이트 컬러 믹스",
      price: 38000,
      image: nailart3,
      category: "gradient",
      rating: 4.7,
      isPopular: true,
    },
    {
      id: "4",
      name: "수채화 컬러 아트",
      price: 44000,
      image: nailart4,
      category: "gradient",
      rating: 4.6,
    },
    {
      id: "5",
      name: "시크 블랙 프렌치",
      price: 40000,
      image: nailart5,
      category: "french",
      rating: 4.5,
      isNew: true,
    },
    {
      id: "6",
      name: "너무 우아해 고급 미끌림",
      price: 48000,
      image: nailart6,
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

  const DesignDetailModal = ({ design }: { design: Design }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mb-2">
          <Eye className="h-4 w-4 mr-2" />
          상세보기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{design.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img 
              src={design.image} 
              alt={design.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-pink-600">
                  ₩{design.price.toLocaleString()}
                </span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  ⭐ {design.rating}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-4">
                {design.isPopular && (
                  <Badge className="bg-red-100 text-red-800">인기</Badge>
                )}
                {design.isNew && (
                  <Badge className="bg-blue-100 text-blue-800">신규</Badge>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">디자인 특징</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 전문 네일 아티스트 디자인</li>
                <li>• 고품질 네일 프린팅 소재</li>
                <li>• 약 7-10일 지속</li>
                <li>• 자연스러운 마감</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">시술 안내</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 시술 시간: 약 60분</li>
                <li>• 베이스코트 + 디자인 + 탑코트</li>
                <li>• 전문 UV 램프 사용</li>
                <li>• 24시간 방수</li>
              </ul>
            </div>
            
            <Button 
              className="w-full bg-pink-600 hover:bg-pink-700"
              onClick={() => {
                setSelectedDesign(design.id);
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              이 디자인 선택하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => setLocation("/upload")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('designs.title')}</h1>
            <p className="text-gray-600">{t('designs.subtitle')}</p>
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

        {/* Design Grid - Shopping Mall Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDesigns.map((design) => (
            <Card 
              key={design.id}
              className="group cursor-pointer transition-all hover:shadow-xl hover:scale-105 overflow-hidden bg-white"
            >
              <div className="relative">
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={design.image} 
                    alt={design.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {design.isPopular && (
                    <Badge className="bg-red-500 text-white text-xs px-2 py-1 font-semibold">HOT</Badge>
                  )}
                  {design.isNew && (
                    <Badge className="bg-blue-500 text-white text-xs px-2 py-1 font-semibold">NEW</Badge>
                  )}
                </div>

                {/* Favorite Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 h-8 w-8 bg-white/90 hover:bg-white border-0 shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(design.id);
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 transition-colors ${
                      favorites.includes(design.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
                    }`} 
                  />
                </Button>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{design.name}</h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-pink-600">
                      ₩{design.price.toLocaleString()}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700">{design.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">(128)</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <DesignDetailModal design={design} />
                    <Button 
                      className={`flex-1 ${
                        selectedDesign === design.id 
                          ? 'bg-pink-600 text-white' 
                          : 'bg-white text-pink-600 border-pink-600'
                      } hover:bg-pink-600 hover:text-white transition-colors`}
                      variant={selectedDesign === design.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDesign(design.id)}
                    >
                      {selectedDesign === design.id ? (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          선택됨
                        </>
                      ) : (
                        '선택하기'
                      )}
                    </Button>
                  </div>
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
            onClick={() => setLocation("/processing")}
          >
            <Eye className="h-4 w-4 mr-2" />
            AI 미리보기
          </Button>
        </div>
      </div>
    </div>
  );
}