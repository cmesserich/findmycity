// scripts/build-cities.mjs
// Build lib/data/cities.ts by merging inputs with precedence:
// place → county → cbsa → state → dataset medians (as last resort)

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, "data", "inputs");
const OUT_TS = path.join(ROOT, "lib", "data", "cities.ts");

// ---------- tiny CSV parser (no quoted fields) ----------
function parseCSV(str) {
  const lines = str.trim().split(/\r?\n/);
  const header = lines.shift().split(",");
  return lines
    .filter(l => l.trim().length > 0)
    .map((line) => {
      const cols = line.split(",");
      const row = {};
      header.forEach((h, i) => (row[h.trim()] = (cols[i] ?? "").trim()));
      return row;
    });
}

const num = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// ---------- load helpers ----------
async function loadCSV(name) {
  const p = path.join(INPUT_DIR, name);
  if (!existsSync(p)) return { rows: [], path: p, exists: false };
  const raw = await readFile(p, "utf8");
  return { rows: parseCSV(raw), path: p, exists: true };
}

function median(arr) {
  const a = arr.filter((x) => x !== null && x !== undefined && Number.isFinite(x)).sort((x, y) => x - y);
  if (a.length === 0) return null;
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

// ---------- main ----------
async function main() {
  // Load all inputs
  const id = await loadCSV("cities_identity.csv");
  const xw = await loadCSV("crosswalk_place_county_cbsa.csv");
  const mPlace = await loadCSV("metrics_place.csv");
  const mCounty = await loadCSV("metrics_county.csv");
  const mCbsa = await loadCSV("metrics_cbsa.csv");
  const mState = await loadCSV("metrics_state.csv");

  console.log("[build:data] files:");
  console.log(`  identity: ${id.exists ? id.path : "(missing)"} rows=${id.rows.length}`);
  console.log(`  crosswalk: ${xw.exists ? xw.path : "(missing)"} rows=${xw.rows.length}`);
  console.log(`  place: ${mPlace.exists ? mPlace.path : "(missing)"} rows=${mPlace.rows.length}`);
  console.log(`  county: ${mCounty.exists ? mCounty.path : "(missing)"} rows=${mCounty.rows.length}`);
  console.log(`  cbsa: ${mCbsa.exists ? mCbsa.path : "(missing)"} rows=${mCbsa.rows.length}`);
  console.log(`  state: ${mState.exists ? mState.path : "(missing)"} rows=${mState.rows.length}`);

  if (!id.exists) {
    console.error(`Missing ${id.path}. Please create it (header + rows).`);
    process.exit(1);
  }

  // Index helpers
  const xwByPlace = new Map(xw.rows.map(r => [r.place_geoid, r]));
  const placeById = new Map(mPlace.rows.map(r => [r.place_geoid, r]));
  const countyByFips = new Map(mCounty.rows.map(r => [r.county_fips, r]));
  const cbsaByCode = new Map(mCbsa.rows.map(r => [r.cbsa_code, r]));
  const stateByFips = new Map(mState.rows.map(r => [r.state_fips, r]));

  // Compute medians from place-level where available (for imputation)
  const placeNums = {
    incomeMedian: [],
    diversityIndex: [],
    rentIndex: [],
    parksPer10k: [],
    cafesPer10k: [],
    barsPer10k: [],
  };
  mPlace.rows.forEach(r => {
    placeNums.incomeMedian.push(num(r.incomeMedian));
    placeNums.diversityIndex.push(num(r.diversityIndex));
    placeNums.rentIndex.push(num(r.rentIndex));
    placeNums.parksPer10k.push(num(r.parksPer10k));
    placeNums.cafesPer10k.push(num(r.cafesPer10k));
    placeNums.barsPer10k.push(num(r.barsPer10k));
  });
  const med = {
    incomeMedian: median(placeNums.incomeMedian) ?? 65000,
    diversityIndex: median(placeNums.diversityIndex) ?? 0.75,
    rentIndex: median(placeNums.rentIndex) ?? 65,
    parksPer10k: median(placeNums.parksPer10k) ?? 25,
    cafesPer10k: median(placeNums.cafesPer10k) ?? 20,
    barsPer10k: median(placeNums.barsPer10k) ?? 18,
    rpp: 100, // national-ish default if cbsa/state missing
    internetMbps: 150, // a safe modern default
  };

  const rowsOut = [];

  for (const row of id.rows) {
    const slug = row.slug;
    const name = row.name;
    const state = row.state;

    if (!slug || !name || !state) {
      console.warn(`[skip] identity row missing slug/name/state:`, row);
      continue;
    }

    // Prefer identity’s keys, then crosswalk as backup
    const place_geoid = row.place_geoid || (xwByPlace.get(row.place_geoid || "")?.place_geoid) || null;
    const county_fips = row.county_fips || (xwByPlace.get(place_geoid || "")?.county_fips) || null;
    const cbsa_code = row.cbsa_code || (xwByPlace.get(place_geoid || "")?.cbsa_code) || null;
    const state_fips = row.state_fips || (xwByPlace.get(place_geoid || "")?.state_fips) || null;
    const geo_level = row.geo_level || "place";

    // Gather metrics with precedence per field
    const p = place_geoid ? placeById.get(place_geoid) : null;
    const c = county_fips ? countyByFips.get(county_fips) : null;
    const b = cbsa_code ? cbsaByCode.get(cbsa_code) : null;
    const s = state_fips ? stateByFips.get(state_fips) : null;

    // RPP: cbsa → state → default
    const rpp = num(b?.rpp) ?? num(s?.rpp) ?? med.rpp;

    // Internet: county → cbsa → state → default
    const internetMbps = num(c?.internetMbps) ?? num(b?.internetMbps) ?? num(s?.internetMbps) ?? med.internetMbps;

    // Place-only metrics (fallback to medians)
    const pop = num(p?.pop) ?? null;
    const incomeMedian = num(p?.incomeMedian) ?? med.incomeMedian;
    const diversityIndex = num(p?.diversityIndex) ?? med.diversityIndex;
    const rentIndex = num(p?.rentIndex) ?? med.rentIndex;
    const parksPer10k = num(p?.parksPer10k) ?? med.parksPer10k;
    const cafesPer10k = num(p?.cafesPer10k) ?? med.cafesPer10k;
    const barsPer10k = num(p?.barsPer10k) ?? med.barsPer10k;
    const climate = (p?.climate && p.climate !== "") ? p.climate : "—";

    const commuteMedian = num(c?.commuteMedian) ?? null;
    const transitShare = num(c?.transitShare) ?? null;

    rowsOut.push({
      slug,
      name,
      state,
      state_fips: state_fips || null,
      place_geoid: place_geoid || null,
      county_fips: county_fips || null,
      cbsa_code: cbsa_code || null,
      geo_level,
      pop,
      rpp,
      rentIndex,
      incomeMedian,
      diversityIndex,
      internetMbps,
      parksPer10k,
      cafesPer10k,
      barsPer10k,
      climate,
      commuteMedian,
      transitShare,
    });
  }

  // Emit TS
  const header =
`import type { City } from "@/lib/types";

// AUTO-GENERATED by scripts/build-cities.mjs
export const CITIES: City[] = [
`;
  const body = rowsOut.map((r) => {
    // Safely stringify
    const esc = (v) => (v === null || v === undefined) ? "null" : JSON.stringify(v);
    return `  {
    slug: ${esc(r.slug)},
    name: ${esc(r.name)},
    state: ${esc(r.state)},
    state_fips: ${esc(r.state_fips)},
    place_geoid: ${esc(r.place_geoid)},
    county_fips: ${esc(r.county_fips)},
    cbsa_code: ${esc(r.cbsa_code)},
    geo_level: ${esc(r.geo_level)},
    pop: ${r.pop ?? "null"},
    rpp: ${r.rpp},
    rentIndex: ${r.rentIndex},
    incomeMedian: ${r.incomeMedian},
    diversityIndex: ${r.diversityIndex},
    internetMbps: ${r.internetMbps},
    parksPer10k: ${r.parksPer10k},
    cafesPer10k: ${r.cafesPer10k},
    barsPer10k: ${r.barsPer10k},
    climate: ${esc(r.climate)},
    commuteMedian: ${r.commuteMedian ?? "null"},
    transitShare: ${r.transitShare ?? "null"},
  }`;
  }).join(",\n");

  const footer = `
];\n`;

  await writeFile(OUT_TS, header + body + footer, "utf8");
  console.log(`Wrote ${path.relative(ROOT, OUT_TS)} with ${rowsOut.length} cities.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
