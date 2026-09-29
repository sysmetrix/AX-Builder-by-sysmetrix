import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Flow, visibilityLabel } from "@/components/project-parts";
import { caseStudies } from "@/lib/case-studies";
import { flows } from "@/lib/flows";
import { caseStudyProjects, selectedProjects, themeLabels } from "@/lib/catalog";
import { publication } from "@/lib/publication";
import { canonical, ogImagesFor, publicUrl, siteName } from "@/lib/site";

export function generateStaticParams() {
  return caseStudyProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = caseStudyProjects.find((x) => x.slug === slug);
  if (!p) return {};
  const description = `${flows[slug]?.headline ?? ""} ${p.oneLiner}`.trim();
  const socialTitle = `${p.title} — Case Study`;
  return {
    title: p.title,
    description,
    alternates: canonical(`/work/${slug}`),
    openGraph: { type: "article", siteName, locale: "ko_KR", title: socialTitle, description, url: publicUrl(`/work/${slug}`), images: ogImagesFor(p.title, flows[slug]?.what ?? "Case Study · AX Builder") },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: ogImagesFor(p.title, flows[slug]?.what ?? "Case Study · AX Builder") },
  };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = caseStudyProjects.findIndex((p) => p.slug === slug);
  if (idx < 0) notFound();
  const p = caseStudyProjects[idx];
  const selectedIdx = selectedProjects.findIndex((x) => x.slug === slug);
  const themes = themeLabels(p);
  const flow = flows[slug];
  const glance = [
    { label: "무엇", value: flow?.what ?? p.eyebrow },
    { label: "누구를 위해", value: flow?.audience },
    { label: "역할", value: p.role },
    { label: "공개 범위", value: visibilityLabel(p) },
  ].filter((g) => g.value);
  const detail = caseStudies[slug];
  const related = (detail?.related ?? [])
    .map((relatedSlug) => caseStudyProjects.find((candidate) => candidate.slug === relatedSlug))
    .filter((candidate): candidate is (typeof caseStudyProjects)[number] => Boolean(candidate));
  const next = caseStudyProjects[(idx + 1) % caseStudyProjects.length];
  const isPublic = p.sourceVisibility === "public";
  const links = [
    isPublic && p.repoUrl && publication.allows(slug, "source") ? { href: p.repoUrl, label: "GitHub" } : null,
    isPublic && p.liveUrl && publication.allows(slug, "demo") ? { href: p.liveUrl, label: "라이브 데모" } : null,
  ].filter((l): l is { href: string; label: string } => l !== null);
  const pageUrl = publicUrl(`/work/${slug}`);
  const caseJsonLd = pageUrl
    ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: p.title,
        ...(p.internalName ? { alternateName: p.internalName } : {}),
        headline: flow?.headline ?? p.oneLiner,
        description: `${flow?.headline ?? ""} ${p.oneLiner}`.trim(),
        url: pageUrl,
        inLanguage: "ko",
        isPartOf: { "@type": "WebSite", name: siteName, url: publicUrl("/") },
      }
    : null;

  return (
    <div className="wrap">
      {caseJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <section className="case-hero">
        <Link className="mono-ko crumb" href={selectedIdx >= 0 ? "/#work" : "/work"}>
          {selectedIdx >= 0
            ? `← 대표 작업 · 사례 ${String(selectedIdx + 1).padStart(2, "0")} / ${String(selectedProjects.length).padStart(2, "0")}`
            : "← 전체 작업"}
        </Link>
        <h1 className="case-title">
          <span>{flow?.headline ?? p.oneLiner}</span>
        </h1>
        <p className="lead-ko">{p.oneLiner}</p>
        {themes.length > 0 && <p className="mono-ko case-themes">{themes.join(" · ")}</p>}
        {p.internalName && <p className="mono-ko case-themes">Internal project name: {p.internalName}</p>}
        <dl className="glance">
          {glance.map((g) => (
            <div key={g.label}><dt className="mono-ko">{g.label}</dt><dd>{g.value}</dd></div>
          ))}
        </dl>
        {links.length > 0 && (
          <p className="case-links">
            {links.map((l) => (
              <a key={l.href} className="more" href={l.href} rel="noopener noreferrer" target="_blank">
                {l.label} ↗
              </a>
            ))}
          </p>
        )}
      </section>

      <nav className="case-toc" aria-label="사례 목차">
        <a href="#c-flow">흐름</a>
        <a href="#c-evidence">화면·증거</a>
        <a href="#c-problem">문제</a>
        <a href="#c-built">구축 내용</a>
        <a href="#c-change">변화</a>
        <a href="#c-eng">구현·검증</a>
      </nav>

      <Flow slug={slug} id="c-flow" />

      <section className="case-proof" id="c-evidence" aria-labelledby="c-evidence-h">
        <div className="case-proof-head">
          <h2 id="c-evidence-h">화면·증거</h2>
          <p>공개 범위 안에서 직접 확인할 수 있는 자료만 연결합니다.</p>
        </div>
        {p.screens && p.screens.length > 0 && (
          <div className="case-screens">
            {p.screens.map((screen, i) => (
              <figure key={screen.src} className={i === 0 ? "shot-lead" : undefined}>
                <a href={screen.src} target="_blank" rel="noopener noreferrer" title="원본 크기로 보기">
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    width={screen.width}
                    height={screen.height}
                    sizes={i === 0 ? "(max-width: 820px) calc(100vw - 40px), 1120px" : "(max-width: 820px) calc(100vw - 40px), 560px"}
                  />
                </a>
                {screen.caption && <figcaption>{screen.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
        <ul className="proof-list">
          {p.screens && p.screens.length > 0 && <li>공개 가능한 화면 {p.screens.length}개와 설명을 제공합니다.</li>}
          {links.map((link) => <li key={link.href}><a href={link.href} rel="noopener noreferrer" target="_blank">{link.label}에서 직접 확인 ↗</a></li>)}
          {links.length === 0 && <li>{visibilityLabel(p)}. 저장소와 운영자료는 공개 증거로 연결하지 않습니다.</li>}
        </ul>
      </section>

      <section className="case-sec" aria-labelledby="c-problem">
        <h2 id="c-problem">문제</h2>
        <div>
          <p>{detail?.before ?? p.problem}</p>
        </div>
      </section>
      <section className="case-sec" aria-labelledby="c-built">
        <h2 id="c-built">구축 내용</h2>
        <div>
          {!detail && <p>{p.solution}</p>}
          {detail && <ul className="case-list">{detail.built.map((item) => <li key={item}>{item}</li>)}</ul>}
        </div>
      </section>
      {detail && (
        <section className="case-sec" aria-labelledby="c-decisions">
          <h2 id="c-decisions">핵심 결정</h2>
          <div><ul className="case-list">{detail.decisions.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </section>
      )}
      <section className="case-sec" aria-labelledby="c-change">
        <h2 id="c-change">변화</h2>
        <div>
          <p>{detail?.after ?? p.outcome}</p>
          {detail?.impact && detail.impact !== detail.after && <p>{detail.impact}</p>}
        </div>
      </section>
      <section className="case-sec" aria-labelledby="c-eng">
        <h2 id="c-eng">구현·검증</h2>
        <div>
          {(detail?.engineering ?? []).map((item) => <p key={item}>{item}</p>)}
          <p className="mono">{p.tags.join(" · ")}</p>
        </div>
      </section>
      {detail?.evolution && (
        <section className="case-sec" aria-labelledby="c-evolution">
          <h2 id="c-evolution">진화</h2>
          <div><p>{detail.evolution}</p></div>
        </section>
      )}
      {related.length > 0 && (
        <section className="case-sec case-related" aria-labelledby="c-related">
          <h2 id="c-related">관련 작업</h2>
          <ul className="related-list">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/work/${item.slug}`}>
                  <strong>{item.title}</strong>
                  <span>{item.oneLiner}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Link className="next" href={`/work/${next.slug}`}>
        <span className="mono-ko">다음 사례</span>
        <p className="lead-ko">{next.title} →</p>
      </Link>
    </div>
  );
}
