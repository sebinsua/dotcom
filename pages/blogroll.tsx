/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Page } from "@components/Page";

export default function BlogrollPage() {
  return (
    <Page title="Blogroll" slug="/blogroll">
      <div
        css={css`
          font-size: 0.8rem;
          line-height: 1.5rem;
          margin-top: 1.475em;
          background: linear-gradient(
            100deg,
            #ff9269 15%,
            #f76631 35%,
            #1778e9
          );
          text-decoration: none;
          background-clip: text;
          -webkit-background-clip: text;
          pre {
            display: inline;
            padding: 0;
          }
          em {
            font-weight: bold;
          }
          strong,
          a {
            color: rgba(255, 255, 255, 0);
            /* See: https://bugs.webkit.org/show_bug.cgi?id=169125 */
            background-clip: text;
            -webkit-background-clip: text;
          }
        `}
      >
        <p>
          Here are some articles by other blog writers that I’ve found
          insightful:
        </p>
        <ul>
          <li>
            <a href="https://two-wrongs.com/data-consistency-is-overrated.html">
              <em>“Data Consistency Is Overrated”</em>
            </a>{" "}
            by <a href="https://xkqr.org/profile">Christoffer Stjernlöf</a> of{" "}
            <a href="https://two-wrongs.com/">Two Wrongs</a>.
          </li>
        </ul>
      </div>
    </Page>
  );
}
