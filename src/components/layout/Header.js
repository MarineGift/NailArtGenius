import Link from 'next/link'
import LanguageSelector from './LanguageSelector'

export default function Header({ lang, dict }) {
  const navigation = [
    { name: dict.nav.home, href: `/${lang}` },
    { name: dict.nav.services, href: `/${lang}/services` },
    { name: dict.nav.about, href: `/${lang}/about` },
    { name: dict.nav.contact, href: `/${lang}/contact` },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href={`/${lang}`} className="flex items-center">
              <span className="text-2xl font-bold text-pink-600">
                Connie's Nail
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-900 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSelector lang={lang} />
            <Link
              href={`/${lang}/contact`}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition-colors"
            >
              {dict.nav.booking}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}