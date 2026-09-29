import type { Metadata } from "next";
import Link from "next/link";
import { youthFeaturedProjects, youthRelatedProjects, hasCaseStudy } from "@/lib/catalog";
import { canonical, ogImagesFor, publicUrl, youthSiteName } from "@/lib/site";

const title = "Youth Worker 소개";
const description = "청소년 현장과 사업을 중심에 두고 정책·평가·데이터·AX를 연결합니다.";
export const metadata: Metadata = {
  title: `${title} — ${youthSiteName}`, description, alternates: canonical("/youth/about"),
  openGraph: { type: "website", siteName: youthSiteName, locale: "ko_KR", title, description, url: publicUrl("/youth/about"), images: ogImagesFor("현장을 이해하고, 사업과 시스템을 만듭니다.", youthSiteName) },
  twitter: { card: "summary_large_image", title, description, images: ogImagesFor("현장을 이해하고, 사업과 시스템을 만듭니다.", youthSiteName) },
};

const axes = [
  { en: "Youth Work & Programs", ko: "청소년 현장·사업·활동", text: "청소년과 만나는 현장을 이해하고, 목적과 참여 경험이 분명한 사업과 활동을 기획·운영합니다." },
  { en: "Policy & Evaluation", ko: "정책·성과·평가", text: "현장의 경험을 정책과 성과 언어로 연결하고, 설문과 데이터를 사업 개선에 사용할 수 있는 근거로 바꿉니다." },
  { en: "Systems for Practice", ko: "데이터·AX·업무 시스템", text: "반복되는 행정과 판단을 구조화해 현장 실무자가 실제로 사용할 수 있는 시스템과 도구를 직접 만듭니다." },
];

export default function YouthAboutPage() {
  const projects = [...youthFeaturedProjects, ...youthRelatedProjects];
  return <div className="wrap"><header className="page-head"><p className="mono">About · Youth Worker</p><h1>현장을 이해하고, 사업과 시스템을 만듭니다.</h1><p className="lede">청소년 현장과 사업이 중심입니다. 정책·성과·데이터·AX는 그 일을 더 잘 설계하고 운영하기 위해 연결하는 방법입니다.</p></header>
    <section className="block" aria-labelledby="youth-axes-h"><div className="sec-h"><h2 id="youth-axes-h">일의 세 축</h2><p>Field to System</p></div><ul className="rows">{axes.map((axis) => <li className="row-item" key={axis.en}><div><h3>{axis.en}</h3><p className="mono-ko">{axis.ko}</p></div><div><p>{axis.text}</p></div></li>)}</ul></section>
    <section className="block" aria-labelledby="youth-projects-h"><div className="sec-h"><h2 id="youth-projects-h">연결된 작업</h2><p>현장 작업과 지원 시스템</p></div><ul className="rows">{projects.map((p) => <li className="row-item" key={p.slug}><div><h3>{hasCaseStudy(p) ? <Link href={`/youth/work/${p.slug}`}>{p.title}</Link> : p.title}</h3><p className="mono-ko">{p.youthPresentation === "featured" ? "청소년 현장 작업" : "연결된 시스템"}</p></div><div><p>{p.oneLiner}</p></div></li>)}</ul></section>
  </div>;
}
