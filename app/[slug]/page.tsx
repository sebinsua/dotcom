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
    slug: meta.slug,
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

  function proceed(
    direction: "previous" | "next",
    posts: PostData[],
    postIndex: number,
  ) {
    const step = direction === "previous" ? 1 : -1;

    let index = postIndex + step;
    while (posts[index] && posts[index].meta.hidden === true) {
      index = index + step;
    }

    return posts[index] ?? null;
  }

  const meta = post.meta;
  const html = await renderMarkdown(post.content);

  return {
    previous: proceed("previous", posts, postIndex),
    next: proceed("next", posts, postIndex),
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
            <li
              className={css`
                text-align: left;
              `}
            >
              {previous && (
                <Link href={`/${encodeURIComponent(previous.meta.slug)}`}>
                  <span
                    className={css`
                      position: relative;
                      &::before {
                        position: absolute;
                        content: "←";
                        left: -1rem;
                        margin-right: 0.6rem;
                      }
                    `}
                  >
                    {previous.meta.title}
                  </span>
                </Link>
              )}
            </li>

            <li
              className={css`
                text-align: right;
              `}
            >
              {next && (
                <Link href={`/${encodeURIComponent(next.meta.slug)}`}>
                  <span
                    className={css`
                      position: relative;
                      &::after {
                        position: absolute;
                        content: "→";
                        margin-left: 0.6rem;
                      }
                    `}
                  >
                    {next.meta.title}
                  </span>
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
