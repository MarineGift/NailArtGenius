export default async function ServicesPage({ params }) {
  const { lang } = await params

  const services = [
    {
      id: 'classic-french',
      emoji: '💅',
      category: 'classic',
      price: '$45',
      title: 'Classic French Manicure',
      description: 'Traditional French manicure style',
      rating: '4.8',
      reviews: '127',
      duration: '45min'
    },
    {
      id: 'floral-design',
      emoji: '🌸',
      category: 'floral',
      price: '$65',
      title: 'Floral Design',
      description: 'Delicate floral nail art',
      rating: '4.9',
      reviews: '89',
      duration: '90min'
    },
    {
      id: 'geometric',
      emoji: '⚡',
      category: 'modern',
      price: '$55',
      title: 'Geometric Pattern',
      description: 'Modern geometric patterns',
      rating: '4.7',
      reviews: '156',
      duration: '60min'
    },
    {
      id: 'glitter',
      emoji: '✨',
      category: 'glamour',
      price: '$70',
      title: 'Glitter & Sparkle',
      description: 'Glamorous glitter nail art',
      rating: '4.6',
      reviews: '92',
      duration: '75min'
    },
    {
      id: 'minimalist',
      emoji: '🤍',
      category: 'minimalist',
      price: '$40',
      title: 'Minimalist Style',
      description: 'Simple and sophisticated minimal design',
      rating: '4.8',
      reviews: '134',
      duration: '30min'
    },
    {
      id: 'seasonal',
      emoji: '🍂',
      category: 'seasonal',
      price: '$60',
      title: 'Seasonal Design',
      description: 'Special seasonal designs',
      rating: '4.7',
      reviews: '78',
      duration: '60min'
    },
    {
      id: 'wedding',
      emoji: '💍',
      category: 'wedding',
      price: '$80',
      title: 'Wedding Special',
      description: 'Elegant nail art for weddings',
      rating: '4.9',
      reviews: '45',
      duration: '90min'
    },
    {
      id: 'ombre',
      emoji: '🌈',
      category: 'gradient',
      price: '$65',
      title: 'Ombre Effect',
      description: 'Soft gradient effects',
      rating: '4.7',
      reviews: '103',
      duration: '60min'
    },
    {
      id: '3d-art',
      emoji: '🎨',
      category: '3d',
      price: '$90',
      title: '3D Art Design',
      description: 'Three-dimensional nail art',
      rating: '4.8',
      reviews: '67',
      duration: '120min'
    }
  ]

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💅 Professional Nail Art Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our premium collection of nail art designs, each crafted with precision and care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg border hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl">{service.emoji}</div>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {service.category}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-pink-600">{service.price}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>⭐ {service.rating}({service.reviews})</span>
                  <span>⏱️ {service.duration}</span>
                </div>
                
                <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}