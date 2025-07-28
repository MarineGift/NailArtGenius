import { Clock, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer({ lang, dict }) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">💅</span>
              </div>
              <h3 className="text-xl font-bold">Connie's Nail</h3>
            </div>
            <p className="text-gray-400 mb-4">{dict?.footer?.location || 'Washington, DC'}</p>
          </div>
          
          {/* Business Hours */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {dict?.footer?.business_hours || 'Business Hours'}
            </h4>
            <p className="text-gray-400">{dict?.footer?.weekdays || 'Monday - Friday'}</p>
            <p className="text-gray-400">{dict?.footer?.hours || '10:00 AM - 7:00 PM'}</p>
            <p className="text-gray-400 mt-2">{dict?.footer?.weekend || 'Saturday - Sunday'}</p>
            <p className="text-gray-400">{dict?.footer?.closed || 'Closed'}</p>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{dict?.footer?.contact_info || 'Contact Information'}</h4>
            <p className="text-gray-400 flex items-center mb-2">
              <Phone className="w-4 h-4 mr-2" />
              202.898.0826
            </p>
            <p className="text-gray-400 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Sungimconniekim@gmail.com
            </p>
          </div>
          
          {/* Address */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {dict?.footer?.address || 'Address'}
            </h4>
            <p className="text-gray-400">1300 Pennsylvania Avenue NW</p>
            <p className="text-gray-400">Washington, DC 20004</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {dict?.footer?.copyright || '© 2025 Connie\'s Nail. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}