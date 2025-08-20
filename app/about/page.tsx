// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CityScout",
  description:
    "Who we are, what we believe, and how CityScout helps you choose where to live.",
  openGraph: { title: "About CityScout" },
  twitter: { title: "About CityScout", card: "summary" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero */}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
        About CityScout
      </h1>
      <p className="mt-3 text-slate-600">
        CityScout helps remote workers and movers make confident, modern
        relocation decisions—fast. We turn messy data into clear comparisons and
        one-page reports you can share with friends, family, or hiring teams.
      </p>

      {/* Quick CTAs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/wizard" className="btn btn-primary">Find Your City</Link>
        <Link href="/compare" className="btn btn-outline">Compare Cities</Link>
        <Link href="/contact" className="btn btn-outline">Contact</Link>
      </div>

      {/* Story & Team */}
      <section id="story" className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">Our story</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Why we built CityScout</h3>
            <p className="mt-3 text-sm text-slate-700">
              Moving is a high-stakes decision that’s usually made with a handful
              of tabs, outdated “cost of living” calculators, and gut feel.
              We wanted a tool that feels like a financial dashboard—clean,
              objective, and fast—while still reflecting the lifestyle tradeoffs
              that actually matter.
            </p>
            <p className="mt-3 text-sm text-slate-700">
              CityScout started as a side project to compare where we lived to
              where we might go next. Friends began asking for custom reports.
              That’s when we realized there should be a simpler, more credible way
              for everyone to scout cities.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold">Who we are</h3>
            <p className="mt-3 text-sm text-slate-700">
              We’re a small remote team of product designers, data people, and
              engineers who have lived in big cities, small towns, and everything
              between. We’re obsessive about clarity, pragmatic about models, and
              allergic to dark patterns.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li><span className="font-medium">Product & Research:</span> turns user needs into simple flows.</li>
              <li><span className="font-medium">Data & Engineering:</span> builds the scoring pipeline and fallbacks.</li>
              <li><span className="font-medium">Design & Brand:</span> keeps the experience calm, modern, and printable.</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Interested in collaborating or partnering?{" "}
              <Link href="/contact" className="underline">Say hello</Link>.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold">What we value</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-700">
              <li>
                <span className="font-medium">Clarity over noise:</span> one page, the right metrics, plain language.
              </li>
              <li>
                <span className="font-medium">Honest tradeoffs:</span> we show when a place is cheaper but slower, or pricier but faster.
              </li>
              <li>
                <span className="font-medium">Professional polish:</span> reports you’re proud to send to a recruiter or partner.
              </li>
              <li>
                <span className="font-medium">Privacy by default:</span> we don’t sell personal data; we build for trust.
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold">Who we serve</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>Remote workers exploring new cities.</li>
              <li>People relocating for a job and needing a quick, credible brief.</li>
              <li>Hiring & People teams who want better candidate relocation support.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/wizard" className="btn btn-outline">Try the matcher</Link>
              <Link href="/briefs" className="btn btn-outline">See City Reports</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology (marketing-safe) */}
      <section id="methodology" className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">How CityScout works</h2>
        <p className="mt-2 text-slate-600">
          A high-level overview of what we measure and how we turn it into
          a score—transparent without exposing proprietary weighting.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold">What we measure</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li><strong>Affordability:</strong> overall price levels and housing pressure.</li>
              <li><strong>Housing:</strong> rent index relative to peers.</li>
              <li><strong>Connectivity:</strong> median internet speeds.</li>
              <li><strong>Amenities:</strong> parks, cafés, and nightlife density.</li>
              <li><strong>Diversity:</strong> mix of people and backgrounds.</li>
              <li><strong>Mobility (coming soon):</strong> commute times & transit share.</li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold">How we score</h3>
            <p className="mt-3 text-sm text-slate-700">
              We normalize each metric across places to a 0–1 range, apply
              user-chosen weights, and combine them into a composite score out of
              100. Some metrics invert (lower is better), others reward higher values.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              We don’t publish exact weights or the full feature list publicly.
              Need more detail? <Link href="/contact" className="underline">Get in touch</Link>.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold">Geography policy</h3>
            <p className="mt-3 text-sm text-slate-700">
              We use the lowest reliable geography available for each metric.
              When a value is missing, we fall back in this order:
              <em> Place → CBSA (metro/micro) → County → State</em>. This keeps
              small towns searchable while maintaining coverage.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold">Refresh & quality</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>Rolling source updates; consolidated quarterly releases.</li>
              <li>Outlier checks and unit consistency validation.</li>
              <li>We surface caveats when fallbacks are used.</li>
            </ul>
          </div>

          <div className="card p-6 md:col-span-2">
            <h3 className="text-lg font-semibold">Caveats</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>Prototype dataset; some values are illustrative or aggregated.</li>
              <li>Affordability is directional and not a personal budget.</li>
              <li>Coverage and metric depth will expand over time.</li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/wizard" className="btn btn-outline">Try the matcher</Link>
              <Link href="/compare" className="btn btn-outline">Compare cities</Link>
              <Link href="/contact" className="btn btn-outline">Request a datasheet</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
