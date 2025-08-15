import { Dictionary, Locale } from '@/types/i18n'

const dictionaries = {
  ko: () => import('@/lib/i18n/locales/ko.json').then((module) => module.default),
  en: () => import('@/lib/i18n/locales/en.json').then((module) => module.default),
  ja: () => import('@/lib/i18n/locales/ja.json').then((module) => module.default),
  es: () => import('@/lib/i18n/locales/es.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const dict = await dictionaries[locale]()
  return dict as Dictionary
}