import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const csvPath = path.join(process.cwd(), "data", "cities.csv");
const outPath = path.join(process.cwd(), "lib", "data", "cities.ts");

const text = await readFile(csvPath, "utf8");
const [headerLine, ...lines] = text.trim().split(/\r?\n/);
const headers = headerLine.split(",");

const numCols = new Set([
  "rpp","rentIndex","incomeMedian","diversityIndex","internetMbps","parksPer10k","cafesPer10k","barsPer10k"
]);

function parseLine(line) {
  const parts = line.split(",");
  const obj = {};
  headers.forEach((h, i) => {
    const key = h.trim();
    const raw = (parts[i] ?? "").trim();
    obj[key] = numCols.has(key) ? Number(raw) : raw;
  });
  return obj;
}

const rows = lines.filter(Boolean).map(parseLine);

const cityType = `
export type City = {
  slug: string;
  name: string;
  state: string;
  rpp: number;
  rentIndex: number;
  incomeMedian: number;
  diversityIndex: number;
  internetMbps: number;
  parksPer10k: number;
  cafesPer10k: number;
  barsPer10k: number;
  climate: string;
};`;

const citiesArray = `export const CITIES: City[] = ${JSON.stringify(rows, null, 2)};`;

const file = `${cityType}\n\n${citiesArray}\n`;
await writeFile(outPath, file, "utf8");
console.log(`Wrote ${rows.length} cities -> ${outPath}`);
