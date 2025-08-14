// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter", // reference in Tailwind as var(--font-inter)
});

export const metadata: Metadata = {
  // helps OG/twitter absolute URLs
  metadataBase: new URL(SITE.url),

  title: {
    default: `${SITE.name} – Relocation made simple`,
    template: `%s – ${SITE.name}`,
  },
  description: SITE.tagline,

  openGraph: {
    title: SITE.name,
    description: SITE.tagline,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.tagline,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Inter via next/font + Tailwind font-sans */}
      <body className={`${inter.variable} font-sans`}>
        <NavBar />
        <main className="section py-8 md:py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
