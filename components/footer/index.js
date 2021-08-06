/** @jsxImportSource theme-ui */
import Link from "@components/link";

const Footer = ({ slug }) => {
  return (
    <>
      <footer sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Link href="/feed.xml" external gray>
          rss
        </Link>
      </footer>
    </>
  );
};

export default Footer;
