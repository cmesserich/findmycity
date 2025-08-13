import { CITIES, City } from '@/lib/data/cities';

export function getCity(slug: string): City | undefined {
  return CITIES.find(city => city.slug.toLowerCase() === slug.toLowerCase());
}

export function percentDelta(a: number, b: number): number {
  if (a === 0) return b === 0 ? 0 : 100;
  return ((b - a) / a) * 100;
}

export function spendingPower(salary: number, rppA: number, rppB: number): {
  destEquivalent: number;
  deltaPct: number;
} {
  // Calculate equivalent salary needed in destination city
  const destEquivalent = (salary * rppB) / rppA;
  
  // Calculate the percentage difference in spending power
  // Positive delta means you need less money (better spending power)
  const deltaPct = ((salary - destEquivalent) / salary) * 100;
  
  return {
    destEquivalent,
    deltaPct
  };
}

export function fmtMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function fmtPct(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

export function normalizeSlug(input: string): string {
  return input.toLowerCase().replace(/\s+/g, '-');
}