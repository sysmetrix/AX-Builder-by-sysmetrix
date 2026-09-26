import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/projects";
import { hasCaseStudy, themeLabels } from "@/lib/catalog";
import { flows } from "@/lib/flows";

export function Flow({ slug }: { slug: string }) {
  const flow = flows[slug];
  if (!flow) return null;
  return (
    <figure className="figure">
      <ol className="flow" aria-label={`${flow.what} 업무 흐름 도식`}>
        {flow.steps.map((s) => (
          <li key={s.label} className={s.source ? "src" : undefined}>
            {s.label}
          </li>
        ))}
      </ol>
      <p className="flow-summary">
        {flow.compactSteps.join(" → ")}
      </p>
      <figcaption>흐름 — {flow.caption}</figcaption>
    </figure>
  );
}

/** Selected Work card: outcome-first title → Problem / System / Change / Engineering. */
export function ProjectFeature({ project, index, total }: { project: Project; index: number; total: number }) {
  const flow = flows[project.slug];
  const lead = project.screens?.[0];
  return (
    <article className="feature">
      <div className="feature-top mono-ko">
        <span>
          사례 {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {project.title}
          {flow?.what ? ` — ${flow.what}` : ""}
        </span>
        <span>{visibilityLabel(project)}</span>
      </div>
      <div className="feature-grid">
        <div className="feature-copy">
          <h3>
            <Link href={`/work/${project.slug}`} className="feature-link">
              <span>{flow?.headline ?? project.oneLiner}</span>
              <span className="sr-only"> — {project.title} 사례 읽기</span>
            </Link>
          </h3>
          <div className="notes">
            <div>
              <h4 className="mono-ko">문제</h4>
              <p>{project.problem}</p>
            </div>
            <div>
              <h4 className="mono-ko">시스템</h4>
              <p>{project.solution}</p>
            </div>
            <div>
              <h4 className="mono-ko">변화</h4>
              <p>{project.outcome}</p>
            </div>
          </div>
        </div>
        <div className="feature-side">
          <Flow slug={project.slug} />
          {lead && (
            <figure className="feature-shot">
              <Image
                src={lead.src}
                alt={lead.alt}
                width={lead.width}
                height={lead.height}
                sizes="(max-width: 820px) calc(100vw - 40px), 520px"
              />
            </figure>
          )}
        </div>
      </div>
      <span className="more" aria-hidden="true">사례 읽기 →</span>
    </article>
  );
}

export function ProjectRow({ project }: { project: Project }) {
  const themes = themeLabels(project).join(" · ");
  return (
    <li className="row-item">
      <div>
        <h3>{hasCaseStudy(project) ? <Link href={`/work/${project.slug}`}>{project.title}</Link> : project.title}</h3>
        <p className="mono-ko">{themes || categoryLabel(project.category)}</p>
      </div>
      <div>
        <p>{project.oneLiner}</p>
      </div>
    </li>
  );
}

export function visibilityLabel(p: Project) {
  switch (p.sourceVisibility) {
    case "public":
      return "사례 공개";
    case "internal":
      return "사례만 (내부 자료 비공개)";
    default:
      return "사례만 · 소스 비공개";
  }
}

function categoryLabel(category: Project["category"]) {
  switch (category) {
    case "data-research": return "데이터·조사";
    case "tools": return "업무 도구";
    case "experiments": return "실험";
    case "history": return "기록";
    default: return "대표 작업";
  }
}
