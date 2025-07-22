import { useTranslation } from '@/lib/i18n';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ImageCarousel } from '@/components/image-carousel';
import { BookingHeroSection } from '@/components/booking-hero-section';
import { AIServiceSection } from '@/components/ai-service-section';
import { LocationMap } from '@/components/location-map';

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

        {/* Booking Hero Section */}
        <BookingHeroSection />

        {/* AI Service Section */}
        <AIServiceSection />

        {/* Location Map Section */}
        <LocationMap />
      </main>
      
      <Footer />
    </div>
  );
}