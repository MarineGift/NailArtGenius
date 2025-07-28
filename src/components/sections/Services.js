import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function Services({ lang, dict }) {
  const services = [
    {
      id: 'ai-nail-art',
      icon: '🎨',
      title: dict.services.aiNailArt.title,
      description: dict.services.aiNailArt.description,
      price: dict.services.aiNailArt.price,
      duration: dict.services.aiNailArt.duration,
    },
    {
      id: 'classic-manicure', 
      icon: '💅',
      title: dict.services.classicManicure.title,
      description: dict.services.classicManicure.description,
      price: dict.services.classicManicure.price,
      duration: dict.services.classicManicure.duration,
    },
    {
      id: 'gel-nails',
      icon: '✨',
      title: dict.services.gelNails.title,
      description: dict.services.gelNails.description,
      price: dict.services.gelNails.price,
      duration: dict.services.gelNails.duration,
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {dict.services.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {dict.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="text-center p-6">
              <div className="text-6xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-pink-600 font-semibold">{service.price}</span>
                <span className="text-gray-500">{service.duration}</span>
              </div>
              <Button variant="primary" size="sm" className="w-full">
                {dict.hero.bookNow}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}