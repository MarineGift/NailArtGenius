/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker 배포를 위한 필수 설정
  output: 'standalone',
  
  // 성능 최적화
  poweredByHeader: false,
  compress: true,
  
  // Docker 환경에서 이미지 최적화
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 환경변수 설정
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // TypeScript 설정
  typescript: {
    // 개발 중에만 에러 무시 (프로덕션에서는 체크)
    ignoreBuildErrors: false,
  },
  
  // ESLint 설정
  eslint: {
    // 개발 중에만 에러 무시 (프로덕션에서는 체크)
    ignoreDuringBuilds: false,
  },
  
  // 실험적 기능
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // 웹팩 설정 (Docker 최적화)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Docker 환경에서의 파일 감시 최적화
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    
    // 프로덕션 빌드 최적화
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
              priority: 40,
              enforce: true,
            },
          },
        },
      }
    }
    
    return config
  },
  
  // 헤더 설정 (보안)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig