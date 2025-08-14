'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { SITE } from '@/lib/site';

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Mark active if exact match OR if this is a parent segment (e.g., /about for /about/data)
  const isActive =
    pathname === href ||
    (href !== '/' && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={
        'transition-colors ' +
        (isActive
          ? 'text-slate-900 font-medium'
          : 'text-slate-600 hover:text-slate-900')
      }
    >
      {children}
    </Link>
  );
}

export default function NavBar() {
  return (
    <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
      <div className="section flex h-14 items-center justify-between">
        <Link href="/" className="logo">
          <img src="/icon.svg" alt="" className="h-5 w-5" />
          <span>CityScout</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {/* Home ➜ Compare Cities */}
          <Link href="/" className="nav-link">Compare Cities</Link>

          {/* Matcher ➜ Find My City (path unchanged: /wizard) */}
          <Link href="/wizard" className="nav-link">Find My City</Link>

          {/* Briefs ➜ City Reports (path unchanged: /briefs) */}
          <Link href="/briefs" className="nav-link">City Reports</Link>

          <Link href="/about" className="nav-link">About</Link>
          <Link href="/about/data" className="nav-link">Data</Link>
        </nav>
      </div>
    </header>
  );
}
