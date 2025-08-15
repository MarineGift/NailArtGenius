import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Dictionary, Locale } from '@/types/i18n'

interface AIFeaturesProps {
  lang: Locale
  dict: Dictionary
}

export default function AIFeatures({ lang, dict }: AIFeaturesProps) {
  const features = [
    {
      title: dict.ai.feature1.title,
      description: dict.ai.feature1.description,
      icon: '🤖',
    },
    {
      title: dict.ai.feature2.title,
      description: dict.ai.feature2.description,
      icon: '📱',
    },
    {
      title: dict.ai.feature3.title,
      description: dict.ai.feature3.description,
      icon: '📊',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {dict.ai.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {dict.ai.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}