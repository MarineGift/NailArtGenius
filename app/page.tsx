export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              NailArt Genius
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your nails into works of art with our AI-powered design tools and professional nail services.
          </p>
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg">
            Book Your Appointment
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💅</div>
            <h3 className="text-2xl font-bold mb-4 text-pink-600">Classic Manicure</h3>
            <p className="text-gray-600 mb-6">Professional nail care with perfect polish application and cuticle maintenance.</p>
            <div className="text-3xl font-bold text-purple-600">$35</div>
            <div className="text-sm text-gray-500 mt-2">45 minutes</div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-bold mb-4 text-pink-600">Gel Manicure</h3>
            <p className="text-gray-600 mb-6">Long-lasting gel polish that maintains shine and durability for weeks.</p>
            <div className="text-3xl font-bold text-purple-600">$45</div>
            <div className="text-sm text-gray-500 mt-2">60 minutes</div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold mb-4 text-pink-600">Nail Art Design</h3>
            <p className="text-gray-600 mb-6">Custom artistic designs tailored to your style and preferences.</p>
            <div className="text-3xl font-bold text-purple-600">$55+</div>
            <div className="text-sm text-gray-500 mt-2">75 minutes</div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Why Choose Us?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">1000+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-gray-600">Unique Designs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">5.0</div>
              <div className="text-gray-600">Star Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">3+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-12 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Nails?</h2>
          <p className="text-xl mb-8 opacity-90">Book your appointment today and experience the art of beautiful nails.</p>
          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-4 text-lg">
              <span>📞 +1 (555) 123-4567</span>
              <span>📧 hello@nailartgenius.com</span>
            </div>
            <div className="text-lg">
              📍 123 Beauty Avenue, Studio City, CA 90210
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}