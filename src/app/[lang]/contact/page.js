export default async function ContactPage({ params }) {
  const { lang } = await params

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our services? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
              >
                Send Inquiry
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Business Hours</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday</span>
                  <span>10:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday - Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Phone</h4>
                  <a href="tel:202.898.0826" className="text-pink-600 hover:text-pink-700">
                    202.898.0826
                  </a>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <a href="mailto:Sungimconniekim@gmail.com" className="text-pink-600 hover:text-pink-700">
                    Sungimconniekim@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Visit Our Salon
            </h2>
            <p className="text-xl text-gray-600">
              Find us easily with our convenient location in Washington, DC
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-pink-50 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Location & Contact</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600">
                      1300 Pennsylvania Avenue NW, Washington, DC 20004
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                    <a href="tel:202.898.0826" className="text-pink-600 hover:text-pink-700">
                      202.898.0826
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Business Hours</h4>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 10:00 AM - 7:00 PM</p>
                      <p>Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-pink-200">
                  <button className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                    Get Directions
                  </button>
                  <button className="w-full mt-3 border border-pink-600 text-pink-600 py-3 px-6 rounded-lg font-semibold hover:bg-pink-50 transition-colors">
                    Open in Google Maps
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connie's Nail</h3>
                <p className="text-gray-600 mb-8">Washington, DC</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Transportation Options</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-900">By Car</h5>
                      <p className="text-gray-600 text-sm">
                        Convenient parking available nearby. Use GPS navigation for the most efficient route.
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900">Public Transit</h5>
                      <p className="text-gray-600 text-sm">
                        Accessible via Metro. Check local transit schedules for the most up-to-date information.
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900">Need Help?</h5>
                      <p className="text-gray-600 text-sm">
                        Call us if you need directions or have questions about finding our location.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}