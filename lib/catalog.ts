import { caseStudies } from "./case-studies";
import { flows } from "./flows";
import { projects, type Project, type ProjectCategory } from "./projects";
import { themeIds, themeLabel, type ThemeId } from "./themes";

/**
 * The portfolio is a growing collection: projects are added, re-classified and promoted over time.
 * Everything the site shows is DERIVED from `projects` here — never hard-code a count or a slug list.
 *
 *  - `category`  → how a project is presented. `selected-work` = large card on Home (a curated set;
 *                  its size is NOT fixed — replace, add or demote entries freely).
 *  - `hasCaseStudy` → whether a project gets a /work/[slug] page. Independent of `category`, so a
 *                  project can have a page without being a Selected Work entry.
 *  - `themes`    → the domain axis (youth work, policy, …), multi-valued.
 *  - `order`     → optional manual order inside a category (lower first); otherwise file order.
 */

const indexOf = new Map(projects.map((p, i) => [p.slug, i]));
const rank = (p: Project) => p.order ?? 1000 + (indexOf.get(p.slug) ?? 0);

export const sortedProjects: Project[] = [...projects].sort((a, b) => rank(a) - rank(b));

export function projectsByCategory(category: ProjectCategory): Project[] {
  return sortedProjects.filter((p) => p.category === category);
}

/** Projects that may appear in public lists or routes. `internal` is always pre-publication only. */
export const publicProjects: Project[] = sortedProjects.filter((p) => p.sourceVisibility !== "internal");

export function publicProjectsByCategory(category: ProjectCategory): Project[] {
  return publicProjects.filter((p) => p.category === category);
}

export const selectedProjects: Project[] = publicProjectsByCategory("selected-work");
export const homeLeadProjects: Project[] = selectedProjects.filter((p) => p.homePresentation === "lead");
export const homeCompactProjects: Project[] = selectedProjects.filter((p) => p.homePresentation === "compact");

/** A project has a case-study page if it is a Selected Work entry or has case-study copy. */
export function hasCaseStudy(p: Project): boolean {
  return p.category === "selected-work" || Boolean(caseStudies[p.slug]);
}

/** Public case-study routes. Internal-only copy may exist in data, but never creates a route. */
export const caseStudyProjects: Project[] = publicProjects.filter(hasCaseStudy);

/** Themes that have at least one public project — drives the /work filter, so an empty theme never shows. */
export const themesInUse: ThemeId[] = themeIds.filter((t) => publicProjects.some((p) => p.themes.includes(t)));

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectsByTheme(theme: ThemeId): Project[] {
  return publicProjects.filter((p) => p.themes.includes(theme));
}

export function themeLabels(p: Project): string[] {
  return p.themes.map(themeLabel);
}

/**
 * Build-time guard. Importing this module during `next build` fails the build with a readable list
 * if the catalog is inconsistent, so a new project can never ship half-configured
 * (missing diagram, missing case-study copy, dangling related link, typo'd slug...).
 */
export function validateCatalog(): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  for (const p of projects) {
    if (slugs.has(p.slug)) errors.push(`duplicate slug: ${p.slug}`);
    slugs.add(p.slug);
    for (const t of p.themes) if (!themeIds.includes(t)) errors.push(`${p.slug}: unknown theme "${t}"`);
    if (p.category === "selected-work" && p.sourceVisibility === "internal") {
      errors.push(`${p.slug}: internal projects cannot be selected-work`);
    }
    if (p.category === "selected-work" && !p.homePresentation) {
      errors.push(`${p.slug}: selected-work requires homePresentation (lead or compact)`);
    }
    if (p.category !== "selected-work" && p.homePresentation) {
      errors.push(`${p.slug}: homePresentation is only valid for selected-work`);
    }
  }
  for (const key of Object.keys(flows)) if (!slugs.has(key)) errors.push(`flows: unknown project slug "${key}"`);
  for (const key of Object.keys(caseStudies)) if (!slugs.has(key)) errors.push(`caseStudies: unknown project slug "${key}"`);

  if (selectedProjects.length === 0) errors.push("no selected-work project");
  if (homeLeadProjects.length === 0) errors.push("selected-work requires at least one lead Home project");
  if (homeCompactProjects.length === 0) errors.push("selected-work requires at least one compact Home project");
  const pageSlugs = new Set(caseStudyProjects.map((p) => p.slug));
  for (const p of selectedProjects) {
    if (!flows[p.slug]) errors.push(`${p.slug}: selected-work requires an entry in lib/flows.ts (headline, steps, audience)`);
    if (!caseStudies[p.slug]) errors.push(`${p.slug}: selected-work requires an entry in lib/case-studies.ts`);
  }
  for (const p of caseStudyProjects) {
    for (const r of caseStudies[p.slug]?.related ?? []) {
      if (!pageSlugs.has(r)) errors.push(`${p.slug}: related "${r}" has no case-study page`);
    }
  }
  return errors;
}

const problems = validateCatalog();
if (problems.length > 0) {
  throw new Error(`Portfolio catalog is inconsistent:\n - ${problems.join("\n - ")}`);
}
