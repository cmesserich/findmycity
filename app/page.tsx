// app/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

const PRESETS = [
  { a: "washington-dc", b: "omaha",       label: "Washington, DC → Omaha, NE",    chip: "+18% spending power" },
  { a: "new-york-city", b: "miami",       label: "New York, NY → Miami, FL",      chip: "+9% spending power"  },
  { a: "seattle",       b: "austin",      label: "Seattle, WA → Austin, TX",      chip: "+6% spending power"  },
  { a: "san-diego",     b: "denver",      label: "San Diego, CA → Denver, CO",    chip: "+7% spending power"  },
];

export default function HomePage() {
  return (
    <main className="home-flush">
     <section className="relative isolate flow-root">
  {/* HERO — full-bleed, bold, and accessible */}
  {/* background art and wash, pinned to section height */}
  <div className="full-bleed-abs hero-bg">
    {/* Rotated micro-grid (soft feather) */}
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[-6%] h-[140%] w-[120%] -translate-x-1/2 -rotate-[3deg] opacity-[0.24]
                 [mask-image:radial-gradient(70%_60%_at_50%_35%,_#000_60%,_transparent_100%)]"
      viewBox="0 0 100 100" preserveAspectRatio="none"
    >
      <defs>
        <pattern id="cs-grid" width="4" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cs-grid)" style={{ color: "var(--brand)" }} />
    </svg>
  </div>
  <div className="full-bleed-abs hero-contrast" />

  {/* constrained content */}
  <div className="section hero-content py-14 md:py-20">
    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 max-w-3xl">
      Pick two cities. See your life side-by-side.
    </h1>
    <p className="mt-3 max-w-2xl text-slate-600">
      CityScout shows how your salary and lifestyle change when you move—then gives you clean, printable reports.
    </p>

    <div className="mt-6 flex flex-wrap gap-2">
      <Link href="/wizard" className="btn btn-primary shadow-md">Find Your City</Link>
      <Link href="/compare" className="btn btn-white shadow-sm ring-1 ring-[color:var(--border)]">Compare Cities</Link>
      <Link href="/snapshot" className="btn btn-outline">City Scouting Report</Link>
    </div>

    <p className="mt-3 text-xs text-slate-700">No account needed · Free to start</p>
  </div>
</section>





      {/* LIVE EXAMPLES */}
      <section className="section py-10">
        <h2 className="text-sm font-medium text-slate-700">Try a popular comparison</h2>

        <div className="card mt-3 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {PRESETS.map((p) => (
              <Link
                key={p.label}
                href={`/compare?a=${p.a}&b=${p.b}&salary=100000`}
                className="btn w-full justify-between bg-white hover:bg-[color:var(--surface-2)]"
              >
                <span>{p.label}</span>
                <span className="pill pill-good">{p.chip}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section pb-4">
        <h2 className="text-xl font-semibold text-slate-900">How it works</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              n: "1",
              t: "Compare or discover",
              p: "Start with Compare Cities or Find Your City. Choose two places—or dial in your preferences."
            },
            {
              n: "2",
              t: "See the trade-offs",
              p: "We normalize salary for local prices and show lifestyle factors like internet, parks, and cafés."
            },
            {
              n: "3",
              t: "Share a clean report",
              p: "Export a one-page brief to send to family, recruiters, or HR—fast and professional."
            },
          ].map(({ n, t, p }) => (
            <div key={n} className="card p-5">
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--brand)] text-[color:var(--brand)] text-sm font-semibold">
                {n}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{t}</h3>
              <p className="mt-1 text-sm text-slate-600">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FREE vs PRO TEASER */}
      <section className="section py-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Free</h3>
            <p className="mt-1 text-sm text-slate-600">
              Core comparison with 10 key metrics and printable City Reports.
            </p>
            <ul className="mt-3 text-sm text-slate-700 list-disc pl-5 space-y-1">
              <li>Salary adjusted by local prices (spending power)</li>
              <li>Rent index, median income</li>
              <li>Internet, parks, cafés, nightlife</li>
              <li>Clean, one-page export</li>
            </ul>
            <div className="mt-4">
              <Link href="/compare" className="btn btn-primary">Start free</Link>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">Pro</h3>
              <span className="pill pill-neutral">Coming soon</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Deeper dive (50–100+ metrics), neighborhoods roll-ups, and partner offers.
            </p>
            <ul className="mt-3 text-sm text-slate-700 list-disc pl-5 space-y-1">
              <li>Advanced QoL + commute + safety indices</li>
              <li>School & childcare overlays</li>
              <li>Housing trends & taxes</li>
              <li>Save, compare, and share multiple reports</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/contact?subject=CityScout%20Pro%20waitlist"
                className="btn btn-outline"
              >
                Join Pro waitlist
              </Link>
              <Link
                href="/contact?subject=Pro%20pricing%20question"
                className="btn btn-outline"
              >
                Ask about pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST / PARTNERS STRIP */}
      <section className="section pb-14">
        <div className="card p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-700">
            Hiring, relocating, or partnering? We’d love to talk.
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/contact?subject=Join%20the%20CityScout%20waitlist"
              className="btn btn-outline"
            >
              Join the waitlist
            </Link>
            <Link
              href="/contact?subject=Partnerships%20and%20integrations"
              className="btn btn-outline"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
