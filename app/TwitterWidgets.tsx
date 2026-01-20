"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

export function TwitterWidgets() {
  const pathname = usePathname();

  // Re-render Twitter widgets when navigating to a new page
  useEffect(() => {
    if (window.twttr?.widgets?.load) {
      window.twttr.widgets.load();
    }
  }, [pathname]);

  return (
    <Script
      src="https://platform.twitter.com/widgets.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (window.twttr?.widgets?.load) {
          window.twttr.widgets.load();
        }
      }}
    />
  );
}
