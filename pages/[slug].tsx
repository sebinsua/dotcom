/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Head from "next/head";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";

import { Page } from "@components/Page";
import { Link } from "@components/Link";
import { getPosts } from "@lib/getPosts";
import { renderMarkdown } from "@lib/renderMarkdown";

import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import type { PostData } from "@lib/getPosts";

interface PostNavigationProps {
  previous: PostData | null;
  next: PostData | null;
}

function PostNavigation({ previous, next }: PostNavigationProps) {
  return (
    <footer
      css={css`
        & hr {
          opacity: 0.2;
          color: lightgrey;
        }
        & a {
          color: grey;
        }
      `}
    >
      <hr />
      {(previous || next) && (
        <nav>
          <ul
            css={css`
              display: flex;
              justify-content: space-between;
              list-style-type: none;
              padding: 0 2rem;
            `}
          >
            <li>
              {previous && (
                <Link href={`/${encodeURIComponent(previous.meta.slug)}`}>
                  ← {previous.meta.title}
                </Link>
              )}
            </li>

            <li>
              {next && (
                <Link href={`/${encodeURIComponent(next.meta.slug)}`}>
                  {next.meta.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </footer>
  );
}

interface PostProps {
  previous: PostData | null;
  next: PostData | null;
  meta: PostData["meta"];
  html: string;
}

function Post({
  previous,
  next,
  meta: { title, date: iso8601DateString },
  html,
}: PostProps) {
  const currentYear = new Date().getFullYear();
  const date = parseISO(iso8601DateString);
  return (
    <>
      <header>
        <h2
          css={css`
            font-size: 1rem;
            line-height: 1.9rem;
            margin-top: 0.95rem;
          `}
        >
          {title}
        </h2>
        <div
          css={css`
            padding-top: 0.75rem;
          `}
        >
          <small>
            {date.getFullYear() === currentYear
              ? format(date, "do LLL")
              : format(date, "do LLL yyyy")}
          </small>
        </div>
      </header>

      <article
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />

      <PostNavigation previous={previous} next={next} />
    </>
  );
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
): Promise<GetStaticPropsResult<PostPageProps>> {
  const posts = await getPosts();
  const postIndex = posts.findIndex(
    (p) => p.meta.slug === context?.params?.slug
  );
  const post = posts[postIndex];

  const { content, meta } = post;
  const html = await renderMarkdown(content);

  return {
    props: {
      previous: posts[postIndex + 1] ?? null,
      next: posts[postIndex - 1] ?? null,
      meta,
      html,
    },
  };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const posts = await getPosts();

  return {
    paths: posts.map((p) => `/${encodeURIComponent(p.meta.slug)}`),
    fallback: false,
  };
}

export interface PostPageProps {
  previous: PostData | null;
  next: PostData | null;
  meta: PostData["meta"];
  html: string;
}

export default function PostPage(props: PostPageProps) {
  return (
    <Page
      title={props.meta.title}
      slug={props.meta.slug}
      description={props.meta.description}
    >
      <Head>
        {props.meta.hidden && <meta name="robots" content="noindex" />}
        {props.meta.date && <meta name="date" content={props.meta.date} />}
      </Head>
      <Post
        previous={props.previous}
        next={props.next}
        meta={props.meta}
        html={props.html}
      />
    </Page>
  );
}
