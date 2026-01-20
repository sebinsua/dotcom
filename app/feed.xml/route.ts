import RSS from "rss";

import packageJson from "../../package.json";

import type { NextRequest } from "next/server";

export const dynamic = "force-static";

async function getRss() {
  const { getVisiblePosts } = await import("@lib/getPosts");
  const { renderMarkdown } = await import("@lib/renderMarkdown");
  const feed = new RSS({
    title: packageJson.blog.title,
    site_url: packageJson.blog.siteUrl,
    feed_url: `${packageJson.blog.siteUrl}/feed.xml`,
    language: "en",
  });

  const posts = await getVisiblePosts();

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
    }),
  );

  const rss = feed.xml({
    indent: true,
  });

  return rss;
}

export async function GET(_: NextRequest) {
  const rss = await getRss();

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
