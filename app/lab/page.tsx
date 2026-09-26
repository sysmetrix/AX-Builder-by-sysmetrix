import type { Metadata } from "next";
import { ProjectRow } from "@/components/project-parts";
import { publicProjectsByCategory } from "@/lib/catalog";
import { canonical, ogImages, publicUrl, siteName } from "@/lib/site";

const title = "도구와 실험";
const description = "작은 반복업무와 데이터 표현 아이디어를 실제로 만들어 검증한 도구와 실험 모음.";

export const metadata: Metadata = {
  title,
  description,
  alternates: canonical("/lab"),
  openGraph: { type: "website", siteName, locale: "ko_KR", title: `${title} — ${siteName}`, description, url: publicUrl("/lab"), images: ogImages },
  twitter: { card: "summary_large_image", title: `${title} — ${siteName}`, description, images: ogImages },
};

const groups = [
  { key: "tools", title: "업무 도구" },
  { key: "experiments", title: "실험" },
] as const;

export default function LabPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <p className="mono">Lab</p>
        <h1>필요한 것이 없으면, 작게라도 직접 만듭니다.</h1>
        <p className="lede">
          작은 반복업무, 개인 생산성 문제, 데이터 표현 아이디어를 실제로 만들어 검증한 프로젝트입니다.
        </p>
      </header>
      {groups.map((g) => (
        <section className="block" key={g.key} aria-labelledby={`h-${g.key}`}>
          <div className="sec-h"><h2 id={`h-${g.key}`}>{g.title}</h2></div>
          <ul className="rows">
            {publicProjectsByCategory(g.key).map((p) => (
              <ProjectRow key={p.slug} project={p} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
