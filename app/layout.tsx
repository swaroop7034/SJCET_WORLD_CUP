import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "GOAL26 — FIFA World Cup 2026 Official Countdown",
  description:
    "The stage is set. Follow every kick, every goal, every glory moment of the FIFA World Cup 2026. Live scores, teams, and the road to the final.",
  authors: [{ name: "GOAL26" }],
  openGraph: {
    title: "GOAL26 — FIFA World Cup 2026",
    description:
      "The stage is set. The world is watching. Follow every kick of the FIFA World Cup 2026.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap"
        />
       
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
