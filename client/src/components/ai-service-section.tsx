import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'wouter';
import { Sparkles, Clock, DollarSign, Palette, Camera, Zap } from 'lucide-react';

export function AIServiceSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Camera className="h-8 w-8 text-pink-500" />,
      title: '사진 분석',
      description: 'AI가 손톱 모양을 정확하게 분석합니다'
    },
    {
      icon: <Palette className="h-8 w-8 text-purple-500" />,
      title: '맞춤 디자인',
      description: '개인 취향에 맞는 독특한 네일아트'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: '시간 절약',
      description: '미리 디자인 선택으로 대기시간 단축'
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      title: '비용 절약',
      description: '효율적인 서비스로 합리적인 가격'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Sparkles className="h-10 w-10 text-pink-500 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              혁신적인 AI 네일아트 시스템
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AI를 이용한 손톱 제작 시스템으로 사전에 디자인을 선택하여 주문함으로써 
            <span className="font-semibold text-pink-600"> 시간과 비용을 줄일 수 있는 혁신적인 서비스</span>를 제공합니다.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">간단한 3단계 프로세스</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">손톱 촬영</h4>
              <p className="text-gray-600">간편하게 손톱 사진을 촬영하여 업로드</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">AI 분석 및 디자인</h4>
              <p className="text-gray-600">AI가 분석하여 맞춤형 디자인 추천</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">매장 방문</h4>
              <p className="text-gray-600">예약된 시간에 방문하여 빠른 시술</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-gray-700 mb-6">
            방문 가능한 편리한 시간에 예약해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3">
                <Clock className="h-5 w-5 mr-2" />
                지금 예약하기
              </Button>
            </Link>
            <Link href="/photo-upload">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-3"
              >
                <Zap className="h-5 w-5 mr-2" />
                AI 디자인 체험
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}