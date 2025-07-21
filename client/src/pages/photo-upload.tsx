import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/header";
import PhotoUploadZone from "@/components/photo-upload-zone";
import { Camera, AlertTriangle } from "lucide-react";
import { nanoid } from "nanoid";

interface UploadedPhoto {
  file: File;
  photoType: string;
  fingerType: string;
  preview: string;
}

export default function PhotoUpload() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [sessionId] = useState(() => nanoid());

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/photos/upload", formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "업로드 완료",
        description: "사진이 성공적으로 업로드되었습니다.",
      });
      setLocation(`/processing?sessionId=${data.sessionId}`);
    },
    onError: (error) => {
      toast({
        title: "업로드 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePhotoUpload = (file: File, photoType: string, fingerType: string) => {
    const preview = URL.createObjectURL(file);
    const newPhoto: UploadedPhoto = {
      file,
      photoType,
      fingerType,
      preview
    };

    setUploadedPhotos(prev => {
      const filtered = prev.filter(p => !(p.photoType === photoType && p.fingerType === fingerType));
      return [...filtered, newPhoto];
    });
  };

  const handleProcessPhotos = () => {
    if (uploadedPhotos.length < 6) {
      toast({
        title: "업로드 미완료",
        description: "6장의 사진을 모두 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    const photoTypes: string[] = [];
    const fingerTypes: string[] = [];

    uploadedPhotos.forEach(photo => {
      formData.append('photos', photo.file);
      photoTypes.push(photo.photoType);
      fingerTypes.push(photo.fingerType);
    });

    formData.append('photoTypes', JSON.stringify(photoTypes));
    formData.append('fingerTypes', JSON.stringify(fingerTypes));
    formData.append('sessionId', sessionId);

    uploadMutation.mutate(formData);
  };

  const progressPercentage = Math.round((uploadedPhotos.length / 6) * 100);

  const fingerPositions = [
    { type: 'thumb', label: '엄지 손가락' },
    { type: 'index', label: '검지 손가락' },
    { type: 'middle', label: '중지 손가락' },
    { type: 'ring', label: '약지 손가락' }
  ];

  const curvatureAngles = [
    { type: 'left_side', label: '왼쪽 측면 굴곡' },
    { type: 'right_side', label: '오른쪽 측면 굴곡' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">손가락 사진 촬영</h2>
          <p className="text-gray-600">신용카드에 손가락을 올려놓고 총 6장의 사진을 촬영해주세요</p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 flex items-center justify-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              정확한 AI 분석을 위해 신용카드 위에 손가락을 올려놓고 촬영해주세요
            </p>
          </div>
        </div>

        {/* Credit Card Reference */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">신용카드 기준 촬영법</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
                <div className="w-64 h-40 flex items-center justify-center border-2 border-dashed border-white/50 rounded">
                  <div className="text-center">
                    <div className="text-3xl mb-2 opacity-75">✋</div>
                    <p className="text-sm">손가락을 여기에 올려주세요</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Zones */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Finger Position Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="mr-2 h-5 w-5 text-secondary" />
                손가락 위치 사진 (4장)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {fingerPositions.map(finger => (
                  <PhotoUploadZone
                    key={finger.type}
                    label={finger.label}
                    onUpload={(file) => handlePhotoUpload(file, 'finger_position', finger.type)}
                    isUploaded={uploadedPhotos.some(p => p.photoType === 'finger_position' && p.fingerType === finger.type)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Finger Curvature Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="mr-2 h-5 w-5 text-secondary">🔄</div>
                손가락 굴곡 사진 (2장)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {curvatureAngles.map(angle => (
                  <PhotoUploadZone
                    key={angle.type}
                    label={angle.label}
                    onUpload={(file) => handlePhotoUpload(file, 'finger_curvature', angle.type)}
                    isUploaded={uploadedPhotos.some(p => p.photoType === 'finger_curvature' && p.fingerType === angle.type)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">업로드 진행상황</h3>
              <span className="text-sm text-gray-600">{uploadedPhotos.length}/6 완료</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            size="lg"
            onClick={handleProcessPhotos}
            disabled={uploadedPhotos.length < 6 || uploadMutation.isPending}
            className="bg-secondary text-white px-8 py-3 font-semibold hover:bg-pink-600 disabled:opacity-50"
          >
            {uploadMutation.isPending ? "업로드 중..." : "AI 분석 시작하기"}
            <span className="ml-2">→</span>
          </Button>
        </div>
      </main>
    </div>
  );
}
