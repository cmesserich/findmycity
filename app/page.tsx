import Link from "next/link";
import ShareCompareButton from "@/components/ShareCompareButton";

const PRESETS = [
  { a: "washington-dc", b: "omaha", label: "DC → Omaha" },
  { a: "new-york-city", b: "miami", label: "NYC → Miami" },
  { a: "seattle", b: "austin", label: "Seattle → Austin" },
  { a: "san-diego", b: "denver", label: "San Diego → Denver" },
];

export default function Home() {
  return (
    <main>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Find My City</h1>
      <p className="mt-3 text-lg text-slate-600">
        Compare two US cities and see how your salary and lifestyle might change.
      </p>
      <p className="mt-2 text-sm">
        Not sure where to go? <a className="underline" href="/wizard">Try the matcher →</a>
      </p>

      <datalist id="city-slugs">
        {[
          "washington-dc","omaha","austin","denver","new-york-city","miami","seattle","phoenix","boston",
          "nashville","portland","atlanta","san-diego","chicago","tampa",
        ].map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <form
        id="compareForm"
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        action="/compare"
        aria-label="City comparison form"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">City A (slug)</label>
          <input
            name="a"
            list="city-slugs"
            defaultValue="washington-dc"
            required
            className="input mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">City B (slug)</label>
          <input
            name="b"
            list="city-slugs"
            defaultValue="omaha"
            required
            className="input mt-1"
          />
        </div>
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
