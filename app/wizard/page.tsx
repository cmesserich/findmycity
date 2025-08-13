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

export default function Page() {
  const [salary, setSalary] = React.useState(100000);
  const [current, setCurrent] = React.useState("washington-dc");
  const [weights, setWeights] = React.useState({
    affordability: 4, internet: 3, parks: 2, cafes: 2, nightlife: 2, diversity: 3,
  });

  const [results, setResults] = React.useState<ReturnType<typeof getTopMatches> | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefs: Preferences = { salary, currentCitySlug: current || undefined, weights };
    setResults(getTopMatches(prefs, 5));
  };

  const currentCity = CITIES.find(c => c.slug === current);

  // ---- lead capture + CSV
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const payload = { salary, current, weights, results };
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, payload }),
    });
    setSubmitting(false);
    setSubmitted(res.ok);
  }

  function downloadCsv() {
    if (!results) return;
    const rows: (string | number)[][] = [
      ["rank", "slug", "city", "state", "score", "destEquivalent", "deltaPct"],
    ];
    const cur = currentCity;
    results.forEach(({ city, score }, i) => {
      const sp = cur ? spendingPower(salary, cur.rpp, city.rpp) : null;
      rows.push([
        i + 1,
        city.slug,
        city.name,
        city.state,
        Number(score.toFixed(0)),
        sp ? Math.round(sp.destEquivalent) : "",
        sp ? Number(sp.deltaPct.toFixed(1)) : "",
      ]);
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "findmycity_matches.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Find My City – Matcher</h1>
      <p className="mt-2 text-slate-600">Tell us what matters, we’ll rank cities and let you jump into a comparison or brief.</p>

      <form onSubmit={submit} className="mt-8 grid gap-6">
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
        <>
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

          <section className="mt-8 card p-4">
            <h3 className="font-medium">Keep these results</h3>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <form onSubmit={handleSubscribe} className="flex w-full gap-2 sm:w-auto">
                <input type="email" placeholder="you@email.com" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <button className="btn" disabled={submitting || submitted}>
                  {submitted ? "Sent!" : submitting ? "Sending..." : "Email me my matches"}
                </button>
              </form>
              <button className="btn-outline" onClick={downloadCsv}>Download CSV</button>
            </div>
            <p className="mt-2 text-xs text-slate-500">Local dev stores to <code>tmp/subscribers.csv</code>. We’ll swap to a real ESP on deploy.</p>
          </section>
        </>
      )}

      <datalist id="city-slugs">
        {CITIES.map(c => <option key={c.slug} value={c.slug} />)}
      </datalist>
    </main>
  );
}
