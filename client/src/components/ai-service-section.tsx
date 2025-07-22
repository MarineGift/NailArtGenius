import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'wouter';
import { Sparkles, Clock, DollarSign, Palette, Camera, Heart, Scissors, Star, Zap, Calendar } from 'lucide-react';

export function AIServiceSection() {
  const { t } = useTranslation();

  const services = [
    {
      icon: <Palette className="h-8 w-8 text-pink-500" />,
      title: '스파 매니큐어',
      description: '프리미엄 스파 트리트먼트와 함께하는 완벽한 손톱 관리'
    },
    {
      icon: <Camera className="h-8 w-8 text-purple-500" />,
      title: 'AI 네일아트 생성',
      description: '인공지능이 맞춤형 독특한 네일 디자인을 생성해드립니다'
    },
    {
      icon: <Scissors className="h-8 w-8 text-blue-500" />,
      title: '전문 왁싱 서비스',
      description: '얼굴부터 전신까지 전문적인 왁싱 케어 서비스'
    },
    {
      icon: <Heart className="h-8 w-8 text-green-500" />,
      title: '마사지 테라피',
      description: '편안한 체어 마사지로 몸과 마음의 완전한 휴식'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Star className="h-10 w-10 text-pink-500 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              💅 Connie's Nail 프리미엄 서비스
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            전통적인 네일 케어부터 혁신적인 AI 네일아트까지,  
            <span className="font-semibold text-pink-600"> 완벽한 뷰티 케어 경험</span>을 제공합니다.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Process */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">간단한 예약 프로세스</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">서비스 선택</h4>
              <p className="text-gray-600">원하는 네일, 스파, 왁싱 서비스를 선택</p>
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
            <Link href="/upload">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-3"
              >
                <Camera className="h-5 w-5 mr-2" />
                AI 디자인 체험
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}