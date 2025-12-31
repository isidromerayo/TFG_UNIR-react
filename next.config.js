/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving from the public directory
  images: {
    unoptimized: true
  },
  // Configure static file serving
  assetPrefix: '',
  basePath: '',
  // Fix workspace root detection warning
  outputFileTracingRoot: __dirname
}

module.exports = nextConfig
