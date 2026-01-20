import { css } from "@linaria/core";
import { Link } from "./Link";
import { NavLinks } from "./NavLinks";

import packageJson from "../package.json";

import type { ReactNode } from "react";

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
      <Link href="/">
        <span
          className={css`
            position: absolute;
            width: 1px;
            height: 1px;
            margin: -1px;
            border: 0;
            padding: 0;
            clip: rect(0 0 0 0);
            overflow: hidden;
          `}
        >
          Navigate Home
        </span>
        {children}
      </Link>
    </h1>
  );
}

export function Header() {
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
          font-family: var(--font-family-text);

          @media (max-width: 768px) {
            justify-content: flex-start;
            padding: 0 1rem;
            font-size: 0.8rem;
          }
        `}
      >
        <NavLinks />
      </div>
    </header>
  );
}
