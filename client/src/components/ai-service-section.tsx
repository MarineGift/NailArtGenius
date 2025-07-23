import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'wouter';
import { Sparkles, Clock, DollarSign, Palette, Camera, Heart, Scissors, Star, Zap, Calendar } from 'lucide-react';

export function AIServiceSection() {
  const { t } = useTranslation();

  const services = [
    {
      icon: <Palette className="h-8 w-8 text-pink-500" />,
      title: 'Spa Manicure',
      description: 'Perfect nail care with premium spa treatment'
    },
    {
      icon: <Camera className="h-8 w-8 text-purple-500" />,
      title: 'AI Nail Art Generation',
      description: 'AI creates unique personalized nail designs just for you'
    },
    {
      icon: <Scissors className="h-8 w-8 text-blue-500" />,
      title: 'Professional Waxing',
      description: 'Professional waxing care services from face to full body'
    },
    {
      icon: <Heart className="h-8 w-8 text-green-500" />,
      title: 'Massage Therapy',
      description: 'Complete relaxation for body and mind with comfortable chair massage'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Star className="h-10 w-10 text-pink-500 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              💅 Connie's Nail Premium Services
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From traditional nail care to innovative AI nail art,  
            <span className="font-semibold text-pink-600"> perfect beauty care experience</span> awaits you.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Process */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Simple Booking Process</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Select Date & Time</h4>
              <p className="text-gray-600">Choose your desired appointment date and time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Select Service</h4>
              <p className="text-gray-600">Then enter phone number and additional notes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Visit Store</h4>
              <p className="text-gray-600">Visit at your scheduled time for quick service</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-gray-700 mb-6">
            Book at a convenient time that works for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3">
                <Clock className="h-5 w-5 mr-2" />
                Book Now
              </Button>
            </Link>
            <Link href="/ai-generator">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-3"
              >
                <Camera className="h-5 w-5 mr-2" />
                Try AI Design
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}