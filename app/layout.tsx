import { css } from "@linaria/core";

import { PathnameContainer } from "./PathnameContainer";

import "@styles/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div
          className={css`
            display: flex;
            width: 100%;
            justify-content: center;
          `}
        >
          <PathnameContainer>{children}</PathnameContainer>
        </div>
      </body>
    </html>
  );
}
