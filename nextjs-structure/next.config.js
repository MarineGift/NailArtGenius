const withNextIntl = require('next-intl/plugin')('./lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'your-supabase-project.supabase.co',
      'images.unsplash.com',
      'unsplash.com'
    ],
  },
  // Railway 배포 최적화
  output: 'standalone',
  // 환경 변수 설정
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // 빌드 최적화
  swcMinify: true,
  compress: true,
};

module.exports = withNextIntl(nextConfig);