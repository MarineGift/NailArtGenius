import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

import store1 from "@assets/store_1753218028383.jpg";
import nailart1 from "@assets/nailart1_1753154093464.jpg";
import nailart2 from "@assets/nailart2_1753154093464.jpg";
import nailart3 from "@assets/nailart3_1753154093464.jpg";

export function ImageCarousel() {
  const { t } = useTranslation();
  
  const sampleImages = [
    {
      url: store1,
      title: 'Connie\'s Nail Salon',
      description: 'Washington DC Premium Nail Salon'
    },
    {
      url: nailart1,
      title: 'Beautiful Nail Art',
      description: 'Expert careful design'
    },
    {
      url: nailart2,
      title: 'AI Custom Nails',
      description: 'Completed with innovative AI technology'
    },
    {
      url: nailart3,
      title: 'Premium Care',
      description: 'Luxury nail service experience'
    }
  ];
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
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-lg shadow-lg">
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
              <div className="text-center text-white px-4">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2">{image.title}</h3>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-8 h-8 sm:w-10 sm:h-10"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-8 h-8 sm:w-10 sm:h-10"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
        {sampleImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}