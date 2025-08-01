import Link from 'next/link'

export default function AIFeatures({ lang, dict }) {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            🤖 {dict?.ai_features?.title || 'AI Nail Art - Revolutionary Nail Art Service'}
          </h3>
          <p className="text-lg text-gray-700 mb-6 max-w-4xl mx-auto">
            {dict?.ai_features?.description || 
              `Register your nails → select nail art design → payment → visit date process. 
              Connie's Nail AI analyzes your nails and pre-creates your selected nail art design, 
              dramatically reducing treatment time and cost during your visit.`
            }
          </p>
          <Link 
            href={`/${lang}/ai-nail-art`}
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
          >
            ✨ {dict?.ai_features?.go_to_ai || 'Go to AI Nail Art'}
          </Link>
        </div>
      </div>
    </section>
  )
}