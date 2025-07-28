'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  // 간단한 다국어 지원을 위한 기본 텍스트
  const texts = {
    title: "Connie's Nail - 프리미엄 네일 살롱",
    subtitle: "전문적인 네일 케어와 AI 기반 네일 아트 디자인 서비스",
    services: "서비스",
    gallery: "갤러리", 
    booking: "예약",
    contact: "연락처",
    bookNow: "지금 예약",
    viewGallery: "갤러리 보기"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-purple-600">
              Connie's Nail
            </h1>
            <nav className="flex space-x-6">
              <Link href="/services" className="text-gray-600 hover:text-purple-600">
                {texts.services}
              </Link>
              <Link href="/gallery" className="text-gray-600 hover:text-purple-600">
                {texts.gallery}
              </Link>
              <Link href="/booking" className="text-gray-600 hover:text-purple-600">
                {texts.booking}
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-purple-600">
                {texts.contact}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {texts.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {texts.subtitle}
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              {texts.bookNow}
            </Button>
            <Button size="lg" variant="outline">
              {texts.viewGallery}
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">
                클래식 매니큐어
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                전통적인 프렌치 매니큐어와 클래식 네일 케어
              </p>
              <p className="font-semibold text-2xl text-purple-600">₩45,000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">
                AI 네일 아트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                AI 기술을 활용한 맞춤형 네일 아트 디자인
              </p>
              <p className="font-semibold text-2xl text-purple-600">₩80,000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">
                프리미엄 서비스
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                고급 스파 트리트먼트와 프리미엄 네일 케어
              </p>
              <p className="font-semibold text-2xl text-purple-600">₩120,000</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Connie's Nail</h3>
              <p className="text-gray-400">
                최고의 네일 케어와 아름다운 네일 아트를 제공합니다
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">연락처</h4>
              <p className="text-gray-400">📞 010-1234-5678</p>
              <p className="text-gray-400">📧 info@connienail.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">운영 시간</h4>
              <p className="text-gray-400">평일: 10:00 - 19:00</p>
              <p className="text-gray-400">토요일: 10:00 - 18:00</p>
              <p className="text-gray-400">일요일: 휴무</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}