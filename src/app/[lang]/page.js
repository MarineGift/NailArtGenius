import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage({ params }) {
  const { lang } = await params

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-pink-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mb-4">
                  Online
                </div>
                <Image
                  src="/assets/placeholder.svg"
                  alt="Connie's Nail Salon"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg mb-6"
                  priority
                />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Connie's Nail Salon
                </h1>
                <p className="text-gray-600 text-lg">
                  Washington DC Premium Nail Salon
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="text-center">
                  <Image
                    src="/assets/placeholder.svg"
                    alt="Beautiful Nail Art"
                    width={300}
                    height={200}
                    className="rounded-lg shadow-md mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">Beautiful Nail Art</h3>
                  <p className="text-gray-600">Expert careful design</p>
                </div>
                
                <div className="text-center">
                  <Image
                    src="/assets/placeholder.svg"
                    alt="AI Custom Nails"
                    width={300}
                    height={200}
                    className="rounded-lg shadow-md mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">AI Custom Nails</h3>
                  <p className="text-gray-600">Completed with innovative AI technology</p>
                </div>
                
                <div className="text-center">
                  <Image
                    src="/assets/placeholder.svg"
                    alt="Premium Care"
                    width={300}
                    height={200}
                    className="rounded-lg shadow-md mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">Premium Care</h3>
                  <p className="text-gray-600">Luxury nail service experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              💅 Connie's Nail Premium Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From traditional nail care to innovative AI nail art, perfect beauty care experience awaits you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">Spa Manicure</h3>
              <p className="text-gray-600">Perfect nail care with premium spa treatment</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">AI Nail Art Generation</h3>
              <p className="text-gray-600">AI creates unique personalized nail designs just for you</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">Professional Waxing</h3>
              <p className="text-gray-600">Professional waxing care services from face to full body</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">Massage Therapy</h3>
              <p className="text-gray-600">Complete relaxation for body and mind with comfortable chair massage</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Nail Art Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            🤖 AI Nail Art - Revolutionary Nail Art Service
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Register your nails → select nail art design → payment → visit date process. 
            Connie's Nail AI analyzes your nails and pre-creates your selected nail art design, 
            dramatically reducing treatment time and cost during your visit.
          </p>
          <Link
            href={`/${lang}/ai-nail-art`}
            className="inline-flex items-center bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            ✨ Go to AI Nail Art
          </Link>
        </div>
      </section>

      {/* Treatment Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Treatment Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Nail Preparation</h3>
              <p className="text-gray-600">Cuticle care and nail trimming</p>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Base Coating</h3>
              <p className="text-gray-600">Base work for healthy nails</p>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Color Application</h3>
              <p className="text-gray-600">Precise color application process</p>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Finish Coating</h3>
              <p className="text-gray-600">Top coating for long-lasting shine</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-16 bg-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Premium Nail Service Booking
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Experience perfect nail care with expert touch and innovative AI technology
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Book Now</h3>
              <p className="text-pink-100">Book online easily and receive special benefits</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Quick Booking</h3>
              <p className="text-pink-100">Real-time confirmation</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Special Benefits</h3>
              <p className="text-pink-100">Online booking discount</p>
            </div>
          </div>
          <Link
            href={`/${lang}/booking`}
            className="inline-flex items-center bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Book Appointment
          </Link>
          <p className="text-pink-100 mt-4">* 10% discount for online bookings</p>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Popular Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Spa Manicure</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">60min</span>
                <span className="text-2xl font-bold text-pink-600">$45</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center border-2 border-pink-200">
              <div className="inline-block bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded-full mb-2">
                Recommended
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Custom Nail Art</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">120min</span>
                <span className="text-2xl font-bold text-pink-600">$80</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Gel Manicure</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">75min</span>
                <span className="text-2xl font-bold text-pink-600">$40</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link
              href={`/${lang}/services`}
              className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700"
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}