import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname:
          '/heurist-network/heurist-agent-framework/refs/heads/main/mesh/images/**',
      },
    ],
  },
};

export default nextConfig;
