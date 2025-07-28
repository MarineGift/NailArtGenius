export const routes = {
  home: '/',
  about: '/about',
  services: '/services',
  contact: '/contact',
  booking: '/booking',
  gallery: '/gallery',
  aiNailArt: '/ai-nail-art'
}

export function getLocalizedRoute(route, locale) {
  return `/${locale}${route}`
}

export const navigationItems = [
  { key: 'home', route: routes.home },
  { key: 'services', route: routes.services },
  { key: 'booking', route: routes.booking },
  { key: 'gallery', route: routes.gallery },
  { key: 'ai_nail_art', route: routes.aiNailArt },
  { key: 'contact', route: routes.contact }
]