// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

module.exports = {
  async rewrites() {
    return [
      // {
      //   source: '/:slug',
      //   destination: '/illustrations/:slug',
      // },
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
  async redirects() {
    return [
      {
        source: '/illustration-types/:slug',
        destination: '/illustrations/:slug',
        permanent: false,
      },
      {
        source: '/illustration-categories/:slug',
        destination: '/illustrations/:slug',
        permanent: false,
      },
      {
        source: '/single-illustrations/:slug',
        destination: '/illustrations/:slug',
        permanent: false,
      },
    ]
  },


    eslint: {
      ignoreDuringBuilds: true,
    },
  
}