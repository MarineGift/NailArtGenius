import 'server-only'

const dictionaries = {
  ko: () => import('@/../../public/locales/ko/common.json').then((module) => module.default),
  en: () => import('@/../../public/locales/en/common.json').then((module) => module.default),
  ja: () => import('@/../../public/locales/ja/common.json').then((module) => module.default),
  es: () => import('@/../../public/locales/es/common.json').then((module) => module.default),
}

export const getDictionary = async (locale) => {
  return dictionaries[locale]?.() ?? dictionaries.ko()
}