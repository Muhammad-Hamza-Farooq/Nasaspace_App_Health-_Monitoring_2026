import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display-loaded",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const body = IBM_Plex_Sans({
  variable: "--font-body-loaded",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-loaded",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "PULSE — Astronaut Health Monitor",
  description:
    "NASA Space Apps 2026 prototype: gather, evaluate, and act on astronaut health indicators.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body
        className="h-full overflow-hidden"
        style={
          {
            ["--font-display"]: "var(--font-display-loaded), sans-serif",
            ["--font-body"]: "var(--font-body-loaded), sans-serif",
            ["--font-mono"]: "var(--font-mono-loaded), monospace",
          } as CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
