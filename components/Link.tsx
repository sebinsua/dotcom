import NextLink from "next/link";

import type { ReactNode } from "react";
import type { LinkProps as NextLinkProps } from "next/link";

export type LinkProps<RouteType> = Pick<
  NextLinkProps<RouteType>,
  "href" | "passHref"
> & {
  external?: boolean;
  children?: ReactNode;
};

export function Link<RouteType>({
  href,
  passHref,
  external,
  children,
  ...props
}: LinkProps<RouteType>) {
  if (external) {
    return (
      <a
        href={href.toString()}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} passHref={passHref} legacyBehavior>
      {passHref ? children : <a>{children}</a>}
    </NextLink>
  );
}
