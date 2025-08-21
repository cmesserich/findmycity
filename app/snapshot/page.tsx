// app/snapshot/page.tsx
import Link from "next/link";
import CityAutocomplete from "@/components/CityAutocomplete";
import { normalizeSlug } from "@/lib/slug";
import { getCity, spendingPower, fmtMoney } from "@/lib/compare";
import { suggestCitySlugs } from "@/lib/fuzzy";
import { CITIES } from "@/lib/data/cities";
import DeltaPill from "@/components/DeltaPill";
import CopyLinkButton from "@/components/CopyLinkButton";
import PrintButton from "@/components/PrintButton";

const POPULAR_SLUGS = [
  "washington-dc",
  "new-york-city",
  "austin",
  "denver",
  "miami",
  "seattle",
  "phoenix",
  "boston",
];


type SearchParams = { [key: string]: string | string[] | undefined };
export const dynamic = "force-dynamic";

function firstParam(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function SnapshotPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  // Accept ?city=… (fallback: ?a=…)
  const cityRaw = firstParam(sp.city) ?? firstParam(sp.a) ?? "";
  const cityParam = normalizeSlug(cityRaw);

  const clampSalary = (n: number) =>
    Number.isFinite(n) ? Math.max(0, Math.min(5_000_000, n)) : 100000;
  const salary = clampSalary(Number(firstParam(sp.salary) ?? 100000));

  const city = cityParam ? getCity(cityParam) : undefined;

  // ---------- No valid city yet: show search UI
  if (!city) {
    const suggestions = cityParam ? suggestCitySlugs(cityParam, 5) : [];

{/* Popular cities */}
<section className="mt-10">
  <h3 className="text-sm font-medium text-slate-700">Popular cities</h3>
  <div className="card mt-2 p-4">
    <div className="grid gap-3 sm:grid-cols-2">
      {POPULAR_SLUGS.map((slug) => (
        <Link
          key={slug}
          href={`/snapshot?city=${slug}&salary=${salary}`}
          className="btn btn-white w-full justify-between"
        >
          <span>{prettyCityLabel(slug)}</span>
          <span aria-hidden>→</span>
        </Link>
      ))}
    </div>
  </div>
</section>

    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
          City Scouting Report
        </h1>
        <p className="mt-2 text-slate-600">
          Pick a city and salary to see how your spending power and key stats
          look there.
        </p>

        {/* Helper nav buttons (match Compare page style) */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/wizard" className="btn btn-outline">
            Find Your City
          </Link>
          <Link href="/compare" className="btn btn-outline">
            Compare Cities
          </Link>
        </div>

        {/* Search form (city + salary) */}
        <form
  action="/snapshot"
  className="mt-8 grid gap-4 sm:grid-cols-[1fr,auto,auto] sm:items-end"
>
  <div>
    <CityAutocomplete
      id="city"
      name="city"                     // <-- send ?city=...
      label="City"
      placeholder="Start typing a city…"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-700">Salary (USD)</label>
    <input
      type="number"
      name="salary"
      placeholder="e.g. $100,000"
      min={0}
      step={1000}
      className="input mt-1"
    />
  </div>

  <button type="submit" className="btn btn-primary w-full sm:w-auto">
    View snapshot
  </button>
</form>

{/* Or explore popular cities */}
<section className="mt-6">
  <h3 className="text-sm font-medium text-slate-700">Popular cities</h3>
  <div className="card mt-2 p-4">
    <div className="grid gap-3 sm:grid-cols-2">
      {POPULAR_SLUGS.map((slug) => (
        <Link
          key={slug}
          href={`/snapshot?city=${slug}&salary=${salary}`}
          className="btn btn-white w-full justify-between"
        >
          <span>{prettyCityLabel(slug)}</span>
          <span aria-hidden>→</span>
        </Link>
      ))}
    </div>
  </div>
</section>


        {/* If they typed a near-miss, offer suggestions */}
        {cityParam && suggestions.length > 0 && (
          <>
            <p className="mt-6 text-sm text-slate-600">Did you mean:</p>
            <ul className="mt-2 flex flex-wrap gap-2 text-sm">
              {suggestions.map((s) => (
                <li key={s}>
                  <Link
                    className="btn-outline"
                    href={`/snapshot?city=${encodeURIComponent(s)}&salary=${salary}`}
                  >
                    {prettyCityLabel(s)}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    );
  }

  // ---------- Valid city: render the report
  // Compare to US average (RPP 100)
  const spower = spendingPower(salary, 100, city.rpp);
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
            Salary entered:{" "}
            <strong className="text-slate-900">{fmtMoney(salary)}</strong>.
            Versus US average prices, that feels like{" "}
            <strong className="text-slate-900">
              {fmtMoney(spower.destEquivalent)}
            </strong>{" "}
            in {city.name} (
            <span
              className={
                spower.destEquivalent >= salary ? "text-green-700" : "text-red-700"
              }
            >
              {(spower.deltaPct > 0 ? "+" : "") + spower.deltaPct.toFixed(1)}%
            </span>
            ).
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            className="btn btn-outline"
            href={`/compare?a=${city.slug}&salary=${salary}`}
          >
            Add a comparison
          </Link>
          <CopyLinkButton className="btn-outline" presetHref={shareUrl} />
          <PrintButton className="btn-outline" label="Export report" />
        </div>
      </div>

      <div className="card">
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="card-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Spending power vs US avg
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {fmtMoney(spower.destEquivalent)}
            </div>
            <div className="mt-1 text-sm text-slate-600">
              <DeltaPill value={spower.deltaPct} good={spower.deltaPct >= 0} />
            </div>
          </div>
          <div className="card-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Housing snapshot
            </div>
            <div className="mt-2 text-sm">
              Rent index: <span className="font-medium">{city.rentIndex}</span>
            </div>
            <div className="mt-1 text-sm">
              Income:{" "}
              <span className="font-medium">
                {fmtMoney(city.incomeMedian)}
              </span>
            </div>
          </div>
          <div className="card-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Lifestyle
            </div>
            <div className="mt-2 text-sm">
              Internet: <span className="font-medium">{city.internetMbps} Mbps</span>
            </div>
            <div className="mt-1 text-sm">
              Parks per 10k: <span className="font-medium">{city.parksPer10k}</span>
            </div>
            <div className="mt-1 text-sm">
              Cafes per 10k: <span className="font-medium">{city.cafesPer10k}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-slate-200">
          <table className="table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="text-slate-800">{r.label}</td>
                  <td>
                    {r.money
                      ? fmtMoney(r.v as number)
                      : (r.v as number).toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr>
                <td>Climate</td>
                <td>{city.climate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick re-search inline */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Try another city</h2>
        <form
          action="/snapshot"
          className="mt-4 grid gap-4 sm:grid-cols-[1fr,auto,auto] sm:items-end"
        >
          <div>
            <CityAutocomplete
              id="city2"
              name="city"
              label="City"
              placeholder="Start typing a city…"
              defaultSlug={city.slug}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Salary (USD)
            </label>
            <input
              type="number"
              name="salary"
              defaultValue={salary}
              min={0}
              step={1000}
              className="input mt-1"
            />
          </div>
          <button className="btn btn-primary w-full sm:w-auto">View snapshot</button>
        </form>
      </div>
    </main>
  );
}

function prettyCityLabel(slug: string) {
  const c = CITIES.find((x) => x.slug === slug);
  return c ? `${c.name}, ${c.state}` : slug.replace(/-/g, " ");
}
