import type { BuilderLogStats } from "./builder-log";
import { AdaptiveFooter, AdaptiveHeader } from "./adaptive-chrome";
import { caseStudyProjects, publicProjects, themesInUse } from "@/lib/catalog";
import { publication } from "@/lib/publication";

export function SiteHeader() {
  return <AdaptiveHeader />;
}

const logStats: BuilderLogStats = {
  projects: publicProjects.length,
  caseStudies: caseStudyProjects.length,
  publicSources: publicProjects.filter((p) => p.sourceVisibility === "public" && p.repoUrl && publication.allows(p.slug, "source")).length,
  themes: themesInUse.length,
};
export function SiteFooter() {
  return <AdaptiveFooter stats={logStats} />;
}
