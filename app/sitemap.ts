// app/sitemap.ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/wizard`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Example compare route for crawlers; your dynamic pages work as-is:
    {
      url: `${SITE.url}/compare?a=washington-dc&b=omaha&salary=100000`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/briefs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];
}
