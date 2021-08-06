"use strict";

const fs = require("fs");
const RSS = require("rss");
const path = require("path");
const matter = require("gray-matter");

// -- Inlined from `lib/render-markdown.js` --
const util = require("util");
const remark = require("remark");
const html = require("remark-html");
const { default: remarkShikiTwoSlash } = require("remark-shiki-twoslash");

const render = util.promisify(
  remark().use(remarkShikiTwoSlash).use(html).process
);

async function renderMarkdown(markdown) {
  const { contents } = await render(markdown);
  return contents;
}
// -- Inlined from `lib/render-markdown.js` --

const { blog } = require("../package.json");

const getPosts = () => {
  let dir;
  try {
    dir = fs.readdirSync(path.resolve(__dirname, "../posts/"));
  } catch (err) {
    // No posts.
    return [];
  }

  return dir
    .filter((file) => path.extname(file) === ".md")
    .map((file) => {
      const postContent = fs.readFileSync(`./posts/${file}`, "utf8");
      const { data, content } = matter(postContent);
      return { ...data, body: content };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

const main = async () => {
  const feed = new RSS({
    title: blog.title,
    site_url: blog.siteUrl,
    feed_url: `${blog.siteUrl}/feed.xml`,
    language: "en",
  });

  const posts = getPosts();

  await Promise.all(
    posts.map(async (post) => {
      const url = `${blog.siteUrl}/${post.slug}`;

      const description = await renderMarkdown(post.body);
      feed.item({
        url,
        guid: url,
        title: post.title,
        description,
        date: new Date(post.date),
        author: blog.author,
      });
    })
  );

  const rss = feed.xml({ indent: true });
  fs.writeFileSync(path.join(__dirname, "../public/feed.xml"), rss);
};

main();
