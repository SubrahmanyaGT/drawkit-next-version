// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

module.exports = {
  async rewrites() {
    return [
      {
        source: '/plans',
        destination: '/membership/plans',
      },
      {
        source: '/:slug',
        destination: 'https://drawkit-v2.webflow.io/:slug',
      },
      {
        source: '/blog/:slug',
        destination: 'https://drawkit-v2.webflow.io/blog/:slug',
      },
      
    ]
  },


    eslint: {
      ignoreDuringBuilds: true,
    },
  
}