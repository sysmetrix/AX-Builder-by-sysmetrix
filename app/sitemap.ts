import type { MetadataRoute } from "next";
import { indexable, publicRoutes, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Sitemaps require absolute URLs; without a configured site URL there is nothing valid to list.
  if (!indexable || !siteUrl) return [];
  return publicRoutes().map((path) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.startsWith("/work/") ? 0.8 : 0.6,
  }));
}
