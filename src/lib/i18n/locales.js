export const supportedLocales = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
]

export const defaultLocale = 'ko'

export function getLocaleInfo(code) {
  return supportedLocales.find(locale => locale.code === code) || supportedLocales[0]
}