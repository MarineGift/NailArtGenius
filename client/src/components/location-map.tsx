import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Mail, Navigation } from 'lucide-react';

export function LocationMap() {
  const openGoogleMaps = () => {
    const address = "1300 Pennsylvania Avenue NW, Washington, DC 20004, USA";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const callPhone = () => {
    window.location.href = 'tel:202-898-0826';
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            오시는 길
          </h2>
          <p className="text-lg text-gray-600">
            편리한 교통으로 쉽게 찾아오세요
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map Section */}
          <div className="order-2 lg:order-1">
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3104.9567892439906!2d-77.0301!3d38.8935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7b7bcdecbb1df%3A0x715969d86d0b76bf!2sRonald%20Reagan%20Building%20and%20International%20Trade%20Center!5e0!3m2!1sen!2sus!4v1672876543210!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-t-lg"
                  ></iframe>
                </div>
                <div className="p-6">
                  <Button 
                    onClick={openGoogleMaps}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Google Maps에서 길찾기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="order-1 lg:order-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <MapPin className="h-5 w-5 mr-2 text-pink-500" />
                  매장 위치
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Ronald Reagan Building & International Trade Center</strong><br />
                  1300 Pennsylvania Avenue NW<br />
                  Washington, DC 20004, USA
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Clock className="h-5 w-5 mr-2 text-purple-500" />
                  영업시간
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>월요일 - 금요일</span>
                    <span className="font-medium">오전 10:00 - 오후 7:00</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>토요일 - 일요일</span>
                    <span>휴무</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Phone className="h-5 w-5 mr-2 text-green-500" />
                  연락처
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-2">전화번호</p>
                  <Button 
                    variant="outline" 
                    onClick={callPhone}
                    className="w-full justify-start"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    202.898.0826
                  </Button>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">이메일</p>
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                    Sungimconniekim@gmail.com
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transportation Guide */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">교통편 안내</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <p className="font-medium text-blue-600 mb-1">🚇 지하철</p>
                    <p className="text-sm">Federal Triangle 역 (Blue, Orange, Silver Line)</p>
                    <p className="text-sm text-gray-600">도보 2분 거리</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-600 mb-1">🚌 버스</p>
                    <p className="text-sm">Pennsylvania Avenue 버스 정류장</p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-600 mb-1">🚗 주차</p>
                    <p className="text-sm">건물 내 유료 주차장 이용 가능</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}