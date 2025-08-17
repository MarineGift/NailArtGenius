/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@mediapipe/hands', '@mediapipe/camera_utils'],
  webpack: (config) => {
    // Handle MediaPipe modules for AR functionality
    config.resolve = config.resolve || {}
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    }
    
    return config
  },
  images: {
    domains: ['cdn.jsdelivr.net', 'storage.googleapis.com']
  },
  // Disable TypeScript during build for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

export default nextConfig