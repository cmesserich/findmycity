import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Data & Methodology — ${SITE.name}`,
  description: `Learn how ${SITE.name} estimates spending power and summarizes city signals.`,
};

export default function DataMethodologyPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Data &amp; Methodology</h1>
      <p className="mt-3 text-slate-700 leading-relaxed">
        We combine publicly available datasets and normalized indices to provide directional insights for relocation research.
        Our goal is clarity and speed—not financial or legal advice.
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Spending power</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          We adjust your salary by a relative price level index between the two cities to estimate how far your money goes.
          This yields a “feels like” salary in the destination city and a percentage change vs. your current city.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Housing snapshot</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          We summarize housing via a rent index and median household income. These are directional markers that help compare
          affordability across places.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Lifestyle signals</h2>
        <ul className="mt-3 list-disc pl-6 text-slate-700 space-y-1">
          <li><strong>Internet speed:</strong> typical median Mbps</li>
          <li><strong>Parks / cafés / bars per capita:</strong> proxy counts for outdoor and social amenities</li>
          <li><strong>Climate:</strong> a shorthand descriptor (e.g., “continental”, “mediterranean”)</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Limitations</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">
          These comparisons are simplified and can’t capture neighborhood-level nuance. Always pair this with local research
          and up-to-date listings when you’re close to a decision.
        </p>
      </section>

      <div className="mt-10">
        <a href="/about" className="btn-outline">← Back to About</a>
      </div>
    </main>
  );
}
