// app/snapshot/page.tsx
import { normalizeSlug } from "@/lib/slug";
import { getCity, spendingPower, fmtMoney } from "@/lib/compare";
import { suggestCitySlugs } from "@/lib/fuzzy";
import { CITIES } from "@/lib/data/cities";
import DeltaPill from "@/components/DeltaPill";
import CopyLinkButton from "@/components/CopyLinkButton";
import PrintButton from "@/components/PrintButton";
import SnapshotSearch from "@/components/SnapshotSearch";

type SearchParams = { [key: string]: string | string[] | undefined };
export const dynamic = "force-dynamic";

export default async function SnapshotPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  // Accept ?city=… (fallback: ?a=…)
  const cityParam = normalizeSlug((sp.city as string) || (sp.a as string) || "");
  const clampSalary = (n: number) =>
    Number.isFinite(n) ? Math.max(0, Math.min(5_000_000, n)) : 100000;
  const salary = clampSalary(Number(sp.salary || 100000));
  const city = cityParam ? getCity(cityParam) : undefined;

  // If no valid city yet: show dedicated search UI (what you described)
  if (!city) {
    const suggestions = cityParam ? suggestCitySlugs(cityParam, 5) : [];
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
          City Snapshot
        </h1>
        <p className="lead">
          Pick a city and salary to see how your spending power and key stats look there.
        </p>

        {/* Search form (city + salary) */}
        <SnapshotSearch initialSalary={salary} initialCitySlug={cityParam || "omaha"} />

        {/* If they typed a bad city string, offer suggestions */}
        {cityParam && suggestions.length > 0 && (
          <>
            <p className="mt-6 text-sm text-slate-600">Did you mean:</p>
            <ul className="mt-2 flex flex-wrap gap-2 text-sm">
              {suggestions.map((s) => (
                <li key={s}>
                  <a className="btn-outline" href={`/snapshot?city=${encodeURIComponent(s)}&salary=${salary}`}>
                    {prettyCityLabel(s)}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    );
  }

  // Valid city: render the report
  const spower = spendingPower(salary, 100, city.rpp); // vs US average
  const shareUrl = `/snapshot?city=${encodeURIComponent(city.slug)}&salary=${salary}`;

  const rows = [
    { label: "Affordability (RPP, lower is cheaper)", v: city.rpp },
    { label: "Rent Index (higher is pricier)", v: city.rentIndex },
    { label: "Median Household Income", v: city.incomeMedian, money: true },
    { label: "Diversity Index (0–1)", v: city.diversityIndex },
    { label: "Internet median Mbps", v: city.internetMbps },
    { label: "Parks per 10k", v: city.parksPer10k },
    { label: "Cafes per 10k", v: city.cafesPer10k },
    { label: "Bars per 10k", v: city.barsPer10k },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {city.name}, {city.state}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Salary entered: <strong className="text-slate-900">{fmtMoney(salary)}</strong>. Versus US average prices,
            that feels like <strong className="text-slate-900">{fmtMoney(spower.destEquivalent)}</strong> in {city.name} (
            <span className={spower.destEquivalent >= salary ? "text-green-700" : "text-red-700"}>
              {(spower.deltaPct > 0 ? "+" : "") + spower.deltaPct.toFixed(1)}%
            </span>
            ).
          </p>
        </div>
        <div className="flex gap-2">
          <a className="btn-outline" href={`/compare?a=${city.slug}&salary=${salary}`}>Add a comparison</a>
          <CopyLinkButton presetHref={shareUrl} />
          <PrintButton />
        </div>
      </div>

      <div className="card">
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="card-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Spending power vs US avg</div>
            <div className="mt-2 text-2xl font-semibold">{fmtMoney(spower.destEquivalent)}</div>
            <div className="mt-1 text-sm text-slate-600">
              <DeltaPill value={spower.deltaPct} good={spower.deltaPct >= 0} />
            </div>
          </div>
          <div className="card-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Housing snapshot</div>
            <div className="mt-2 text-sm">Rent index: <span className="font-medium">{city.rentIndex}</span></div>
            <div className="mt-1 text-sm">Income: <span className="font-medium">{fmtMoney(city.incomeMedian)}</span></div>
          </div>
          <div className="card-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Lifestyle</div>
            <div className="mt-2 text-sm">Internet: <span className="font-medium">{city.internetMbps} Mbps</span></div>
            <div className="mt-1 text-sm">Parks per 10k: <span className="font-medium">{city.parksPer10k}</span></div>
            <div className="mt-1 text-sm">Cafes per 10k: <span className="font-medium">{city.cafesPer10k}</span></div>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-slate-200">
          <table className="table">
            <thead><tr><th>Metric</th><th>Value</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="text-slate-800">{r.label}</td>
                  <td>{r.money ? fmtMoney(r.v as number) : (r.v as number).toLocaleString()}</td>
                </tr>
              ))}
              <tr><td>Climate</td><td>{city.climate}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Handy: let users change city right here, too */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Try another city</h2>
        <SnapshotSearch initialSalary={salary} initialCitySlug={city.slug} />
      </div>
    </main>
  );
}

function prettyCityLabel(slug: string) {
  const c = CITIES.find((x) => x.slug === slug);
  return c ? `${c.name}, ${c.state}` : slug.replace(/-/g, " ");
}
