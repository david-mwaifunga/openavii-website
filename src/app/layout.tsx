/**
 * Root Layout
 * Fonts (Geist only), the pre-hydration theme script, and the theme provider.
 * Metadata, structured data and social cards are added in the SEO phase.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/context";
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
 * Site metadata for SEO and social sharing.
 * Icons are supplied by the file conventions in this folder
 * (icon.png, apple-icon.png, favicon.ico), not declared here.
 */
export const metadata: Metadata = {
  title: {
    default: "Openavii Technologies | Illuminating Your Digital Journey",
    template: "%s | Openavii Technologies",
  },
  description:
    "Lusaka-based technology partner. Websites, custom software, automation and consultancy that turn complex business challenges into practical, scalable solutions.",
  authors: [{ name: "David Mwaifunga" }],
  creator: "David Mwaifunga",
  publisher: "Openavii Technologies Limited",
  robots: {
    index: true,
    follow: true,
  },
};

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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
