import Link from 'next/link'

export default function BookingCTA({ lang, dict }) {
  const features = [
    {
      icon: '📅',
      title: dict?.booking_cta?.online_booking || 'Book online easily',
      subtitle: 'and receive special benefits',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600'
    },
    {
      icon: '⚡',
      title: dict?.booking_cta?.quick_booking || 'Quick Booking',
      subtitle: 'Real-time confirmation',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      icon: '🎁',
      title: dict?.booking_cta?.special_benefits || 'Special Benefits',
      subtitle: 'Online booking discount',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    }
  ]

  return (
    <section className="py-16 bg-white border-t">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {dict?.booking_cta?.title || 'Premium Nail Service Booking'}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {dict?.booking_cta?.description || 'Experience perfect nail care with expert touch and innovative AI technology'}
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center mr-4`}>
                  <span className={feature.textColor}>{feature.icon}</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Link 
            href={`/${lang}/booking`}
            className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            {dict?.booking_cta?.book_appointment || 'Book Appointment'}
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            {dict?.booking_cta?.discount_notice || '* 10% discount for online bookings'}
          </p>
        </div>
      </div>
    </section>
  )
}