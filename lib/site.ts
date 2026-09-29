import { caseStudyProjects } from "./catalog";

export const siteName = "AX Builder by sysmetrix";
export const siteDescription =
  "청소년 현장과 사업을 출발점으로 정책·성과·데이터·AX를 연결해, 실제 업무에 쓰이는 시스템과 도구를 만듭니다. I build systems for better public work.";

/**
 * Deploy-time configuration — there is intentionally NO default URL.
 *   NEXT_PUBLIC_SITE_URL       e.g. https://example.com  (the intended HTTPS production origin)
 *   NEXT_PUBLIC_ALLOW_INDEXING "true" to allow search engines (requires SITE_URL)
 * Until both are set the site emits noindex + `Disallow: /` and no canonical/sitemap URLs.
 */
function validSiteUrl(value: string | undefined): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.pathname !== "/" || url.username || url.password || url.search || url.hash) {
      return undefined;
    }
    return url.origin;
  } catch {
    return undefined;
  }
}

export const siteUrl = validSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const indexable = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" && Boolean(siteUrl);

export function publicUrl(path: string): string | undefined {
  return indexable && siteUrl ? `${siteUrl}${path === "/" ? "" : path}` : undefined;
}

/** Canonical is only emitted after the explicit indexing opt-in. */
export function canonical(path: string) {
  const url = publicUrl(path);
  return url ? { canonical: url } : undefined;
}

/** Public, indexable routes. /brand is dev-only and deliberately absent. */
export function publicRoutes(): string[] {
  const work = caseStudyProjects.map((p) => `/work/${p.slug}`);
  return ["/", "/work", "/about", "/lab", ...work];
}

/** Route-aware social card. Attached only after the explicit indexing opt-in. */
export function ogImagesFor(title: string, eyebrow = siteName) {
  if (!indexable || !siteUrl) return undefined;
  const query = new URLSearchParams({ title, eyebrow });
  return [{
    url: `${siteUrl}/og?${query}`,
    width: 1200,
    height: 630,
    alt: `${title} — ${eyebrow}`,
  }];
}

export const ogImages = ogImagesFor("I build systems for better public work.");
