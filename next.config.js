const withLinaria = require("next-with-linaria");

/**
 * @type {import('next-with-linaria').LinariaConfig}
 */
const config = {
  experimental: {
    typedRoutes: true,
    webpackBuildWorker: true,
  },
  images: {
    loader: "custom",
  },
  reactStrictMode: true,
  swcMinify: true,
};

if (process.env.NEXT_EXPORT === "true") {
  config.output = "export";
}

module.exports = withLinaria(config);
