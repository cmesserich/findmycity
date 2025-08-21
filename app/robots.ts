// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allowIndex = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "1";
  return {
    rules: allowIndex
      ? [{ userAgent: "*", allow: "/" }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: allowIndex ? `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml` : undefined,
  };
}
