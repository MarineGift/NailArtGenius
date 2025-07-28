/**
 * Application configuration
 */

module.exports = {
  app: {
    name: "Connie's Nail",
    description: "Multilingual nail salon website with AI-powered features",
    version: "1.0.0",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  },
  
  i18n: {
    defaultLanguage: 'ko',
    supportedLanguages: ['ko', 'en', 'ja', 'es'],
    locales: {
      ko: { name: '한국어', flag: '🇰🇷' },
      en: { name: 'English', flag: '🇺🇸' },
      ja: { name: '日本語', flag: '🇯🇵' },
      es: { name: 'Español', flag: '🇪🇸' }
    }
  },
  
  features: {
    aiNailArt: true,
    onlineBooking: true,
    multiLanguage: true,
    pwn: true
  },
  
  api: {
    timeout: 10000,
    retries: 3
  },
  
  social: {
    instagram: "https://instagram.com/connienail",
    facebook: "https://facebook.com/connienail",
    kakao: "https://pf.kakao.com/connienail"
  }
};