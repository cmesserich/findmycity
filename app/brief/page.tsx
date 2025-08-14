import { getCity, fmtMoney, spendingPower, percentDelta } from "@/lib/compare";
import { normalizeSlug } from "@/lib/slug";
import PrintButton from "@/components/PrintButton";
import PrintBrandHeader from "@/components/PrintBrandHeader";

// import CopyLinkButton if you want a share button here too
// import CopyLinkButton from "@/components/CopyLinkButton";

type SearchParams = { [key: string]: string | string[] | undefined };

// Server Component (no event handlers here)
export default async function BriefPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>; // 👈 Next 15: searchParams is async
}) {
  const params = await searchParams; // 👈 await before using

  const aSlug = normalizeSlug(String(params.a ?? ""));
  const bSlug = normalizeSlug(String(params.b ?? ""));
  const salary = Number(params.salary ?? 100000);

  const a = aSlug ? getCity(aSlug) : undefined;
  const b = bSlug ? getCity(bSlug) : undefined;

  if (!a || !b || !Number.isFinite(salary)) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <PrintBrandHeader/>
        <h1 className="text-2xl font-semibold">Missing or invalid parameters</h1>
        <p className="mt-3 text-slate-600">
          We need valid <code className="rounded bg-slate-100 px-1">a</code>,{" "}
          <code className="rounded bg-slate-100 px-1">b</code>, and{" "}
          <code className="rounded bg-slate-100 px-1">salary</code>.
        </p>
        <p className="mt-4">
          <a className="underline" href="/">
            Go back and try again from the homepage
          </a>
          {"  "}or{"  "}
          <a className="underline" href="/wizard">
            use the matcher
          </a>
          .
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

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-slate-900">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            {b.name}, {b.state} — Relocation brief
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            From {a.name}, {a.state} on{" "}
            <strong className="text-slate-900">{fmtMoney(salary)}</strong>. Spending power in{" "}
            {b.name}: <strong className="text-slate-900">{fmtMoney(spend.destEquivalent)}</strong>{" "}
            (<span className={spend.deltaPct >= 0 ? "text-green-700" : "text-red-700"}>
              {(spend.deltaPct > 0 ? "+" : "") + spend.deltaPct.toFixed(1)}%
            </span>{" "}
            vs {a.name}).
          </p>
        </div>
        <div className="flex gap-2">
          {/* Keep interactivity inside client components only */}
          <PrintButton />
          {/* <CopyLinkButton />  // optional share button if you want */}
        </div>
      </div>

      {/* Summary cards */}
      <section className="card p-6 avoid-break">
        <h2 className="text-lg font-medium">Snapshot</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="card-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Spending power</div>
            <div className="mt-2 text-2xl font-semibold">{fmtMoney(spend.destEquivalent)}</div>
            <div className="mt-1 text-sm text-slate-600">
              feels like in {b.name}
            </div>
          </div>
          <div className="card-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Housing snapshot</div>
            <div className="mt-2 text-sm">
              Rent index: <span className="font-medium">{a.rentIndex}</span> →{" "}
              <span className="font-medium">{b.rentIndex}</span>
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
      </section>

      {/* Mini table of key deltas for credibility */}
      <section className="mt-6 card avoid-break">
        <div className="overflow-x-auto">
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
                const format = (v: number) => (r.money ? fmtMoney(v) : v.toLocaleString());
                return (
                  <tr key={r.label}>
                    <td className="text-slate-800">{r.label}</td>
                    <td>{format(r.a as number)}</td>
                    <td>{format(r.b as number)}</td>
                    <td className={delta >= 0 ? "text-red-700" : "text-green-700"}>
                      {(delta > 0 ? "+" : "") + delta.toFixed(1)}%
                    </td>
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
      </section>

      {/* Actions */}
      <div className="mt-8">
        <a href={`/compare?a=${a.slug}&b=${b.slug}&salary=${salary}`} className="btn-outline no-print">
          Back to comparison
        </a>
      </div>
    </main>
  );
}
