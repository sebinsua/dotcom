/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Page } from "@components/Page";

export default function AboutPage() {
  return (
    <Page title="About me" slug="/about">
      <div
        css={css`
          font-size: 0.8rem;
          line-height: 1.8rem;
          margin-top: 0.95em;
          background: linear-gradient(
            100deg,
            #ff9269 15%,
            #f76631 35%,
            #1778e9
          );
          text-decoration: none;
          background-clip: text;
          -webkit-background-clip: text;
          h3 {
            font-size: 1rem;
            line-height: 1.9em;
          }
          .intention {
            font-size: 1.15em;
            line-height: 1.6em;
            padding: 0.6rem 0;
          }
          abbr {
            cursor: help;
            text-decoration: none;
          }
          strong {
            color: rgba(255, 255, 255, 0);
            /* See: https://bugs.webkit.org/show_bug.cgi?id=169125 */
            background-clip: text;
            -webkit-background-clip: text;
          }
        `}
      >
        <h3>
          {"I'm"} <strong>Seb Insua</strong>, a software engineer residing in{" "}
          <abbr title="London, United Kingdom">London</abbr>.
        </h3>
        <p className="intention">
          I like to advise on how to maximise{" "}
          <strong>technical leverage</strong> while reducing exposure to{" "}
          <strong>execution costs</strong>.
        </p>
        <p>
          Knowing when not to solve a problem is as important as knowing how to
          solve it.
        </p>
      </div>
    </Page>
  );
}
