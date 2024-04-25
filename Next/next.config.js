/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/question/valorant-coaches/:slug",
        destination:
          "/question/valorant-coaches/hire-freelance-valorant-coach/:slug",
        permanent: true,
      },
      {
        source: "/question/anime-artists/:slug",
        destination:
          "/question/anime-artists/hire-freelance-anime-artist/:slug",
        permanent: true,
      },
      {
        source: "/question/spanish-tutors/:slug",
        destination:
          "/question/spanish-tutors/hire-freelance-spanish-teacher/:slug",
        permanent: true,
      },
      {
        source: "/question/apex-legends-coaches/:slug",
        destination:
          "/question/apex-legends-coaches/freelance-apex-legends-coach/:slug",
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;

const { withSentryConfig } = require("@sentry/nextjs");
if (process.env.NODE_ENV === "production") {
  module.exports = withSentryConfig(
    module.exports,
    {
      silent: true,
      org: "vaekra-media",
      project: "javascript-nextjs",
    },
    {
      widenClientFileUpload: true,
      transpileClientSDK: true,
      tunnelRoute: "/monitoring",
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    }
  );
}
