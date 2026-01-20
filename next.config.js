const { withWyw } = require("@wyw-in-js/nextjs");

/**
 * @type {import('next').NextConfig}
 */
const config = {
  typedRoutes: true,
  reactStrictMode: true,
  images: {
    loader: "custom",
  },
  // Bundle shiki instead of externalizing it (it's ESM-only)
  transpilePackages: ["shiki", "@shikijs/markdown-it"],
  experimental: {
    // Optimize barrel file imports for better tree-shaking
    optimizePackageImports: ["date-fns", "katex", "@shikijs/twoslash"],
  },
};

if (process.env.NEXT_EXPORT === "true") {
  config.output = "export";
}

module.exports = withWyw(config, {
  turbopackLoaderOptions: {
    features: { happyDOM: false },
    importOverrides: {
      "@babel/runtime/helpers/interopRequireDefault": { unknown: "allow" },
    },
  },
});
