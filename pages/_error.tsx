import Head from "next/head";

import { Page } from "@components/Page";

import type { NextPageContext } from "next";

export function getInitialProps({ res, err }: NextPageContext): ErrorPageProps {
  const status = res ? res.statusCode : err ? err.statusCode : undefined;
  return {
    status,
  };
}

interface ErrorPageProps {
  status?: number;
}

export default function ErrorPage({ status }: ErrorPageProps) {
  const title = typeof status === "number" ? status.toString() : "Error";
  return (
    <Page title={title}>
      <Head>
        <title>{title}</title>
      </Head>
      <section>
        <span>{title}</span>
        <p>Oh no.</p>
      </section>
    </Page>
  );
}
