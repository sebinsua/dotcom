import * as path from "path";
import * as fs from "fs-extra";
import RSS from "rss";

import { getPosts } from "@lib/getPosts";
import { renderMarkdown } from "@lib/renderMarkdown";

import packageJson from "../package.json";

const feedPath = path.join(__dirname, "../public/feed.xml");

async function createRss() {
  const feed = new RSS({
    title: packageJson.blog.title,
    site_url: packageJson.blog.siteUrl,
    feed_url: `${packageJson.blog.siteUrl}/feed.xml`,
    language: "en",
  });

  const posts = await getPosts();

  await Promise.all(
    posts.map(async (post) => {
      const url = `${packageJson.blog.siteUrl}/${post.meta.slug}`;

      // TODO: We should ensure that the markdown is rendered
      //       with absolute paths including domain names for
      //       all URLs (links, images, etc).
      const description = await renderMarkdown(post.content);

      feed.item({
        url,
        guid: url,
        title: post.meta.title,
        description,
        date: new Date(post.meta.date),
        author: post.meta.author ?? packageJson.blog.author,
      });
    })
  );

  const rss = feed.xml({
    indent: true,
  });

  await fs.writeFile(feedPath, rss);
}

(async () => {
  try {
    await createRss();
    process.exitCode = 0;
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
