import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useLocation } from "wouter";
import Header from "@/components/header";

interface PhotoSlot {
  id: string;
  title: string;
  description: string;
  icon: string;
  file?: File;
}

export default function PhotoUpload() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  
  const [photoSlots, setPhotoSlots] = useState<PhotoSlot[]>([
    { id: 'left-hand', title: '왼손 네손톱', description: '왼손 네손톱 전체', icon: '🤚' },
    { id: 'left-thumb', title: '왼손 엄지', description: '왼손 엄지 단독', icon: '👍' },
    { id: 'right-hand', title: '오른손 네손톱', description: '오른손 네손톱 전체', icon: '✋' },
    { id: 'right-thumb', title: '오른손 엄지', description: '오른손 엄지 단독', icon: '👍' },
    { id: 'nail-curve', title: '네손톱 곡률', description: '손톱의 곡률 측정', icon: '📐' },
    { id: 'nail-width', title: '엄지 곡률', description: '엄지 손톱 곡률', icon: '📏' },
  ]);

  const handlePhotoClick = (slotId: string) => {
    setActiveSlot(slotId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeSlot) {
      setPhotoSlots(prev => prev.map(slot => 
        slot.id === activeSlot ? { ...slot, file } : slot
      ));
      setActiveSlot(null);
    }
  };

  const completedPhotos = photoSlots.filter(slot => slot.file).length;
  const isComplete = completedPhotos === 6;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">손톱 촬영</h1>
            <p className="text-gray-600">정확한 네일 분석을 위해 6장의 사진을 촬영해주세요</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>진행상황</span>
            <span>{completedPhotos}/6</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedPhotos / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-700 font-medium">
              ⚠️ 아래 촬영 예시를 꼭 확인해 주세요.
            </p>
          </CardContent>
        </Card>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {photoSlots.map((slot) => (
            <Card 
              key={slot.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                slot.file ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
              onClick={() => handlePhotoClick(slot.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{slot.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{slot.title}</h3>
                      <p className="text-sm text-gray-600">{slot.description}</p>
                    </div>
                  </div>
                  {slot.file && (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      완료
                    </Badge>
                  )}
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
                  {slot.file ? (
                    <img
                      src={URL.createObjectURL(slot.file)}
                      alt={slot.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">탭하여 사진 추가</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <Button 
            disabled={!isComplete}
            className="bg-pink-600 hover:bg-pink-700"
            onClick={() => setLocation("/processing")}
          >
            다음 단계
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}