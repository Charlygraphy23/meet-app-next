/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.icons8.com'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
}

module.exports = nextConfig
