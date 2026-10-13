"use client";

import { ThemeProvider, LocaleProvider } from "@wikitraveler/ui";
import { NodeAuthRetry } from "./NodeAuthRetry";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <NodeAuthRetry>{children}</NodeAuthRetry>
      </LocaleProvider>
    </ThemeProvider>
  );
}
