"use client";

import { usePathname } from "next/navigation";
import { css } from "@linaria/core";
import { Link } from "./Link";

import type { Route } from "next";

const navListStyles = css`
  list-style-type: none;
  text-align: right;
  min-width: max-content;

  a:visited {
    color: #0000ee;
  }

  @media (max-width: 768px) {
    display: flex;
    padding: 0;

    li:not(:last-child) {
      padding-right: 0.5rem;
    }
  }
`;

const activeLinkStyles = css`
  pointer-events: none;
  border-bottom: 1px solid lightgrey;
`;

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

function NavLink({ href, children, external }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href as Route}
      external={external}
      className={isActive ? activeLinkStyles : undefined}
    >
      {children}
    </Link>
  );
}

export function NavLinks() {
  return (
    <ul className={navListStyles}>
      <li>
        <NavLink href="/">writing</NavLink>
      </li>
      <li>
        <NavLink href="/blogroll">blogroll</NavLink>
      </li>
      <li>
        <NavLink href="https://gist.github.com/sebinsua" external>
          gists
        </NavLink>
      </li>
      <li>
        <NavLink href="https://github.com/sebinsua" external>
          github
        </NavLink>
      </li>
      <li>
        <NavLink href="https://twitter.com/sebinsua" external>
          twitter
        </NavLink>
      </li>
      <li>
        <NavLink href="/about">about</NavLink>
      </li>
    </ul>
  );
}
