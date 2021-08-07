/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import NProgress from "next-nprogress-emotion";

import type { AppProps } from "next/app";

import "@styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NProgress showAfterMs={500} spinner={false} color="lightgrey" />
      <div
        css={css`
          display: flex;
          width: 100%;
          justify-content: center;
        `}
      >
        <Component {...pageProps} />
      </div>
    </>
  );
}
