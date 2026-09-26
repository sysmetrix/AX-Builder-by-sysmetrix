import type { Metadata } from "next";
import Link from "next/link";
import { hasCaseStudy, sortedProjects } from "@/lib/catalog";
import { canonical, ogImages, publicUrl, siteName } from "@/lib/site";
import type { ThemeId } from "@/lib/themes";

const title = "소개";
const description =
  "청소년 현장과 사업을 기반으로 정책·성과·데이터·AX를 연결해, 실제 업무에 쓰이는 시스템과 도구를 만듭니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: canonical("/about"),
  openGraph: { type: "website", siteName, locale: "ko_KR", title: `${title} — ${siteName}`, description, url: publicUrl("/about"), images: ogImages },
  twitter: { card: "summary_large_image", title: `${title} — ${siteName}`, description, images: ogImages },
};

/**
 * "What I work on": three axes. Axis order follows the identity line (field first).
 * Wording rules (user decision, 2026-09-26):
 *  - no department name / job title, and no statement about a future role — only what is being done now;
 *  - youth-field words: 사업 · 활동 · 프로그램. Things that were built: 시스템 · 서비스 · 도구 · 자동화.
 * Related works are derived from project `themes` (lib/catalog.ts), each project under the first axis it matches.
 */
const axes: { en: string; ko: string; stage: string; body: string; themes: ThemeId[] }[] = [
  {
    en: "Youth Work & Programs",
    ko: "청소년 사업·현장",
    stage: "경험 · Experience",
    body: "청소년 활동과 사업의 현장에서 프로그램을 기획하고 운영해 왔습니다. 이 현장 경험이 이후 모든 작업의 출발점입니다.",
    themes: ["youth-work"],
  },
  {
    en: "Policy & Performance",
    ko: "정책·성과",
    stage: "현재 · Practice",
    body: "현재 성과관리와 청소년·청년 정책 업무를 하고 있습니다. 목표·성과·지표를 구분하고, 사업과 정책의 의사결정 흐름을 시스템 설계에 반영합니다.",
    themes: ["policy", "performance", "strategy"],
  },
  {
    en: "AX & Digital Building",
    ko: "AX·디지털 구축",
    stage: "현재 · Practice",
    body: "현재 AX 전략과 AX 챌린저 운영도 맡고 있습니다. AI를 기능 하나로 붙이기보다 사람이 반복하는 업무 흐름 전체를 다시 설계하고, 시스템·서비스·도구·자동화로 직접 만듭니다.",
    themes: ["ax-automation", "document-engineering"],
  },
];

const shown = new Set<string>();
const related = axes.map((axis) => {
  const list = sortedProjects
    .filter((p) => p.sourceVisibility !== "internal" && !shown.has(p.slug) && p.themes.some((t) => axis.themes.includes(t)))
    .slice(0, 6);
  list.forEach((p) => shown.add(p.slug));
  return list;
});

export default function AboutPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <p className="mono">About</p>
        <h1>현장을 아는 사람이 직접 시스템을 만듭니다.</h1>
        <p className="lede">
          청소년 현장에서 시작해 정책·성과 업무로, 다시 데이터와 AX로 일의 범위를 넓혀 왔습니다.
          공공기관이라는 업무환경 안에서, 사업과 업무의 문제를 직접 데이터와 디지털 시스템으로 풀어 갑니다.
        </p>
      </header>
      <section className="block" aria-labelledby="works-h">
        <div className="sec-h">
          <h2 id="works-h">하는 일</h2>
          <p>What I Work On</p>
        </div>
        <ul className="rows">
          {axes.map((axis, i) => (
            <li className="row-item" key={axis.en}>
              <div>
                <h3>{axis.en}</h3>
                <p className="mono-ko">{axis.ko}</p>
              </div>
              <div>
                <p className="mono-ko">{axis.stage}</p>
                <p>{axis.body}</p>
                {related[i].length > 0 && (
                  <p className="mono-ko about-works">
                    관련 작업 ·{" "}
                    {related[i].map((p, j) => (
                      <span key={p.slug}>
                        {j > 0 && " · "}
                        {hasCaseStudy(p) ? <Link href={`/work/${p.slug}`}>{p.title}</Link> : p.title}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
