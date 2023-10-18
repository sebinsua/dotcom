import { css } from "@linaria/core";

import { PathnameContainer } from "./PathnameContainer";
import { HireMeFooter } from "./HireMeFooter";

import "@styles/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLookingForWork = true;
  return (
    <html lang="en">
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
          <PathnameContainer>{children}</PathnameContainer>
        </div>
        {isLookingForWork ? <HireMeFooter /> : null}
      </body>
    </html>
  );
}
