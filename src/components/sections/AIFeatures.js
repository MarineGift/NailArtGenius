export default function AIFeatures({ lang, dict }) {
  const features = [
    {
      icon: '🎨',
      title: dict.ai.features.design.title,
      description: dict.ai.features.design.description,
    },
    {
      icon: '🌈',
      title: dict.ai.features.color.title,
      description: dict.ai.features.color.description,
    },
    {
      icon: '📈',
      title: dict.ai.features.trend.title,
      description: dict.ai.features.trend.description,
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {dict.ai.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {dict.ai.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}