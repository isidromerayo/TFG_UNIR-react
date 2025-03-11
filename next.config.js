/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving from the public directory
  images: {
    unoptimized: true
  },
  // Configure static file serving
  assetPrefix: '',
  basePath: ''
}

module.exports = nextConfig
