import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const urls = [
    "/",
    "/wizard",
    "/compare?a=washington-dc&b=omaha&salary=100000",
    "/compare?a=new-york-city&b=miami&salary=100000",
    "/compare?a=seattle&b=austin&salary=100000",
  ];
  const now = new Date().toISOString();
  return urls.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
