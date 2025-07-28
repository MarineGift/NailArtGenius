import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 지원하는 언어 목록
export const locales = ['ko', 'en', 'ja', 'es'] as const;
export type Locale = (typeof locales)[number];

// 언어별 이름 매핑
export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English', 
  ja: '日本語',
  es: 'Español'
};

// 기본 언어
export const defaultLocale: Locale = 'ko';

export default getRequestConfig(async ({ locale }) => {
  // 지원하지 않는 언어인 경우 404 페이지로 이동
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    // 해당 언어의 메시지 파일 로드
    messages: (await import(`../locales/${locale}.json`)).default
  };
});

// 현재 언어가 RTL(Right-to-Left)인지 확인
export function isRTL(locale: Locale): boolean {
  // 아랍어, 히브리어 등 RTL 언어 추가 시 여기에 포함
  return false;
}

// 언어별 폰트 클래스 반환
export function getFontClass(locale: Locale): string {
  switch (locale) {
    case 'ko':
      return 'font-korean';
    case 'ja':
      return 'font-japanese';
    default:
      return 'font-sans';
  }
}

// 언어별 날짜 형식
export function getDateFormat(locale: Locale): string {
  switch (locale) {
    case 'ko':
      return 'yyyy년 M월 d일';
    case 'ja': 
      return 'yyyy年M月d日';
    case 'es':
      return 'd/M/yyyy';
    default:
      return 'MMM d, yyyy';
  }
}