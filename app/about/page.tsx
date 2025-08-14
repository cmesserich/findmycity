// app/about/page.tsx
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description: `${SITE.name} helps remote workers quickly compare cities, understand how salary translates, and print shareable relocation briefs.`,
  openGraph: {
    title: `About — ${SITE.name}`,
    description: `${SITE.name} makes relocation research fast, clear, and shareable.`,
    url: `${SITE.url}/about`,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About — ${SITE.name}`,
    description: `${SITE.name} makes relocation research fast, clear, and shareable.`,
  },
};

export default function AboutPage() {
  // JSON-LD for richer search previews
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About — ${SITE.name}`,
    url: `${SITE.url}/about`,
    description:
      `${SITE.name} helps remote workers compare cities, understand salary spending power, and print relocation briefs.`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
    },
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Brand marker */}
      <div className="mb-6">
        <Logo />
      </div>

      <h1 className="text-3xl font-semibold">About {SITE.name}</h1>
      <p className="mt-3 text-slate-700 leading-relaxed">
        {SITE.name} makes relocation research fast, clear, and shareable. Compare cities side-by-side,
        see how your salary translates, and print a polished brief you can send to friends, family, or employers.
      </p>

      {/* Primary CTAs */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="/" className="btn-primary">Compare cities</a>
        <a href="/wizard" className="btn-outline">Try the matcher</a>
      </div>

      {/* What we show */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">What we show</h2>
        <ul className="mt-3 list-disc pl-6 text-slate-700 space-y-1">
          <li>Spending power (your salary adjusted by relative price levels)</li>
          <li>Housing snapshot (rent index &amp; median household income)</li>
          <li>Lifestyle signals (internet speed, parks, cafés, bars, climate)</li>
        </ul>
      </section>

      {/* How it works */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">How it works</h2>
        <ol className="mt-3 list-decimal pl-6 text-slate-700 space-y-2">
          <li>Pick two cities and enter your salary.</li>
          <li>We estimate “feels like” salary and highlight lifestyle differences.</li>
          <li>Print or share a one-page brief to decide and get feedback fast.</li>
        </ol>
      </section>

      {/* Data & methodology teaser + link */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">
          <a href="/about/data" className="hover:underline">Data &amp; methodology</a>
        </h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          We combine publicly available datasets and normalized indices to provide directional insights.
          Metrics are simplified for clarity and speed—perfect for early research.{" "}
          <a href="/about/data" className="underline text-slate-900 hover:opacity-80">
            Read the full methodology →
          </a>
        </p>
      </section>

      {/* Partnerships / contact */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Partnerships</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          We’re exploring partnerships with moving companies, internet providers, and real-estate platforms
          to help users go from decision to done. Interested in working with {SITE.name}?{" "}
          <a className="underline" href="mailto:hello@cityscout.app">hello@cityscout.app</a>
        </p>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
