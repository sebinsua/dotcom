/** @jsxImportSource theme-ui */
import { memo } from "react";
import { Themed } from "theme-ui";

import Link from "@components/link";

const categoryEmojis = {};

const fallbackEmojis = [];

const Entry = ({ title, href, as, category, date, description }) => {
  return (
    <li sx={{ mb: 4 }}>
      <header>
        <Themed.h3 sx={{ mb: 0 }}>
          <Link passHref href={href} as={as} external={!as} title={`${title}`}>
            <a sx={{ textDecoration: "none", color: "primary" }}>{title}</a>
          </Link>
        </Themed.h3>
        <small>{date}</small>
      </header>
      <section>
        <Themed.p sx={{ mt: 2, pb: 2, fontSize: 2 }}>{description}</Themed.p>
      </section>
    </li>
  );
};

export default memo(Entry);
