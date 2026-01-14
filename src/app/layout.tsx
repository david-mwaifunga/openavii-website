/**
 * Root Layout
 * Main layout wrapper for the Openavii Technologies website.
 * Configures fonts, metadata, theme provider, and global structure.
 * Supports light and dark themes with system preference detection.
 *
 * @author David Mwaifunga
 * @company Openavii Technologies
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context";
import "./globals.css";

/**
 * Geist Sans font configuration
 * Modern, clean sans-serif typeface by Vercel
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Geist Mono font configuration
 * Monospace variant for code and technical content
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Site metadata for SEO and social sharing
 */
export const metadata: Metadata = {
  title: {
    default: "Openavii Technologies | Website Development Packages",
    template: "%s | Openavii Technologies",
  },
  description:
    "Transform your vision into a stunning online presence. Openavii Technologies offers professional website development packages for startups and businesses in Zambia.",
  keywords: [
    "website development",
    "web design",
    "Zambia",
    "startup website",
    "business website",
    "Openavii",
    "digital solutions",
  ],
  authors: [{ name: "David Mwaifunga" }],
  creator: "David Mwaifunga",
  publisher: "Openavii Technologies",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Openavii Technologies",
    title: "Openavii Technologies | Website Development Packages",
    description:
      "Transform your vision into a stunning online presence. Professional website development packages for startups and businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Openavii Technologies | Website Development Packages",
    description:
      "Transform your vision into a stunning online presence. Professional website development packages.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Root layout component
 * Wraps all pages with fonts, theme provider, and base styling.
 * Theme is managed by ThemeProvider which applies 'light' or 'dark' class to html.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-white dark:bg-slate-950
          text-slate-900 dark:text-slate-50
          transition-colors duration-300
        `}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
