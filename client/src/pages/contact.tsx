import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Navigation } from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();

  const ContactSection = ({ icon, title, children }: { 
    icon: React.ReactNode; 
    title: string; 
    children: React.ReactNode 
  }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center text-purple-700 dark:text-purple-300">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('contact.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Salon Info */}
          <ContactSection 
            icon={<Phone className="h-6 w-6" />} 
            title={t('contact.salon_name')}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                  {t('contact.call_us')}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  {t('contact.hours')}
                </span>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-purple-800 dark:text-purple-200 font-medium">
                  {t('contact.appointment_note')}
                </p>
              </div>
            </div>
          </ContactSection>

          {/* Location */}
          <ContactSection 
            icon={<MapPin className="h-6 w-6" />} 
            title={t('contact.where_title')}
          >
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  {t('contact.building')}
                </h3>
                <div className="space-y-1 text-gray-700 dark:text-gray-300">
                  <p className="font-medium">{t('contact.space')}</p>
                  <p>{t('contact.address')}</p>
                  <p>{t('contact.city')}</p>
                </div>
              </div>
              
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => window.open('https://maps.google.com/?q=1300+Pennsylvania+Avenue+Washington+DC+20004', '_blank')}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Open in Google Maps
              </Button>
            </div>
          </ContactSection>

          {/* Directions */}
          <ContactSection 
            icon={<Navigation className="h-6 w-6" />} 
            title={t('contact.directions_title')}
          >
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">
                  {t('contact.metro_title')}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('contact.metro_directions')}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">
                  {t('contact.walking_title')}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('contact.walking_directions')}
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-purple-800 dark:text-purple-200 font-medium">
                  {t('contact.location_note')}
                </p>
              </div>
            </div>
          </ContactSection>

          {/* Contact Us */}
          <ContactSection 
            icon={<Mail className="h-6 w-6" />} 
            title={t('contact.feedback_title')}
          >
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {t('contact.email_note')}
              </p>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-600" />
                <a 
                  href="mailto:Sungimconniekim@gmail.com" 
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-medium"
                >
                  {t('contact.email')}
                </a>
              </div>
              
              <Separator />
              
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-lg">
                <p className="text-center text-lg font-bold text-purple-800 dark:text-purple-200">
                  {t('contact.appointment_call')}
                </p>
                <div className="text-center mt-4">
                  <Button 
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                    onClick={() => window.location.href = 'tel:202-898-0826'}
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now: 202.898.0826
                  </Button>
                </div>
              </div>
            </div>
          </ContactSection>
        </div>
      </main>

      <Footer />
    </div>
  );
}