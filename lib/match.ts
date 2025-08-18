// lib/match.ts
import { CITIES } from "@/lib/data/cities";
import type { City } from "@/lib/types"; 

export type Preferences = {
  salary: number;
  currentCitySlug?: string;
  weights: {
    affordability: number;
    internet: number;
    parks: number;
    cafes: number;
    nightlife: number;
    diversity: number;
  };
};

type Range = { min: number; max: number };

const ranges = (() => {
  const init = (min = Infinity, max = -Infinity): Range => ({ min, max });
  const rpp = init(), rentIndex = init(), incomeMedian = init(), diversityIndex = init(),
        internetMbps = init(), parksPer10k = init(), cafesPer10k = init(), barsPer10k = init();

  for (const c of CITIES) {
    rpp.min = Math.min(rpp.min, c.rpp);                 rpp.max = Math.max(rpp.max, c.rpp);
    rentIndex.min = Math.min(rentIndex.min, c.rentIndex); rentIndex.max = Math.max(rentIndex.max, c.rentIndex);
    incomeMedian.min = Math.min(incomeMedian.min, c.incomeMedian); incomeMedian.max = Math.max(incomeMedian.max, c.incomeMedian);
    diversityIndex.min = Math.min(diversityIndex.min, c.diversityIndex); diversityIndex.max = Math.max(diversityIndex.max, c.diversityIndex);
    internetMbps.min = Math.min(internetMbps.min, c.internetMbps); internetMbps.max = Math.max(internetMbps.max, c.internetMbps);
    parksPer10k.min = Math.min(parksPer10k.min, c.parksPer10k); parksPer10k.max = Math.max(parksPer10k.max, c.parksPer10k);
    cafesPer10k.min = Math.min(cafesPer10k.min, c.cafesPer10k); cafesPer10k.max = Math.max(cafesPer10k.max, c.cafesPer10k);
    barsPer10k.min = Math.min(barsPer10k.min, c.barsPer10k); barsPer10k.max = Math.max(barsPer10k.max, c.barsPer10k);
  }
  return { rpp, rentIndex, incomeMedian, diversityIndex, internetMbps, parksPer10k, cafesPer10k, barsPer10k };
})();

function normHigher(v: number, r: Range) {
  const span = r.max - r.min;
  return span <= 0 ? 0.5 : (v - r.min) / span; // 0..1
}
function normLower(v: number, r: Range) {
  const span = r.max - r.min;
  return span <= 0 ? 0.5 : (r.max - v) / span; // 0..1 (lower better)
}

export function scoreCity(city: City, prefs: Preferences) {
  const w = prefs.weights;
  const wSum = w.affordability + w.internet + w.parks + w.cafes + w.nightlife + w.diversity || 1;

  // affordability blends RPP (70%) + RentIndex (30%)
  const afford = 0.7 * normLower(city.rpp, ranges.rpp) + 0.3 * normLower(city.rentIndex, ranges.rentIndex);
  const internet = normHigher(city.internetMbps, ranges.internetMbps);
  const parks = normHigher(city.parksPer10k, ranges.parksPer10k);
  const cafes = normHigher(city.cafesPer10k, ranges.cafesPer10k);
  const bars = normHigher(city.barsPer10k, ranges.barsPer10k);
  const diversity = normHigher(city.diversityIndex, ranges.diversityIndex);

  const composite =
    w.affordability * afford +
    w.internet * internet +
    w.parks * parks +
    w.cafes * cafes +
    w.nightlife * bars +
    w.diversity * diversity;

  return (100 * composite) / wSum; // 0..100
}

export function getTopMatches(prefs: Preferences, limit = 5) {
  const scores = CITIES.map((c) => ({ city: c, score: scoreCity(c, prefs) }));
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, limit);
}
