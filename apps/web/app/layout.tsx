import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "StageLog — Your front row, everywhere", template: "%s · StageLog" },
  description: "Discover live stages, local schedules, and original performance stories.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer"><span>STAGELOG</span><p>One stage. Every timezone.</p><small>Fictional portfolio project · 2026</small></footer>
      </body>
    </html>
  );
}
