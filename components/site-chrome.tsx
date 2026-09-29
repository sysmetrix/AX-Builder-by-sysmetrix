import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { MobileMenu } from "./mobile-menu";
import { PrimaryNav } from "./primary-nav";
import { BuilderLog, type BuilderLogStats } from "./builder-log";
import { identityLine } from "@/lib/identity";
import { caseStudyProjects, publicProjects, themesInUse } from "@/lib/catalog";
import { publication } from "@/lib/publication";
import { period, safeHref, str } from "@/lib/career";
import { publicContacts, publicTimeline } from "@/lib/career-public";

const nav = [
  { href: "/work", label: "작업" },
  { href: "/work#data", label: "데이터·조사" },
  { href: "/lab", label: "도구" },
  { href: "/about", label: "소개" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link className="brand" href="/" aria-label="AX Builder by sysmetrix — 홈">
          <BrandMark />
          <span>
            <span className="brand-name">AX Builder</span>
            <small>by sysmetrix</small>
          </span>
        </Link>
        <PrimaryNav items={nav} />
        <MobileMenu items={nav} />
      </div>
    </header>
  );
}

const logStats: BuilderLogStats = {
  projects: publicProjects.length,
  caseStudies: caseStudyProjects.length,
  publicSources: publicProjects.filter((p) => p.sourceVisibility === "public" && p.repoUrl && publication.allows(p.slug, "source")).length,
  themes: themesInUse.length,
};
const logTimeline = publicTimeline.map((i) => ({
  when: period(i) || str(i, "year"),
  title: str(i, "org") || str(i, "title"),
  detail: str(i, "role"),
}));
const contact = publicContacts.find((c) => safeHref(str(c, "url")));

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap foot">
        <div>
          <BuilderLog identity={identityLine} stats={logStats} timeline={logTimeline} />
          <p className="mono">{identityLine}</p>
        </div>
        <p className="foot-note">
          현장에서 출발한 시스템과 도구를 만듭니다.
          {contact && (
            <>
              <br />
              <a href={safeHref(str(contact, "url"))} rel="noopener noreferrer">{str(contact, "value") || str(contact, "label")}</a>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
