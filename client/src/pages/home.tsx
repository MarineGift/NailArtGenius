import { useTranslation } from '@/lib/i18n';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ImageCarousel } from '@/components/image-carousel';
import { BookingHeroSection } from '@/components/booking-hero-section';
import { AIServiceSection } from '@/components/ai-service-section';
import { EnglishServicesSection } from '@/components/english-services-section';
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
                🤖 AI Nail Art - Revolutionary Nail Art Service
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Register your nails → select nail art design → payment → visit date process. 
                  Connie's Nail AI analyzes your nails and pre-creates your selected nail art design, 
                  dramatically reducing treatment time and cost during your visit.
                </p>
                <div className="flex justify-center">
                  <Link href="/ai-nail-generator">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      ✨ Go to AI Nail Art
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
        
        {/* English Services Section */}
        <EnglishServicesSection />

        {/* Location Map Section */}
        <LocationMap />
      </main>
      
      <Footer />
    </div>
  );
}