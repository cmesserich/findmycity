// lib/site.ts
export const SITE = {
  name: "CityScout",
  tagline: "Relocation made simple for remote workers",
  // Set this in .env for prod, falls back to dev localhost:
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
