import { useTranslation } from '@/lib/i18n';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ImageCarousel } from '@/components/image-carousel';
import { BookingHeroSection } from '@/components/booking-hero-section';
import { AIServiceSection } from '@/components/ai-service-section';
import { KoreanServicesSection } from '@/components/korean-services-section';
import { LocationMap } from '@/components/location-map';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Carousel Section */}
        <section className="mb-0">
          <ImageCarousel />
        </section>

        {/* AI Nail Art Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                🤖 AI Nail Art - 혁신적인 네일아트 서비스
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  손톱을 등록한 후 네일아트 디자인을 선택한 후 결제 하신 후 방문일자를 입력해 주세요. 
                  Connie's Nail AI가 손톱을 분석한 후 고객이 선택하신 네일아트를 사전에 제작함으로 
                  방문시 시술시간 및 비용을 획기적으로 줄여 줍니다.
                </p>
                <div className="flex justify-center">
                  <Link href="/ai-nail-generator">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      ✨ AI Nail Art 바로 가기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Hero Section */}
        <BookingHeroSection />

        {/* AI Service Section */}
        <AIServiceSection />
        
        {/* Korean Services Section */}
        <KoreanServicesSection />

        {/* Location Map Section */}
        <LocationMap />
      </main>
      
      <Footer />
    </div>
  );
}