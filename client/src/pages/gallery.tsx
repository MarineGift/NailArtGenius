import { useTranslation } from '@/lib/i18n';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Gallery() {
  const { t } = useTranslation();

  // 네일아트 갤러리 데이터
  const nailArtGallery = [
    {
      id: 1,
      title: "Classic French Manicure",
      description: "전통적인 프렌치 매니큐어 스타일",
      category: "classic",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
      price: "$45"
    },
    {
      id: 2,
      title: "Floral Design",
      description: "섬세한 꽃 무늬 네일아트",
      category: "floral",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=400&fit=crop",
      price: "$65"
    },
    {
      id: 3,
      title: "Geometric Patterns",
      description: "모던한 기하학적 패턴",
      category: "modern",
      image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=400&fit=crop",
      price: "$55"
    },
    {
      id: 4,
      title: "Glitter & Sparkle",
      description: "화려한 글리터 네일아트",
      category: "glamour",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop",
      price: "$70"
    },
    {
      id: 5,
      title: "Minimalist Style",
      description: "심플하고 세련된 미니멀 디자인",
      category: "minimalist",
      image: "https://images.unsplash.com/photo-1599948174842-84bf74a4b2c5?w=400&h=400&fit=crop",
      price: "$40"
    },
    {
      id: 6,
      title: "Seasonal Design",
      description: "계절감 있는 특별 디자인",
      category: "seasonal",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      price: "$60"
    },
    {
      id: 7,
      title: "Wedding Special",
      description: "결혼식을 위한 우아한 네일아트",
      category: "wedding",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
      price: "$80"
    },
    {
      id: 8,
      title: "Ombre Effect",
      description: "부드러운 그라데이션 효과",
      category: "gradient",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
      price: "$65"
    },
    {
      id: 9,
      title: "3D Art Design",
      description: "입체적인 3D 네일아트",
      category: "3d",
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop",
      price: "$90"
    }
  ];

  // 시술 과정 사진
  const treatmentProcess = [
    {
      id: 1,
      title: "네일 준비 단계",
      description: "큐티클 케어와 네일 정리",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "베이스 코팅",
      description: "건강한 네일을 위한 베이스 작업",
      image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "컬러 적용",
      description: "정밀한 컬러 적용 과정",
      image: "https://images.unsplash.com/photo-1604902396830-aca29492adc3?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "마무리 코팅",
      description: "오래가는 광택을 위한 탑 코팅",
      image: "https://images.unsplash.com/photo-1562887495-b65905f149ac?w=400&h=300&fit=crop"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      classic: "bg-blue-100 text-blue-800",
      floral: "bg-pink-100 text-pink-800",
      modern: "bg-purple-100 text-purple-800",
      glamour: "bg-yellow-100 text-yellow-800",
      minimalist: "bg-gray-100 text-gray-800",
      seasonal: "bg-green-100 text-green-800",
      wedding: "bg-rose-100 text-rose-800",
      gradient: "bg-indigo-100 text-indigo-800",
      "3d": "bg-red-100 text-red-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('gallery.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* 네일아트 갤러리 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            네일아트 디자인 갤러리
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nailArtGallery.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <span className="text-lg font-bold text-secondary">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {item.description}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                      예약하기
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      자세히
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 시술 과정 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            시술 과정
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentProcess.map((step, index) => (
              <Card key={step.id} className="overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-secondary text-white">
                      Step {index + 1}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            마음에 드는 디자인이 있으신가요?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            지금 바로 예약하고 전문적인 네일아트 서비스를 경험해보세요
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-secondary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition-colors">
              예약하기
            </button>
            <button className="bg-white text-secondary border border-secondary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-50 transition-colors">
              상담받기
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}