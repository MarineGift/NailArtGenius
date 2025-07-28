'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Carousel images data
  const carouselImages = [
    {
      id: 1,
      title: "Beautiful Nail Art",
      subtitle: "Expert careful design",
      image: "/attached_assets/nailart1_1753154093464.jpg"
    },
    {
      id: 2,
      title: "AI Custom Nails", 
      subtitle: "Completed with innovative AI technology",
      image: "/attached_assets/nailart2_1753154093464.jpg"
    },
    {
      id: 3,
      title: "Premium Care",
      subtitle: "Luxury nail service experience", 
      image: "/attached_assets/nailart3_1753154093464.jpg"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">💅</span>
              </div>
              <h1 className="text-2xl font-bold text-pink-600">
                Connie's Nail
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-pink-600 font-medium">Home</Link>
              <Link href="/services" className="text-gray-700 hover:text-pink-600 font-medium">Services</Link>
              <Link href="/booking" className="text-gray-700 hover:text-pink-600 font-medium">Booking</Link>
              <Link href="/gallery" className="text-gray-700 hover:text-pink-600 font-medium">Gallery</Link>
              <Link href="/ai-nail-art" className="text-gray-700 hover:text-pink-600 font-medium">AI Nail Art</Link>
              <Link href="/contact" className="text-gray-700 hover:text-pink-600 font-medium">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Log In</Button>
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700">Sign Up</Button>
              <select className="text-sm border rounded px-2 py-1">
                <option value="ko">🇰🇷 Korean</option>
                <option value="en">🇺🇸 English</option>
              </select>
              <Button size="sm" className="bg-pink-500 text-white">📱 Web App</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <main className="relative">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          {carouselImages.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex h-full">
                {/* Left side - Nail gallery */}
                <div className="w-1/2 bg-gray-100 p-8 flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-4 max-w-sm">
                    {[1,2,3,4,5,6,7,8].map((nail) => (
                      <div key={nail} className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg shadow-sm"></div>
                    ))}
                  </div>
                </div>
                
                {/* Right side - Featured design */}
                <div className="w-1/2 bg-gray-900 relative flex items-center justify-center">
                  <div className="text-center text-white z-10">
                    <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-xl opacity-90">{slide.subtitle}</p>
                  </div>
                  {/* Green nail pattern overlay */}
                  <div className="absolute right-8 grid grid-cols-2 gap-3">
                    {[1,2,3,4,5,6,7,8,9,10].map((nail) => (
                      <div key={nail} className="w-16 h-20 bg-gradient-to-b from-green-300 to-green-500 rounded-t-full rounded-b-lg shadow-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Premium Services Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-pink-500 mr-2" />
              <span className="text-pink-500 font-medium">💅</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Connie's Nail Premium Services
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              From traditional nail care to innovative AI nail art, <span className="text-pink-600 font-semibold">perfect beauty care experience</span> awaits you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌸</span>
                </div>
                <CardTitle className="text-pink-600">Spa Manicure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Perfect nail care with premium spa treatment</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <CardTitle className="text-blue-600">AI Nail Art Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">AI creates unique personalized nail designs just for you</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✂️</span>
                </div>
                <CardTitle className="text-purple-600">Professional Waxing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Professional waxing care services from face to full body</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💆</span>
                </div>
                <CardTitle className="text-green-600">Massage Therapy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Complete relaxation for body and mind with comfortable chair massage</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Nail Art CTA */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-16">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">🤖 AI Nail Art - Revolutionary Nail Art Service</h3>
              <p className="text-lg text-gray-700 mb-6 max-w-4xl mx-auto">
                Register your nails → select nail art design → payment → visit date process. 
                Connie's Nail AI analyzes your nails and pre-creates your selected nail art design, 
                dramatically reducing treatment time and cost during your visit.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3">
                ✨ Go to AI Nail Art
              </Button>
            </div>
          </div>
        </div>
        {/* Booking CTA Section */}
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Nail Service Booking</h2>
              <p className="text-lg text-gray-600 mb-8">Experience perfect nail care with expert touch and innovative AI technology</p>
              
              <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-pink-600">📅</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Book online easily</h4>
                    <p className="text-gray-600 text-sm">and receive special benefits</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Quick Booking</h4>
                    <p className="text-gray-600 text-sm">Real-time confirmation</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600">🎁</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Special Benefits</h4>
                    <p className="text-gray-600 text-sm">Online booking discount</p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 mr-4">
                Book Appointment
              </Button>
              <p className="text-sm text-gray-500 mt-2">* 10% discount for online bookings</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}  
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">💅</span>
                </div>
                <h3 className="text-xl font-bold">Connie's Nail</h3>
              </div>
              <p className="text-gray-400 mb-4">Washington, DC</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Business Hours
              </h4>
              <p className="text-gray-400">Monday - Friday</p>
              <p className="text-gray-400">10:00 AM - 7:00 PM</p>
              <p className="text-gray-400 mt-2">Saturday - Sunday</p>
              <p className="text-gray-400">Closed</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Information</h4>
              <p className="text-gray-400 flex items-center mb-2">
                <Phone className="w-4 h-4 mr-2" />
                202.898.0826
              </p>
              <p className="text-gray-400 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Sungimconniekim@gmail.com
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address  
              </h4>
              <p className="text-gray-400">1300 Pennsylvania Avenue NW</p>
              <p className="text-gray-400">Washington, DC 20004</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 Connie's Nail. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}