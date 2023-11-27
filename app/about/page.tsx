import { css } from "@linaria/core";

import { createMetadata } from "@lib/createMetadata";
import { Page } from "@components/Page";

import { ProfileImage } from "./ProfileImage";

export async function generateMetadata() {
  return createMetadata({
    title: "About me",
    slug: "about",
  });
}

export default function AboutPage() {
  return (
    <Page title="About me" slug="/about">
      <div
        className={css`
          font-family: var(--font-family-text);
          font-size: 0.8rem;
          line-height: 1.5rem;
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
          .image-container {
            display: flex;
            flex-direction: column;
            > div {
              align-self: center;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              filter: grayscale(100%) contrast(75%) brightness(85%);
            }
          }
          .headline {
            margin-top: 1.5rem;
            margin-bottom: 0;
            font-size: 1.1rem;
            line-height: 1.9em;
            font-weight: normal;
            a {
              font-weight: bold;
            }
          }
          .intention {
            font-size: 1.2em;
            line-height: 1.8em;
            padding: 0.6rem 0;
            padding-bottom: 0;
          }
          .likes {
            em {
              font-style: normal;
              border-bottom: 1px solid lightgrey;
            }
          }
          abbr {
            cursor: help;
            text-decoration: none;
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
        <div className="image-container">
          <ProfileImage />
        </div>
        <h2 className="headline">
          This is the blog of <a href="mailto:me@sebinsua.com">Seb Insua</a>, a
          software engineer, consultant and engineering lead based in{" "}
          <abbr title="London, United Kingdom">London</abbr>.
        </h2>
        <div className="intention">
          <p>
            When writing software my focus is on readability and reliability. An
            unfortunate industry norm is for software to be rewritten afresh as
            a greenfield project every two to five years. It is a story of
            repeated institutional knowledge loss and companies that learn to do
            better here have the opportunity to surpass those that do not.
          </p>
          <p>
            To bring about lasting software, software quality and cultural
            practices must grow trust and understanding in what exists and lower
            the cost of continuous, meaningful improvements by individual
            contributors. Subsequently the job of engineering leaders is to help
            others to carve out career-defining work from within legacy systems
            and to ensure that{" "}
            <a href="https://pages.cs.wisc.edu/~remzi/Naur.pdf">
              knowledge is permanently embedded into their organisation’s
              software, systems and people
            </a>
            .
          </p>
          <p>
            I usually program in{" "}
            <a href="https://www.typescriptlang.org/">TypeScript</a>,{" "}
            <a href="https://www.python.org">Python</a> and{" "}
            <a href="https://www.rust-lang.org/">Rust</a> but have hundreds of
            hours of experience using a wide range of languages and
            technologies. I am an expert within the{" "}
            <a href="https://nodejs.org/en/">Node.js</a> and{" "}
            <a href="https://reactjs.org/">React</a> ecosystems, where I have 12
            and 9 years of experience respectively.
          </p>
        </div>
        <p className="likes">
          I like <em>working in public</em>, <em>writing cultures</em>,{" "}
          <em>protocols</em>, <em>asynchronous communication</em>,{" "}
          <em>literate programming</em>, <em>cryptography</em>, <em>poetry</em>,{" "}
          <em>high leverage but low cost approaches</em>,{" "}
          <em>vertical integration</em>,{" "}
          <em>defactoring, inlining and colocation</em>,{" "}
          <em>decisions that allow problems to be circumvented</em>,{" "}
          <em>tooling</em> and <em>folk music</em>.
        </p>
      </div>
    </Page>
  );
}
