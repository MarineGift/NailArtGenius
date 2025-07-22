import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Camera, Palette, Printer, CreditCard, Calendar, Sparkles, Wand2, BarChart3 } from "lucide-react";

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
            AI가 그려낸 당신만의 손끝 예술, 지금부터 시작해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setLocation('/upload')}
              className="bg-secondary text-white px-8 py-4 text-lg font-semibold hover:bg-pink-600 shadow-lg"
            >
              <Camera className="mr-2 h-5 w-5" />
              새 네일아트 시작하기
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-secondary text-secondary hover:bg-pink-50 px-8 py-4 text-lg"
              onClick={() => setLocation("/advanced-design-studio")}
            >
              <Wand2 className="mr-2 h-5 w-5" />
              AI 디자인 스튜디오
            </Button>
          </div>
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
              <CardTitle className="text-lg">네일 아트</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                당신을 위해 선택된 아트, 손끝 위에 섬세하게 담아냅니다
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-secondary" />
                정밀 촬영 가이드
              </div>
              <Button variant="outline" onClick={() => setLocation('/photo-guide')}>
                상세 가이드 보기
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">중요:</span> 정확한 AI 분석을 위해 반드시 신용카드 위에 손가락을 올려놓고 촬영해주세요. 
                총 12장의 사진이 필요합니다.
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

        {/* Recent Bookings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-secondary" />
              최근 예약 내역
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">예약 내역이 없습니다</p>
              <p className="text-sm">첫 번째 방문 예약을 만들어보세요!</p>
            </div>
          </CardContent>
        </Card>

        {/* New AI Design Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🤖 AI 맞춤형 디자인 서비스
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-center text-purple-800 flex items-center justify-center">
                  <Sparkles className="mr-2 h-5 w-5" />
                  스타일 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-purple-700 mb-4">AI가 당신만의 맞춤형 디자인을 생성할 수 있도록 선호도를 설정하세요</p>
                <Button 
                  size="lg"
                  onClick={() => setLocation('/style-preferences')}
                  className="bg-purple-600 text-white px-6 py-3 font-semibold hover:bg-purple-700"
                >
                  스타일 선호도 설정
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-center text-pink-800 flex items-center justify-center">
                  <Wand2 className="mr-2 h-5 w-5" />
                  AI 디자인 생성
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-pink-700 mb-4">AI가 당신만의 독특한 네일 디자인을 생성해드립니다</p>
                <Button 
                  size="lg"
                  onClick={() => setLocation('/custom-design')}
                  className="bg-pink-600 text-white px-6 py-3 font-semibold hover:bg-pink-700"
                >
                  맞춤형 디자인 생성
                  <Wand2 className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-pink-200 bg-pink-50">
            <CardHeader>
              <CardTitle className="text-center text-pink-800">새 네일아트 주문</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-pink-700 mb-4">AI 분석부터 시작하세요</p>
              <Button 
                size="lg"
                onClick={() => setLocation('/upload')}
                className="bg-secondary text-white px-6 py-3 font-semibold hover:bg-pink-600"
              >
                사진 촬영 시작하기
                <Camera className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-center text-blue-800">방문 예약</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-blue-700 mb-4">매장 방문 일정을 예약하세요</p>
              <Button 
                size="lg"
                onClick={() => setLocation('/booking')}
                variant="outline"
                className="border-blue-500 text-blue-600 px-6 py-3 font-semibold hover:bg-blue-100"
              >
                방문 예약하기
                <span className="ml-2">📅</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
