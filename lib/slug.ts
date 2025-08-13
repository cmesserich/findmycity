export function normalizeSlug(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, "-");
}
