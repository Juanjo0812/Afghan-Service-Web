import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.WORDPRESS_MEDIA_HOSTNAME || 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-router': path.resolve(__dirname, 'src/lib/react-router-shim.tsx'),
    }
    return config
  },
}

export default nextConfig
