import type { ThemeId } from "./themes";

export interface CapabilityAxis {
  en: string;
  ko: string;
  stage: string;
  summary: string;
  themes: ThemeId[];
}

/** Shared capability language for Home and About. Order follows the top-level identity: field first. */
export const capabilityAxes: CapabilityAxis[] = [
  {
    en: "Youth Work & Programs",
    ko: "청소년 사업·현장",
    stage: "경험 · Experience",
    summary: "청소년 활동과 사업의 현장에서 프로그램을 기획하고 운영해 왔습니다. 이 현장 경험이 이후 모든 작업의 출발점입니다.",
    themes: ["youth-work"],
  },
  {
    en: "Policy & Performance",
    ko: "정책·성과",
    stage: "현재 · Practice",
    summary: "현재 성과관리와 청소년·청년 정책 업무를 하고 있습니다. 목표·성과·지표를 구분하고, 사업과 정책의 의사결정 흐름을 시스템 설계에 반영합니다.",
    themes: ["policy", "performance", "strategy"],
  },
  {
    en: "AX & Digital Building",
    ko: "AX·디지털 구축",
    stage: "현재 · Practice",
    summary: "현재 AX 전략과 AX 챌린저 운영도 맡고 있습니다. AI를 기능 하나로 붙이기보다 사람이 반복하는 업무 흐름 전체를 다시 설계하고, 시스템·서비스·도구·자동화로 직접 만듭니다.",
    themes: ["ax-automation", "document-engineering"],
  },
];
