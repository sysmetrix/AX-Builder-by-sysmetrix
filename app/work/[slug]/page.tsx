import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Flow, visibilityLabel } from "@/components/project-parts";
import { caseStudies } from "@/lib/case-studies";
import { flows } from "@/lib/flows";
import { caseStudyProjects, selectedProjects, themeLabels } from "@/lib/catalog";
import { publication } from "@/lib/publication";
import { canonical, ogImages, publicUrl, siteName } from "@/lib/site";

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
    openGraph: { type: "article", siteName, locale: "ko_KR", title: socialTitle, description, url: publicUrl(`/work/${slug}`), images: ogImages },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: ogImages },
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

      <Flow slug={slug} />

      {p.screens && p.screens.length > 0 && (
        <section className="case-shots" aria-labelledby="c-media">
          <h2 id="c-media" className="mono-ko shots-label">화면 · 샘플 데이터</h2>
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
        </section>
      )}

      <section className="case-sec" aria-labelledby="c-problem">
        <h2 id="c-problem">문제</h2>
        <div>
          <p>{detail?.before ?? p.problem}</p>
        </div>
      </section>
      <section className="case-sec" aria-labelledby="c-system">
        <h2 id="c-system">시스템</h2>
        <div>
          {!detail && <p>{p.solution}</p>}
          {detail && (
            <>
              <p className="mono-ko case-label">구성</p>
              <ul className="case-list">
                {detail.built.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="mono-ko case-label">핵심 결정</p>
              <ul className="case-list">
                {detail.decisions.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="case-evolution">{detail.evolution}</p>
            </>
          )}
        </div>
      </section>
      <section className="case-sec" aria-labelledby="c-change">
        <h2 id="c-change">변화</h2>
        <div><p>{detail?.after ?? p.outcome}</p></div>
      </section>
      <section className="case-sec" aria-labelledby="c-eng">
        <h2 id="c-eng">구현</h2>
        <div>
          {(detail?.engineering ?? []).map((item) => <p key={item}>{item}</p>)}
          <p className="mono">{p.tags.join(" · ")}</p>
        </div>
      </section>
      <Link className="next" href={`/work/${next.slug}`}>
        <span className="mono-ko">다음 사례</span>
        <p className="lead-ko">{next.title} →</p>
      </Link>
    </div>
  );
}
