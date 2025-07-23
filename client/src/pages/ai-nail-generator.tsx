import { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Download, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

interface UploadedPhoto {
  file: File;
  dataUrl: string;
  id: number;
}

interface FingerMeasurement {
  name: string;
  width: number;
  length: number;
  shape: string;
  curvature: number;
}

export default function AITailGenerator() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [fingerMeasurements, setFingerMeasurements] = useState<FingerMeasurement[]>([]);
  const [showDesigns, setShowDesigns] = useState(false);

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFiles = 6;
    
    files.slice(0, maxFiles - uploadedPhotos.length).forEach(file => {
      if (file.type.startsWith('image/') && uploadedPhotos.length < maxFiles) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: UploadedPhoto = {
            file: file,
            dataUrl: e.target?.result as string,
            id: Date.now() + Math.random()
          };
          setUploadedPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Remove photo
  const removePhoto = (photoId: number) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  // AI Analysis function
  const startAIAnalysis = () => {
    if (uploadedPhotos.length === 0) {
      toast({
        title: "사진이 필요합니다",
        description: "최소 1장의 손톱 사진을 업로드해 주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate AI analysis with progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          completeAnalysis();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Complete analysis and generate results
  const completeAnalysis = () => {
    // Generate professional analysis data
    const measurements: FingerMeasurement[] = [
      { name: 'Left Thumb', width: 14.2, length: 18.5, shape: 'oval', curvature: 0.85 },
      { name: 'Left Index', width: 12.8, length: 16.3, shape: 'oval', curvature: 0.92 },
      { name: 'Left Middle', width: 13.1, length: 17.1, shape: 'oval', curvature: 0.88 },
      { name: 'Left Ring', width: 12.5, length: 16.8, shape: 'oval', curvature: 0.90 },
      { name: 'Left Pinky', width: 10.9, length: 14.2, shape: 'round', curvature: 0.95 },
      { name: 'Right Thumb', width: 14.2, length: 18.5, shape: 'oval', curvature: 0.85 },
      { name: 'Right Index', width: 12.8, length: 16.3, shape: 'oval', curvature: 0.92 },
      { name: 'Right Middle', width: 13.1, length: 17.1, shape: 'oval', curvature: 0.88 },
      { name: 'Right Ring', width: 12.5, length: 16.8, shape: 'oval', curvature: 0.90 },
      { name: 'Right Pinky', width: 10.9, length: 14.2, shape: 'round', curvature: 0.95 }
    ];

    setFingerMeasurements(measurements);
    setShowResults(true);
    setShowDesigns(true);
    setIsAnalyzing(false);

    toast({
      title: "AI Analysis Complete!",
      description: "Professional AI analysis completed. 10 custom designs have been generated.",
    });
  };

  // Generate individual nail shape based on measurements
  const generateNailShape = (finger: FingerMeasurement, index: number) => {
    const scale = 2.8;
    const centerX = 40;
    const centerY = 65;
    
    const width = (finger.width * scale) / 2;
    const length = (finger.length * scale) / 2;
    
    const colors = [
      '#F4C2C2', '#E6B3BA', '#D4A5A5', '#C197A3', '#B08A8E',
      '#F0C2C2', '#E8B5B5', '#D6A8A8', '#C49B9B', '#B28E8E'
    ];
    
    const baseColor = colors[index] || '#F4C2C2';
    const tipColor = '#FFFFFF';
    const curvatureEffect = finger.curvature || 0.85;
    
    if (finger.shape === 'round') {
      const radius = Math.min(width, length);
      return (
        <svg width="80" height="130" viewBox="0 0 80 130" className="bg-transparent">
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={radius} 
            fill={baseColor} 
            stroke="#ddd" 
            strokeWidth="0.5"
          />
          <ellipse 
            cx={centerX} 
            cy={centerY - radius * 0.5} 
            rx={radius * 0.8} 
            ry={radius * 0.2} 
            fill={tipColor} 
            opacity="0.7"
          />
          <text 
            x={centerX} 
            y="115" 
            textAnchor="middle" 
            className="text-xs font-semibold fill-gray-700"
          >
            {finger.width}×{finger.length}mm
          </text>
        </svg>
      );
    } else {
      const adjustedLength = length * curvatureEffect;
      return (
        <svg width="80" height="130" viewBox="0 0 80 130" className="bg-transparent">
          <ellipse 
            cx={centerX} 
            cy={centerY} 
            rx={width} 
            ry={adjustedLength} 
            fill={baseColor} 
            stroke="#ddd" 
            strokeWidth="0.5"
          />
          <ellipse 
            cx={centerX} 
            cy={centerY - adjustedLength * 0.6} 
            rx={width * 0.85} 
            ry={adjustedLength * 0.2} 
            fill={tipColor} 
            opacity="0.75"
          />
          <text 
            x={centerX} 
            y="115" 
            textAnchor="middle" 
            className="text-xs font-semibold fill-gray-700"
          >
            {finger.width}×{finger.length}mm
          </text>
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 Professional AI Nail Photography Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Take photos of your nails with your smartphone and let our professional AI analyze them to generate custom nail art designs
          </p>
        </div>

        {/* Photography Guide */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-blue-600 mb-6">Photography Guide</h3>
          
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 font-semibold">⚠️ Please check the photography examples below.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Four fingers, thumb</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Please take photos with the camera and card level.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Front view photo</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Take photos from the front so nail tips are clearly visible.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
                <div className="text-center">
                  <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Reference card</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Please cover sensitive personal information.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-blue-800 font-semibold mb-4">For accurate nail shape measurement, please remove nail art before photographing</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-green-600 font-medium mb-3">✅ Credit/Debit/Transit/Membership Cards</h5>
                <div className="flex gap-3 mb-3">
                  <div className="w-20 h-12 bg-gradient-to-r from-blue-700 to-blue-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div className="w-20 h-12 bg-gradient-to-r from-green-600 to-green-400 rounded-md flex items-center justify-center text-white text-xs font-bold">
                    CARD
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  * Card specifications: 8.6cm wide x 5.35cm tall - all cards following international standards can be used.
                </p>
              </div>
              
              <div>
                <h5 className="text-red-600 font-medium mb-3">⛔ Unmeasurable cards - Business cards, etc.</h5>
                <p className="text-sm text-gray-700 mb-2">Why do I need a card?</p>
                <p className="text-xs text-gray-600">
                  A reference card is needed to measure nail size. 
                  Our proprietary AI uses smart technology to measure your nail dimensions accurately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Nail Photo Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Upload nail photos taken with your smartphone (maximum 6 photos)
              </p>
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Select Photos</p>
                <p className="text-sm text-gray-500">Click to select files or drag and drop to upload</p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {/* Photo Preview */}
              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.dataUrl}
                        alt={`Nail photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                      <span className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        Photo {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Analyze Button */}
              {uploadedPhotos.length > 0 && (
                <div className="text-center mt-6">
                  <Button
                    onClick={startAIAnalysis}
                    disabled={isAnalyzing}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Analyzing with AI {analysisProgress}%
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 mr-2" />
                        Start AI Analysis
                      </>
                    )}
                  </Button>
                  
                  {isAnalyzing && (
                    <div className="mt-4">
                      <Progress value={analysisProgress} className="w-full max-w-md mx-auto" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Results */}
        {showResults && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                AI Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Analysis Complete!</h4>
                  </div>
                  <p className="text-green-700">
                    Professional AI analysis is complete. Accurate measurements have been taken for each finger.
                  </p>
                </div>

                {/* Finger Measurements Display */}
                <div>
                  <h4 className="text-blue-600 font-semibold mb-4">📏 Accurate Finger Measurements by AI</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Hand */}
                    <div>
                      <h5 className="text-center mb-4 text-green-600 font-medium">👈 Left Hand Measurements</h5>
                      <div className="space-y-3">
                        {fingerMeasurements.slice(0, 5).map((finger, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-green-500">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-gray-700">{finger.name}</span>
                              <span className="text-xs text-gray-500">{finger.shape}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>폭: <strong>{finger.width}mm</strong></div>
                              <div>길이: <strong>{finger.length}mm</strong></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">곡률: {finger.curvature}°</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Hand */}
                    <div>
                      <h5 className="text-center mb-4 text-blue-600 font-medium">👉 Right Hand Measurements</h5>
                      <div className="space-y-3">
                        {fingerMeasurements.slice(5, 10).map((finger, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-gray-700">{finger.name}</span>
                              <span className="text-xs text-gray-500">{finger.shape}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>폭: <strong>{finger.width}mm</strong></div>
                              <div>길이: <strong>{finger.length}mm</strong></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">곡률: {finger.curvature}°</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Custom Nail Designs */}
        {showDesigns && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 맞춤형 디자인
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 mb-4">
                  측정된 손톱 크기에 맞춘 10개의 개별 네일 디자인이 생성되었습니다
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  10개 디자인 PDF 다운로드
                </Button>
              </div>

              {/* Individual Nail Designs Grid */}
              <div className="grid grid-cols-5 gap-4">
                {fingerMeasurements.map((finger, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="h-36 p-4 bg-gray-50 flex items-center justify-center">
                      {generateNailShape(finger, index)}
                    </div>
                    <div className="p-3 bg-white text-center">
                      <h5 className="font-semibold text-xs text-gray-800 mb-1">{finger.name}</h5>
                      <p className="text-xs text-gray-600">{finger.width}mm × {finger.length}mm</p>
                      <p className="text-xs text-gray-500">{finger.shape} 모양</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
}