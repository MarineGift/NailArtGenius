'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Hero({ lang, dict }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const carouselImages = [
    {
      id: 1,
      title: dict?.hero?.title || "Beautiful Nail Art",
      subtitle: "Expert careful design",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "AI Custom Nails",
      subtitle: "Completed with innovative AI technology",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Premium Care",
      subtitle: "Luxury nail service experience",
      image: "https://images.unsplash.com/photo-1522338140262-f46f5913618f?w=800&h=600&fit=crop"
    }
  ]

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [carouselImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <section className="relative hero-section">
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
    </section>
  )
}