import Link from 'next/link'

export default async function AboutPage({ params }) {
  const { lang } = await params

  const content = {
    ko: {
      title: '소개',
      subtitle: 'Connie\'s Nail에 대해 알아보세요',
      mission: '우리의 미션',
      missionText: '최신 AI 기술과 전문적인 네일 케어 서비스를 통해 고객님의 아름다움을 극대화합니다.',
      story: '우리의 이야기',
      storyText: '2020년 설립된 Connie\'s Nail은 전통적인 네일 케어와 최신 기술을 결합하여 독특하고 혁신적인 서비스를 제공합니다.',
      values: '우리의 가치',
      team: '팀 소개'
    },
    en: {
      title: 'About Us',
      subtitle: 'Learn more about Connie\'s Nail',
      mission: 'Our Mission',
      missionText: 'We maximize your beauty through cutting-edge AI technology and professional nail care services.',
      story: 'Our Story',
      storyText: 'Founded in 2020, Connie\'s Nail combines traditional nail care with the latest technology to provide unique and innovative services.',
      values: 'Our Values',
      team: 'Meet Our Team'
    },
    ja: {
      title: 'About Us',
      subtitle: 'コニーネイルについて',
      mission: '私たちのミッション',
      missionText: '最新のAI技術とプロフェッショナルなネイルケアサービスを通じて、お客様の美しさを最大化します。',
      story: '私たちのストーリー',
      storyText: '2020年に設立されたコニーネイルは、伝統的なネイルケアと最新技術を組み合わせて、ユニークで革新的なサービスを提供しています。',
      values: '私たちの価値観',
      team: 'チーム紹介'
    },
    es: {
      title: 'Nosotros',
      subtitle: 'Conoce más sobre Connie\'s Nail',
      mission: 'Nuestra Misión',
      missionText: 'Maximizamos tu belleza a través de tecnología de IA de vanguardia y servicios profesionales de cuidado de uñas.',
      story: 'Nuestra Historia',
      storyText: 'Fundado en 2020, Connie\'s Nail combina el cuidado tradicional de uñas con la última tecnología para brindar servicios únicos e innovadores.',
      values: 'Nuestros Valores',
      team: 'Conoce Nuestro Equipo'
    }
  }

  const pageContent = content[lang] || content.ko

  const values = [
    {
      icon: '🎨',
      title: lang === 'ko' ? '창의성' : 'Creativity',
      description: lang === 'ko' 
        ? 'AI 기술을 활용한 독창적인 네일 디자인'
        : 'Unique nail designs using AI technology'
    },
    {
      icon: '⭐',
      title: lang === 'ko' ? '품질' : 'Quality',
      description: lang === 'ko'
        ? '최고급 제품만을 사용하는 프리미엄 서비스'
        : 'Premium service using only the finest products'
    },
    {
      icon: '❤️',
      title: lang === 'ko' ? '고객 만족' : 'Customer Satisfaction',
      description: lang === 'ko'
        ? '고객의 만족을 최우선으로 하는 서비스'
        : 'Service that prioritizes customer satisfaction'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Link 
            href={`/${lang}`}
            className="inline-block bg-pink-600 text-white px-4 py-2 rounded-lg mb-6 hover:bg-pink-700 transition-colors"
          >
            ← {lang === 'ko' ? '홈으로' : 'Back to Home'}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {pageContent.title}
          </h1>
          <p className="text-xl text-gray-600">
            {pageContent.subtitle}
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">{pageContent.mission}</h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            {pageContent.missionText}
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">{pageContent.story}</h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            {pageContent.storyText}
          </p>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-8 text-center">{pageContent.values}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-8 text-center">{pageContent.team}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                👩‍💼
              </div>
              <h3 className="text-lg font-semibold mb-2">Connie</h3>
              <p className="text-gray-600">
                {lang === 'ko' ? '대표 및 수석 네일 아티스트' : 'CEO & Lead Nail Artist'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                👩‍🎨
              </div>
              <h3 className="text-lg font-semibold mb-2">Sarah</h3>
              <p className="text-gray-600">
                {lang === 'ko' ? 'AI 디자인 전문가' : 'AI Design Specialist'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                👩‍💻
              </div>
              <h3 className="text-lg font-semibold mb-2">Emma</h3>
              <p className="text-gray-600">
                {lang === 'ko' ? '고객 서비스 매니저' : 'Customer Service Manager'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}