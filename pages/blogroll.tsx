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
            <a href="https://christopherolah.wordpress.com/2011/07/31/you-already-know-calculus-derivatives/">
              <em>“You Already Know Calculus: Derivatives”</em> (2011)
            </a>{" "}
            by <a href="https://colah.github.io/">Christopher Olah</a>.
          </li>
          <li>
            <a href="https://dominictarr.com/post/154769946347/fairly-tale-cryptography-2-hashes">
              <em>“Fairy Tale Cryptography 2: Hashes”</em> (2017)
            </a>{" "}
            by <a href="https://dominictarr.com/">Dominic Tarr</a>.
          </li>
          <li>
            <a href="https://two-wrongs.com/data-consistency-is-overrated.html">
              <em>“Data Consistency Is Overrated”</em> (2023)
            </a>{" "}
            by <a href="https://xkqr.org/profile">Christoffer Stjernlöf</a> of{" "}
            <a href="https://two-wrongs.com/">Two Wrongs</a>.
          </li>
          <li>
            <a href="https://jvns.ca/blog/2015/04/14/strace-zine/">
              <em>
                How to spy on your programs with <pre>strace</pre>
              </em>{" "}
              (2015)
            </a>{" "}
            by <a href="https://jvns.ca/">Julia Evans</a>.
          </li>
          <li>
            <a href="https://danluu.com/file-consistency/">
              <em>“Files are hard”</em> (2017)
            </a>{" "}
            by <a href="https://danluu.com/">Dan Luu</a>.
          </li>
          <li>
            <a href="https://wordsandbuttons.online/sine_and_cosine.html">
              <em>“Sine and cosine”</em> (2020)
            </a>{" "}
            by <a href="https://wordsandbuttons.online/">Oleksandr Kaleniuk</a>.
          </li>
        </ul>
      </div>
    </Page>
  );
}
