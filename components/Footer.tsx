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
          <Link href="/about" className="hover:text-slate-900">Learn more</Link>
          <Link href="/wizard" className="hover:text-slate-900">Matcher</Link>
        </nav>
      </div>
    </footer>
  );
}
