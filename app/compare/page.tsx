// app/compare/page.tsx
import Link from "next/link";
import CityAutocomplete from "@/components/CityAutocomplete";
import CopyLinkButton from "@/components/CopyLinkButton";
import PrintButton from "@/components/PrintButton";
import DeltaPill from "@/components/DeltaPill";

import { normalizeSlug } from "@/lib/slug";
import { getCity, spendingPower, percentDelta, fmtMoney } from "@/lib/compare";
// (Optional) import { suggestCitySlugs } from "@/lib/fuzzy";

type SP = { a?: string; b?: string; salary?: string };

function resolveSearchParams(sp: SP | Promise<SP>): Promise<SP> {
  return (typeof (sp as any)?.then === "function")
    ? (sp as Promise<SP>)
    : Promise.resolve(sp as SP);
}

const clampSalary = (n: number) =>
  Number.isFinite(n) ? Math.max(0, Math.min(5_000_000, n)) : 100_000;

export const dynamic = "force-dynamic";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await resolveSearchParams(searchParams);

 // --- NEW: derive defaults from query (works when coming from Snapshot or chips)
  const defaultA = typeof sp.a === "string" && sp.a.trim() ? sp.a : undefined;
  const defaultB = typeof sp.b === "string" && sp.b.trim() ? sp.b : undefined;
  const defaultSalary =
    typeof sp.salary === "string" && sp.salary.trim() ? sp.salary : "";

  // Parse inputs
  const aParam = normalizeSlug(sp.a || "");
  const bParam = normalizeSlug(sp.b || "");
  const salary = clampSalary(Number(sp.salary || 100000));

  const a = aParam ? getCity(aParam) : undefined;
  const b = bParam ? getCity(bParam) : undefined;

  // ---------- EMPTY / BUILDER STATE (no valid pair yet)
  if (!a || !b) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
          Compare Cities
        </h1>
        <p className="mt-2 text-slate-600">
          Compare two US cities and see how your salary and lifestyle might change.
        </p>

        {/* Helper buttons under the intro, same style everywhere */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/wizard" className="btn btn-outline">Find Your City</Link>
          <Link href="/snapshot" className="btn btn-outline">City Scouting Report</Link>
        </div>

        {/* Form row */}
        <form
          id="compare-form"
          action="/compare"
          method="GET"
          className="mt-8 grid gap-4 sm:grid-cols-[1fr,1fr,200px,auto] sm:items-end"
        >
          <div>
            <CityAutocomplete
              id="cityA"
              name="a"
              label="City A"
              placeholder="Start typing a city…"
              defaultSlug={defaultA}
            />
          </div>
          <div>
            <CityAutocomplete
              id="cityB"
              name="b"
              label="City B"
              placeholder="Start typing a city…"
              defaultSlug={defaultB}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Salary (USD)</label>
            <input
              className="input mt-1"
              type="number"
              name="salary"
              placeholder="e.g. $100,000"
              min={0}
              step={1000}
              defaultValue={defaultSalary}
            />
          </div>
          <div className="self-end">
            <button type="submit" className="btn btn-primary w-full sm:w-auto">Compare</button>
          </div>

          {/* Share comparison (composes URL from this form) */}
          <div className="sm:col-span-4">
            <CopyLinkButton formId="compare-form" className="btn-outline" label="Share comparison" />
          </div>
        </form>

        {/* Popular comparisons */}
        <section className="mt-8">
          <h3 className="text-sm font-medium text-slate-700">Popular comparisons</h3>
          <div className="card mt-2 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { a: "washington-dc", b: "omaha",  label: "Washington, DC → Omaha, NE" },
                { a: "new-york-city", b: "miami",  label: "New York, NY → Miami, FL" },
                { a: "seattle",       b: "austin", label: "Seattle, WA → Austin, TX" },
                { a: "san-diego",     b: "denver", label: "San Diego, CA → Denver, CO" },
              ].map((p) => (
                <Link
                  key={`${p.a}-${p.b}`}
                  href={{ pathname: "/compare", query: { a: p.a, b: p.b, salary: "100000" } }}
                  prefetch={false}
                  className="btn btn-white w-full justify-between"
                >
                  <span>{p.label}</span>
                  <span aria-hidden>→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ---------- RESULTS STATE (valid pair)
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
          <Link href={{ pathname: "/compare", query: { a: b.slug, b: a.slug, salary: String(salary) } }} className="btn btn-outline">
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
              in {b.name}&nbsp;<DeltaPill value={spend.deltaPct} good={spend.destEquivalent >= salary} />
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

      {/* Pair briefs (A->B and B->A) */}
      <section className="mt-8">
        <div className="mt-8 card p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">Want the full City Report with more detail?</div>
          <div className="flex flex-wrap gap-2">
            <Link className="btn btn-outline" href={{ pathname: "/brief", query: { a: a.slug, b: b.slug, salary: String(salary) } }}>
              View City Report (to {b.name})
            </Link>
            <Link className="btn btn-outline" href={{ pathname: "/brief", query: { a: b.slug, b: a.slug, salary: String(salary) } }}>
              View City Report (to {a.name})
            </Link>
          </div>
        </div>
      </section>

      <Link href="/" className="mt-8 inline-block underline">← New comparison</Link>
    </main>
  );
}
