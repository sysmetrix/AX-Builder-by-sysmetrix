/**
 * Content Gate (user-confirmed 2026-09-26, applied at launch): only these links are public.
 * A link renders only when the project is listed here AND is `public` in lib/projects.ts.
 * Everything not listed (성과관리 운영 시스템, ToolBox, Annual Plan Automation, …) shows no source or demo link.
 * Security Checkup: no links until its repository is cleaned.
 */
type PublicLink = "source" | "demo";

const approved: Record<string, readonly PublicLink[]> = {
  "survey-intelligence": ["source", "demo"],
  "to-hwpx": ["source", "demo"],
  "security-checkup": [], // GitHub link withdrawn: repository still holds staff-roster data (see review/opus-production-launch-review.md)
};

export const publication = {
  allows: (slug: string, link: PublicLink) => approved[slug]?.includes(link) ?? false,
} as const;
