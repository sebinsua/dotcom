const packageJson = require("./package.json");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: packageJson.blog.siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
};
