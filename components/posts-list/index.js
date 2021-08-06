/** @jsxImportSource theme-ui */
import { useState } from "react";

import Entry from "@components/entry";

const numberOfPostsPerPage = 3;

const Posts = ({ slug, posts, paginate }) => {
  const [showMore, setShowMore] = useState(numberOfPostsPerPage);

  return (
    <ul sx={{ listStyleType: "none", m: 0, p: 0 }}>
      {posts.slice(0, paginate ? showMore : undefined).map((post) => {
        return (
          <Entry
            key={`post-item-${post.slug}`}
            href="/[slug]"
            as={`/${post.slug}`}
            title={`${post.title}`}
            category={post.category}
            date={post.date}
            description={post.description}
          />
        );
      })}
      {paginate && showMore < posts.length && (
        <button
          onClick={() => {
            setShowMore(showMore + numberOfPostsPerPage);
          }}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3,
            cursor: "pointer",
            fontWeight: 500,
            fontSize: 2,
            border: "none",
            outline: "none",
            color: "secondary",
            backgroundColor: "muted",
            ":hover": {
              color: "primary",
            },
            ":focus": {
              color: "primary",
            },
            ":active": {
              backgroundColor: "muted",
            },
          }}
        >
          Show More
        </button>
      )}
    </ul>
  );
};

export default Posts;
