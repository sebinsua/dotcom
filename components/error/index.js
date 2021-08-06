/** @jsxImportSource theme-ui */
import Head from "next/head";

import Page from "@components/page";
import Link from "@components/link";

const Error = ({ status }) => {
  return (
    <Page title={status || "Error"} showSlug={false}>
      <Head>
        <title>{[status]}</title>
      </Head>

      {status === 404 ? (
        <>
          <h1>404</h1>

          <Link href="/" passHref>
            <a sx={{ color: "white" }}>Go Home</a>
          </Link>
        </>
      ) : (
        <section>
          <span>{status}</span>
          <p>Oh no.</p>
        </section>
      )}
    </Page>
  );
};

export default Error;
