/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import parseISO from "date-fns/parseISO";
import formatISO9075 from "date-fns/formatISO9075";

import { Page } from "@components/Page";
import { Link } from "@components/Link";
import { getPosts } from "@lib/getPosts";

import type { GetStaticPropsResult } from "next";
import type { PostData } from "@lib/getPosts";

interface PostItemProps {
  title: string;
  slug: string;
  date: Date;
}

function PostItem({ title, slug, date }: PostItemProps) {
  return (
    <li
      css={css`
        margin-bottom: 1.65rem;
      `}
    >
      <header>
        <h4
          css={css`
            display: flex;
            justify-content: space-between;
            margin: 0;
          `}
        >
          <Link href={`/${slug}`} passHref>
            <a>{title}</a>
          </Link>
          <time>{formatISO9075(date, { representation: "date" })}</time>
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
      css={css`
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

export async function getStaticProps(): Promise<
  GetStaticPropsResult<HomePageProps>
> {
  const posts = await getPosts();

  return {
    props: {
      posts,
    },
  };
}

interface HomePageProps {
  posts: PostData[];
}

export default function HomePage({ posts }: HomePageProps) {
  return (
    <Page>
      <PostsList posts={posts} />
    </Page>
  );
}
