import { css } from "@linaria/core";

interface HireMeFooterProps {
  works: string[];
}

function HireMeContent({ works }: HireMeFooterProps) {
  return (
    <div
      className={css`
        text-align: center;
        font-family: var(--font-family-text);
        font-size: 1rem;
        font-weight: bold;
        color: white;

        &::before {
          content: "✨✨✨";
          margin-right: 0.5rem;
        }

        &::after {
          content: "✨✨✨";
          margin-left: 0.5rem;
        }
      `}
    >
      <span>I&rsquo;m currently available for {works.join(" or ")} work.</span>{" "}
      <a
        href="mailto:me@sebinsua.com"
        className={css`
          color: white;
          text-decoration: none;
          &:hover {
            border-bottom: 2px solid white;
          }
        `}
      >
        <span
          className={css`
            border-bottom: 2px solid white;
          `}
        >
          Contact me
        </span>{" "}
        to discuss further!
      </a>
    </div>
  );
}

export function HireMeFooter() {
  return (
    <>
      <div
        className={css`
          position: relative;
          width: 100%;
          height: 60px;

          @media (max-width: 576px) {
            height: 120px;
          }
          @media (min-width: 576px) and (max-width: 1024px) {
            height: 90px;
          }
        `}
      ></div>
      <div
        className={css`
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
        `}
      >
        <div
          className={css`
            display: flex;
            justify-content: center;
            padding: 0.55rem;
            background-color: #00e;
          `}
        >
          <HireMeContent works={["freelance"]} />
        </div>
      </div>
    </>
  );
}
