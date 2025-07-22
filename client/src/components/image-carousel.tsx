import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sampleImages = [
  {
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&h=600&fit=crop',
    title: '프리미엄 네일 케어',
    description: '최고급 네일 서비스'
  },
  {
    url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=1200&h=600&fit=crop',
    title: 'AI 맞춤 디자인',
    description: '혁신적인 네일아트'
  },
  {
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=600&fit=crop',
    title: '편안한 스파 환경',
    description: '힐링 공간에서의 특별한 경험'
  },
  {
    url: 'https://images.unsplash.com/photo-1562887284-5233374ea3a2?w=1200&h=600&fit=crop',
    title: '정밀한 네일 케어',
    description: '전문가의 세심한 손길'
  }
];

export function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === sampleImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? sampleImages.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === sampleImages.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-lg">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sampleImages.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            <img 
              src={image.url} 
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl md:text-4xl font-bold mb-2">{image.title}</h3>
                <p className="text-lg md:text-xl opacity-90">{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sampleImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}