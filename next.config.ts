// Static export config for Timeweb FTP hosting (no image optimization server).

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  agentRules: false,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
