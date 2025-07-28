import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // locale 기본값 및 유효성 검사
  const supportedLocales = ['ko', 'en', 'ja', 'es'];
  const validLocale = supportedLocales.includes(locale) ? locale : 'ko';
  
  console.log('Loading locale:', validLocale);
  
  try {
    const messages = await import(`../locales/${validLocale}.json`);
    return { 
      messages: messages.default,
      locale: validLocale
    };
  } catch (error) {
    console.log(`Loading fallback for locale: ${locale}`, error);
    const messages = await import(`../locales/ko.json`);
    return { 
      messages: messages.default,
      locale: 'ko'
    };
  }
});