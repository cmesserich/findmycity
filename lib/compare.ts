// lib/compare.ts
import { CITIES, type City } from "@/lib/data/cities";

/** Get a city by slug (e.g., "washington-dc"). */
export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

/** Percentage change from A -> B (B vs A), signed. */
export function percentDelta(a: number, b: number): number {
  if (a === 0 && b === 0) return 0;
  if (a === 0) return 100;
  return ((b - a) / a) * 100;
}

/**
 * Cost-of-living adjusted spending power when moving from A -> B.
 * Lower RPP = cheaper. If B is cheaper than A, you should feel *richer* in B.
 *
 * destEquivalent = salary * (RPP_A / RPP_B)
 * deltaPct       = (destEquivalent / salary - 1) * 100
 */
export function spendingPower(salary: number, rppA: number, rppB: number) {
  const destEquivalent = salary * (rppA / rppB);     // <-- key fix: A / B (not B / A)
  const deltaPct = percentDelta(salary, destEquivalent);
  return { destEquivalent, deltaPct };
}

export function fmtMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function fmtPct(p: number) {
  const sign = p > 0 ? "+" : "";
  return `${sign}${p.toFixed(1)}%`;
}
