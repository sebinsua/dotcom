import React from "react";

import Page from "@components/page";
import PostsList from "@components/posts-list";
import getPosts from "@lib/get-posts";

export const getStaticProps = () => {
  const posts = getPosts();

  return {
    props: {
      posts,
    },
  };
};

export default function Blog({ posts }) {
  return (
    <Page>
      <PostsList posts={posts} paginate />
    </Page>
  );
}
