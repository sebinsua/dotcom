const withLinaria = require("next-with-linaria");

/**
 * @type {import('next-with-linaria').LinariaConfig}
 */
const config = {
  output: "export",
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  images: {
    loader: "custom",
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withLinaria(config);
