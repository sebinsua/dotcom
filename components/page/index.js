/** @jsxImportSource theme-ui */
import SEO from "@components/seo";
import Header from "@components/header";
import Footer from "@components/footer";

import packageJson from "../../package.json";

const Page = ({
  title,
  description = packageJson.blog.description,
  siteUrl = packageJson.blog.siteUrl,
  author = packageJson.blog.author,
  image,
  slug,
  children,
}) => {
  return (
    <>
      <SEO
        title={[title, packageJson.blog.title].filter(Boolean).join(" · ")}
        description={description}
        siteUrl={siteUrl}
        author={author}
        image={image}
      />

      <Header slug={slug} title={title} />
      <main sx={{ mt: 4 }}>{children}</main>
      <Footer slug={slug} />
    </>
  );
};

export default Page;
