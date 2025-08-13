import Link from "next/link";

const PRESETS = [
  { a: "washington-dc", b: "omaha", label: "DC → Omaha" },
  { a: "new-york-city", b: "miami", label: "NYC → Miami" },
  { a: "san-diego", b: "denver", label: "San Diego → Denver" },
  { a: "seattle", b: "austin", label: "Seattle → Austin" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Find My Next City</h1>
      <p className="mt-3 text-lg text-gray-600">
        Compare two US cities and see how your salary and lifestyle might change.
      </p>

      {/* list of available slugs for autocomplete */}
      <datalist id="city-slugs">
        {[
          "washington-dc","omaha","austin","denver","new-york-city","miami","seattle","phoenix","boston",
          "nashville","portland","atlanta","san-diego","chicago","tampa",
        ].map(s => <option key={s} value={s} />)}
      </datalist>

      <form className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3" action="/compare" aria-label="City comparison form">
        <div>
          <label className="block text-sm font-medium">City A (slug)</label>
          <input name="a" list="city-slugs" defaultValue="washington-dc" required
                 className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">City B (slug)</label>
          <input name="b" list="city-slugs" defaultValue="omaha" required
                 className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Salary (USD)</label>
          <input name="salary" type="number" min="0" step="1000" defaultValue="100000" required
                 className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div className="sm:col-span-3">
          <button className="w-full rounded bg-black px-4 py-2 text-white hover:opacity-90">Compare</button>
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-sm font-medium text-gray-500">Popular comparisons</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {PRESETS.map(p => (
            <Link key={p.label}
              className="rounded-lg border border-black/10 bg-white px-4 py-3 shadow hover:shadow-md"
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
