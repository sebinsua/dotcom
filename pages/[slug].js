import Head from "next/head";
import Page from "@components/page";
import Post from "@components/post";
import getPosts from "@lib/get-posts";
import renderMarkdown from "@lib/render-markdown";

export const getStaticProps = async ({ params: { slug } }) => {
  const posts = getPosts();
  const postIndex = posts.findIndex((p) => p.slug === slug);
  const post = posts[postIndex];
  const { body, ...rest } = post;

  const html = await renderMarkdown(body);

  return {
    props: {
      previous: posts[postIndex + 1] || null,
      next: posts[postIndex - 1] || null,
      ...rest,
      html,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: getPosts().map((p) => `/${p.slug}`),
    fallback: false,
  };
};

export default function PostPage(props) {
  return (
    <Page slug={props.slug} title={props.title} description={props.description}>
      <Head>
        {props.hidden && <meta name="robots" content="noindex" />}
        {props.date && <meta name="date" content={props.date} />}
      </Head>
      <Post {...props} />
    </Page>
  );
}
