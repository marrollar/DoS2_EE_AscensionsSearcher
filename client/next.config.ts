import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ascensions',
        permanent: true,
      },
    ]
  },

};

export default nextConfig;
