import { getDictionary } from '@/lib/i18n/dictionaries'
import Link from 'next/link'

export default async function ServicesPage({ params }) {
  const { lang } = params
  const dict = await getDictionary(lang)

  const services = [
    {
      id: 'classic-french',
      title: dict?.services?.classic_french || 'Classic French Manicure',
      price: '$45',
      description: dict?.services?.classic_french_desc || 'Traditional French manicure with elegant white tips',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop'
    },
    {
      id: 'ai-nail-art',
      title: dict?.services?.ai_nail_art?.title || 'AI Nail Art Generation',
      price: '$80',
      description: dict?.services?.ai_nail_art?.description || 'Custom AI-generated nail designs',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=300&fit=crop'
    },
    {
      id: 'spa-manicure',
      title: dict?.services?.spa_manicure?.title || 'Spa Manicure',
      price: '$65',
      description: dict?.services?.spa_manicure?.description || 'Relaxing spa treatment with premium nail care',
      image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618f?w=400&h=300&fit=crop'
    },
    {
      id: 'gel-polish',
      title: dict?.services?.gel_polish || 'Gel Polish',
      price: '$55',
      description: dict?.services?.gel_polish_desc || 'Long-lasting gel polish application',
      image: 'https://images.unsplash.com/photo-1606462146674-44d46b1b4f75?w=400&h=300&fit=crop'
    }
  ]

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {dict?.services?.title || 'Our Services'}
          </h1>
          <p className="text-xl text-gray-600">
            {dict?.services?.subtitle || 'Professional nail care and beauty treatments'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/${lang}/services/${service.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <span className="text-lg font-bold text-pink-600">
                    {service.price}
                  </span>
                </div>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}