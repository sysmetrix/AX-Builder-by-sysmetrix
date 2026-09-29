import type { Metadata } from "next";
import Link from "next/link";
import { hasCaseStudy, sortedProjects } from "@/lib/catalog";
import { capabilityAxes } from "@/lib/capabilities";
import { period, safeHref, str } from "@/lib/career";
import { publicContacts, publicTimeline } from "@/lib/career-public";
import { canonical, ogImagesFor, publicUrl, siteName } from "@/lib/site";

const title = "소개";
const description =
  "청소년 현장과 사업을 기반으로 정책·성과·데이터·AX를 연결해, 실제 업무에 쓰이는 시스템과 도구를 만듭니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: canonical("/about"),
  openGraph: { type: "website", siteName, locale: "ko_KR", title: `${title} — ${siteName}`, description, url: publicUrl("/about"), images: ogImagesFor("현장을 아는 사람이 직접 시스템을 만듭니다.", "About · AX Builder") },
  twitter: { card: "summary_large_image", title: `${title} — ${siteName}`, description, images: ogImagesFor("현장을 아는 사람이 직접 시스템을 만듭니다.", "About · AX Builder") },
};

/**
 * "What I work on": three axes. Axis order follows the identity line (field first).
 * Wording rules (user decision, 2026-09-26):
 *  - no department name / job title, and no statement about a future role — only what is being done now;
 *  - youth-field words: 사업 · 활동 · 프로그램. Things that were built: 시스템 · 서비스 · 도구 · 자동화.
 * Related works are derived from project `themes` (lib/catalog.ts), each project under the first axis it matches.
 */
const shown = new Set<string>();
const related = capabilityAxes.map((axis) => {
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
          {capabilityAxes.map((axis, i) => (
            <li className="row-item" key={axis.en}>
              <div>
                <h3>{axis.en}</h3>
                <p className="mono-ko">{axis.ko}</p>
              </div>
              <div>
                <p className="mono-ko">{axis.stage}</p>
                <p>{axis.summary}</p>
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
      <section className="block" aria-labelledby="method-h">
        <div className="sec-h">
          <h2 id="method-h">일하는 방식</h2>
          <p>How I Build</p>
        </div>
        <ol className="method-steps">
          <li><span className="mono">01</span><h3>현장 문제 정의</h3><p>사용자가 반복해서 판단하고 옮기고 확인하는 지점을 실제 업무 언어로 정리합니다.</p></li>
          <li><span className="mono">02</span><h3>업무 흐름 모델링</h3><p>입력·판단·예외·산출의 순서와 책임을 시스템이 다룰 수 있는 구조로 바꿉니다.</p></li>
          <li><span className="mono">03</span><h3>직접 구현</h3><p>문제에 맞는 웹·데스크톱·문서 자동화 환경을 선택해 실제 사용할 수 있는 도구로 만듭니다.</p></li>
          <li><span className="mono">04</span><h3>산출물 검증·개선</h3><p>화면만이 아니라 문서·데이터·권한·예외 처리까지 실제 결과물을 기준으로 확인하고 고칩니다.</p></li>
        </ol>
      </section>
      {publicTimeline.length > 0 && (
        <section className="block" aria-labelledby="career-h">
          <div className="sec-h">
            <h2 id="career-h">걸어온 길</h2>
            <p>Career</p>
          </div>
          <ul className="rows">
            {publicTimeline.map((item) => (
              <li className="row-item" key={item.id}>
                <div>
                  <h3>{str(item, "org") || str(item, "title")}</h3>
                  <p className="mono-ko">{period(item) || str(item, "year")}</p>
                </div>
                <div>
                  {str(item, "role") && <p className="mono-ko">{str(item, "role")}</p>}
                  {str(item, "summary") && <p>{str(item, "summary")}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      {publicContacts.length > 0 && (
        <section className="block" aria-labelledby="contact-h">
          <div className="sec-h">
            <h2 id="contact-h">연락</h2>
            <p>Contact</p>
          </div>
          <ul className="rows">
            {publicContacts.map((c) => (
              <li className="row-item" key={c.id}>
                <div><h3>{str(c, "label")}</h3></div>
                <div>
                  {safeHref(str(c, "url"))
                    ? <a className="more" href={safeHref(str(c, "url"))} rel="noopener noreferrer">{str(c, "value") || str(c, "url")}</a>
                    : <p>{str(c, "value")}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
