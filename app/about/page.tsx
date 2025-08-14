import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description: `${SITE.name} helps remote workers compare cities and create printable relocation briefs.`,
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6">
        <Logo />
      </div>

      <h1 className="text-3xl font-semibold">About {SITE.name}</h1>
      <p className="mt-3 text-slate-700">
        {SITE.name} makes relocation research fast, clear, and shareable. Compare cities side-by-side, 
        understand how your salary translates, and print a polished brief you can send to friends, 
        family, or employers.
      </p>

      <h2 className="mt-8 text-xl font-semibold">What we show</h2>
      <ul className="mt-3 list-disc pl-6 text-slate-700 space-y-1">
        <li>Spending power (salary adjusted by relative price levels)</li>
        <li>Housing snapshot (rent index &amp; median income)</li>
        <li>Lifestyle signals (internet speed, parks, cafés, bars, climate)</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Why it matters</h2>
      <p className="mt-3 text-slate-700">
        Relocation decisions are stressful. We reduce the noise so you can focus on trade-offs that matter and 
        move forward confidently.
      </p>
    </main>
  );
}
