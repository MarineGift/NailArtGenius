import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Camera, Check, Info, HelpCircle, Upload, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";
import Header from "@/components/header";
import PhotoGuideModal from "@/components/photo-guide-modal";

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
  const [showGuideModal, setShowGuideModal] = useState(false);
  
  const [photoSlots, setPhotoSlots] = useState<PhotoSlot[]>([
    { id: 'thumb', title: '엄지손가락', description: '신용카드 위에 엄지 올리고 촬영', icon: '👍' },
    { id: 'index', title: '검지손가락', description: '신용카드 위에 검지 올리고 촬영', icon: '☝️' },
    { id: 'middle', title: '중지손가락', description: '신용카드 위에 중지 올리고 촬영', icon: '🖕' },
    { id: 'ring', title: '약지손가락', description: '신용카드 위에 약지 올리고 촬영', icon: '💍' },
    { id: 'left-curve', title: '왼쪽 곡률', description: '왼쪽에서 손톱 곡률 촬영', icon: '📐' },
    { id: 'right-curve', title: '오른쪽 곡률', description: '오른쪽에서 손톱 곡률 촬영', icon: '📏' },
  ]);

  const [sessionId] = useState(() => nanoid());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handlePhotoClick = (slotId: string) => {
    setActiveSlot(slotId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeSlot) {
      try {
        setIsUploading(true);
        
        // Upload photo to server
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('sessionId', sessionId);
        formData.append('fingerType', activeSlot);
        formData.append('photoType', activeSlot.includes('curve') ? 'curvature' : 'finger_with_card');
        
        const response = await fetch('/api/photos/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('사진 업로드에 실패했습니다.');
        }
        
        const result = await response.json();
        
        // Update photo slots
        setPhotoSlots(prev => prev.map(slot => 
          slot.id === activeSlot ? { ...slot, file } : slot
        ));
        
        toast({
          title: "사진 업로드 완료",
          description: `${photoSlots.find(s => s.id === activeSlot)?.title} 사진이 업로드되었습니다.`,
        });
        
        setActiveSlot(null);
        setUploadProgress(prev => prev + 1);
        
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "업로드 실패",
          description: "사진 업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const completedPhotos = photoSlots.filter(slot => slot.file).length;
  const isComplete = completedPhotos === 6;

  const handleStartAnalysis = async () => {
    try {
      setIsUploading(true);
      
      // Start AI analysis and nail art generation
      const response = await fetch('/api/photos/analyze-and-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      
      if (!response.ok) {
        throw new Error('AI 분석에 실패했습니다.');
      }
      
      const result = await response.json();
      
      toast({
        title: "AI 분석 완료!",
        description: `${result.totalImages}개의 맞춤형 네일아트가 생성되었습니다.`,
      });
      
      // Redirect to results page
      setLocation(`/pdf-preview?session=${sessionId}`);
      
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "분석 실패",
        description: error.message || "AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTestWithExistingPhotos = async () => {
    try {
      setIsUploading(true);
      
      toast({
        title: "테스트 시작",
        description: "기존 테스트 이미지로 AI 분석을 시작합니다...",
      });
      
      // Use a demo session ID
      const demoSessionId = `demo_${Date.now()}`;
      
      // Simulate 6 photos being uploaded by marking all slots as complete
      setPhotoSlots(prev => prev.map(slot => ({ ...slot, file: new File([''], 'demo.jpg') })));
      
      // Wait a bit to show the UI update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Start AI analysis with demo data
      const response = await fetch('/api/photos/analyze-and-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: demoSessionId }),
      });
      
      if (!response.ok) {
        throw new Error('AI 분석에 실패했습니다.');
      }
      
      const result = await response.json();
      
      toast({
        title: "테스트 완료!",
        description: `${result.totalImages}개의 데모 네일아트가 생성되었습니다.`,
      });
      
      // Redirect to results page
      setLocation(`/pdf-preview?session=${demoSessionId}`);
      
    } catch (error: any) {
      console.error('Test error:', error);
      toast({
        title: "테스트 실패",
        description: error.message || "테스트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-4" onClick={() => setLocation("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">손톱 촬영</h1>
              <p className="text-gray-600">정확한 네일 분석을 위해 6장의 사진을 촬영해주세요</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowGuideModal(true)}>
            <HelpCircle className="h-4 w-4 mr-2" />
            촬영 가이드
          </Button>
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
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-blue-700 font-medium">
                💡 AI 네일아트 생성 시스템 테스트하기
              </p>
              <Button
                onClick={handleTestWithExistingPhotos}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                기존 사진으로 테스트
              </Button>
            </div>
            <p className="text-blue-600 text-sm mt-2">
              실제 손톱 사진이 없으시면 기존 테스트 이미지로 전체 시스템을 체험해보세요.
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
            disabled={!isComplete || isUploading}
            className="bg-pink-600 hover:bg-pink-700"
            onClick={handleStartAnalysis}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                업로드 중...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                AI 분석 시작
              </>
            )}
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

      {/* Photo Guide Modal */}
      <PhotoGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
}