import { Star } from 'lucide-react'

export default function Services({ lang, dict }) {
  const services = [
    {
      icon: '🌸',
      title: dict?.services?.spa_manicure?.title || 'Spa Manicure',
      description: dict?.services?.spa_manicure?.description || 'Perfect nail care with premium spa treatment',
      bgColor: 'bg-pink-100'
    },
    {
      icon: '📱',
      title: dict?.services?.ai_nail_art?.title || 'AI Nail Art Generation',
      description: dict?.services?.ai_nail_art?.description || 'AI creates unique personalized nail designs just for you',
      bgColor: 'bg-blue-100'
    },
    {
      icon: '✂️',
      title: dict?.services?.waxing?.title || 'Professional Waxing',
      description: dict?.services?.waxing?.description || 'Professional waxing care services from face to full body',
      bgColor: 'bg-purple-100'
    },
    {
      icon: '💆',
      title: dict?.services?.massage?.title || 'Massage Therapy',
      description: dict?.services?.massage?.description || 'Complete relaxation for body and mind with comfortable chair massage',
      bgColor: 'bg-green-100'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-pink-500 mr-2" />
            <span className="text-pink-500 font-medium">💅</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {dict?.services?.title || "Connie's Nail Premium Services"}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            From traditional nail care to innovative AI nail art, <span className="text-pink-600 font-semibold">perfect beauty care experience</span> awaits you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="service-card text-center bg-white rounded-lg p-6 shadow-sm border hover:shadow-md">
              <div className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{service.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}