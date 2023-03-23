import { css } from "@linaria/core";
import Head from "next/head";

import { Page } from "@components/Page";
import { Link } from "@components/Link";

export default function NotFoundPage() {
  return (
    <Page title="404">
      <Head>
        <title>404</title>
      </Head>

      <>
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
      </>
    </Page>
  );
}
