import { getDictionary } from '@/lib/i18n/dictionaries'
import Link from 'next/link'

const serviceDetails = {
  'classic-french': {
    title: 'Classic French Manicure',
    price: '$45',
    duration: '60 minutes',
    description: 'Our signature French manicure service includes nail shaping, cuticle care, base coat, polish application, and white tip design.',
    includes: [
      'Nail shaping and filing',
      'Cuticle trimming and care',
      'Hand massage',
      'Base coat application',
      'French tip design',
      'Top coat finish'
    ],
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop'
  },
  'ai-nail-art': {
    title: 'AI Nail Art Generation',
    price: '$80',
    duration: '90 minutes',
    description: 'Revolutionary AI-powered nail art design service. Upload photos of your nails and let our AI create custom designs just for you.',
    includes: [
      'AI nail analysis',
      'Custom design generation',
      'Professional application',
      'High-quality materials',
      'Photo documentation',
      'Design consultation'
    ],
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=600&fit=crop'
  },
  'spa-manicure': {
    title: 'Spa Manicure',
    price: '$65',
    duration: '75 minutes',
    description: 'Relaxing spa manicure with premium treatments, including exfoliation, moisturizing, and therapeutic hand massage.',
    includes: [
      'Nail care and shaping',
      'Cuticle treatment',
      'Hand exfoliation',
      'Moisturizing treatment',
      'Relaxing hand massage',
      'Polish application'
    ],
    image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618f?w=800&h=600&fit=crop'
  },
  'gel-polish': {
    title: 'Gel Polish',
    price: '$55',
    duration: '60 minutes',
    description: 'Long-lasting gel polish application that provides chip-resistant color for up to 3 weeks.',
    includes: [
      'Nail preparation',
      'Base coat application',
      'Gel polish application',
      'UV light curing',
      'Top coat finish',
      'Hand moisturizing'
    ],
    image: 'https://images.unsplash.com/photo-1606462146674-44d46b1b4f75?w=800&h=600&fit=crop'
  }
}

export default async function ServiceDetailPage({ params }) {
  const { lang, slug } = params
  const dict = await getDictionary(lang)
  const service = serviceDetails[slug]

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <Link 
            href={`/${lang}/services`}
            className="text-pink-600 hover:text-pink-700"
          >
            Back to Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {service.title}
            </h1>
            
            <div className="flex items-center space-x-6 mb-6">
              <span className="text-2xl font-bold text-pink-600">
                {service.price}
              </span>
              <span className="text-gray-600">
                {service.duration}
              </span>
            </div>
            
            <p className="text-gray-600 mb-8">
              {service.description}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {dict?.service_detail?.includes || 'What\'s Included:'}
            </h3>
            <ul className="space-y-2 mb-8">
              {service.includes.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
            
            <div className="flex space-x-4">
              <Link
                href={`/${lang}/booking`}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                {dict?.service_detail?.book_now || 'Book Now'}
              </Link>
              <Link
                href={`/${lang}/services`}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium"
              >
                {dict?.service_detail?.back_to_services || 'Back to Services'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}