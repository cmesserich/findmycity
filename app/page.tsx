import Link from "next/link";
import ShareCompareButton from "@/components/ShareCompareButton";
import CityAutocomplete from "@/components/CityAutocomplete";

const PRESETS = [
  { a: "washington-dc", b: "omaha", label: "Washington, DC → Omaha, NE" },
  { a: "new-york-city", b: "miami", label: "New York, NY → Miami, FL" },
  { a: "seattle", b: "austin", label: "Seattle, WA → Austin, TX" },
  { a: "san-diego", b: "denver", label: "San Diego, CA → Denver, CO" },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Find My Next City</h1>
      <p className="mt-2 text-slate-600">
        Compare two US cities and see how your salary and lifestyle might change.
      </p>
      <p className="mt-2 text-sm">
        Not sure where to go? Search for a city!<a className="underline" href="/wizard">Try the city matcher tool →</a>
      </p>

      <form
        id="compareForm"
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        action="/compare"
        aria-label="City comparison form"
      >
        <CityAutocomplete
          id="cityA"
          name="a"
          label="City A"
          defaultSlug="washington-dc"
          placeholder="e.g. Omaha, NE"
        />
        <CityAutocomplete
          id="cityB"
          name="b"
          label="City B"
          defaultSlug="omaha"
          placeholder="e.g. New York, NY"
        />
        <div>
          <label className="block text-sm font-medium text-slate-700">Salary (USD)</label>
          <input
            name="salary"
            type="number"
            min="0"
            step="1000"
            defaultValue="100000"
            required
            className="input mt-1"
          />
        </div>
        <div className="sm:col-span-3">
          <button className="btn w-full">Compare</button>
        </div>
        <div className="sm:col-span-3 -mt-1">
          <ShareCompareButton formId="compareForm" />
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-sm font-medium text-slate-600">Popular comparisons</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {PRESETS.map((p) => (
            <Link
              key={p.label}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm transition hover:shadow"
              href={`/compare?a=${p.a}&b=${p.b}&salary=100000`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
