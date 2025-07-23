import { useState, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  Upload, 
  Zap, 
  Download, 
  Star, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  CreditCard,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Info,
  Target,
  Ruler,
  Eye,
  Fingerprint
} from "lucide-react";

interface NailPhoto {
  id: string;
  file: File | null;
  fingerType: string;
  preview: string | null;
  analyzed: boolean;
}

interface AnalysisResult {
  fingerId: string;
  nailLength: number;
  nailWidth: number;
  nailArea: number;
  shape: string;
  confidence: number;
}

export default function AINailMeasurement() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<NailPhoto[]>([
    { id: "1", file: null, fingerType: "Left Thumb", preview: null, analyzed: false },
    { id: "2", file: null, fingerType: "Left Index", preview: null, analyzed: false },
    { id: "3", file: null, fingerType: "Left Middle", preview: null, analyzed: false },
    { id: "4", file: null, fingerType: "Right Thumb", preview: null, analyzed: false },
    { id: "5", file: null, fingerType: "Right Index", preview: null, analyzed: false },
    { id: "6", file: null, fingerType: "Right Middle", preview: null, analyzed: false }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handlePhotoUpload = (photoId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotos(prev => prev.map(photo => 
        photo.id === photoId 
          ? { ...photo, file, preview: e.target?.result as string, analyzed: false }
          : photo
      ));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, file: null, preview: null, analyzed: false }
        : photo
    ));
  };

  const analyzeNails = async () => {
    const uploadedPhotos = photos.filter(p => p.file);
    if (uploadedPhotos.length === 0) {
      toast({
        title: "No photos uploaded",
        description: "Please upload at least one nail photo to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisStep(0);

    try {
      const results: AnalysisResult[] = [];
      
      for (let i = 0; i < uploadedPhotos.length; i++) {
        const photo = uploadedPhotos[i];
        setAnalysisStep(i + 1);
        setProgress(((i + 1) / uploadedPhotos.length) * 100);

        // Create FormData for the API request
        const formData = new FormData();
        formData.append('image', photo.file!);
        formData.append('fingerType', photo.fingerType);

        // Call the nail measurement API
        const response = await fetch('/api/analyze-nail-measurement', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Analysis failed for ${photo.fingerType}`);
        }

        const result = await response.json();
        results.push({
          fingerId: photo.id,
          nailLength: result.nailLength,
          nailWidth: result.nailWidth,
          nailArea: result.nailArea,
          shape: result.shape,
          confidence: result.confidence
        });

        // Mark photo as analyzed
        setPhotos(prev => prev.map(p => 
          p.id === photo.id ? { ...p, analyzed: true } : p
        ));

        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setAnalysisResults(results);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${results.length} nail photos`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed", 
        description: "Unable to analyze nail measurements. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
      setAnalysisStep(0);
    }
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(analysisResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nail-measurements.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const allPhotosUploaded = photos.every(p => p.file);
  const hasUploadedPhotos = photos.some(p => p.file);
  const hasAnalysisResults = analysisResults.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Nail Measurement Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upload 6 photos of your nails with a credit card for scale reference. 
            Our AI will precisely measure nail dimensions and recommend perfect custom designs.
          </p>
          <Badge variant="secondary" className="mt-4">
            <Star className="w-4 h-4 mr-1" />
            Precision Analysis with OpenAI
          </Badge>
        </div>

        {/* How It Works Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              How the 6-Photo System Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Photo Capture</h3>
                <p className="text-sm text-gray-600">
                  Take photos of 6 different nails with a credit card placed for scale reference
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">2. AI Analysis</h3>
                <p className="text-sm text-gray-600">
                  OpenAI analyzes each photo to measure nail dimensions with millimeter precision
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Custom Recommendations</h3>
                <p className="text-sm text-gray-600">
                  Get personalized nail design recommendations based on your exact measurements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Nail Photos ({photos.filter(p => p.file).length}/6)
              </span>
              {hasUploadedPhotos && (
                <Badge variant={allPhotosUploaded ? "default" : "secondary"}>
                  {allPhotosUploaded ? "Complete" : "In Progress"}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {photos.map((photo) => (
                <div key={photo.id} className="space-y-3">
                  <Label className="text-sm font-medium">{photo.fingerType}</Label>
                  <div className="relative">
                    {photo.preview ? (
                      <div className="relative group">
                        <img
                          src={photo.preview}
                          alt={`${photo.fingerType} nail`}
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => removePhoto(photo.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            Remove
                          </Button>
                        </div>
                        {photo.analyzed && (
                          <Badge className="absolute top-2 right-2 bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Analyzed
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div
                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
                        onClick={() => fileInputRefs.current[photo.id]?.click()}
                      >
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 text-center">
                          Click to upload<br />{photo.fingerType}
                        </p>
                      </div>
                    )}
                    <Input
                      ref={(el) => { fileInputRefs.current[photo.id] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(photo.id, e)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Important: Credit Card Required</h4>
                  <p className="text-sm text-yellow-700">
                    Place a standard credit card (85.60mm × 53.98mm) next to your nail in each photo for accurate scale measurement.
                    This ensures our AI can calculate precise nail dimensions.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={analyzeNails}
              disabled={!hasUploadedPhotos || isAnalyzing}
              className="w-full h-12 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Photo {analysisStep} of {photos.filter(p => p.file).length}...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze Nail Measurements
                </>
              )}
            </Button>

            {isAnalyzing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Analysis Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {hasAnalysisResults && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Ruler className="w-5 h-5" />
                  Analysis Results
                </span>
                <Button onClick={downloadResults} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Results
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {analysisResults.map((result, index) => {
                  const photo = photos.find(p => p.id === result.fingerId);
                  return (
                    <div key={result.fingerId} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{photo?.fingerType}</h4>
                        <Badge variant="outline">
                          {Math.round(result.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Nail Length:</span>
                          <span className="font-medium">{result.nailLength.toFixed(2)}mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nail Width:</span>
                          <span className="font-medium">{result.nailWidth.toFixed(2)}mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nail Area:</span>
                          <span className="font-medium">{result.nailArea.toFixed(2)}mm²</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shape:</span>
                          <span className="font-medium capitalize">{result.shape}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-6" />

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Ready for Custom Design?</h3>
                <p className="text-gray-600 mb-6">
                  Based on your nail measurements, we can create perfectly fitted custom nail designs.
                </p>
                <div className="flex justify-center gap-4">
                  <Button className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    View Design Recommendations
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Book Appointment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Fingerprint className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Precision Measurement</h3>
                <p className="text-sm text-gray-600">
                  AI-powered analysis with millimeter accuracy using credit card scale reference
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Custom Recommendations</h3>
                <p className="text-sm text-gray-600">
                  Personalized design suggestions based on your unique nail dimensions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Professional Results</h3>
                <p className="text-sm text-gray-600">
                  Get salon-quality measurements for perfect-fitting nail designs
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}