// Career data model shared by the admin editor (/admin), the resume exports and the public pages.
// The full record lives in a PRIVATE repository; only items marked `public` are copied to
// content/career.public.json, which is the only career data the public site ever imports.

export type FieldType = "text" | "textarea" | "month" | "url";
export interface FieldDef { key: string; label: string; type: FieldType; placeholder?: string }
export interface SectionDef { id: SectionId; label: string; single?: boolean; fields: FieldDef[] }

export type SectionId =
  | "profile" | "contacts" | "experience" | "youthPrograms" | "achievements"
  | "education" | "certifications" | "awards" | "activities";

export interface CareerItem {
  id: string;
  public: boolean;
  /** Private memo. Never exported, never published. */
  note?: string;
  [field: string]: string | boolean | undefined;
}

export interface Career {
  version: 1;
  updatedAt?: string;
  sections: Record<SectionId, CareerItem[]>;
  /** Private only: words that trigger a warning when they appear in public items. */
  settings?: { sensitiveTerms?: string[] };
}

export type PublicCareer = Omit<Career, "settings">;

export const sections: SectionDef[] = [
  { id: "profile", label: "기본 정보", single: true, fields: [
    { key: "name", label: "이름", type: "text" },
    { key: "headline", label: "한 줄 소개", type: "text" },
    { key: "summary", label: "요약", type: "textarea" },
  ] },
  { id: "contacts", label: "연락처", fields: [
    { key: "label", label: "구분", type: "text", placeholder: "이메일, LinkedIn …" },
    { key: "value", label: "표시 값", type: "text" },
    { key: "url", label: "링크", type: "url", placeholder: "mailto: 또는 https://" },
  ] },
  { id: "experience", label: "경력", fields: [
    { key: "org", label: "기관", type: "text" },
    { key: "role", label: "역할·직무", type: "text" },
    { key: "start", label: "시작", type: "month" },
    { key: "end", label: "종료 (비우면 현재)", type: "month" },
    { key: "summary", label: "주요 업무", type: "textarea" },
    { key: "highlights", label: "핵심 성과 (줄마다 하나)", type: "textarea" },
  ] },
  { id: "youthPrograms", label: "청소년 사업·활동", fields: [
    { key: "title", label: "사업·활동명", type: "text" },
    { key: "year", label: "연도", type: "text" },
    { key: "role", label: "역할", type: "text" },
    { key: "scale", label: "규모 (참여자·기간 등)", type: "text" },
    { key: "summary", label: "내용", type: "textarea" },
  ] },
  { id: "achievements", label: "성과·수치", fields: [
    { key: "project", label: "프로젝트·업무", type: "text" },
    { key: "metric", label: "지표", type: "text", placeholder: "보고서 작성 시간" },
    { key: "value", label: "값·변화", type: "text", placeholder: "3일 → 반나절" },
    { key: "period", label: "기간·시점", type: "text" },
    { key: "source", label: "근거", type: "text" },
  ] },
  { id: "education", label: "학력", fields: [
    { key: "school", label: "학교", type: "text" },
    { key: "degree", label: "전공·학위", type: "text" },
    { key: "start", label: "시작", type: "month" },
    { key: "end", label: "종료", type: "month" },
  ] },
  { id: "certifications", label: "자격", fields: [
    { key: "name", label: "자격명", type: "text" },
    { key: "issuer", label: "발급 기관", type: "text" },
    { key: "date", label: "취득", type: "month" },
  ] },
  { id: "awards", label: "수상", fields: [
    { key: "name", label: "수상명", type: "text" },
    { key: "issuer", label: "수여 기관", type: "text" },
    { key: "date", label: "시점", type: "month" },
  ] },
  { id: "activities", label: "교육·강의·대외활동", fields: [
    { key: "title", label: "활동명", type: "text" },
    { key: "org", label: "기관", type: "text" },
    { key: "date", label: "시점", type: "text" },
    { key: "summary", label: "내용", type: "textarea" },
  ] },
];

export const sectionById = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<SectionId, SectionDef>;

export function emptyCareer(): Career {
  return {
    version: 1,
    sections: Object.fromEntries(sections.map((s) => [s.id, []])) as unknown as Career["sections"],
    settings: { sensitiveTerms: [] },
  };
}

/** Fill in sections that an older file may lack, so the editor never crashes on partial data. */
export function normalizeCareer(raw: unknown): Career {
  const base = emptyCareer();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<Career>;
  for (const s of sections) {
    const list = r.sections?.[s.id];
    if (Array.isArray(list)) base.sections[s.id] = list.filter((x) => x && typeof x === "object") as CareerItem[];
  }
  base.updatedAt = typeof r.updatedAt === "string" ? r.updatedAt : undefined;
  base.settings = { sensitiveTerms: Array.isArray(r.settings?.sensitiveTerms) ? r.settings!.sensitiveTerms!.filter((t) => typeof t === "string") : [] };
  return base;
}

/** Only `public` items, only declared fields, no private memo and no settings. */
export function toPublic(career: Career): PublicCareer {
  const out = emptyCareer() as PublicCareer & { settings?: unknown };
  delete out.settings;
  out.updatedAt = career.updatedAt;
  for (const s of sections) {
    out.sections[s.id] = career.sections[s.id]
      .filter((item) => item.public === true)
      .map((item) => {
        const clean: CareerItem = { id: item.id, public: true };
        for (const f of s.fields) {
          const v = item[f.key];
          if (typeof v !== "string" || !v.trim()) continue;
          if (f.type === "url" && !safeHref(v)) continue;
          clean[f.key] = v.trim();
        }
        return clean;
      });
  }
  return out;
}

/** Terms from the private settings that would be published. */
export function sensitiveHits(career: Career): string[] {
  const text = JSON.stringify(toPublic(career));
  return (career.settings?.sensitiveTerms ?? []).filter((t) => t.trim() && text.includes(t.trim()));
}

export function str(item: CareerItem | undefined, key: string): string {
  const v = item?.[key];
  return typeof v === "string" ? v : "";
}

export function period(item: CareerItem, startKey = "start", endKey = "end"): string {
  const s = str(item, startKey);
  const e = str(item, endKey);
  if (!s && !e) return "";
  return `${s.replace("-", ".")} – ${e ? e.replace("-", ".") : "현재"}`;
}

/** Newest first by start/date/year. */
export function byRecent(items: CareerItem[]): CareerItem[] {
  const key = (i: CareerItem) => str(i, "start") || str(i, "date") || str(i, "year");
  return [...items].sort((a, b) => key(b).localeCompare(key(a)));
}

/** Only https:, mailto: and tel: links are ever rendered. */
export function safeHref(value: string): string {
  const v = value.trim();
  return /^(https:\/\/|mailto:|tel:)/i.test(v) ? v : "";
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export type ChangeKind = "added" | "removed" | "changed" | "published" | "unpublished";
export interface Change { section: SectionId; id: string; kind: ChangeKind; label: string }

/** Human label for an item: its first filled field. */
export function itemLabel(section: SectionId, item: CareerItem): string {
  for (const f of sectionById[section].fields) {
    const v = str(item, f.key).trim();
    if (v) return v.length > 40 ? v.slice(0, 40) + "…" : v;
  }
  return "(빈 항목)";
}

/** What changes when going from `from` to `to`, item by item (matched by id). */
export function diffCareer(from: Career, to: Career): Change[] {
  const out: Change[] = [];
  for (const s of sections) {
    const a = new Map(from.sections[s.id].map((i) => [i.id, i]));
    const b = new Map(to.sections[s.id].map((i) => [i.id, i]));
    for (const [id, item] of b) {
      const old = a.get(id);
      if (!old) { out.push({ section: s.id, id, kind: "added", label: itemLabel(s.id, item) }); continue; }
      if (old.public !== item.public) out.push({ section: s.id, id, kind: item.public ? "published" : "unpublished", label: itemLabel(s.id, item) });
      const keys = [...s.fields.map((f) => f.key), "note"];
      if (keys.some((k) => str(old, k) !== str(item, k))) out.push({ section: s.id, id, kind: "changed", label: itemLabel(s.id, item) });
    }
    for (const [id, item] of a) if (!b.has(id)) out.push({ section: s.id, id, kind: "removed", label: itemLabel(s.id, item) });
  }
  const terms = (c: Career) => (c.settings?.sensitiveTerms ?? []).join("\n");
  if (terms(from) !== terms(to)) out.push({ section: "profile", id: "settings", kind: "changed", label: "주의 단어 설정" });
  return out;
}

export const changeWord: Record<ChangeKind, string> = { added: "추가", removed: "삭제", changed: "수정", published: "공개", unpublished: "비공개" };

/** Short commit message, e.g. "경력 +1, 학력 수정 1, 공개 1". */
export function summarizeChanges(changes: Change[]): string {
  if (!changes.length) return "변경 없음";
  const counts = new Map<string, number>();
  for (const c of changes) {
    const sec = c.id === "settings" ? "설정" : sectionById[c.section].label;
    const key = c.kind === "added" ? `${sec} +` : c.kind === "removed" ? `${sec} -` : `${sec} ${changeWord[c.kind]} `;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts].map(([k, n]) => `${k}${n}`).join(", ");
}
