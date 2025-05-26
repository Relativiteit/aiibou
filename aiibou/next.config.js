// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-node$": false,
      "sharp$": false,
      fs: false,
      path: false,
    }
    return config
  },
}

module.exports = nextConfig
