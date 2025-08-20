// app/compare/page.tsx
import type { Metadata } from "next";
import { getCity, percentDelta, spendingPower, fmtMoney } from "@/lib/compare";
import { normalizeSlug } from "@/lib/slug";
import DeltaPill from "@/components/DeltaPill";
import { suggestCitySlugs } from "@/lib/fuzzy";
import PrintButton from "@/components/PrintButton";
import CopyLinkButton from "@/components/CopyLinkButton";
import Link from "next/link";


export const dynamic = "force-dynamic";

type SP = { a?: string; b?: string; salary?: string };

// ---- metadata (must await searchParams on Next 15)
export async function generateMetadata(
  { searchParams }: { searchParams: Promise<Record<string, string>> }
): Promise<Metadata> {
  const sp = await searchParams;
  const a = (sp.a ?? "").replace(/-/g, " ");
  const b = (sp.b ?? "").replace(/-/g, " ");
  const salary = sp.salary ?? "your salary";

  const title =
    a && b
      ? `Compare ${a} vs ${b} – feels like on $${salary} | CityScout`
      : "Compare cities – CityScout";

  const description =
    a && b
      ? `See affordability, rent, internet, amenities, and how $${salary} feels moving from ${a} to ${b}.`
      : "Compare cities, check salary spending power, and explore lifestyle tradeoffs.";

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description, card: "summary_large_image" },
  };
}

const clampSalary = (n: number) =>
  Number.isFinite(n) ? Math.max(0, Math.min(5_000_000, n)) : 100_000;

export default async function ComparePage(
  { searchParams }: { searchParams: Promise<SP> }
) {
  const sp = await searchParams;
  const aParam = normalizeSlug(sp.a || "");
  const bParam = normalizeSlug(sp.b || "");
  const salary = clampSalary(Number(sp.salary || 100000));

  const a = aParam ? getCity(aParam) : undefined;
  const b = bParam ? getCity(bParam) : undefined;

  // ---- Friendly invalid-slug screen with suggestions
  if (!a || !b) {
    const salaryStr = String(salary || 100000);

    const suggestList = (badSlug: string, forParam: "a" | "b", keepOther: string) => {
      if (!badSlug) return null;
      const suggestions = suggestCitySlugs(badSlug, 3);
      if (suggestions.length === 0) return null;
      return (
  <ul className="mt-2 flex flex-wrap gap-2 text-sm">
    {suggestions.map((s) => {
      const href =
        forParam === "a"
          ? `/compare?a=${encodeURIComponent(s)}&b=${encodeURIComponent(keepOther)}&salary=${salaryStr}`
          : `/compare?a=${encodeURIComponent(keepOther)}&b=${encodeURIComponent(s)}&salary=${salaryStr}`;
      return (
        <li key={`${forParam}-${s}`}>
          <Link className="btn-outline" href={href}>{s}</Link>
        </li>
      );
    })}
  </ul>
      );
    };

    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold">We couldn’t find that city</h1>
        {!a && (
          <>
            <p className="mt-3">
              Unknown city A:{" "}
              <code className="rounded bg-slate-100 px-1">{aParam || "(blank)"}</code>
            </p>
            {bParam && suggestList(aParam, "a", bParam)}
          </>
        )}
        {!b && (
          <>
            <p className="mt-3">
              Unknown city B:{" "}
              <code className="rounded bg-slate-100 px-1">{bParam || "(blank)"}</code>
            </p>
            {aParam && suggestList(bParam, "b", aParam)}
          </>
        )}
        <p className="mt-6 text-sm text-slate-600">
  Try the <Link className="underline" href="/wizard">Find My City</Link> tool or go back{" "}
  <Link className="underline" href="/">home</Link>.
</p>
      </main>
    );
  }

  // spending power: A -> B (A salary adjusted by relative price levels)
  const spend = spendingPower(salary, a.rpp, b.rpp);

  const rows = [
    { label: "Affordability (RPP, lower is cheaper)", a: a.rpp, b: b.rpp, better: "lower" as const },
    { label: "Rent Index (higher is pricier)", a: a.rentIndex, b: b.rentIndex, better: "lower" as const },
    { label: "Median Household Income", a: a.incomeMedian, b: b.incomeMedian, money: true, better: "higher" as const },
    { label: "Diversity Index (0–1)", a: a.diversityIndex, b: b.diversityIndex, better: "higher" as const },
    { label: "Internet Median Mbps", a: a.internetMbps, b: b.internetMbps, better: "higher" as const },
    { label: "Parks per 10k", a: a.parksPer10k, b: b.parksPer10k, better: "higher" as const },
    { label: "Cafes per 10k", a: a.cafesPer10k, b: b.cafesPer10k, better: "higher" as const },
    { label: "Bars per 10k", a: a.barsPer10k, b: b.barsPer10k, better: "higher" as const },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {a.name}, {a.state} <span className="text-slate-500">vs</span> {b.name}, {b.state}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Salary entered: <strong className="text-slate-900">{fmtMoney(salary)}</strong>. Based on relative price levels,
            that feels like <strong className="text-slate-900">{fmtMoney(spend.destEquivalent)}</strong> in {b.name} (
            <span className={spend.destEquivalent >= salary ? "text-green-700" : "text-red-700"}>
              {(spend.deltaPct > 0 ? "+" : "") + spend.deltaPct.toFixed(1)}%
            </span>
            ).
          </p>
        </div>
        <div className="flex gap-2">
  <Link href={`/compare?a=${b.slug}&b=${a.slug}&salary=${salary}`} className="btn btn-outline">
    Swap cities
  </Link>
  <CopyLinkButton className="btn btn-outline" />
 <PrintButton className="btn btn-outline" label="Export report" />


</div>
      </div>

      <div className="card">
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="card-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Spending power</div>
            <div className="mt-2 text-2xl font-semibold">{fmtMoney(spend.destEquivalent)}</div>
            <div className="mt-1 text-sm text-slate-600">
              in {b.name}&nbsp;<DeltaPill value={spend.deltaPct} good={spend.deltaPct >= 0} />
            </div>
          </div>
          <div className="card-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Housing snapshot</div>
            <div className="mt-2 text-sm">
              Rent index: <span className="font-medium">{a.rentIndex}</span> → <span className="font-medium">{b.rentIndex}</span>
            </div>
            <div className="mt-1 text-sm">
              Income: <span className="font-medium">{fmtMoney(a.incomeMedian)}</span> →{" "}
              <span className="font-medium">{fmtMoney(b.incomeMedian)}</span>
            </div>
          </div>
          <div className="card-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Lifestyle</div>
            <div className="mt-2 text-sm">Internet: <span className="font-medium">{b.internetMbps} Mbps</span></div>
            <div className="mt-1 text-sm">Parks per 10k: <span className="font-medium">{b.parksPer10k}</span></div>
            <div className="mt-1 text-sm">Cafes per 10k: <span className="font-medium">{b.cafesPer10k}</span></div>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-[color:var(--border)]">
          <table className="table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>{a.name}</th>
                <th>{b.name}</th>
                <th>Δ (B vs A)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const delta = percentDelta(r.a as number, r.b as number);
                const good = (r.better === "lower" && delta < 0) || (r.better === "higher" && delta > 0);
                const format = (v: number) => (r.money ? fmtMoney(v) : v.toLocaleString());
                return (
                  <tr key={r.label}>
                    <td className="text-slate-800">{r.label}</td>
                    <td>{format(r.a as number)}</td>
                    <td>{format(r.b as number)}</td>
                    <td><DeltaPill value={delta} good={good} /></td>
                  </tr>
                );
              })}
              <tr>
                <td>Climate</td>
                <td>{a.climate}</td>
                <td>{b.climate}</td>
                <td className="text-slate-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links to pair briefs (A->B and B->A) */}
      <section className="mt-8">
        <div className="mt-8 card p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div className="text-sm text-slate-600">Want the full City Report with more detail?</div>
  <div className="flex flex-wrap gap-2">
    <Link className="btn btn-outline" href={`/brief?a=${a.slug}&b=${b.slug}&salary=${salary}`}>
      View City Report (to {b.name})
    </Link>
    <Link className="btn btn-outline" href={`/brief?a=${b.slug}&b=${a.slug}&salary=${salary}`}>
      View City Report (to {a.name})
    </Link>
  </div>
</div>


      </section>

      <a href="/" className="mt-8 inline-block underline">← New comparison</a>
    </main>
  );
}
