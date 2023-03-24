import type { Metadata } from "next";

export interface GenerateMetadataProps {
  title?: string;
  description?: string;
  siteUrl?: string;
  author?: string;
  date?: string;
}

export async function createMetadata({
  title,
  date,
  description: _description,
  siteUrl: _siteUrl,
  author: _author,
}: GenerateMetadataProps): Promise<Metadata> {
  const packageJson = await import("../package.json");

  const description = _description ?? packageJson.blog.description;
  const siteUrl = _siteUrl ?? packageJson.blog.siteUrl;
  const author = _author ?? packageJson.blog.author;

  return {
    title: [title, packageJson.blog.title].filter(Boolean).join(" · "),
    appleWebApp: {
      title,
    },
    description,
    authors: {
      name: author,
      url: siteUrl,
    },
    icons: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
    alternates: {
      canonical: siteUrl,
      types: {
        "application/rss+xml": [
          {
            title: `RSS Feed for ${siteUrl}`,
            url: "/feed.xml",
          },
        ],
      },
    },
    manifest: "/site.webmanifest",
    other: {
      "msapplication-TileColor": "#ffffff",
      "theme-color": "#ffffff",
      ...(date !== null ? { date } : {}),
    },
    viewport: {
      width: "device-width",
      initialScale: 1.0,
    },
  };
}
