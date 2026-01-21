import type { Metadata } from "next";

export interface GenerateMetadataProps {
  title?: string;
  slug?: string;
  description?: string;
  siteUrl?: string;
  author?: string;
  date?: string;
}

export async function createMetadata({
  title,
  slug,
  date,
  description: _description,
  siteUrl: _siteUrl,
  author: _author,
}: GenerateMetadataProps): Promise<Metadata> {
  const packageJson = await import("../package.json");

  const description = _description ?? packageJson.blog.description;
  const siteUrl = _siteUrl ?? packageJson.blog.siteUrl;
  const author = _author ?? packageJson.blog.author;

  const fullTitle = [title, packageJson.blog.title].filter(Boolean).join(" · ");
  const url = slug ? `${siteUrl}/${slug}` : siteUrl;

  return {
    title: fullTitle,
    appleWebApp: {
      title,
    },
    description,
    authors: {
      name: author,
      url: siteUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: packageJson.blog.title,
      type: slug ? "article" : "website",
      ...(slug && date ? { publishedTime: date } : {}),
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
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
      canonical: url,
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
  };
}
