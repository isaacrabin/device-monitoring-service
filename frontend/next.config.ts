import type { NextConfig } from 'next';

const backendUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'http://backend:8080';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/ws/:path*',
        destination: `${backendUrl}/ws/:path*`,
      },
    ];
  },
};

export default nextConfig;
