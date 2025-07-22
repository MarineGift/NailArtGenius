import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export function BookingHeroSection() {
  const popularServices = [
    { name: '스파 매니큐어', price: '$45', duration: '60분' },
    { name: 'AI 맞춤 네일아트', price: '$80', duration: '120분', featured: true },
    { name: '젤 매니큐어', price: '$40', duration: '75분' }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-100 via-white to-purple-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Star className="h-8 w-8 text-yellow-500 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              프리미엄 네일 서비스 예약
            </h2>
            <Star className="h-8 w-8 text-yellow-500 ml-2" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            전문가의 손길과 혁신적인 AI 기술로 만나는 완벽한 네일 케어 경험
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center">
                  <Calendar className="h-8 w-8 mr-3" />
                  지금 예약하세요
                </CardTitle>
                <p className="text-pink-100 text-lg">
                  온라인으로 간편하게 예약하고 특별한 혜택을 받으세요
                </p>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-lg p-4">
                    <Clock className="h-6 w-6 mx-auto mb-2" />
                    <p className="font-semibold">빠른 예약</p>
                    <p className="text-sm text-pink-100">실시간 예약 확인</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Sparkles className="h-6 w-6 mx-auto mb-2" />
                    <p className="font-semibold">특별 혜택</p>
                    <p className="text-sm text-pink-100">온라인 예약 할인</p>
                  </div>
                </div>
                
                <Link href="/booking">
                  <Button 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    예약하기
                  </Button>
                </Link>
                
                <p className="text-pink-100 text-sm mt-4">
                  * 온라인 예약시 10% 할인 혜택
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Popular Services */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">인기 서비스</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularServices.map((service, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                      service.featured 
                        ? 'border-purple-300 bg-purple-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{service.name}</h3>
                      {service.featured && (
                        <Badge className="bg-purple-500 hover:bg-purple-600">
                          <Sparkles className="h-3 w-3 mr-1" />
                          추천
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </span>
                      <span className="font-bold text-purple-600">{service.price}</span>
                    </div>
                  </div>
                ))}
                
                <Link href="/services">
                  <Button variant="outline" className="w-full mt-4">
                    전체 서비스 보기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}