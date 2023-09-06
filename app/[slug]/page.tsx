import { css } from "@linaria/core";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";

import { createMetadata } from "@lib/createMetadata";
import { Page } from "@components/Page";
import { Link } from "@components/Link";
import { getPosts } from "@lib/getPosts";
import { renderMarkdown } from "@lib/renderMarkdown";

import type { PostData } from "@lib/getPosts";

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.meta.slug,
  }));
}

export async function generateMetadata(props: PostPageProps) {
  const { meta } = await getPost(props);

  return createMetadata({
    title: meta.title,
    description: meta.description,
    date: meta.date,
  });
}

async function getPost(props: PostPageProps) {
  const posts = await getPosts();
  const postIndex = posts.findIndex((p) => p.meta.slug === props.params.slug);
  const post = posts[postIndex];
  if (!post) {
    throw new Error("No post was found for the slug: " + props.params.slug);
  }

  const previous =
    posts[postIndex + 1] && posts[postIndex + 1].meta.hidden !== true
      ? posts[postIndex + 1]
      : null;
  const next =
    posts[postIndex - 1] && posts[postIndex - 1].meta.hidden !== true
      ? posts[postIndex - 1]
      : null;

  const meta = post.meta;
  const html = await renderMarkdown(post.content);

  return {
    previous,
    next,
    meta,
    html,
  };
}

interface PostNavigationProps {
  previous: PostData | null;
  next: PostData | null;
}

function PostNavigation({ previous, next }: PostNavigationProps) {
  return (
    <footer
      className={css`
        hr {
          opacity: 0.2;
          color: lightgrey;
        }
        a {
          color: grey;
        }
      `}
    >
      <hr />
      {(previous || next) && (
        <nav>
          <ul
            className={css`
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
          className={css`
            font-size: 1.1rem;
            line-height: 2rem;
            margin-top: 0.95rem;

            @media (min-width: 768px) {
              white-space: nowrap;
            }
          `}
        >
          {title}
        </h2>
        <div
          className={css`
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

export interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage(props: PostPageProps) {
  const { previous, next, meta, html } = await getPost(props);

  return (
    <Page title={meta.title} slug={meta.slug} description={meta.description}>
      <Post previous={previous} next={next} meta={meta} html={html} />
    </Page>
  );
}
