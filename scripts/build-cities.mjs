// scripts/build-cities.mjs
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";

const IN_CSV = path.join(process.cwd(), "data", "inputs", "cities_base.csv");
const OUT_TS = path.join(process.cwd(), "lib", "data", "cities.ts");

// Simple CSV parser for our flat file (no quoted commas expected)
function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const header = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const cols = line.split(",").map(c => c.trim());
    const obj = {};
    header.forEach((h, i) => (obj[h] = cols[i]));
    return obj;
  });
}

function toNumber(v) {
  if (v === undefined || v === null || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

async function main() {
  // 1) ensure input exists
  if (!existsSync(IN_CSV)) {
    console.error(`Missing ${IN_CSV}. Please create it with the template header below:\n`);
    console.error(
      [
        "slug,name,state,pop,rpp,rentIndex,incomeMedian,diversityIndex,internetMbps,parksPer10k,cafesPer10k,barsPer10k,climate",
        "washington-dc,Washington,DC,705749,118.7,85,92266,0.89,145,42,28,15,Humid subtropical",
      ].join("\n")
    );
    process.exit(1);
  }

  // 2) read and parse csv
  const raw = await fs.readFile(IN_CSV, "utf8");
  const rows = parseCsv(raw);

  // 3) transform rows -> TS objects
  const cities = rows.map(r => ({
    slug: r.slug,
    name: r.name,
    state: r.state,
    pop: toNumber(r.pop),
    rpp: toNumber(r.rpp),
    rentIndex: toNumber(r.rentIndex),
    incomeMedian: toNumber(r.incomeMedian),
    diversityIndex: toNumber(r.diversityIndex),
    internetMbps: toNumber(r.internetMbps),
    parksPer10k: toNumber(r.parksPer10k),
    cafesPer10k: toNumber(r.cafesPer10k),
    barsPer10k: toNumber(r.barsPer10k),
    climate: r.climate ?? "",
  }));

  // 4) ensure output dir exists
  mkdirSync(path.dirname(OUT_TS), { recursive: true });

  // 5) write TS module
  const content = `// AUTO-GENERATED FILE. Do not edit by hand.
// Source: ${path.relative(process.cwd(), IN_CSV)}

export interface City {
  slug: string;
  name: string;
  state: string;
  pop: number;
  rpp: number;
  rentIndex: number;
  incomeMedian: number;
  diversityIndex: number;
  internetMbps: number;
  parksPer10k: number;
  cafesPer10k: number;
  barsPer10k: number;
  climate: string;
}

export const CITIES: City[] = ${JSON.stringify(cities, null, 2)};
`;

  await fs.writeFile(OUT_TS, content, "utf8");

  console.log(
    `Wrote ${path.relative(process.cwd(), OUT_TS)} with ${cities.length} cities.`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
