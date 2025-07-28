'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export default function LanguageSelector({ lang }) {
  const pathname = usePathname()
  
  const getLocalizedPath = (newLang) => {
    const segments = pathname.split('/').filter(Boolean)
    segments[0] = newLang
    return '/' + segments.join('/')
  }

  const currentLanguage = languages.find(l => l.code === lang)

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
        <span>{currentLanguage?.flag}</span>
        <span>{currentLanguage?.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((language) => (
            <Link
              key={language.code}
              href={getLocalizedPath(language.code)}
              className={`flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                language.code === lang ? 'bg-pink-50 text-pink-600' : 'text-gray-700'
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}