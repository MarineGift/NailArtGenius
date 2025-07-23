import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Palette, Camera, Scissors, Heart } from 'lucide-react';

export function PremiumServicesSection() {
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
        <div className="grid md:grid-cols-4 gap-6">
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
      </div>
    </section>
  );
}