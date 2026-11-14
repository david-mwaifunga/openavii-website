/**
 * Root Layout
 * Fonts (Geist only), page metadata, the pre-hydration theme script, and the
 * theme and enquiry providers.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { InquiryProvider, ThemeProvider } from "@/context";
import { siteMetadata, siteViewport } from "@/lib/seo";
import { themeScript } from "@/lib/themeScript";
import "./globals.css";

/**
 * Geist - the brand's primary typeface (variable font, all weights).
 * Geist Mono is not part of the brand and is no longer loaded.
 */
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Page metadata and viewport come from lib/seo (built from content/site).
 * Icons are supplied by the file conventions in this folder
 * (icon.png, apple-icon.png, favicon.ico, opengraph-image.png), not declared here.
 */
export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = siteViewport;

/**
 * Root layout component.
 * The inline script sets the theme class on <html> before first paint, so
 * suppressHydrationWarning is needed on <html> (React would otherwise see the
 * class difference from the server markup).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZM" className={geist.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <InquiryProvider>{children}</InquiryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
