import { css } from "@linaria/core";

import { Page } from "@components/Page";
import { Link } from "@components/Link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404",
};

export default function NotFoundPage() {
  return (
    <Page title="404">
      <h1>404</h1>

      <Link href="/" passHref>
        <a
          className={css`
            color: lightgrey;
          `}
        >
          Go Home
        </a>
      </Link>
    </Page>
  );
}
