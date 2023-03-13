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
            font-weight: normal;
            color: black;
            font-style: normal;
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
            <a href="https://jessitron.com/2021/01/18/when-costs-are-nonlinear-keep-it-small/">
              <em>“When costs are nonlinear, keep it small”</em> (2021)
            </a>{" "}
            by <a href="https://jessitron.com/">Jessica Kerr</a>.
          </li>
          <li>
            <a href="https://sophiebits.com/2018/12/03/yak-shaving-fixing.html">
              <em>“Yak shaving and fixing”</em> (2018)
            </a>{" "}
            by <a href="https://sophiebits.com/">Sophie Alpert</a>.
          </li>
          <li>
            <a href="https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction">
              <em>“The Wrong Abstraction”</em> (2016)
            </a>{" "}
            by <a href="https://sandimetz.com/">Sandi Metz</a>.
          </li>
          <li>
            <a href="https://wordsandbuttons.online/programmers_guide_to_polynomials_and_splines.html">
              <em>“Programmer’s guide to polynomials and splines”</em> (2019)
            </a>{" "}
            by <a href="https://wordsandbuttons.online/">Oleksandr Kaleniuk</a>.
          </li>
          <li>
            <a href="https://chidiwilliams.com/post/quadtrees/">
              <em>“Quadtrees in the Wild”</em> (2021)
            </a>{" "}
            by <a href="https://chidiwilliams.com/">Chidi Williams</a>.
          </li>
          <li>
            <a href="https://two-wrongs.com/data-consistency-is-overrated.html">
              <em>“Data Consistency Is Overrated”</em> (2023)
            </a>{" "}
            by <a href="https://xkqr.org/profile">Christoffer Stjernlöf</a>.
          </li>
          <li>
            <a href="https://jvns.ca/blog/2015/04/14/strace-zine/">
              <em>
                “How to spy on your programs with <pre>strace</pre>”
              </em>{" "}
              (2015)
            </a>{" "}
            by <a href="https://jvns.ca/">Julia Evans</a>.
          </li>
          <li>
            <a href="https://tiarkrompf.github.io/notes/?/just-write-the-parser/">
              <em>“Just write the #!%/* parser”</em> (2019)
            </a>{" "}
            by <a href="https://tiarkrompf.github.io/">Tiark Rompf</a>.
          </li>
          <li>
            <a href="https://danluu.com/file-consistency/">
              <em>“Files are hard”</em> (2017)
            </a>{" "}
            by <a href="https://danluu.com/">Dan Luu</a>.
          </li>
          <li>
            <a href="https://lethain.com/learn-to-never-be-wrong/">
              <em>“Learn to never be wrong”</em> (2020)
            </a>{" "}
            by <a href="https://lethain.com/">Will Larson</a>.
          </li>
          <li>
            <a href="https://macwright.com/2021/02/17/the-naming-of-things.html">
              <em>“The naming of things”</em> (2021)
            </a>{" "}
            by <a href="https://macwright.com/">Tom MacWright</a>.
          </li>
          <li>
            <a href="https://monkey.org/~marius/unix-tools-hints.html">
              <em>“Hints for writing Unix tools”</em> (2014)
            </a>{" "}
            by <a href="https://monkey.org/~marius/">Marius Eriksen</a>.
          </li>
          <li>
            <a href="https://lord.io/spreadsheets/">
              <em>“How to recalculate a spreadsheet”</em> (2020)
            </a>{" "}
            by <a href="https://lord.io/">Robert Lord</a>.
          </li>
          <li>
            <a href="https://koolaidfactory.com/writing-in-public-inside-your-company/">
              <em>“Writing In Public, Inside Your Company”</em> (2021)
            </a>{" "}
            by <a href="https://www.briewolfson.com">Brie Wolfson</a>.
          </li>
          <li>
            <a href="https://www.patrickstevens.co.uk/posts/2021-02-20-in-praise-of-dry-run/">
              <em>
                “In praise of <pre>--dry-run</pre>”
              </em>{" "}
              (2021)
            </a>{" "}
            by <a href="https://www.patrickstevens.co.uk">Patrick Stevens</a>.
          </li>
          <li>
            <a href="https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html">
              <em>“What’s up with monomorphism?”</em> (2015)
            </a>{" "}
            by <a href="https://mrale.ph/">Vyacheslav Egorov</a>.
          </li>
          <li>
            <a href="https://www.igvita.com/2014/05/05/minimum-viable-block-chain/">
              <em>“Minimum Viable Blockchain”</em> (2014)
            </a>{" "}
            by <a href="https://www.igvita.com/">Ilya Grigorik</a>.
          </li>
          <li>
            <a href="https://web.archive.org/web/20160306114307/http://szabo.best.vwh.net/history.html">
              <em>“History and the Security of Property”</em> (2006)
            </a>{" "}
            by <a href="https://unenumerated.blogspot.com/">Nick Szabo</a>.
          </li>
        </ul>
      </div>
    </Page>
  );
}
