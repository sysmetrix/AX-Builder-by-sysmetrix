import type { Metadata } from "next";
import Link from "next/link";
import { HomeIntro } from "@/components/home-intro";
import { ProjectFeature, ProjectRow } from "@/components/project-parts";
import { publicProjectsByCategory, selectedProjects } from "@/lib/catalog";
import { canonical } from "@/lib/site";

export const metadata: Metadata = { alternates: canonical("/") };

// Every list is derived from the catalog: adding, re-classifying or promoting a project needs no change here.
// Home = curation. Only a few of each tier are shown here; the rest live in /work (everything) and /lab (tools).
const HOME_DATA_LIMIT = 3;
const HOME_TOOLS_LIMIT = 4;

const selected = selectedProjects;
const allResearch = publicProjectsByCategory("data-research");
const research = allResearch.slice(0, HOME_DATA_LIMIT);
const moreResearch = allResearch.length - research.length;
const allTools = publicProjectsByCategory("tools");
const tools = allTools.slice(0, HOME_TOOLS_LIMIT);
const moreTools = allTools.length - tools.length;

export default function Home() {
  return (
    <>
      <div className="wrap">
        <HomeIntro projectCount={selected.length} />

        <section className="block" id="work" aria-labelledby="work-h">
          <div className="sec-h">
            <h2 id="work-h">대표 작업</h2>
            <p>바뀐 업무를 먼저 설명하고, 기술은 마지막에 둡니다.</p>
          </div>
          {selected.map((p, i) => (
            <ProjectFeature key={p.slug} project={p} index={i} total={selected.length} />
          ))}
          <Link className="more" href="/work">전체 작업 보기 →</Link>
        </section>

        <section className="block" id="data" aria-labelledby="data-h">
          <div className="sec-h">
            <h2 id="data-h">데이터·조사</h2>
            <p>청소년 사업 자료를 회의에서 쓸 수 있는 화면으로.</p>
          </div>
          <ul className="rows">
            {research.map((p) => (
              <ProjectRow key={p.slug} project={p} />
            ))}
          </ul>
          <Link className="more" href="/work">
            {moreResearch > 0 ? `${moreResearch}개 더 — 전체 작업 보기 →` : "전체 작업 보기 →"}
          </Link>
        </section>

        <section className="block" aria-labelledby="lab-h">
          <div className="sec-h">
            <h2 id="lab-h">도구와 실험</h2>
            <p>필요한 것이 없으면, 작게라도 직접 만듭니다.</p>
          </div>
          <ul className="rows">
            {tools.map((p) => (
              <ProjectRow key={p.slug} project={p} />
            ))}
          </ul>
          <Link className="more" href="/lab">{moreTools > 0 ? `도구 ${moreTools}개 더 보기 →` : "도구와 실험 전체 보기 →"}</Link>
        </section>

        <section className="block about-teaser" aria-labelledby="about-h">
          <h2 id="about-h">현장을 아는 사람이 직접 시스템을 만듭니다.</h2>
          <div>
            <p>
              청소년 활동과 사업의 현장에서 출발해, 정책·성과·데이터·AX를 연결하고
              실제 업무에 쓰이는 시스템과 도구를 만듭니다.
            </p>
            <Link className="more" href="/about">소개 읽기 →</Link>
          </div>
        </section>
      </div>
    </>
  );
}
