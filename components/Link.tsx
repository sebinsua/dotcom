import NextLink from "next/link";

import type { ReactNode } from "react";
import type { LinkProps as NextLinkProps } from "next/link";

export type LinkProps = Pick<NextLinkProps, "href" | "passHref"> & {
  external?: boolean;
  children?: ReactNode;
};

export function Link({
  href,
  passHref,
  external,
  children,
  ...props
}: LinkProps) {
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
