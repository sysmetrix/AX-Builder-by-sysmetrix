import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!indexable) {
    // Pre-launch default: keep every crawler out until NEXT_PUBLIC_ALLOW_INDEXING=true.
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/brand"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
