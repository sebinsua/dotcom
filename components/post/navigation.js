/** @jsxImportSource theme-ui */
import { Flex } from "theme-ui";
import Link from "@components/link";

const Navigation = ({ previous, next }) => {
  return (
    <footer>
      <hr
        sx={{
          my: 3,
          color: "muted",
        }}
      />
      {(previous || next) && (
        <nav>
          <Flex
            as="ul"
            sx={{
              flexWrap: `wrap`,
              flexDirection: next && previous === null ? "row-reverse" : "row",
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            {previous && (
              <li>
                <Link href="/[slug]" gray as={`/${previous.slug}`}>
                  ← {previous.title}
                </Link>
              </li>
            )}

            {next && (
              <li>
                <Link href="/[slug]" gray as={`/${next.slug}`}>
                  {next.title} →
                </Link>
              </li>
            )}
          </Flex>
        </nav>
      )}
    </footer>
  );
};

export default Navigation;
