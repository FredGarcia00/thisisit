/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.pexels.com'],
    // Disable the built-in image optimization that uses sharp
    unoptimized: true,
  },
  // Explicitly exclude sharp from webpack bundling
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'sharp' on the client side
      config.resolve.alias = {
        ...config.resolve.alias,
        sharp: false
      };
    }
    return config;
  },
}

module.exports = nextConfig