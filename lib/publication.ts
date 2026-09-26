/**
 * Content Gate (user-confirmed 2026-09-26, applied at launch): only these links are public.
 * A link renders only when the project is listed here AND is `public` in lib/projects.ts.
 * Everything not listed (성과관리 운영 시스템, ToolBox, Annual Plan Automation, …) shows no source or demo link.
 * Security Checkup: GitHub only — the live demo stays hidden for now.
 */
type PublicLink = "source" | "demo";

const approved: Record<string, readonly PublicLink[]> = {
  "survey-intelligence": ["source", "demo"],
  "to-hwpx": ["source", "demo"],
  "security-checkup": ["source"],
};

export const publication = {
  allows: (slug: string, link: PublicLink) => approved[slug]?.includes(link) ?? false,
} as const;
