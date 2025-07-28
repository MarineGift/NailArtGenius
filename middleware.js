import { NextResponse } from 'next/server';

// Supported languages
const locales = ['ko', 'en', 'ja', 'es'];
const defaultLocale = 'ko';

// Get locale from pathname
function getLocale(pathname) {
  const segments = pathname.split('/');
  const locale = segments[1];
  return locales.includes(locale) ? locale : null;
}

// Get preferred locale from Accept-Language header
function getPreferredLocale(request) {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [locale, q = '1'] = lang.trim().split(';q=');
      return { locale: locale.toLowerCase(), q: parseFloat(q) };
    })
    .sort((a, b) => b.q - a.q);

  // Find first supported language
  for (const { locale } of languages) {
    for (const supportedLocale of locales) {
      if (locale.startsWith(supportedLocale)) {
        return supportedLocale;
      }
    }
  }

  return defaultLocale;
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const currentLocale = getLocale(pathname);

  // If no locale in pathname, redirect to preferred locale
  if (!currentLocale) {
    const preferredLocale = getPreferredLocale(request);
    const redirectUrl = new URL(`/${preferredLocale}${pathname}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Continue with current locale
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};