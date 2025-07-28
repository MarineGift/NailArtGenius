/** @type {import('next').NextConfig} */
const nextConfig = {
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
}

export default nextConfig;