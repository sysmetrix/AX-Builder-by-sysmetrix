import type { Metadata } from "next";
import { WorkIndex, type WorkGroup } from "@/components/work-index";
import { statusLabel } from "@/components/project-parts";
import { hasCaseStudy, themeLabels, youthArchiveProjects, youthRelatedProjects } from "@/lib/catalog";
import { canonical, ogImagesFor, publicUrl, youthSiteName } from "@/lib/site";

const title = "청소년 사업·활동";
const description = "청소년 현장과 사업에서 출발한 작업과 이를 뒷받침하는 시스템을 모았습니다.";
export const metadata: Metadata = {
  title: `${title} — ${youthSiteName}`, description, alternates: canonical("/youth/work"),
  openGraph: { type: "website", siteName: youthSiteName, locale: "ko_KR", title, description, url: publicUrl("/youth/work"), images: ogImagesFor("청소년 현장에서 만든 일", youthSiteName) },
  twitter: { card: "summary_large_image", title, description, images: ogImagesFor("청소년 현장에서 만든 일", youthSiteName) },
};

const item = (p: (typeof youthArchiveProjects)[number]) => ({
  slug: p.slug, title: p.title, oneLiner: p.oneLiner, themes: p.themes as string[], themeLabels: themeLabels(p),
  year: p.year, status: statusLabel(p.status), href: hasCaseStudy(p) ? `/youth/work/${p.slug}` : undefined,
});
const groups: WorkGroup[] = [
  { key: "youth-work", id: "field", title: "현장·사업·평가", items: youthArchiveProjects.map(item) },
  { key: "related", id: "systems", title: "연결된 시스템", items: youthRelatedProjects.map(item) },
];
const filters = [{ id: "all", label: "전체" }, { id: "youth-work", label: "청소년 현장" }, { id: "related", label: "연결된 시스템" }];

export default function YouthWorkPage() {
  return <div className="wrap"><header className="page-head"><p className="mono">Youth Work</p><h1>현장에서 시작해, 사업과 시스템으로 이어진 일.</h1><p className="lede">청소년과 직접 만나는 현장, 사업을 평가하고 개선하는 데이터, 그 일을 지속 가능하게 만드는 시스템을 함께 보여줍니다.</p></header><WorkIndex groups={groups} filters={filters} /></div>;
}
