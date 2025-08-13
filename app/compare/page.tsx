import { getCity, percentDelta, spendingPower, fmtMoney } from "@/lib/compare";
import { CITIES } from "@/lib/data/cities";
import { normalizeSlug } from "@/lib/slug";
import DeltaPill from "@/components/DeltaPill";
import CopyLinkButton from "@/components/CopyLinkButton";
import { suggestCitySlugs } from "@/lib/fuzzy";
import type { Metadata } from "next";

export function generateMetadata({ searchParams }: { searchParams: Record<string, string> }): Metadata {
  const a = (searchParams.a ?? "").replace(/-/g, " ");
  const b = (searchParams.b ?? "").replace(/-/g, " ");
  const salary = searchParams.salary ?? "your salary";
  const title = a && b
    ? `Compare ${a} vs ${b} – feels like on $${salary}`
    : "Compare cities – Find My City";
  const description = a && b
    ? `See affordability, rent, internet, amenities and how $${salary} feels moving from ${a} to ${b}.`
    : "Compare cities, check salary spending power, and explore lifestyle tradeoffs.";
  return { title, description };
}


export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };
const clampSalary = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.min(5_000_000, n)) : 100000);

export default function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  const aParam = normalizeSlug((searchParams.a as string) || "");
  const bParam = normalizeSlug((searchParams.b as string) || "");
  const salary = clampSalary(Number(searchParams.salary || 100000));

  const a = aParam ? getCity(aParam) : undefined;
  const b = bParam ? getCity(bParam) : undefined;

  // Friendly invalid-slug screen with suggestions
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
                <a className="btn-outline" href={href}>{s}</a>
              </li>
            );
          })}
        </ul>
      );
    };

    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-slate-900">
        <h1 className="text-2xl font-semibold">We couldn’t find that city</h1>
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
          Try the <a className="underline" href="/wizard">matcher</a> or go back{" "}
          <a className="underline" href="/">home</a>.
        </p>
      </main>
    );
  }

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

  const swapHref = `/compare?a=${b.slug}&b=${a.slug}&salary=${salary}`;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-slate-900">
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
          <a href={swapHref} className="btn-outline">Swap cities</a>
          <CopyLinkButton />
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

        <div className="overflow-x-auto border-t border-slate-200">
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

      <a href="/" className="mt-8 inline-block underline">← New comparison</a>
    </main>
  );
}
