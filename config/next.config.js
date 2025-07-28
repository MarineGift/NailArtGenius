/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ko',
        permanent: true,
      },
    ]
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  i18n: {
    locales: ['ko', 'en', 'ja', 'es'],
    defaultLocale: 'ko',
  },
}

module.exports = nextConfig