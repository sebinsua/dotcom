const withLinaria = require("next-with-linaria");

/**
 * @type {import('next-with-linaria').LinariaConfig}
 */
const config = {
  images: {
    loader: "custom",
  },
};

module.exports = withLinaria(config);
