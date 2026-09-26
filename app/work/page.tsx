import type { Metadata } from "next";
import { WorkIndex, type WorkFilter, type WorkGroup } from "@/components/work-index";
import { hasCaseStudy, publicProjects, themeLabels, themesInUse } from "@/lib/catalog";
import { canonical, ogImages, publicUrl, siteName } from "@/lib/site";
import { themes } from "@/lib/themes";

const title = "전체 작업";
const description =
  "청소년 현장과 사업에서 출발해 만든 시스템·서비스·도구·데이터 작업의 전체 목록. 새로운 작업이 계속 추가됩니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: canonical("/work"),
  openGraph: { type: "website", siteName, locale: "ko_KR", title: `${title} — ${siteName}`, description, url: publicUrl("/work"), images: ogImages },
  twitter: { card: "summary_large_image", title: `${title} — ${siteName}`, description, images: ogImages },
};

/**
 * Archive of everything. Home = curated; /work = exploration.
 * Groups follow `category` (how a project is presented); filters follow `themes` (what it is about).
 * Both are derived from the catalog — adding a project never requires editing this page.
 */
const groupDefs = [
  { key: "selected-work", id: "selected", title: "대표 작업" },
  { key: "data-research", id: "data", title: "데이터·조사" },
  { key: "tools", id: "tools", title: "업무 도구" },
  { key: "experiments", id: "experiments", title: "실험" },
  { key: "history", id: "history", title: "기록" },
] as const;

const groups: WorkGroup[] = groupDefs
  .map((g) => ({
    ...g,
    items: publicProjects
      .filter((p) => p.category === g.key)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        oneLiner: p.oneLiner,
        themes: p.themes as string[],
        themeLabels: themeLabels(p),
        href: hasCaseStudy(p) ? `/work/${p.slug}` : undefined,
      })),
  }))
  .filter((g) => g.items.length > 0);

const filters: WorkFilter[] = [
  { id: "all", label: "전체" },
  { id: "selected", label: "대표 작업" },
  ...themesInUse.map((t) => ({ id: t, label: themes[t].ko })),
];

export default function WorkIndexPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <p className="mono">Work</p>
        <h1>만들어 온 작업의 전체 목록.</h1>
        <p className="lede">
          청소년 현장과 사업에서 출발해 만든 시스템·서비스·도구·데이터 작업을 모았습니다. 새로운 작업이 계속 추가됩니다.
        </p>
      </header>
      <WorkIndex groups={groups} filters={filters} />
    </div>
  );
}
