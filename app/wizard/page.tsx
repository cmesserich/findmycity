'use client';

import * as React from "react";
import { getTopMatches, type Preferences } from "@/lib/match";
import { CITIES } from "@/lib/data/cities";
import { spendingPower, fmtMoney } from "@/lib/compare";

function LabeledSlider({
  label, value, onChange
}: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-xs text-slate-500">{value}</span>
      </div>
      <input type="range" min={0} max={5} step={1} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full"
      />
    </div>
  );
}

type Weights = {
  affordability: number; internet: number; parks: number; cafes: number; nightlife: number; diversity: number;
};

const PRESETS: Record<string, Weights> = {
  "Granola & Trails": { affordability: 2, internet: 2, parks: 5, cafes: 2, nightlife: 1, diversity: 3 },
  "Matcha & Yoga":   { affordability: 2, internet: 3, parks: 3, cafes: 4, nightlife: 1, diversity: 4 },
  "Nightlife":       { affordability: 2, internet: 3, parks: 1, cafes: 3, nightlife: 5, diversity: 4 },
  "Family-friendly": { affordability: 4, internet: 3, parks: 4, cafes: 2, nightlife: 1, diversity: 2 },
};

function ReasonChips({
  city, weights
}: { city: (typeof CITIES)[number]; weights: Weights }) {
  // crude normalized contributions for explanation only
  const contribs: {label: string; value: number}[] = [
    { label: "Affordability", value: weights.affordability * (1 / Math.max(1, city.rpp)) + weights.affordability * (1 / Math.max(1, city.rentIndex)) * 0.3 },
    { label: "Internet",      value: weights.internet * city.internetMbps },
    { label: "Parks",         value: weights.parks * city.parksPer10k },
    { label: "Cafes",         value: weights.cafes * city.cafesPer10k },
    { label: "Nightlife",     value: weights.nightlife * city.barsPer10k },
    { label: "Diversity",     value: weights.diversity * city.diversityIndex },
  ];
  contribs.sort((a,b) => b.value - a.value);
  const top = contribs.slice(0, 3).map(c => c.label);

  return (
    <div className="mt-2 flex flex-wrap gap-2 text-xs">
      <span className="text-slate-500">Why this matched:</span>
      {top.map(t => (
        <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{t}</span>
      ))}
    </div>
  );
}

export default function Page() {
  const [salary, setSalary] = React.useState(100000);
  const [current, setCurrent] = React.useState("washington-dc");
  const [weights, setWeights] = React.useState<Weights>({
    affordability: 4, internet: 3, parks: 2, cafes: 2, nightlife: 2, diversity: 3,
  });

  const [results, setResults] = React.useState<ReturnType<typeof getTopMatches> | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefs: Preferences = { salary, currentCitySlug: current || undefined, weights };
    setResults(getTopMatches(prefs, 5));
  };

  const currentCity = CITIES.find(c => c.slug === current);

  function applyPreset(p: Weights) { setWeights(p); }

  // lead capture + CSV from previous step still present? keep if you added it.
  // (remove if you didn’t wire that; not required for this sprint item)

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Find My City – Matcher</h1>
      <p className="mt-2 text-slate-600">Tell us what matters, we’ll rank cities and let you jump into a comparison or brief.</p>

      {/* Presets */}
      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(PRESETS).map(([label, p]) => (
          <button key={label} type="button" className="btn-outline" onClick={() => applyPreset(p)}>
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Current city (slug, optional)</label>
            <input list="city-slugs" value={current} onChange={e => setCurrent(e.target.value)} placeholder="e.g. seattle" className="input mt-1"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Salary (USD)</label>
            <input type="number" min={0} step={1000} value={salary} onChange={e => setSalary(Number(e.target.value))} className="input mt-1"/>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <LabeledSlider label="Affordability" value={weights.affordability} onChange={(v) => setWeights({ ...weights, affordability: v })}/>
          <LabeledSlider label="Internet speed" value={weights.internet} onChange={(v) => setWeights({ ...weights, internet: v })}/>
          <LabeledSlider label="Parks / outdoors" value={weights.parks} onChange={(v) => setWeights({ ...weights, parks: v })}/>
          <LabeledSlider label="Cafes" value={weights.cafes} onChange={(v) => setWeights({ ...weights, cafes: v })}/>
          <LabeledSlider label="Nightlife" value={weights.nightlife} onChange={(v) => setWeights({ ...weights, nightlife: v })}/>
          <LabeledSlider label="Diversity" value={weights.diversity} onChange={(v) => setWeights({ ...weights, diversity: v })}/>
        </div>

        <div>
          <button className="btn w-full sm:w-auto">See top matches</button>
        </div>
      </form>

      {results && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Top matches</h2>
          <ol className="mt-4 space-y-3">
            {results.map(({ city, score }) => {
              const sp = currentCity ? spendingPower(salary, currentCity.rpp, city.rpp) : null;
              return (
                <li key={city.slug} className="card p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-medium">{city.name}, {city.state}</div>
                      <div className="mt-1 text-sm text-slate-600">
                        Match score <span className="font-semibold">{score.toFixed(0)}</span>/100
                        {sp ? <> • feels like <span className={sp.deltaPct>=0 ? "text-green-700" : "text-red-700"}>
                          {fmtMoney(sp.destEquivalent)} ({(sp.deltaPct>0?"+":"") + sp.deltaPct.toFixed(1)}%)
                        </span> vs {currentCity?.name}</> : null}
                      </div>
                      <ReasonChips city={city} weights={weights} />
                    </div>
                    <div className="flex gap-2">
                      {currentCity && (
                        <a className="btn-outline" href={`/compare?a=${currentCity.slug}&b=${city.slug}&salary=${salary}`}>Compare</a>
                      )}
                      <a className="btn-outline" href={`/brief?a=${currentCity ? currentCity.slug : "washington-dc"}&b=${city.slug}&salary=${salary}`}>View brief</a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <datalist id="city-slugs">
        {CITIES.map(c => <option key={c.slug} value={c.slug} />)}
      </datalist>
    </main>
  );
}
