import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";
import { Camera, Palette, Printer, CreditCard } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "인증 필요",
        description: "로그인이 필요합니다...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            안녕하세요, {user?.firstName || '고객'}님! 👋
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI 기술로 완벽한 네일아트를 시작해보세요
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation('/upload')}
            className="bg-secondary text-white px-8 py-4 text-lg font-semibold hover:bg-pink-600 shadow-lg"
          >
            새 네일아트 시작하기
            <Camera className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Service Process Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">사진 촬영</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                신용카드에 손가락을 올려놓고 6장의 사진을 촬영하세요
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="h-6 w-6 text-secondary">🧠</div>
              </div>
              <CardTitle className="text-lg">AI 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                AI가 손가락 모양을 분석하여 최적의 네일 형태를 생성합니다
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">디자인 선택</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                다양한 네일아트 디자인 중 마음에 드는 것을 선택하세요
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">자동 프린팅</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                결제 후 전용 프린터로 네일아트가 자동 제작됩니다
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-secondary" />
              촬영 가이드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">중요:</span> 정확한 AI 분석을 위해 반드시 신용카드 위에 손가락을 올려놓고 촬영해주세요
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">손가락 위치 사진 (4장)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 엄지, 검지, 중지, 약지 각각 1장씩</li>
                  <li>• 손가락을 신용카드 위에 평평하게 올려놓기</li>
                  <li>• 충분한 조명에서 촬영</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">손가락 굴곡 사진 (2장)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 측면에서 손가락의 자연스러운 굴곡 촬영</li>
                  <li>• 왼쪽과 오른쪽에서 각각 1장씩</li>
                  <li>• 손가락의 곡선이 선명하게 보이도록</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => setLocation('/upload')}
            className="bg-secondary text-white px-8 py-4 text-lg font-semibold hover:bg-pink-600"
          >
            사진 촬영 시작하기
            <span className="ml-2">→</span>
          </Button>
        </div>
      </main>
    </div>
  );
}
