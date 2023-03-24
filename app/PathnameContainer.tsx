"use client";

import { usePathname } from "next/navigation";

import type { ReactNode } from "react";

export function PathnameContainer({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="PathnameContainer" data-pathname={pathname}>
      {children}
    </div>
  );
}
