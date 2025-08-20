import Link from "next/link";
import CityAutocomplete from "@/components/CityAutocomplete";
import CopyLinkButton from "@/components/CopyLinkButton";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
        Compare Cities
      </h1>
      <p className="mt-2 text-slate-600">
        Compare two US cities and see how your salary and lifestyle might change.
      </p>

      {/* Helper buttons under the intro, same style everywhere */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/wizard" className="btn btn-outline">Find Your City</Link>
        <Link href="/snapshot" className="btn btn-outline">City Scouting Report</Link>
      </div>

      {/* Form row */}
      <form
  id="compare-form"
  action="/compare"
  method="GET"
  className="mt-8 grid gap-4 sm:grid-cols-[1fr,1fr,200px,auto] sm:items-end"
>
  {/* City A */}
  <div>
    <CityAutocomplete
      id="cityA"
      name="a"
      label="City A"
      placeholder="Start typing a city…"
    />
  </div>

  {/* City B */}
  <div>
    <CityAutocomplete
      id="cityB"
      name="b"
      label="City B"
      placeholder="Start typing a city…"
    />
  </div>

  {/* Salary */}
  <div>
    <label className="block text-sm font-medium text-slate-700">
      Salary (USD)
    </label>
    <input
      className="input mt-1"
      type="number"
      name="salary"
      placeholder="e.g. $100,000"
      min={0}
      step={1000}
    />
  </div>

  {/* Compare button */}
  <div className="self-end">
    <button className="btn btn-primary w-full sm:w-auto">Compare</button>
  </div>

  {/* Share comparison (composes URL from this form) */}
  <div className="sm:col-span-4">
    <CopyLinkButton formId="compare-form" className="btn-outline" label="Share comparison" />
  </div>
</form>

{/* Popular comparisons */}
<section className="mt-8">
  <h3 className="text-sm font-medium text-slate-700">Popular comparisons</h3>

  <div className="card mt-2 p-4">
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        { a: "washington-dc", b: "omaha",       label: "Washington, DC → Omaha, NE" },
        { a: "new-york-city", b: "miami",       label: "New York, NY → Miami, FL" },
        { a: "seattle",       b: "austin",      label: "Seattle, WA → Austin, TX" },
        { a: "san-diego",     b: "denver",      label: "San Diego, CA → Denver, CO" },
      ].map((p) => (
        <Link
          key={`${p.a}-${p.b}`}
          href={`/compare?a=${p.a}&b=${p.b}&salary=100000`}
          className="btn btn-white w-full justify-between"
        >
          <span>{p.label}</span>
          <span aria-hidden>→</span>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* Popular shortcuts (unchanged) */}
      {/* ... keep your existing popular comparison links ... */}
    </main>
  );
}
