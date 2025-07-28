import Link from 'next/link'

export default async function ContactPage({ params }) {
  const { lang } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Link 
            href={`/${lang}`}
            className="inline-block bg-pink-600 text-white px-4 py-2 rounded-lg mb-6 hover:bg-pink-700 transition-colors"
          >
            ← {lang === 'ko' ? '홈으로' : 'Back to Home'}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {lang === 'ko' ? '연락처' : 'Contact Us'}
          </h1>
          <p className="text-xl text-gray-600">
            {lang === 'ko' 
              ? '문의사항이나 예약을 원하시면 연락주세요'
              : 'Get in touch with us for inquiries or bookings'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">
              {lang === 'ko' ? '연락처 정보' : 'Contact Information'}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="text-2xl mr-4">📍</div>
                <div>
                  <h3 className="font-semibold">{lang === 'ko' ? '주소' : 'Address'}</h3>
                  <p className="text-gray-600">123 Beauty Street, Seoul, Korea</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="text-2xl mr-4">📞</div>
                <div>
                  <h3 className="font-semibold">{lang === 'ko' ? '전화번호' : 'Phone'}</h3>
                  <p className="text-gray-600">+82-2-1234-5678</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="text-2xl mr-4">✉️</div>
                <div>
                  <h3 className="font-semibold">{lang === 'ko' ? '이메일' : 'Email'}</h3>
                  <p className="text-gray-600">contact@connienail.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="text-2xl mr-4">🕒</div>
                <div>
                  <h3 className="font-semibold">{lang === 'ko' ? '운영시간' : 'Hours'}</h3>
                  <p className="text-gray-600">
                    {lang === 'ko' ? '월-토: 10:00-20:00' : 'Mon-Sat: 10:00-20:00'}<br />
                    {lang === 'ko' ? '일: 11:00-18:00' : 'Sun: 11:00-18:00'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">
              {lang === 'ko' ? '문의하기' : 'Send Message'}
            </h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ko' ? '이름' : 'Name'}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={lang === 'ko' ? '이름을 입력해주세요' : 'Enter your name'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ko' ? '이메일' : 'Email'}
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={lang === 'ko' ? '이메일을 입력해주세요' : 'Enter your email'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ko' ? '전화번호' : 'Phone'}
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={lang === 'ko' ? '전화번호를 입력해주세요' : 'Enter your phone'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ko' ? '메시지' : 'Message'}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={lang === 'ko' ? '문의 내용을 입력해주세요' : 'Enter your message'}
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
              >
                {lang === 'ko' ? '메시지 보내기' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}