import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Navigation, Send, ExternalLink } from "lucide-react";

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    inquiry: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact-inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: t('contact.form.success'),
          description: "We'll get back to you soon!",
        });
        setFormData({ fullName: '', phoneNumber: '', inquiry: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                {t('contact.open_maps')}
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

          {/* Google Maps Integration */}
          <ContactSection 
            icon={<MapPin className="h-6 w-6" />} 
            title="Location Map"
          >
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-purple-800 dark:text-purple-200 font-medium mb-3">
                  1300 Pennsylvania Avenue NW, Washington, DC 20004
                </p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open('https://www.google.com/maps/place/1300+Pennsylvania+Avenue+NW,+Washington,+DC+20004', '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('contact.open_maps')}
                </Button>
              </div>
              
              {/* Embedded Google Map */}
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3104.5848477!2d-77.0362!3d38.8951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7b7bcc8f8b7a1%3A0x8f8b8b8b8b8b8b8b!2s1300%20Pennsylvania%20Avenue%20NW%2C%20Washington%2C%20DC%2020004!5e0!3m2!1sen!2sus!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </ContactSection>

          {/* Contact Form */}
          <ContactSection 
            icon={<Send className="h-6 w-6" />} 
            title={t('contact.form.title')}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">{t('contact.form.name')}</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">{t('contact.form.phone')}</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="inquiry">{t('contact.form.inquiry')}</Label>
                <Textarea
                  id="inquiry"
                  value={formData.inquiry}
                  onChange={(e) => setFormData(prev => ({ ...prev, inquiry: e.target.value }))}
                  required
                  rows={4}
                  className="mt-1"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Sending...' : t('contact.form.submit')}
              </Button>
            </form>
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
                    {t('contact.call_now')}
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