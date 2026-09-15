import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Product-image uploads run through a server action; the default 1 MB body
    // cap would reject anything but a tiny photo, so allow up to 10 MB to match
    // the storage bucket's per-file limit.
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
