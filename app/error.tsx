"use client";

import { Page } from "@components/Page";

export const metadata = {
  title: "Error",
};

export default function ErrorPage() {
  const title = "Error";
  return (
    <Page>
      <section>
        <span>{title}</span>
        <p>Oh no.</p>
      </section>
    </Page>
  );
}
