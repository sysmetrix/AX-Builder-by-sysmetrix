/**
 * Themes = the *domain* axis. `category` (selected-work / data-research / tools / experiments / history)
 * decides HOW a project is shown (hierarchy); `themes` decide WHAT it is about. They are independent,
 * and a project may have several themes (or none).
 *
 * Vocabulary decided by the user (2026-09-26). To add a theme, add it here — the type, labels and
 * validation follow automatically. Keep this file dependency-free.
 */
export const themes = {
  "youth-work": { ko: "청소년 사업·현장", en: "Youth Work" },
  policy: { ko: "정책", en: "Policy" },
  performance: { ko: "성과관리", en: "Performance" },
  strategy: { ko: "전략", en: "Strategy" },
  "data-evaluation": { ko: "데이터·평가", en: "Data & Evaluation" },
  "ax-automation": { ko: "AX·자동화", en: "AX / Automation" },
  "document-engineering": { ko: "문서 엔지니어링", en: "Document Engineering" },
} as const;

export type ThemeId = keyof typeof themes;

export const themeIds = Object.keys(themes) as ThemeId[];

export function themeLabel(id: ThemeId): string {
  return themes[id].ko;
}
