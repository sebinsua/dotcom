import NextHead from "next/head";

const Head = ({ title, author, description, siteUrl, image, children }) => {
  return (
    <NextHead>
      {/* Title */}
      <title>{title}</title>
      <meta name="og:title" content={title} />

      {/* Description */}
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />

      {/* General */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />

      <meta name="apple-mobile-web-app-title" content={title} />

      <meta name="author" content={author} />

      {/* RSS feed */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`RSS Feed for ${siteUrl}`}
        href="/feed.xml"
      />

      {/* TODO: Favicons */}
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />

      {children}
    </NextHead>
  );
};

export default Head;
