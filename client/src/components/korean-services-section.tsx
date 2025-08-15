import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Eye } from 'lucide-react';

export function KoreanServicesSection() {
  const services = [
    {
      id: 1,
      name: "클래식 프렌치 매니큐어",
      price: 45,
      description: "전통적인 프렌치 매니큐어 스타일",
      rating: 4.8,
      reviews: 127,
      duration: 45,
      category: "classic",
      image: "/images/french-manicure.jpg"
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
      image: "/images/floral-design.jpg"
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
      image: "/images/geometric-pattern.jpg"
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
      image: "/images/glitter-sparkle.jpg"
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
      image: "/images/minimalist-style.jpg"
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
      image: "/images/seasonal-design.jpg"
    },
    {
      id: 7,
      name: "웨딩 스페셜",
      price: 80,
      description: "결혼식을 위한 우아한 네일아트",
      rating: 4.9,
      reviews: 45,
      duration: 90,
      category: "wedding",
      image: "/images/wedding-special.jpg"
    },
    {
      id: 8,
      name: "옴브레 이펙트",
      price: 65,
      description: "부드러운 그라데이션 효과",
      rating: 4.7,
      reviews: 103,
      duration: 60,
      category: "gradient",
      image: "/images/ombre-effect.jpg"
    },
    {
      id: 9,
      name: "3D 아트 디자인",
      price: 90,
      description: "입체적인 3D 네일아트",
      rating: 4.8,
      reviews: 67,
      duration: 120,
      category: "3d",
      image: "/images/3d-art-design.jpg"
    }
  ];

  const treatmentSteps = [
    {
      step: 1,
      title: "네일 준비 단계",
      description: "큐티클 케어와 네일 정리",
      label: "Step 1"
    },
    {
      step: 2,
      title: "베이스 코팅",
      description: "건강한 네일을 위한 베이스 작업",
      label: "Step 2"
    },
    {
      step: 3,
      title: "컬러 적용",
      description: "정밀한 컬러 적용 과정",
      label: "Step 3"
    },
    {
      step: 4,
      title: "마무리 코팅",
      description: "오래가는 광택을 위한 탑 코팅",
      label: "Step 4"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-6">
        {/* Services Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  <span className="text-4xl">{service.category === 'classic' ? '💅' : 
                                               service.category === 'floral' ? '🌸' :
                                               service.category === 'modern' ? '⚡' :
                                               service.category === 'glamour' ? '✨' :
                                               service.category === 'minimalist' ? '🤍' :
                                               service.category === 'seasonal' ? '🍂' :
                                               service.category === 'wedding' ? '💍' :
                                               service.category === 'gradient' ? '🌈' : '🎨'}</span>
                </div>
                <Badge className="absolute top-2 right-2 bg-purple-600 text-white">
                  {service.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                <p className="text-2xl font-bold text-purple-600 mb-2">${service.price}</p>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{service.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({service.reviews})</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="ml-1 text-sm text-gray-600">{service.duration}분</span>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  <Eye className="w-4 h-4 mr-2" />
                  상세히 보기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Treatment Process */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">시술 과정</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {treatmentSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">{step.label}</span>
                  </div>
                </div>
                <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4">마음에 드는 디자인이 있으신가요?</h3>
          <p className="text-gray-600 mb-6">지금 바로 예약하고 전문적인 네일아트 서비스를 경험해보세요</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3">
              예약하기
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-3">
              상담받기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}