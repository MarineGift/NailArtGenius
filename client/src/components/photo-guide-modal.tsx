import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n";

// Import guide images
import thumbGuideImg from "@assets/KakaoTalk_20250721_223405822_1753151788891.jpg";
import fingersGuideImg from "@assets/KakaoTalk_20250721_223405822_01_1753151788892.jpg";
import rightThumbGuideImg from "@assets/KakaoTalk_20250721_223405822_02_1753151788892.jpg";
import rightFingersGuideImg from "@assets/KakaoTalk_20250721_223405822_03_1753151788893.jpg";
import leftThumbGuideImg from "@assets/KakaoTalk_20250721_223405822_04_1753151788893.jpg";
import leftFingersGuideImg from "@assets/KakaoTalk_20250721_223405822_05_1753151788893.jpg";

interface PhotoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const guideImages = [
  {
    id: 'thumb',
    image: thumbGuideImg,
    titleKey: 'photoGuide.thumb.title',
    descriptionKey: 'photoGuide.thumb.description'
  },
  {
    id: 'fingers',
    image: fingersGuideImg,
    titleKey: 'photoGuide.fingers.title',
    descriptionKey: 'photoGuide.fingers.description'
  },
  {
    id: 'rightThumb',
    image: rightThumbGuideImg,
    titleKey: 'photoGuide.rightThumb.title',
    descriptionKey: 'photoGuide.rightThumb.description'
  },
  {
    id: 'rightFingers',
    image: rightFingersGuideImg,
    titleKey: 'photoGuide.rightFingers.title',
    descriptionKey: 'photoGuide.rightFingers.description'
  },
  {
    id: 'leftThumb',
    image: leftThumbGuideImg,
    titleKey: 'photoGuide.leftThumb.title',
    descriptionKey: 'photoGuide.leftThumb.description'
  },
  {
    id: 'leftFingers',
    image: leftFingersGuideImg,
    titleKey: 'photoGuide.leftFingers.title',
    descriptionKey: 'photoGuide.leftFingers.description'
  }
];

export default function PhotoGuideModal({ isOpen, onClose }: PhotoGuideModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  const nextGuide = () => {
    setCurrentIndex((prev) => (prev + 1) % guideImages.length);
  };

  const prevGuide = () => {
    setCurrentIndex((prev) => (prev - 1 + guideImages.length) % guideImages.length);
  };

  const currentGuide = guideImages[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {t('photoGuide.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Navigation Indicators */}
          <div className="flex justify-center space-x-2">
            {guideImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-pink-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          {/* Guide Image */}
          <div className="relative">
            <img
              src={currentGuide.image}
              alt={t(currentGuide.titleKey)}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          {/* Guide Title */}
          <h3 className="text-lg font-semibold text-center">
            {t(currentGuide.titleKey)}
          </h3>
          
          {/* Guide Description */}
          <p className="text-sm text-gray-600 text-center">
            {t(currentGuide.descriptionKey)}
          </p>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={prevGuide}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('common.previous')}
            </Button>
            
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {guideImages.length}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextGuide}
              disabled={currentIndex === guideImages.length - 1}
            >
              {t('common.next')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {/* Close Button */}
          <Button 
            className="w-full mt-4"
            onClick={onClose}
          >
            {t('common.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}