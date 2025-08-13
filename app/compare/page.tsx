import { getCity, percentDelta, spendingPower, fmtMoney } from "@/lib/compare";
import { CITIES } from "@/lib/data/cities";
import { normalizeSlug } from "@/lib/slug";
import DeltaPill from "@/components/DeltaPill";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };
const clampSalary = (n: number) => Number.isFinite(n) ? Math.max(0, Math.min(5_000_000, n)) : 100000;

export default function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  const aSlug = normalizeSlug((searchParams.a as string) || "");
  const bSlug = normalizeSlug((searchParams.b as string) || "");
  const salary = clampSalary(Number(searchParams.salary || 100000));

  const a = aSlug ? getCity(aSlug) : undefined;
  const b = bSlug ? getCity(bSlug) : undefined;

  if (!a || !b) {
    const known = CITIES.map(c => c.slug).join(", ");
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Compare Cities</h1>
        <p className="mt-4 text-gray-600">
          Missing or invalid parameters. Try:
          <br /><code className="rounded bg-gray-100 px-2 py-1">
            /compare?a=washington-dc&b=omaha&salary=100000
          </code>
        </p>
        <p className="mt-3 text-sm text-gray-500">Known slugs: {known}</p>
        <a href="/" className="mt-6 inline-block text-blue-600 underline">← Home</a>
      </main>
    );
  }

  const spend = spendingPower(salary, a.rpp, b.rpp);

  const rows = [
    { label: "Affordability (RPP, lower is cheaper)", a: a.rpp, b: b.rpp, better: "lower" as const },
    { label: "Rent Index (higher is pricier)",         a: a.rentIndex, b: b.rentIndex, better: "lower" as const },
    { label: "Median Household Income",                a: a.incomeMedian, b: b.incomeMedian, money: true, better: "higher" as const },
    { label: "Diversity Index (0–1)",                  a: a.diversityIndex, b: b.diversityIndex, better: "higher" as const },
    { label: "Internet Median Mbps",                   a: a.internetMbps, b: b.internetMbps, better: "higher" as const },
    { label: "Parks per 10k",                          a: a.parksPer10k, b: b.parksPer10k, better: "higher" as const },
    { label: "Cafes per 10k",                          a: a.cafesPer10k, b: b.cafesPer10k, better: "higher" as const },
    { label: "Bars per 10k",                           a: a.barsPer10k, b: b.barsPer10k, better: "higher" as const },
  ];

  const swapHref = `/compare?a=${b.slug}&b=${a.slug}&salary=${salary}`;
  const shareUrl  = typeof window === "undefined" ? "" : window.location.href;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            {a.name}, {a.state} <span className="text-gray-500">vs</span> {b.name}, {b.state}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Salary entered: <strong className="text-gray-900">{fmtMoney(salary)}</strong>. Based on relative price levels,
            that feels like <strong className="text-gray-900">{fmtMoney(spend.destEquivalent)}</strong> in {b.name}{" "}
            (<span className={spend.destEquivalent >= salary ? "text-green-600" : "text-red-600"}>
              {(spend.deltaPct > 0 ? "+" : "") + spend.deltaPct.toFixed(1)}%
            </span>).
          </p>
        </div>
        <div className="flex gap-2">
          <a href={swapHref} className="rounded border px-3 py-2 text-sm hover:bg-gray-50">Swap cities</a>
          <button
            className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => {
              const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
              navigator.clipboard?.writeText(url);
              alert("Link copied!");
            }}
          >
            Copy link
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Spending power</div>
            <div className="mt-2 text-2xl font-semibold">{fmtMoney(spend.destEquivalent)}</div>
            <div className="mt-1 text-sm text-gray-600">
              in {b.name}&nbsp;
              <DeltaPill value={spend.deltaPct} good={spend.deltaPct >= 0} />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Housing snapshot</div>
            <div className="mt-2 text-sm">Rent index: <span className="font-medium">{a.rentIndex}</span> → <span className="font-medium">{b.rentIndex}</span></div>
            <div className="mt-1 text-sm">Income: <span className="font-medium">{fmtMoney(a.incomeMedian)}</span> → <span className="font-medium">{fmtMoney(b.incomeMedian)}</span></div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Lifestyle</div>
            <div className="mt-2 text-sm">Internet: <span className="font-medium">{b.internetMbps} Mbps</span></div>
            <div className="mt-1 text-sm">Parks per 10k: <span className="font-medium">{b.parksPer10k}</span></div>
            <div className="mt-1 text-sm">Cafes per 10k: <span className="font-medium">{b.cafesPer10k}</span></div>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="border-b border-gray-200 p-3">Metric</th>
                <th className="border-b border-gray-200 p-3">{a.name}</th>
                <th className="border-b border-gray-200 p-3">{b.name}</th>
                <th className="border-b border-gray-200 p-3">Δ (B vs A)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const delta = percentDelta(r.a as number, r.b as number);
                const good =
                  (r.better === "lower" && delta < 0) || (r.better === "higher" && delta > 0);
                const format = (v: number) => (r.money ? fmtMoney(v) : v.toLocaleString());
                return (
                  <tr key={r.label} className="border-b last:border-b-0">
                    <td className="p-3">{r.label}</td>
                    <td className="p-3">{format(r.a as number)}</td>
                    <td className="p-3">{format(r.b as number)}</td>
                    <td className="p-3"><DeltaPill value={delta} good={good} /></td>
                  </tr>
                );
              })}
              <tr>
                <td className="p-3">Climate</td>
                <td className="p-3">{a.climate}</td>
                <td className="p-3">{b.climate}</td>
                <td className="p-3 text-gray-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <a href="/" className="mt-8 inline-block text-blue-600 underline">← New comparison</a>
    </main>
  );
}
