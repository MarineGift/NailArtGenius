import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

// 다국어 미들웨어 설정
const intlMiddleware = createMiddleware({
  // 지원하는 언어 목록
  locales: ['ko', 'en', 'ja', 'es'],
  // 기본 언어
  defaultLocale: 'ko',
  // URL에 기본 언어 표시 여부
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  // 관리자 페이지 접근 제어
  if (request.nextUrl.pathname.includes('/admin')) {
    // 인증 확인 로직 (필요시 추가)
  }
  
  return intlMiddleware(request);
}

export const config = {
  // 미들웨어가 실행될 경로 설정
  matcher: [
    // 모든 경로에서 실행하되, API, static 파일, images 등은 제외
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // API 경로에서도 i18n 지원이 필요한 경우
    '/api/(.*)'
  ]
};