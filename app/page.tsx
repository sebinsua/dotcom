import { css } from "@linaria/core";
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

interface PostItemProps {
  title: string;
  slug: string;
  date: Date;
}

function PostItem({ title, slug, date }: PostItemProps) {
  return (
    <li
      className={css`
        margin-bottom: 1.65rem;
      `}
    >
      <header>
        <h4
          className={css`
            display: flex;
            justify-content: space-between;
            margin: 0;
          `}
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
        </h4>
      </header>
    </li>
  );
}

interface PostsListProps {
  posts: PostData[];
}

function PostsList({ posts }: PostsListProps) {
  return (
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
          />
        );
      })}
    </ul>
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
