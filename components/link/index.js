/** @jsxImportSource theme-ui */
import NextLink from "next/link";

const canPrefetch = (href) => {
  if (!href || !href.startsWith("/")) {
    return false;
  }

  return true;
};

const resetCss = {
  outline: "none",
  color: "inherit",
  textDecoration: "none",
};
const grayCss = {
  color: "gray",
  ":hover": { color: "primary" },
};

const Link = ({
  external,
  href,
  as,
  passHref,
  children,
  className,

  // Styling
  gray,
  ...props
}) => {
  const sx = {
    ...resetCss,
    ...(gray ? grayCss : {}),
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        sx={sx}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <>
      <NextLink
        href={href}
        as={as}
        prefetch={canPrefetch(href) ? undefined : false}
        passHref={passHref}
      >
        {passHref ? (
          children
        ) : (
          <a sx={sx} href={as} {...props}>
            {children}
          </a>
        )}
      </NextLink>
    </>
  );
};

export default Link;
