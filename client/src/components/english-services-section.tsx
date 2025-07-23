import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Eye } from 'lucide-react';

export function EnglishServicesSection() {
  const services = [
    {
      id: 1,
      name: "Classic French Manicure",
      price: 45,
      description: "Traditional French manicure style",
      rating: 4.8,
      reviews: 127,
      duration: 45,
      category: "classic",
      emoji: "💅",
      image: "/images/french-manicure.jpg"
    },
    {
      id: 2, 
      name: "Floral Design",
      price: 65,
      description: "Delicate floral nail art",
      rating: 4.9,
      reviews: 89,
      duration: 90,
      category: "floral",
      emoji: "🌸",
      image: "/images/floral-design.jpg"
    },
    {
      id: 3,
      name: "Geometric Pattern",
      price: 55,
      description: "Modern geometric patterns",
      rating: 4.7,
      reviews: 156,
      duration: 60,
      category: "modern",
      emoji: "⚡",
      image: "/images/geometric-pattern.jpg"
    },
    {
      id: 4,
      name: "Glitter & Sparkle",
      price: 70,
      description: "Glamorous glitter nail art",
      rating: 4.6,
      reviews: 92,
      duration: 75,
      category: "glamour",
      emoji: "✨",
      image: "/images/glitter-sparkle.jpg"
    },
    {
      id: 5,
      name: "Minimalist Style",
      price: 40,
      description: "Simple and sophisticated minimal design",
      rating: 4.8,
      reviews: 134,
      duration: 30,
      category: "minimalist",
      emoji: "🤍",
      image: "/images/minimalist-style.jpg"
    },
    {
      id: 6,
      name: "Seasonal Design",
      price: 60,
      description: "Special seasonal designs",
      rating: 4.7,
      reviews: 78,
      duration: 60,
      category: "seasonal",
      emoji: "🍂",
      image: "/images/seasonal-design.jpg"
    },
    {
      id: 7,
      name: "Wedding Special",
      price: 80,
      description: "Elegant nail art for weddings",
      rating: 4.9,
      reviews: 45,
      duration: 90,
      category: "wedding",
      emoji: "💍",
      image: "/images/wedding-special.jpg"
    },
    {
      id: 8,
      name: "Ombre Effect",
      price: 65,
      description: "Soft gradient effects",
      rating: 4.7,
      reviews: 103,
      duration: 60,
      category: "gradient",
      emoji: "🌈",
      image: "/images/ombre-effect.jpg"
    },
    {
      id: 9,
      name: "3D Art Design",
      price: 90,
      description: "Three-dimensional nail art",
      rating: 4.8,
      reviews: 67,
      duration: 120,
      category: "3d",
      emoji: "🎨",
      image: "/images/3d-art-design.jpg"
    }
  ];

  const treatmentSteps = [
    {
      step: 1,
      title: "Nail Preparation",
      description: "Cuticle care and nail trimming"
    },
    {
      step: 2,
      title: "Base Coating",
      description: "Base work for healthy nails"
    },
    {
      step: 3,
      title: "Color Application",
      description: "Precise color application process"
    },
    {
      step: 4,
      title: "Finish Coating",
      description: "Top coating for long-lasting shine"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            💅 Professional Nail Art Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our premium collection of nail art designs, each crafted with precision and care
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{service.emoji}</span>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pink-600">${service.price}</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {service.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-sm">{service.rating}</span>
                    <span className="text-gray-500 text-xs">({service.reviews})</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{service.duration}min</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Treatment Process */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Treatment Process</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {treatmentSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">Step {step.step}</span>
                </div>
                <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Do you have a design you like?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Book now and experience professional nail art services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-pink-600 hover:bg-gray-100 font-semibold px-8"
            >
              Book Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-pink-600 font-semibold px-8"
            >
              Get Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}