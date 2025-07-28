'use client'

import { useRouter, usePathname } from 'next/navigation'
import { localeNames, localeFlags, i18n } from '@/lib/i18n/config'

export default function LanguageSelector({ currentLang }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLang) => {
    // Remove current language from pathname and add new one
    const segments = pathname.split('/').filter(Boolean)
    if (i18n.locales.includes(segments[0])) {
      segments[0] = newLang
    } else {
      segments.unshift(newLang)
    }
    
    const newPathname = '/' + segments.join('/')
    router.push(newPathname)
  }

  return (
    <div className="relative">
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="text-sm border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        {i18n.locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeFlags[locale]} {localeNames[locale]}
          </option>
        ))}
      </select>
    </div>
  )
}