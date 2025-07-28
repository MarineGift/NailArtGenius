import { getDictionary } from '@/lib/i18n/dictionaries'

export default async function AboutPage({ params }) {
  const { lang } = params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {dict?.about?.title || 'About Connie\'s Nail'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {dict?.about?.description || 'Professional nail care and beauty services with AI-powered design and multilingual support.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {dict?.about?.our_story || 'Our Story'}
            </h2>
            <p className="text-gray-600 mb-4">
              {dict?.about?.story_1 || 'Connie\'s Nail has been providing premium nail care services with a focus on quality, innovation, and customer satisfaction.'}
            </p>
            <p className="text-gray-600">
              {dict?.about?.story_2 || 'We combine traditional nail care techniques with cutting-edge AI technology to deliver personalized experiences for every client.'}
            </p>
          </div>
          
          <div className="bg-pink-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {dict?.about?.why_choose_us || 'Why Choose Us?'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                {dict?.about?.feature_1 || 'Professional nail technicians'}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                {dict?.about?.feature_2 || 'AI-powered nail art design'}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                {dict?.about?.feature_3 || 'Multilingual customer service'}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                {dict?.about?.feature_4 || 'Premium quality products'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}