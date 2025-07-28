import { getDictionary } from '@/lib/i18n/dictionaries'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default async function ContactPage({ params }) {
  const { lang } = params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {dict?.contact?.title || 'Contact Us'}
          </h1>
          <p className="text-xl text-gray-600">
            {dict?.contact?.subtitle || 'Get in touch with us for appointments and inquiries'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {dict?.contact?.get_in_touch || 'Get in Touch'}
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-pink-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {dict?.contact?.phone || 'Phone'}
                  </h3>
                  <p className="text-gray-600">202.898.0826</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-pink-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {dict?.contact?.email || 'Email'}
                  </h3>
                  <p className="text-gray-600">Sungimconniekim@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-pink-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {dict?.contact?.address || 'Address'}
                  </h3>
                  <p className="text-gray-600">
                    1300 Pennsylvania Avenue NW<br />
                    Washington, DC 20004
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-6 h-6 text-pink-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {dict?.contact?.hours || 'Business Hours'}
                  </h3>
                  <p className="text-gray-600">
                    {dict?.footer?.weekdays || 'Monday - Friday'}: {dict?.footer?.hours || '10:00 AM - 7:00 PM'}<br />
                    {dict?.footer?.weekend || 'Saturday - Sunday'}: {dict?.footer?.closed || 'Closed'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {dict?.contact?.send_message || 'Send us a Message'}
            </h2>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict?.contact?.name || 'Name'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder={dict?.contact?.name_placeholder || 'Your name'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict?.contact?.email || 'Email'}
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder={dict?.contact?.email_placeholder || 'your@email.com'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict?.contact?.phone || 'Phone'}
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder={dict?.contact?.phone_placeholder || 'Your phone number'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict?.contact?.message || 'Message'}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder={dict?.contact?.message_placeholder || 'How can we help you?'}
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {dict?.contact?.send_message || 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}