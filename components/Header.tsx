import { css } from "@linaria/core";
import { Link } from "./Link";

import packageJson from "../package.json";

import type { ReactNode } from "react";
import type { Route } from "next";

interface TitleProps {
  children: ReactNode;
}

function Title({ children }: TitleProps) {
  return (
    <h1
      className={css`
        font-size: 1rem;
        line-height: 1.9rem;
      `}
    >
      <Link href="/" passHref>
        <a aria-label="Navigate Home">{children}</a>
      </Link>
    </h1>
  );
}

interface HeaderProps {
  slug?: string;
  title?: string;
}

export function Header(_: HeaderProps) {
  return (
    <header
      className={css`
        width: 100px;

        @media (max-width: 768px) {
          width: unset;
        }
      `}
    >
      <nav
        className={css`
          padding-top: 2px;
          display: flex;
          justify-content: flex-end;
          a {
            color: black;
          }

          @media (max-width: 768px) {
            justify-content: flex-start;
            padding: 0 1rem;
          }
        `}
      >
        <Title>{packageJson.blog.title}</Title>
      </nav>
      <div
        className={css`
          display: flex;
          justify-content: flex-end;
          ul {
            list-style-type: none;
            text-align: right;
          }
          a:visited {
            color: #0000ee;
          }
          .PathnameContainer[data-pathname="/"] & a[href="/"],
          .PathnameContainer[data-pathname="/blogroll"] & a[href="/blogroll"],
          .PathnameContainer[data-pathname="/about"] & a[href="/about"] {
            pointer-events: none;
            border-bottom: 1px solid lightgrey;
          }

          @media (max-width: 768px) {
            justify-content: flex-start;
            padding: 0 1rem;
            ul {
              display: flex;
              padding: 0;
            }
            li:not(:last-child) {
              padding-right: 0.5rem;
            }
          }
        `}
      >
        <ul>
          <li>
            <Link href="/" passHref>
              <a>writing</a>
            </Link>
          </li>
          <li>
            <Link href="/blogroll" passHref>
              <a>blogroll</a>
            </Link>
          </li>
          <li>
            <Link href={"https://gist.github.com/sebinsua" as Route} external>
              gists
            </Link>
          </li>
          <li>
            <Link href={"https://github.com/sebinsua" as Route} external>
              github
            </Link>
          </li>
          <li>
            <Link href={"https://twitter.com/sebinsua" as Route} external>
              twitter
            </Link>
          </li>
          <li>
            <Link href="/about" passHref>
              <a>about</a>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
