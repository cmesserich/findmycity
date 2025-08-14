// components/NavBar.tsx
import Logo from "@/components/Logo";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4 text-sm">
          <a href="/" className="text-slate-600 hover:text-slate-900">Home</a>
          <a href="/wizard" className="text-slate-600 hover:text-slate-900">Matcher</a>
          <a href="/briefs" className="text-slate-600 hover:text-slate-900">Briefs</a>
          <a href="/About" className="text-slate-600 hover:text-slate-900">About</a>
        </nav>
      </div>
    </header>
  );
}
