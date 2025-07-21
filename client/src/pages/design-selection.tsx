import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import NailDesignCard from "@/components/nail-design-card";
import { Palette } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

interface NailDesign {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  imageUrl: string;
}

export default function DesignSelection() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDesign, setSelectedDesign] = useState<NailDesign | null>(null);

  const { data: designs = [], isLoading } = useQuery({
    queryKey: ["/api/designs", selectedCategory],
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "인증 만료",
          description: "다시 로그인해주세요...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      setLocation(`/payment?orderId=${order.id}`);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "인증 만료",
          description: "다시 로그인해주세요...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "주문 생성 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProceedToPayment = () => {
    if (!selectedDesign) {
      toast({
        title: "디자인 선택 필요",
        description: "네일아트 디자인을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId');

    const orderData = {
      designId: selectedDesign.id,
      sessionId,
      totalAmount: (parseFloat(selectedDesign.price) + 5000).toFixed(2), // Design price + AI analysis fee
    };

    createOrderMutation.mutate(orderData);
  };

  const categories = [
    { id: "all", label: "전체" },
    { id: "floral", label: "플로럴" },
    { id: "geometric", label: "기하학" },
    { id: "elegant", label: "엘레강스" },
    { id: "cute", label: "큐트" },
    { id: "artistic", label: "아티스틱" },
    { id: "seasonal", label: "시즌" }
  ];

  // Sample nail designs (in a real app, these would come from the API)
  const sampleDesigns: NailDesign[] = [
    {
      id: 1,
      name: "플로럴 엘레강스",
      description: "우아한 꽃무늬 디자인",
      category: "floral",
      price: "25000",
      imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      name: "모던 기하학",
      description: "세련된 기하학적 패턴",
      category: "geometric",
      price: "30000",
      imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      name: "로즈 골드",
      description: "고급스러운 로즈골드 컬러",
      category: "elegant",
      price: "35000",
      imageUrl: "https://images.unsplash.com/photo-1606088295734-4c70374d5b74?w=300&h=300&fit=crop"
    },
    {
      id: 4,
      name: "파스텔 큐트",
      description: "사랑스러운 파스텔 컬러",
      category: "cute",
      price: "22000",
      imageUrl: "https://images.unsplash.com/photo-1609201245058-5324a7c9f5e3?w=300&h=300&fit=crop"
    },
    {
      id: 5,
      name: "아트 갤러리",
      description: "독창적인 아티스틱 디자인",
      category: "artistic",
      price: "40000",
      imageUrl: "https://images.unsplash.com/photo-1521649415036-659258dc424f?w=300&h=300&fit=crop"
    },
    {
      id: 6,
      name: "윈터 스노우",
      description: "겨울 시즌 스페셜",
      category: "seasonal",
      price: "28000",
      imageUrl: "https://images.unsplash.com/photo-1587556930846-19c5c13a9b78?w=300&h=300&fit=crop"
    }
  ];

  const displayDesigns = designs.length > 0 ? designs : sampleDesigns;
  const filteredDesigns = selectedCategory === "all" 
    ? displayDesigns 
    : displayDesigns.filter(design => design.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div>로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">네일아트 디자인 선택</h2>
          <p className="text-gray-600">생성된 네일 모양에 적용할 아름다운 디자인을 선택하세요</p>
        </div>

        {/* Design Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-secondary hover:bg-pink-600" : ""}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Design Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {filteredDesigns.map(design => (
            <NailDesignCard
              key={design.id}
              design={design}
              isSelected={selectedDesign?.id === design.id}
              onSelect={() => setSelectedDesign(design)}
            />
          ))}
        </div>

        {/* Selected Design Preview */}
        {selectedDesign && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>선택된 디자인</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img 
                    src={selectedDesign.imageUrl} 
                    alt={selectedDesign.name}
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedDesign.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedDesign.description}</p>
                  <Badge variant="secondary" className="mb-4">
                    {categories.find(c => c.id === selectedDesign.category)?.label}
                  </Badge>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">디자인</span>
                      <span className="font-medium">{selectedDesign.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">가격</span>
                      <span className="font-medium">₩{parseInt(selectedDesign.price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI 분석 비용</span>
                      <span className="font-medium">₩5,000</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>총 금액</span>
                      <span className="text-secondary">
                        ₩{(parseInt(selectedDesign.price) + 5000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-secondary text-white hover:bg-pink-600"
                    onClick={handleProceedToPayment}
                    disabled={createOrderMutation.isPending}
                  >
                    <Palette className="mr-2 h-4 w-4" />
                    {createOrderMutation.isPending ? "주문 생성 중..." : "PayPal로 결제하기"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedDesign && (
          <div className="text-center p-8 text-gray-500">
            디자인을 선택하면 상세 정보와 결제 옵션이 표시됩니다
          </div>
        )}
      </main>
    </div>
  );
}
