"use client";

import * as React from "react";

export function ThemeProvider({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) {
  React.useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return <>{children}</>;
}