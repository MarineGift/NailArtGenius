import { useTranslation } from '@/lib/i18n';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ImageCarousel } from '@/components/image-carousel';
import { BookingHeroSection } from '@/components/booking-hero-section';
import { PremiumServicesSection } from '@/components/premium-services-section';
import { AINailArtSection } from '@/components/ai-nail-art-section';
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
        {/* Hero Carousel Section */}
        <section className="mb-0">
          <ImageCarousel />
        </section>

        {/* Premium Services Section */}
        <PremiumServicesSection />

        {/* AI Nail Art Section */}
        <AINailArtSection />

        {/* Booking Hero Section */}
        <BookingHeroSection />
        
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