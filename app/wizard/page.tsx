'use client';

import * as React from 'react';
import Link from 'next/link';
import CityAutocomplete from '@/components/CityAutocomplete';
import { getTopMatches, type Preferences } from '@/lib/match';

type Weights = Preferences['weights'];

const DEFAULT_WEIGHTS: Weights = {
  affordability: 3,
  internet: 2,
  parks: 2,
  cafes: 2,
  nightlife: 2,
  diversity: 2,
};

const PRESET_DESCRIPTIONS: Record<string, string> = {
  Outdoorsy:
    'Prioritizes parks/green space and affordability; de-emphasizes nightlife and blazing internet.',
  Nightlife:
    'Favors vibrant night scenes and cafes; affordability still matters but takes a back seat.',
  Remote:
    'Weights fast/reliable internet and good third places (cafes) for remote work.',
  Family:
    'Leans toward affordability and parks; nightlife is less important.',
};

function WeightSlider({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  help?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        {help && <span className="text-xs text-slate-500">{help}</span>}
      </div>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="mt-1 text-xs text-slate-600">
        Weight: <span className="font-medium">{value}</span> / 5
      </div>
    </div>
  );
}

function scoreBadgeClass(score: number) {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

function fmtPop10k(n?: number | null) {
  if (!n || n <= 0) return '—';
  const k10 = Math.round(n / 10000) * 10; // nearest 10k
  return `~${k10.toLocaleString()}k`;
}

export default function WizardPage() {
  const [weights, setWeights] = React.useState<Weights>(DEFAULT_WEIGHTS);
  const [currentCity, setCurrentCity] = React.useState<string>(''); // optional
  const [salary, setSalary] = React.useState<string>(''); // optional
  const [results, setResults] = React.useState<ReturnType<typeof getTopMatches>>([]);
  const [presetNote, setPresetNote] = React.useState<string>('');

  const applyPreset = (name: 'Outdoorsy' | 'Nightlife' | 'Remote' | 'Family') => {
    if (name === 'Outdoorsy')
      setWeights({ affordability: 2, internet: 1, parks: 5, cafes: 2, nightlife: 1, diversity: 2 });
    if (name === 'Nightlife')
      setWeights({ affordability: 2, internet: 2, parks: 1, cafes: 3, nightlife: 5, diversity: 3 });
    if (name === 'Remote')
      setWeights({ affordability: 3, internet: 5, parks: 2, cafes: 3, nightlife: 2, diversity: 2 });
    if (name === 'Family')
      setWeights({ affordability: 4, internet: 2, parks: 4, cafes: 1, nightlife: 0, diversity: 3 });

    setPresetNote(PRESET_DESCRIPTIONS[name]);
  };

  function resetWeights() {
    setWeights(DEFAULT_WEIGHTS);
    setPresetNote('');
  }

  function runMatch() {
    const prefs: Preferences = {
      salary: Number(salary || 0),
      currentCitySlug: currentCity || undefined,
      weights,
    };
    const top = getTopMatches(prefs, 5);
    setResults(top);
    requestAnimationFrame(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const currentCityClean = currentCity || undefined;
  const salaryNum = Number(salary || 0);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
        Find Your City
      </h1>
      <p className="mt-2 text-slate-600">
        Tell us what matters and we’ll rank cities for you. Tune the sliders, optionally set your current
        city and salary, then hit <em>Find matches</em>.
      </p>

      {/* helper nav buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/compare" className="btn btn-outline">Compare Cities</Link>
        <Link href="/snapshot" className="btn btn-outline">City Scouting Report</Link>
      </div>

      {/* Controls */}
      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>

          {/* sliders with concise descriptions */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <WeightSlider
              label="Affordability"
              help="Lower RPP & rent"
              value={weights.affordability}
              onChange={(v) => setWeights({ ...weights, affordability: v })}
            />
            <WeightSlider
              label="Internet speed"
              help="Median Mbps"
              value={weights.internet}
              onChange={(v) => setWeights({ ...weights, internet: v })}
            />
            <WeightSlider
              label="Parks & green space"
              help="Access / quality"
              value={weights.parks}
              onChange={(v) => setWeights({ ...weights, parks: v })}
            />
            <WeightSlider
              label="Cafes / coffee"
              help="Third places"
              value={weights.cafes}
              onChange={(v) => setWeights({ ...weights, cafes: v })}
            />
            <WeightSlider
              label="Nightlife"
              help="Bars & venues"
              value={weights.nightlife}
              onChange={(v) => setWeights({ ...weights, nightlife: v })}
            />
            <WeightSlider
              label="Diversity"
              help="Demographic mix"
              value={weights.diversity}
              onChange={(v) => setWeights({ ...weights, diversity: v })}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-outline" onClick={() => applyPreset('Outdoorsy')}>Preset: Outdoorsy</button>
            <button className="btn btn-outline" onClick={() => applyPreset('Nightlife')}>Preset: Nightlife</button>
            <button className="btn btn-outline" onClick={() => applyPreset('Remote')}>Preset: Remote worker</button>
            <button className="btn btn-outline" onClick={() => applyPreset('Family')}>Preset: Family</button>
            <button className="btn btn-outline" onClick={resetWeights}>Reset</button>
          </div>

          {presetNote && (
            <p className="mt-2 text-sm text-slate-600 italic">{presetNote}</p>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Context (optional)</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <CityAutocomplete
                id="current-city"
                name="current"
                label="Current city (optional)"
                placeholder="Start typing a city…"
                onChangeSlug={setCurrentCity}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Salary (USD, optional)</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="input mt-1"
                placeholder="e.g., 100000"
              />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={runMatch}>Find matches</button>
              <button
                className="btn btn-outline"
                onClick={() => { setResults([]); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="mt-10" aria-live="polite">
        {results.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold">Top matches</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {results.map(({ city, score }) => (
                <div key={city.slug} className="card p-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{city.name}, {city.state}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${scoreBadgeClass(score)}`}>
                      Score {Math.round(score)}
                    </span>
                  </div>

                  {/* population quick stat */}
                  <div className="mt-1 text-sm text-slate-600">
                    Population: <span className="font-medium">{fmtPop10k(city.pop)} people</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="card-muted p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Affordability Index (RPP)</div>
                      <div className="mt-1 font-medium">{city.rpp}</div>
                    </div>
                    <div className="card-muted p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Internet</div>
                      <div className="mt-1 font-medium">{city.internetMbps} Mbps</div>
                    </div>
                    <div className="card-muted p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Parks</div>
                      <div className="mt-1 font-medium">{city.parksPer10k} / 10k people</div>
                    </div>
                    <div className="card-muted p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Cafes</div>
                      <div className="mt-1 font-medium">{city.cafesPer10k} / 10k people</div>
                    </div>
                    <div className="card-muted p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Bars</div>
                      <div className="mt-1 font-medium">{city.barsPer10k} / 10k people</div>
                    </div>
                    <div className="card-muted p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Diversity (0-1)</div>
                      <div className="mt-1 font-medium">{city.diversityIndex.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      className="btn btn-outline"
                      href={`/snapshot?city=${city.slug}${salaryNum ? `&salary=${salaryNum}` : ''}`}
                    >
                      View City Scouting Report
                    </Link>
                    {currentCityClean && (
                      <Link
                        className="btn btn-outline"
                        href={`/compare?a=${currentCityClean}&b=${city.slug}${salaryNum ? `&salary=${salaryNum}` : ''}`}
                      >
                        Compare with your city
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-sm text-slate-600">
            No results yet — adjust your preferences and click <span className="font-medium">Find matches</span>.
          </div>
        )}
      </section>
    </main>
  );
}
