'use client';

import * as React from "react";
import { getTopMatches, type Preferences } from "@/lib/match";
import { CITIES } from "@/lib/data/cities";
import { spendingPower, fmtMoney } from "@/lib/compare";
import CityAutocomplete from "@/components/CityAutocomplete";

function LabeledSlider({
  label, value, onChange
}: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-xs text-slate-500">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-2 w-full"
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
    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
      <span className="text-slate-500">Why this matched:</span>
      {top.map(t => (
        <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{t}</span>
      ))}
    </div>
  );
}

export default function WizardPage() {
  const [salary, setSalary] = React.useState(100000);
  const [current, setCurrent] = React.useState("washington-dc");
  const [weights, setWeights] = React.useState<Weights>({
    affordability: 4, internet: 3, parks: 2, cafes: 2, nightlife: 2, diversity: 3,
  });
  const [activePreset, setActivePreset] = React.useState<string | null>(null);

  const [results, setResults] = React.useState<ReturnType<typeof getTopMatches> | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefs: Preferences = { salary, currentCitySlug: current || undefined, weights };
    setResults(getTopMatches(prefs, 5));
  };

  const currentCity = CITIES.find(c => c.slug === current);

  function applyPreset(label: string, p: Weights) {
    setWeights(p);
    setActivePreset(label);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Header + requested subtext */}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
        Find My City
      </h1>
      <p className="lead">
        Tell us what matters to you! See if you match with one of our preselected profiles,
        or change your preferences using the adjustable sliders. We will rank cities and let
        you explore City Comparisons or City Reports.
      </p>

      {/* Presets as chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(PRESETS).map(([label, p]) => (
          <button
            key={label}
            type="button"
            className={`chip ${activePreset === label ? "chip-active" : ""}`}
            onClick={() => applyPreset(label, p)}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-6">
        {/* Current city + salary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CityAutocomplete
            id="currentCity"
            name="current"
            label="Current city"
            defaultSlug={current}
            placeholder="e.g. Washington, DC"
            onChangeSlug={(slug) => setCurrent(slug)}
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
          </div>
        </div>

        {/* Sliders grouped in a muted section */}
        <div className="section-muted">
          <div className="grid gap-4 sm:grid-cols-3">
            <LabeledSlider label="Affordability"    value={weights.affordability} onChange={(v) => setWeights({ ...weights, affordability: v })}/>
            <LabeledSlider label="Internet speed"   value={weights.internet}      onChange={(v) => setWeights({ ...weights, internet: v })}/>
            <LabeledSlider label="Parks / outdoors" value={weights.parks}         onChange={(v) => setWeights({ ...weights, parks: v })}/>
            <LabeledSlider label="Cafes"            value={weights.cafes}         onChange={(v) => setWeights({ ...weights, cafes: v })}/>
            <LabeledSlider label="Nightlife"        value={weights.nightlife}     onChange={(v) => setWeights({ ...weights, nightlife: v })}/>
            <LabeledSlider label="Diversity"        value={weights.diversity}     onChange={(v) => setWeights({ ...weights, diversity: v })}/>
          </div>
        </div>

        <div>
          <button className="btn btn-primary w-full sm:w-auto">See top matches</button>
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
                      <div className="text-xs text-slate-500 mt-1">{city.climate}</div>
                      <ReasonChips city={city} weights={weights} />
                    </div>
                    <div className="flex gap-2">
                      {currentCity && (
                        <a className="btn-outline" href={`/compare?a=${currentCity.slug}&b=${city.slug}&salary=${salary}`}>Compare cities</a>
                      )}
                      <a className="btn-outline" href={`/brief?a=${currentCity ? currentCity.slug : "washington-dc"}&b=${city.slug}&salary=${salary}`}>View report</a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </main>
  );
}
