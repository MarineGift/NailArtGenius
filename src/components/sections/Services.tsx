import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Dictionary, Locale } from '@/types/i18n'

interface ServicesProps {
  lang: Locale
  dict: Dictionary
}

export default function Services({ lang, dict }: ServicesProps) {
  const services = [
    {
      title: dict.services.manicure.title,
      description: dict.services.manicure.description,
      icon: '✨',
    },
    {
      title: dict.services.pedicure.title,
      description: dict.services.pedicure.description,
      icon: '🦶',
    },
    {
      title: dict.services.gelPolish.title,
      description: dict.services.gelPolish.description,
      icon: '💅',
    },
    {
      title: dict.services.nailArt.title,
      description: dict.services.nailArt.description,
      icon: '🎨',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {dict.services.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {dict.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4">{service.icon}</div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}