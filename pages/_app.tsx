import { css } from "@linaria/core";

import type { AppProps } from "next/app";

import "@styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div
        className={css`
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
