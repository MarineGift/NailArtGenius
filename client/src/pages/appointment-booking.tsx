import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useLocation } from "wouter";
import Header from "@/components/header";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function AppointmentBooking() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Available time slots (30-minute intervals)
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  // Mock booked slots - in real app this would come from API
  const bookedSlots = ["10:00", "14:00", "15:30"];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("날짜와 시간을 선택해주세요");
      return;
    }
    
    alert("방문 예약이 완료되었습니다!");
    setLocation("/");
  };

  const isSlotAvailable = (time: string) => {
    return !bookedSlots.includes(time);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastTime = (time: string) => {
    if (!selectedDate || !isToday(selectedDate)) return false;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const [hour, minute] = time.split(":").map(Number);
    
    return currentHour > hour || (currentHour === hour && currentMinute > minute);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">예약 일정 선택</h1>
            <p className="text-gray-600">네일 아트 시술을 위한 방문 일정을 예약하세요</p>
          </div>
        </div>

        {/* Store Information */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">AI 네일 스튜디오 강남점</h3>
                <p className="text-blue-700 text-sm mb-1">📍 서울특별시 강남구 테헤란로 123, 2층</p>
                <p className="text-blue-700 text-sm mb-1">📞 02-1234-5678</p>
                <p className="text-blue-700 text-sm">⏰ 영업시간: 월-일 09:00-18:00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  날짜 선택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ko}
                  disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time Slots */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    시간 선택
                    <Badge variant="outline" className="ml-2">
                      {format(selectedDate, "PPP", { locale: ko })}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {timeSlots.map((time) => {
                      const isAvailable = isSlotAvailable(time);
                      const isPast = isPastTime(time);
                      const isDisabled = !isAvailable || isPast;
                      const isSelected = selectedTime === time;

                      return (
                        <Button
                          key={time}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          disabled={isDisabled}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            ${isSelected ? 'bg-pink-600 text-white' : ''}
                            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                            ${!isAvailable ? 'bg-red-100 text-red-600 border-red-200' : ''}
                            ${isPast ? 'bg-gray-100 text-gray-400' : ''}
                          `}
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-pink-600 rounded mr-2"></div>
                      <span>선택됨</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-2"></div>
                      <span>예약됨</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-2"></div>
                      <span>지난 시간</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              {/* Store Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2" />
                    매장 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold">AI Nail Studio 강남점</h3>
                    <p className="text-sm text-gray-600">서울시 강남구 테헤란로 123</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600">📞 02-1234-5678</p>
                    <p className="text-gray-600">🚇 강남역 2번 출구 도보 5분</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>• 영업시간: 09:00 - 18:00</p>
                    <p>• 주차: 건물 지하 1층 (2시간 무료)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="h-5 w-5 mr-2" />
                    예약 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">디자인</span>
                      <span className="font-medium">클래식 프렌치</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">결제 완료</span>
                      <Badge className="bg-green-100 text-green-800">₩38,500</Badge>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">예약 날짜</span>
                        <span className="font-medium">
                          {format(selectedDate, "M월 d일 (eee)", { locale: ko })}
                        </span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">예약 시간</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                    <p>💡 예약 안내</p>
                    <ul className="mt-1 space-y-1">
                      <li>• 시술 소요시간: 약 60분</li>
                      <li>• 예약 변경은 24시간 전까지 가능</li>
                      <li>• 노쇼 시 위약금이 부과될 수 있습니다</li>
                    </ul>
                  </div>

                  <Button 
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime}
                  >
                    예약 확정하기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}