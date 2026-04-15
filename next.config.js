/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com', // ✅ covers ALL subdomains
      },
    ],
  },
};

module.exports = nextConfig;