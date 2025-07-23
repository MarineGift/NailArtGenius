import { useTranslation } from '@/lib/i18n';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ImageCarousel } from '@/components/image-carousel';
import { BookingHeroSection } from '@/components/booking-hero-section';
import { AIServiceSection } from '@/components/ai-service-section';
import { EnglishServicesSection } from '@/components/english-services-section';
import { ContactUsForm } from '@/components/contact-us-form';
import { LocationMap } from '@/components/location-map';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Booking Hero Section */}
        <BookingHeroSection />

        {/* AI Service Section */}
        <AIServiceSection />

        {/* Hero Carousel Section */}
        <section className="mb-0">
          <ImageCarousel />
        </section>
        
        {/* English Services Section */}
        <EnglishServicesSection />

        {/* Contact Us Form */}
        <ContactUsForm />

        {/* Location Map */}
        <LocationMap />
      </main>
      
      <Footer />
    </div>
  );
}