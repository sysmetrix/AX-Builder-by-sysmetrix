// Resume (이력서) and career description (경력기술서) as Markdown.
// The Markdown is also the input for To HWPX, which turns it into an HWPX document.
import { byRecent, period, str, type Career, type CareerItem } from "./career";

export type DocKind = "resume" | "career";
export const docTitle: Record<DocKind, string> = { resume: "이력서", career: "경력기술서" };

function pick(career: Career, publicOnly: boolean) {
  const f = (list: CareerItem[]) => (publicOnly ? list.filter((i) => i.public) : list);
  const s = career.sections;
  return {
    profile: f(s.profile)[0],
    contacts: f(s.contacts),
    experience: byRecent(f(s.experience)),
    youth: byRecent(f(s.youthPrograms)),
    achievements: f(s.achievements),
    education: byRecent(f(s.education)),
    certifications: byRecent(f(s.certifications)),
    awards: byRecent(f(s.awards)),
    activities: byRecent(f(s.activities)),
  };
}

const lines = (text: string) => text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const join = (...parts: string[]) => parts.filter(Boolean).join(" · ");
const when = (text: string) => (text ? ` (${text})` : "");

export function toMarkdown(career: Career, kind: DocKind, publicOnly = false): string {
  const d = pick(career, publicOnly);
  const out: string[] = [];
  const name = str(d.profile, "name");
  out.push(`# ${docTitle[kind]}${name ? ` — ${name}` : ""}`, "");
  if (str(d.profile, "headline")) out.push(`**${str(d.profile, "headline")}**`, "");
  if (d.contacts.length) out.push(d.contacts.map((c) => `${str(c, "label")}: ${str(c, "value") || str(c, "url")}`).join("  \n"), "");
  if (str(d.profile, "summary")) out.push(str(d.profile, "summary"), "");

  const section = (title: string, rows: string[]) => { if (rows.length) out.push(`## ${title}`, "", ...rows, ""); };

  if (kind === "resume") {
    section("학력", d.education.map((e) => `- ${join(str(e, "school"), str(e, "degree"))}${when(period(e))}`));
    section("경력", d.experience.map((e) => `- ${join(str(e, "org"), str(e, "role"))}${when(period(e))}`));
    section("청소년 사업·활동", d.youth.map((y) => `- ${join(str(y, "title"), str(y, "role"), str(y, "year"))}`));
    section("자격", d.certifications.map((c) => `- ${join(str(c, "name"), str(c, "issuer"), str(c, "date"))}`));
    section("수상", d.awards.map((a) => `- ${join(str(a, "name"), str(a, "issuer"), str(a, "date"))}`));
    section("교육·강의·대외활동", d.activities.map((a) => `- ${join(str(a, "title"), str(a, "org"), str(a, "date"))}`));
  } else {
    for (const e of d.experience) {
      out.push(`## ${join(str(e, "org"), str(e, "role"))}`, "", `기간: ${period(e) || "-"}`, "");
      if (str(e, "summary")) out.push(str(e, "summary"), "");
      const h = lines(str(e, "highlights"));
      if (h.length) out.push("### 핵심 성과", "", ...h.map((x) => `- ${x}`), "");
    }
    section("청소년 사업·활동", d.youth.flatMap((y) => [
      `### ${str(y, "title")}${str(y, "year") ? ` (${str(y, "year")})` : ""}`,
      "", join(str(y, "role"), str(y, "scale")), ...(str(y, "summary") ? ["", str(y, "summary")] : []), "",
    ]));
    if (d.achievements.length) {
      out.push("## 성과·수치", "", "| 프로젝트·업무 | 지표 | 값·변화 | 기간 | 근거 |", "|---|---|---|---|---|");
      for (const a of d.achievements) out.push(`| ${["project", "metric", "value", "period", "source"].map((k) => str(a, k).replace(/\|/g, "/") || "-").join(" | ")} |`);
      out.push("");
    }
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
