/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'shortner-dev.codeui.com',
    'shortner-dev.higher-up.com.br',
  ],
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.API_URL}/api/auth/:path*`,
      },
    ]
  },
}

export default nextConfig
