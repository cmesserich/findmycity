import { CITIES } from "@/lib/data/cities";

function levenshtein(a: string, b: string) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export function suggestCitySlugs(query: string, limit = 3): string[] {
  if (!query) return [];
  const q = query.toLowerCase();
  const scored = CITIES.map(c => {
    const slugScore = levenshtein(q, c.slug);
    const nameScore = levenshtein(q, `${c.name}-${c.state}`.toLowerCase().replace(/\s+/g, "-"));
    const containsBonus = c.slug.includes(q) || c.name.toLowerCase().includes(q) ? -2 : 0;
    return { slug: c.slug, score: Math.min(slugScore, nameScore) + containsBonus };
  });
  scored.sort((a,b) => a.score - b.score);
  return scored.slice(0, limit).map(s => s.slug);
}
