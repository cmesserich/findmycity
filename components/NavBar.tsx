// components/NavBar.tsx
export default function NavBar() {
  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <a href="/" className="text-sm font-semibold text-slate-900">
          Find My City
        </a>

        <nav className="flex items-center gap-4 text-sm">
          <a href="/" className="text-slate-600 hover:text-slate-900">
            Home
          </a>
          <a href="/wizard" className="text-slate-600 hover:text-slate-900">
            Matcher
          </a>
          {/* NEW: Briefs link */}
          <a href="/briefs" className="text-slate-600 hover:text-slate-900">
            Briefs
          </a>
        </nav>
      </div>
    </header>
  );
}
