'use client';

import * as React from "react";
import CityAutocomplete from "@/components/CityAutocomplete";
import { CITIES } from "@/lib/data/cities";
import { fmtMoney } from "@/lib/compare";

type City = typeof CITIES[number];

function label(c: City) {
  return `${c.name}, ${c.state}`;
}

export default function BriefsClient() {
  const [from, setFrom] = React.useState<string>("washington-dc");
  const [salary, setSalary] = React.useState<number>(100000);
  const [q, setQ] = React.useState<string>("");

  const results = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    // Simple filter on name/state/slug
    return CITIES
      .filter((c) => {
        const hay = `${c.name}, ${c.state} ${c.slug}`.toLowerCase();
        return hay.includes(s);
      })
      .slice(0, 25);
  }, [q]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-slate-900">
      <h1 className="text-3xl font-semibold">Relocation briefs</h1>
      <p className="mt-2 text-slate-600">
        Pick a starting city and salary, then search for your destination to open a printable one-page report.
      </p>

      {/* Controls */}
      <section className="mt-6 card p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <CityAutocomplete
            id="briefsFrom"
            name="from"
            label="From city"
            defaultSlug={from}
            placeholder="e.g. Washington, DC"
            onChangeSlug={(slug) => setFrom(slug)}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700">Salary (USD)</label>
            <input
              type="number"
              min={0}
              step={1000}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="input mt-1"
            />
            <div className="mt-1 text-xs text-slate-500">
              Used to compute cost-of-living adjusted spending power.
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Search destination</label>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type a city (e.g. Omaha, Austin, Miami)…"
              className="input mt-1"
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mt-6">
        {!q.trim() ? (
          <p className="text-sm text-slate-500">Start typing to see cities…</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-slate-500">No cities matched “{q}”.</p>
        ) : (
          <ol className="space-y-3">
            {results.map((c) => {
              const href = `/brief?a=${encodeURIComponent(from)}&b=${encodeURIComponent(c.slug)}&salary=${encodeURIComponent(salary)}`;
              return (
                <li key={c.slug} className="card p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-medium">{label(c)}</div>
                      <div className="text-xs text-slate-500 mt-1">{c.climate}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden text-xs text-slate-500 sm:inline">
                        From salary: {fmtMoney(salary)}
                      </span>
                      <a className="btn-outline" href={href}>View brief</a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}
