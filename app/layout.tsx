import { css } from "@linaria/core";

import { HireMeFooter } from "./HireMeFooter";
import { TwitterWidgets } from "./TwitterWidgets";

import "@styles/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLookingForWork = false;
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/SpaceMono-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div
          className={css`
            display: flex;
            justify-content: center;
            width: 100%;

            @media (max-width: 768px) {
              display: revert;
              justify-content: unset;
            }
          `}
        >
          {children}
        </div>
        {isLookingForWork ? <HireMeFooter /> : null}
        <TwitterWidgets />
      </body>
    </html>
  );
}
