// Dictionary loader for i18n
export async function getDictionary(locale) {
  const dictionaries = {
    ko: () => import('./dictionaries/ko.json').then((module) => module.default),
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    ja: () => import('./dictionaries/ja.json').then((module) => module.default),
    es: () => import('./dictionaries/es.json').then((module) => module.default),
  };

  return dictionaries[locale]?.() ?? dictionaries.ko();
}