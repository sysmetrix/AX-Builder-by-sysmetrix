import type { Metadata } from "next";
import Link from "next/link";
import { YouthIntro } from "@/components/youth-intro";
import { ProjectCompact, ProjectFeature, ProjectRow } from "@/components/project-parts";
import { hasCaseStudy, youthFeaturedProjects, youthRelatedProjects } from "@/lib/catalog";
import { canonical, ogImagesFor, publicUrl, youthSiteName } from "@/lib/site";

const title = "Youth Worker by sysmetrix";
const description = "더 나은 청소년 현장을 위한 사업과 시스템을 만듭니다. 청소년 사업·정책·평가·데이터와 현장을 돕는 도구를 연결합니다.";
export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: canonical("/youth"),
  openGraph: { type: "website", siteName: youthSiteName, locale: "ko_KR", title, description, url: publicUrl("/youth"), images: ogImagesFor("더 나은 청소년 현장을 위한 사업과 시스템을 만듭니다.", youthSiteName) },
  twitter: { card: "summary_large_image", title, description, images: ogImagesFor("더 나은 청소년 현장을 위한 사업과 시스템을 만듭니다.", youthSiteName) },
};

export default function YouthHome() {
  const featuredCases = youthFeaturedProjects.filter(hasCaseStudy);
  return <div className="wrap">
    <YouthIntro />
    <section className="block" id="youth-work" aria-labelledby="youth-work-h">
      <div className="sec-h"><h2 id="youth-work-h">청소년 현장에서 만든 일</h2><p>사업·활동·평가에서 출발한 작업입니다.</p></div>
      {featuredCases.map((p, i) => <ProjectFeature key={p.slug} project={p} index={i} total={featuredCases.length} hrefPrefix="/youth/work" />)}
      <ul className="rows youth-list-only">
        {youthFeaturedProjects.filter((p) => !hasCaseStudy(p)).map((p) => <ProjectRow key={p.slug} project={p} hrefPrefix="/youth/work" />)}
      </ul>
      <Link className="more" href="/youth/work">청소년 사업·활동 전체 보기 →</Link>
    </section>
    <section className="block" aria-labelledby="youth-related-h">
      <div className="sec-h"><h2 id="youth-related-h">현장을 돕는 시스템</h2><p>성과·문서·기획 업무를 더 잘 작동하게 만듭니다.</p></div>
      <div className="compact-work">
        {youthRelatedProjects.map((p) => <ProjectCompact key={p.slug} project={p} hrefPrefix="/youth/work" />)}
      </div>
    </section>
    <section className="block about-teaser" aria-labelledby="youth-about-h">
      <h2 id="youth-about-h">현장을 이해하고, 구조를 만들고, 직접 구현합니다.</h2>
      <div><p>청소년과 만나는 일부터 사업 설계, 성과평가, 업무 시스템 구축까지 하나의 실천 흐름으로 연결합니다.</p><Link className="more" href="/youth/about">Youth Worker 소개 →</Link></div>
    </section>
  </div>;
}
