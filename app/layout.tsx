import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find My City",
  description: "Compare cities, match your vibe, and plan your move.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 min-h-screen`}>
        <NavBar />
        <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
        <footer className="mt-12 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-slate-500">
            © {new Date().getFullYear()} Find My City ·{" "}
            <a className="underline" href="/wizard">Matcher</a> ·{" "}
            <a className="underline" href="/compare?a=washington-dc&b=omaha&salary=100000">Sample compare</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
