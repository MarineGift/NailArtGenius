import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { 
  Download, 
  Eye, 
  FileText, 
  Grid,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Share2,
  PrinterIcon
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface NailArtResult {
  generatedImages: string[];
  descriptions: string[];
  designSpecs: any[];
  pdfUrl: string;
  sessionId: string;
  totalImages: number;
  demoMode?: boolean;
}

export default function PDFPreview() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');

  // Get session ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session');

  // Use demo data for PDF preview since we have demo mode
  const demoNailArtData = {
    generatedImages: [
      'data:image/svg+xml;base64,' + btoa(`<svg width="100" height="120" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="60" rx="45" ry="55" fill="#FFE4E6" stroke="#F472B6" stroke-width="2"/><text x="50" y="110" text-anchor="middle" font-size="8" fill="#9333EA">Left Thumb</text></svg>`),
      'data:image/svg+xml;base64,' + btoa(`<svg width="90" height="140" xmlns="http://www.w3.org/2000/svg"><ellipse cx="45" cy="70" rx="40" ry="65" fill="#E0F2FE" stroke="#0EA5E9" stroke-width="2"/><text x="45" y="130" text-anchor="middle" font-size="8" fill="#0284C7">Left Index</text></svg>`),
      'data:image/svg+xml;base64,' + btoa(`<svg width="95" height="150" xmlns="http://www.w3.org/2000/svg"><ellipse cx="47" cy="75" rx="42" ry="70" fill="#F3E8FF" stroke="#9333EA" stroke-width="2"/><text x="47" y="140" text-anchor="middle" font-size="8" fill="#7C3AED">Left Middle</text></svg>`),
      'data:image/svg+xml;base64,' + btoa(`<svg width="90" height="140" xmlns="http://www.w3.org/2000/svg"><ellipse cx="45" cy="70" rx="40" ry="65" fill="#ECFDF5" stroke="#22C55E" stroke-width="2"/><text x="45" y="130" text-anchor="middle" font-size="8" fill="#15803D">Left Ring</text></svg>`),
      'data:image/svg+xml;base64=' + btoa(`<svg width="75" height="110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="37" cy="55" rx="32" ry="50" fill="#FFF7ED" stroke="#EA580C" stroke-width="2"/><text x="37" y="100" text-anchor="middle" font-size="8" fill="#C2410C">Left Pinky</text></svg>`),
      'data:image/svg+xml;base64=' + btoa(`<svg width="100" height="120" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="60" rx="45" ry="55" fill="#F0F9FF" stroke="#0284C7" stroke-width="2"/><text x="50" y="110" text-anchor="middle" font-size="8" fill="#0369A1">Right Thumb</text></svg>`),
      'data:image/svg+xml;base64=' + btoa(`<svg width="90" height="140" xmlns="http://www.w3.org/2000/svg"><ellipse cx="45" cy="70" rx="40" ry="65" fill="#FFFBEB" stroke="#D97706" stroke-width="2"/><text x="45" y="130" text-anchor="middle" font-size="8" fill="#B45309">Right Index</text></svg>`),
      'data:image/svg+xml;base64=' + btoa(`<svg width="95" height="150" xmlns="http://www.w3.org/2000/svg"><ellipse cx="47" cy="75" rx="42" ry="70" fill="#FDF2F8" stroke="#EC4899" stroke-width="2"/><text x="47" y="140" text-anchor="middle" font-size="8" fill="#BE185D">Right Middle</text></svg>`),
      'data:image/svg+xml;base64=' + btoa(`<svg width="90" height="140" xmlns="http://www.w3.org/2000/svg"><ellipse cx="45" cy="70" rx="40" ry="65" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="2"/><text x="45" y="130" text-anchor="middle" font-size="8" fill="#6D28D9">Right Ring</text></svg>`),
      'data:image/svg+xml;base64=' + btoa(`<svg width="75" height="110" xmlns="http://www.w3.org/2000/svg"><ellipse cx="37" cy="55" rx="32" ry="50" fill="#FAFAF9" stroke="#78716C" stroke-width="2"/><text x="37" y="100" text-anchor="middle" font-size="8" fill="#57534E">Right Pinky</text></svg>`)
    ],
    descriptions: [
      '왼손 엄지용 네일아트 (14.2mm × 12.1mm)',
      '왼손 검지용 네일아트 (12.1mm × 15.3mm)', 
      '왼손 중지용 네일아트 (13.2mm × 17.1mm)',
      '왼손 약지용 네일아트 (12.0mm × 15.2mm)',
      '왼손 새끼용 네일아트 (9.1mm × 12.3mm)',
      '오른손 엄지용 네일아트 (14.0mm × 12.0mm)',
      '오른손 검지용 네일아트 (12.2mm × 15.1mm)',
      '오른손 중지용 네일아트 (13.1mm × 17.0mm)',
      '오른손 약지용 네일아트 (12.1mm × 15.0mm)',
      '오른손 새끼용 네일아트 (9.0mm × 12.1mm)'
    ],
    designSpecs: [
      { fingerType: 'left_thumb', estimatedSize: '14.2mm × 12.1mm', designComplexity: 'medium' },
      { fingerType: 'left_index', estimatedSize: '12.1mm × 15.3mm', designComplexity: 'medium' },
      { fingerType: 'left_middle', estimatedSize: '13.2mm × 17.1mm', designComplexity: 'medium' },
      { fingerType: 'left_ring', estimatedSize: '12.0mm × 15.2mm', designComplexity: 'medium' },
      { fingerType: 'left_pinky', estimatedSize: '9.1mm × 12.3mm', designComplexity: 'simple' },
      { fingerType: 'right_thumb', estimatedSize: '14.0mm × 12.0mm', designComplexity: 'medium' },
      { fingerType: 'right_index', estimatedSize: '12.2mm × 15.1mm', designComplexity: 'medium' },
      { fingerType: 'right_middle', estimatedSize: '13.1mm × 17.0mm', designComplexity: 'medium' },
      { fingerType: 'right_ring', estimatedSize: '12.1mm × 15.0mm', designComplexity: 'medium' },
      { fingerType: 'right_pinky', estimatedSize: '9.0mm × 12.1mm', designComplexity: 'simple' }
    ],
    pdfUrl: '',
    sessionId: sessionId || 'demo-session',
    totalImages: 10,
    demoMode: true
  };

  const nailArtData = demoNailArtData;
  const isLoading = false;
  const error = null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <Eye className="h-4 w-4" />
          <AlertDescription>
            PDF 미리보기를 위해 로그인이 필요합니다.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>PDF 데이터를 로딩 중입니다...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !nailArtData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              PDF 데이터를 불러올 수 없습니다. 먼저 네일아트를 생성해주세요.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button asChild>
              <Link href="/photo-measurement">
                네일아트 생성하러 가기
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fingerNames = [
    { ko: '왼손 엄지', en: 'Left Thumb' },
    { ko: '왼손 검지', en: 'Left Index' },
    { ko: '왼손 중지', en: 'Left Middle' },
    { ko: '왼손 약지', en: 'Left Ring' },
    { ko: '왼손 새끼', en: 'Left Pinky' },
    { ko: '오른손 엄지', en: 'Right Thumb' },
    { ko: '오른손 검지', en: 'Right Index' },
    { ko: '오른손 중지', en: 'Right Middle' },
    { ko: '오른손 약지', en: 'Right Ring' },
    { ko: '오른손 새끼', en: 'Right Pinky' }
  ];

  const handleDownloadPDF = () => {
    if (nailArtData.pdfUrl) {
      window.open(nailArtData.pdfUrl, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '네일아트 디자인 미리보기',
          text: '10개 손가락 맞춤형 네일아트 디자인을 확인해보세요!',
          url: window.location.href
        });
      } catch (error) {
        console.log('공유가 취소되었습니다.');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📄 네일아트 PDF 미리보기
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            생성된 10개 손가락 네일아트 디자인을 미리보고 다운로드하세요
          </p>
          
          {nailArtData.demoMode && (
            <Alert className="border-orange-200 bg-orange-50 mb-6">
              <Eye className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>데모 모드:</strong> 시뮬레이션된 네일아트 결과입니다. 실제 OpenAI API가 복구되면 더욱 정확한 결과를 얻을 수 있습니다.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                미리보기 컨트롤
              </span>
              <Badge variant="outline">
                {nailArtData.totalImages || 10}개 이미지
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* View Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4 mr-1" />
                  격자
                </Button>
                <Button
                  variant={viewMode === 'single' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('single')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  단일
                </Button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                  disabled={zoomLevel <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-16 text-center">
                  {zoomLevel}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                  disabled={zoomLevel >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  공유
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                >
                  <PrinterIcon className="h-4 w-4 mr-1" />
                  인쇄
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={!nailArtData.pdfUrl}
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF 다운로드
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {nailArtData.generatedImages.map((imageUrl, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-center">
                    {fingerNames[index]?.ko || `손가락 ${index + 1}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div 
                    className="relative bg-white rounded-lg border overflow-hidden"
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                  >
                    <img
                      src={imageUrl}
                      alt={fingerNames[index]?.ko || `손가락 ${index + 1}`}
                      className="w-full h-auto object-contain"
                      style={{ minHeight: '120px' }}
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 text-center">
                      {nailArtData.descriptions[index] || '네일아트 디자인'}
                    </p>
                    {nailArtData.designSpecs && nailArtData.designSpecs[index] && (
                      <p className="text-xs text-gray-500 text-center mt-1">
                        {nailArtData.designSpecs[index].estimatedSize}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  이전
                </Button>
                <span className="font-medium">
                  {currentPage} / {nailArtData.generatedImages.length}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(nailArtData.generatedImages.length, currentPage + 1))}
                  disabled={currentPage >= nailArtData.generatedImages.length}
                >
                  다음
                </Button>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">
                  {fingerNames[currentPage - 1]?.ko || `손가락 ${currentPage}`}
                </h3>
                <div 
                  className="inline-block bg-white rounded-lg border-2 border-gray-200 p-4"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                >
                  <img
                    src={nailArtData.generatedImages[currentPage - 1]}
                    alt={fingerNames[currentPage - 1]?.ko || `손가락 ${currentPage}`}
                    className="max-w-full h-auto object-contain"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
                <div className="mt-4 max-w-md mx-auto">
                  <p className="text-gray-700">
                    {nailArtData.descriptions[currentPage - 1] || '네일아트 디자인'}
                  </p>
                  {nailArtData.designSpecs && nailArtData.designSpecs[currentPage - 1] && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>크기: {nailArtData.designSpecs[currentPage - 1].estimatedSize}</p>
                      <p>복잡도: {nailArtData.designSpecs[currentPage - 1].designComplexity}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Session Info */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>세션 ID:</strong><br />
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {nailArtData.sessionId}
                </code>
              </div>
              <div>
                <strong>생성 일시:</strong><br />
                {new Date().toLocaleString('ko-KR')}
              </div>
              <div>
                <strong>총 이미지:</strong><br />
                {nailArtData.totalImages || 10}개
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/analytics">
              분석 대시보드로 돌아가기
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}