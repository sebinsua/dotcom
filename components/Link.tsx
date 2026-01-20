import NextLink from "next/link";

import type { ReactNode } from "react";
import type { LinkProps as NextLinkProps } from "next/link";

export type LinkProps<RouteType> = Pick<NextLinkProps<RouteType>, "href"> & {
  external?: boolean;
  children?: ReactNode;
  className?: string;
};

export function Link<RouteType>({ href, external, children, className }: LinkProps<RouteType>) {
  if (external) {
    return (
      // oxlint-disable-next-line nextjs/no-html-link-for-pages -- external links use <a> intentionally
      <a href={href.toString()} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={className}>
      {children}
    </NextLink>
  );
}
