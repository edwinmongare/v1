/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "stateoforigin.oyostate.gov.ng",
      },
    ],
  },
  swcMinify: false, // Disable SWC minification
  experimental: {
    swcLoader: false, // Disable SWC loader
  },
  pageExtensions: ["ts", "tsx"],
};

module.exports = nextConfig;
