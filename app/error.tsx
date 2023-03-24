"use client";

import { Page } from "@components/Page";

export const metadata = {
  title: "Error",
};

interface ErrorPageProps {}

export default function ErrorPage(_: ErrorPageProps) {
  const title = "Error";
  return (
    <Page title={title}>
      <section>
        <span>{title}</span>
        <p>Oh no.</p>
      </section>
    </Page>
  );
}
