import { getCity, spendingPower, fmtMoney, percentDelta } from "@/lib/compare";
import { normalizeSlug } from "@/lib/slug";
import Checklist from "@/components/Checklist";


export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };
const now = () => new Date().toLocaleDateString();

type Section = { title: string; items: string[] };

export default function BriefPage({ searchParams }: { searchParams: SearchParams }) {
  const a = getCity(normalizeSlug((searchParams.a as string) || ""));
  const b = getCity(normalizeSlug((searchParams.b as string) || ""));
  const salary = Number(searchParams.salary || 100000);

  if (!a || !b || !Number.isFinite(salary)) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Relocation Brief</h1>
        <p className="mt-4 text-gray-600">Missing/invalid parameters.</p>
        <a href="/" className="mt-6 inline-block text-blue-600 underline">← Home</a>
      </main>
    );
  }

  const spend = spendingPower(salary, a.rpp, b.rpp);

  const sections: Section[] = [
    {
      title: "Salary & Costs",
      items: [
        `Your salary: ${fmtMoney(salary)}. In ${b.name}, that feels like ${fmtMoney(spend.destEquivalent)} (${(spend.deltaPct > 0 ? "+" : "") + spend.deltaPct.toFixed(1)}%).`,
        `Affordability (RPP): ${a.rpp} → ${b.rpp}.`,
        `Rent index: ${a.rentIndex} → ${b.rentIndex}.`,
      ],
    },
    {
      title: "Lifestyle & Vibes",
      items: [
        `Diversity index: ${a.diversityIndex.toFixed(2)} → ${b.diversityIndex.toFixed(2)}.`,
        `Internet median speed: ${a.internetMbps} → ${b.internetMbps} Mbps.`,
        `Amenities (per 10k): Parks ${a.parksPer10k} → ${b.parksPer10k}, Cafes ${a.cafesPer10k} → ${b.cafesPer10k}, Bars ${a.barsPer10k} → ${b.barsPer10k}.`,
      ],
    },
    {
      title: "Neighborhood Starter Pack",
      items: [
        `In ${b.name}: Start with three well-known areas (placeholders): Central, Northside, Riverside.`,
        `In ${a.name}: If you stay, explore: Capitol, Heights, Lakeside.`,
      ],
    },
    {
      title: "First Week Plan & Links",
      items: [
        "Day 1–2: Tour 2 neighborhoods; get a 1-week coworking pass.",
        "Day 3–4: Test gym/parks nearby; ride transit at commute time.",
        "Day 5–7: Short-term rental in target area; walk evening routes.",
        "Affiliates (placeholders): movingco.example, rentersins.example, fiberisp.example",
      ],
    },
  ];

  const summaryRows = [
    ["Affordability (RPP, lower is cheaper)", a.rpp, b.rpp, "lower"],
    ["Rent Index (higher is pricier)", a.rentIndex, b.rentIndex, "lower"],
    ["Median Household Income", a.incomeMedian, b.incomeMedian, "higher"],
    ["Diversity Index (0–1)", a.diversityIndex, b.diversityIndex, "higher"],
    ["Internet Median Mbps", a.internetMbps, b.internetMbps, "higher"],
    ["Parks per 10k", a.parksPer10k, b.parksPer10k, "higher"],
    ["Cafes per 10k", a.cafesPer10k, b.cafesPer10k, "higher"],
    ["Bars per 10k", a.barsPer10k, b.barsPer10k, "higher"],
  ] as const;

  return (
    <main className="mx-auto max-w-3xl bg-white px-6 py-10 print:max-w-none print:bg-white print:px-0">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-semibold">Relocation Brief</h1>
        <p className="mt-1 text-gray-500">
          {a.name}, {a.state} → {b.name}, {b.state} • Generated {now()}
        </p>
        <button onClick={() => window.print()} className="mt-4 rounded border px-3 py-2 text-sm hover:bg-gray-50 print:hidden">
          Print / Save as PDF
        </button>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="text-xs uppercase text-gray-500">Salary</div>
          <div className="mt-1 text-2xl font-semibold">{fmtMoney(salary)}</div>
        </div>
        <div className="rounded-lg border bg-gray-50 p-4">
          <div className="text-xs uppercase text-gray-500">Feels like in {b.name}</div>
          <div className="mt-1 text-2xl font-semibold">{fmtMoney(spend.destEquivalent)}</div>
        </div>
        <div className={`rounded-lg border bg-gray-50 p-4 ${spend.deltaPct>=0?"text-green-700":"text-red-700"}`}>
          <div className="text-xs uppercase text-gray-500">Δ Spending power</div>
          <div className="mt-1 text-2xl font-semibold">
            {(spend.deltaPct > 0 ? "+" : "") + spend.deltaPct.toFixed(1)}%
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="border-b p-2">Metric</th>
                <th className="border-b p-2">{a.name}</th>
                <th className="border-b p-2">{b.name}</th>
                <th className="border-b p-2">Δ (B vs A)</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map(([label, av, bv, dir]) => {
                const delta = percentDelta(av as number, bv as number);
                const good = (dir === "lower" && delta < 0) || (dir === "higher" && delta > 0);
                const fmt = (v: number) => (String(label).includes("Income") ? fmtMoney(v) : (v as number).toLocaleString());
                return (
                  <tr key={String(label)} className="border-b last:border-b-0">
                    <td className="p-2">{label}</td>
                    <td className="p-2">{fmt(av as number)}</td>
                    <td className="p-2">{fmt(bv as number)}</td>
                    <td className={`p-2 ${good ? "text-green-700" : "text-red-700"}`}>
                      {(delta > 0 ? "+" : "") + delta.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="p-2">Climate</td>
                <td className="p-2">{a.climate}</td>
                <td className="p-2">{b.climate}</td>
                <td className="p-2 text-gray-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-8">
        <Checklist keyId={`${a.slug}-${b.slug}`} />
      </section>

      {sections.map((sec) => (
        <section key={sec.title} className="mb-6 break-inside-avoid">
          <h2 className="mb-2 text-lg font-semibold">{sec.title}</h2>
          <ul className="list-disc space-y-1 pl-6 text-sm text-gray-800">
            {sec.items.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </section>
      ))}
    </main>
  );
}
