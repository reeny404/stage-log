import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "StageLog — Built for the arrival spike", template: "%s · StageLog" },
  description: "A resilient global fan-event entry and timed participation experience.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer"><span>STAGELOG</span><p>Stable when every fan arrives at once.</p><small>Reproducible portfolio lab · 2026</small></footer>
      </body>
    </html>
  );
}
