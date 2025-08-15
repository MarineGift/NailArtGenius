'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { Locale } from '@/types/i18n'

interface LanguageSelectorProps {
  currentLang: Locale
}

const languages = {
  ko: { name: '한국어', flag: '🇰🇷' },
  en: { name: 'English', flag: '🇺🇸' },
  ja: { name: '日本語', flag: '🇯🇵' },
  es: { name: 'Español', flag: '🇪🇸' },
}

export default function LanguageSelector({ currentLang }: LanguageSelectorProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLanguageChange = (newLang: Locale) => {
    // Replace the current language in the path with the new one
    const pathWithoutLang = pathname.replace(`/${currentLang}`, '')
    const newPath = `/${newLang}${pathWithoutLang}`
    router.push(newPath)
  }

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
        <Globe size={16} />
        <span className="hidden sm:inline">{languages[currentLang].flag}</span>
        <span className="hidden sm:inline">{languages[currentLang].name}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {Object.entries(languages).map(([lang, info]) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang as Locale)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                currentLang === lang ? 'bg-pink-50 text-pink-600' : 'text-gray-700'
              }`}
            >
              <span>{info.flag}</span>
              <span>{info.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}