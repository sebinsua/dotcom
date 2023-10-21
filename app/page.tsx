import { css, cx } from "@linaria/core";
import parseISO from "date-fns/parseISO";
import formatISO9075 from "date-fns/formatISO9075";

import { createMetadata } from "@lib/createMetadata";
import { Page } from "@components/Page";
import { Link } from "@components/Link";
import { getVisiblePosts } from "@lib/getPosts";

import type { PostData } from "@lib/getPosts";

export async function generateMetadata() {
  return createMetadata({});
}

interface GetOpacityForDateOptions {
  minValue?: number;
  maxValue?: number;
  numberOfYears?: number;
}

function getOpacityForDate(
  date: Date,
  {
    minValue = 0.1,
    maxValue = 1.0,
    numberOfYears = 8,
  }: GetOpacityForDateOptions = {}
) {
  const now = new Date();

  const minDate = new Date();
  minDate.setFullYear(now.getFullYear() - numberOfYears);
  if (date.getTime() < minDate.getTime()) {
    return minValue;
  }

  const totalRangeMillis = now.getTime() - minDate.getTime();
  const datePositionMillis = date.getTime() - minDate.getTime();

  return (
    minValue + (datePositionMillis / totalRangeMillis) * (maxValue - minValue)
  );
}

interface PostItemProps {
  title: string;
  slug: string;
  date: Date;
  isEffortPost?: boolean;
}

function PostItem({ title, slug, date, isEffortPost = false }: PostItemProps) {
  return (
    <li
      className={css`
        margin-bottom: 1.65rem;
      `}
    >
      <header>
        <h3
          className={cx(
            css`
              position: relative;
              display: flex;
              justify-content: space-between;
              margin: 0;
              font-size: 1em;
            `,
            isEffortPost
              ? css`
                  &::before {
                    position: absolute;
                    content: "❋";
                    left: -1rem;
                    top: -1px;
                    color: darkslategray;
                    transition: color 0.2s ease-in-out;
                  }
                  &:hover::before {
                    color: slategray;
                  }
                `
              : undefined
          )}
          style={{ opacity: getOpacityForDate(date) }}
        >
          <Link href={`/${slug}`} passHref>
            <a>{title}</a>
          </Link>
          <time
            className={css`
              word-break: keep-all;
            `}
          >
            {formatISO9075(date, { representation: "date" })}
          </time>
        </h3>
      </header>
    </li>
  );
}

interface PostsListProps {
  posts: PostData[];
}

function PostsList({ posts }: PostsListProps) {
  return (
    <>
      <h2
        className={css`
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          border: 0;
          padding: 0;
          clip: rect(0 0 0 0);
          overflow: hidden;
        `}
      >
        Posts
      </h2>
      <ul
        className={css`
          list-style-type: none;
          padding: 0;
          margin-top: 1.1rem;
        `}
      >
        {posts.map((post) => {
          return (
            <PostItem
              key={`post-item-${post.meta.slug}`}
              title={post.meta.title}
              slug={post.meta.slug}
              date={parseISO(post.meta.date)}
              isEffortPost={post.meta.isEffortPost}
            />
          );
        })}
      </ul>
    </>
  );
}

export default async function HomePage() {
  const posts = await getVisiblePosts();

  return (
    <Page>
      <PostsList posts={posts} />
    </Page>
  );
}
