// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig
const fs = require('fs');
module.exports = {
  env: {
    rawJsFromFile: fs.readFileSync('./rawJsFromFile.js').toString()
  },
  async rewrites() {
    return [

      // {
      //   source: "/:slug",
      //   destination: "https://drawkit-v2.webflow.io/:slug",
      // },
      // {
      //   source: "/blog/:slug",
      //   destination: "https://drawkit-v2.webflow.io/blog/:slug",
      // },
    ];
  },
  async redirects() {
    return [
      {
        source: "/illustration-types/:slug",
        destination: "/illustrations/:slug",
        permanent: true,
      },
      {
        source: "/illustration-categories/:slug",
        destination: "/illustrations/:slug",
        permanent: true,
      },
      {
        source: "/single-illustrations/:slug",
        destination: "/illustrations/:slug",
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
