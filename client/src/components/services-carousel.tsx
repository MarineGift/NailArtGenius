import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import storeImage from '@assets/store_1753218028383.jpg';

export function ServicesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: storeImage,
      title: "Connie's Nail 매장 전경",
      description: "깔끔하고 모던한 인테리어의 프리미엄 네일 살롱"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1562887495-b65905f149ac?w=800&h=600&fit=crop",
      title: "전문 네일 시술",
      description: "숙련된 전문가의 정밀하고 세심한 네일케어"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1599948174842-84bf74a4b2c5?w=800&h=600&fit=crop",
      title: "프리미엄 매니큐어",
      description: "최고급 제품을 사용한 완벽한 매니큐어 서비스"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&h=600&fit=crop",
      title: "네일케어 과정",
      description: "체계적이고 전문적인 네일케어 프로세스"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1604902396830-aca29492adc3?w=800&h=600&fit=crop",
      title: "젤 네일 시술",
      description: "오래 지속되는 아름다운 젤 네일 서비스"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=600&fit=crop",
      title: "아티스틱 디자인",
      description: "창의적이고 독창적인 네일아트 디자인"
    }
  ];

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-2xl shadow-xl mb-8">
      {/* 슬라이드 컨테이너 */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                <p className="text-lg opacity-90">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 이전/다음 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}