// components/Footer.tsx
import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200">
      <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between text-sm text-slate-600">
        <span>© {year} {SITE.name}</span>
        <nav className="flex items-center gap-4">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <Link href="/snapshot"className="hover:text-slate-900">City Scouting Report</Link>
          <Link href="/compare"className="hover:text-slate-900">Compare Cities</Link>
          <Link href="/wizard"className="hover:text-slate-900">Find Your City</Link>
          <Link href="/about" className="hover:text-slate-900">About</Link>
          <Link href="/contact"className="hover:text-slate-900">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
