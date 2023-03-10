/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import NextHead from "next/head";
import { useRouter } from "next/router";

import { Link } from "./Link";

import packageJson from "../package.json";

import type { ReactNode } from "react";

const rootPath = "/";

interface SeoHeaderProps {
  title: string;
  author: string;
  description: string;
  siteUrl: string;
  children?: ReactNode;
}

function SeoHeader({
  title,
  author,
  description,
  siteUrl,
  children,
}: SeoHeaderProps) {
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

      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />

      <link rel="manifest" href="/site.webmanifest" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      {children}
    </NextHead>
  );
}

interface TitleProps {
  children: ReactNode;
}

function Title({ children }: TitleProps) {
  const router = useRouter();

  if (router.pathname === rootPath) {
    return (
      <h1
        css={css`
          font-size: 1rem;
          line-height: 1.9rem;
        `}
      >
        <Link href="/" passHref>
          <a aria-current="page" aria-label="Navigate Home">
            {children}
          </a>
        </Link>
      </h1>
    );
  }

  return (
    <h1
      css={css`
        font-size: 1rem;
        line-height: 1.9rem;
      `}
    >
      <Link href="/" passHref>
        <a aria-label="Navigate Home">{children}</a>
      </Link>
    </h1>
  );
}

interface HeaderProps {
  slug?: string;
  title?: string;
}

function Header(_: HeaderProps) {
  const router = useRouter();

  router.pathname === rootPath;

  return (
    <header
      css={css`
        width: 100px;

        @media (max-width: 480px) {
          width: unset;
        }
      `}
    >
      <nav
        css={css`
          padding-top: 2px;
          display: flex;
          justify-content: flex-end;
          a {
            color: black;
          }

          @media (max-width: 480px) {
            justify-content: flex-start;
            padding: 0 1rem;
          }
        `}
      >
        <Title>{packageJson.blog.title}</Title>
      </nav>
      <div
        css={css`
          display: flex;
          justify-content: flex-end;
          ul {
            list-style-type: none;
            text-align: right;
          }
          a:visited {
            color: #0000ee;
          }
          .selected {
            pointer-events: none;
            border-bottom: 1px solid lightgrey;
          }

          @media (max-width: 480px) {
            justify-content: flex-start;
            padding: 0 1rem;
            ul {
              display: flex;
              padding: 0;
            }
            li:not(:last-child) {
              padding-right: 0.5rem;
            }
          }
        `}
      >
        <ul>
          <li>
            <Link href="/" passHref>
              <a className={router.pathname === "/" ? "selected" : undefined}>
                writing
              </a>
            </Link>
          </li>
          <li>
            <Link href="/blogroll" passHref>
              <a
                className={
                  router.pathname === "/blogroll" ? "selected" : undefined
                }
              >
                blogroll
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://gist.github.com/sebinsua" external>
              gists
            </Link>
          </li>
          <li>
            <Link href="https://github.com/sebinsua" external>
              github
            </Link>
          </li>
          <li>
            <Link href="https://twitter.com/sebinsua" external>
              twitter
            </Link>
          </li>
          <li>
            <Link href="/about" passHref>
              <a
                className={
                  router.pathname === "/about" ? "selected" : undefined
                }
              >
                about
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

interface FooterProps {
  slug?: string;
}

function Footer({ slug }: FooterProps) {
  return (
    <>
      <footer
        css={css`
          display: flex;
          flex-direction: row-reverse;

          a {
            color: lightgrey;
          }

          @media (max-width: 768px) {
            flex-grow: initial;
            flex-basis: initial;
            padding: 0 1rem;
          }
          @media (max-width: 480px) {
            padding: 0 1rem;
          }
        `}
      >
        {slug !== "/about" ? (
          <Link href="/feed.xml" passHref>
            <a>rss</a>
          </Link>
        ) : (
          <Link href="mailto:me@sebinsua.com" external>
            email
          </Link>
        )}
      </footer>
    </>
  );
}

interface PageProps {
  title?: string;
  description?: string;
  siteUrl?: string;
  author?: string;
  slug?: string;
  children?: ReactNode;
}

export function Page({
  title,
  slug,
  description = packageJson.blog.description,
  siteUrl = packageJson.blog.siteUrl,
  author = packageJson.blog.author,
  children,
}: PageProps) {
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        width: 800px;

        @media (max-width: 480px) {
          flex-direction: column;
          width: 100%;
        }
      `}
    >
      <SeoHeader
        title={[title, packageJson.blog.title].filter(Boolean).join(" · ")}
        description={description}
        siteUrl={siteUrl}
        author={author}
      />

      <Header slug={slug} title={title} />

      <div
        css={css`
          width: 80%;

          @media (max-width: 480px) {
            width: 100%;
          }
        `}
      >
        <main
          css={css`
            @media (max-width: 768px) {
              flex-grow: initial;
              flex-basis: initial;
              padding: 0 1rem;
            }
            @media (max-width: 480px) {
              padding: 0 1rem;
            }
          `}
        >
          {children}
        </main>
        <Footer slug={slug} />
      </div>
    </div>
  );
}
