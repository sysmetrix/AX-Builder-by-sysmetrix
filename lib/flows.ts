// Presentation content layered on top of lib/projects.ts.
// Every step below is drawn from DATA/projects.json and the case-study briefs — no metrics invented.

export interface Flow {
  /** Outcome-first card/hero title (plain Korean, no stack names). */
  headline: string;
  /** Diagram steps. `source: true` marks the "before" state (dashed). */
  steps: { label: string; source?: boolean }[];
  compactSteps: string[];
  caption: string;
  /** Short lines for the At-a-glance strip. */
  audience: string;
  what: string;
}

export const flows: Record<string, Flow> = {
  "performance-management-system": {
    headline: "엑셀로 이어 붙이던 성과관리를, 하나의 운영 시스템으로.",
    what: "성과관리 운영 플랫폼",
    audience: "부서 담당자 · 성과관리 담당자 · 관리자",
    steps: [
      { label: "Excel · 문서 · 개별 자료에 흩어진 실적", source: true },
      { label: "역할별 실적 입력" },
      { label: "확인 요청" },
      { label: "승인 · 반려 · 재입력" },
      { label: "집계 · 보고 · 평가 준비" },
    ],
    compactSteps: ["분산된 실적", "입력·확인", "집계·보고"],
    caption: "성과관리 업무 흐름 개념도.",
  },
  "survey-intelligence": {
    headline: "청소년 사업의 설문 결과를, 결과평가 보고서와 발표자료까지.",
    what: "청소년 사업 설문 분석·평가 도구",
    audience: "청소년 사업 담당자 · 평가 담당자",
    steps: [
      { label: "사업 설문 결과 (Excel/CSV)", source: true },
      { label: "문항·척도 자동 인식" },
      { label: "만족도·사전사후·성과지표" },
      { label: "결과 문장 검토·편집" },
      { label: "HWPX 결과보고서·발표자료" },
    ],
    compactSteps: ["설문 결과", "분석·평가", "결과보고서"],
    caption: "분석 흐름 개념도. 민감한 원자료를 위한 로컬 우선 처리 원칙을 적용합니다.",
  },
  "to-hwpx": {
    headline: "AI와 웹의 결과물을, 한국 공공업무의 HWPX 문서로.",
    what: "HWPX 문서 변환·생성 엔진",
    audience: "문서 작성자 · AI 워크플로 사용자 · 개발자",
    steps: [
      { label: "Markdown · HTML · DOCX · CSV/XLSX 등 입력", source: true },
      { label: "공통 중간표현과 렌더링 코어" },
      { label: "Web · CLI · MCP 세 가지 진입점" },
      { label: "HWPX 패키지 생성" },
      { label: "구조 검증 · MCP 연동 QA" },
    ],
    compactSteps: ["여러 형식", "공통 렌더링", "HWPX 검증"],
    caption: "구조 개념도. Web·CLI·MCP가 하나의 렌더링 코어를 공유합니다.",
  },
  "security-checkup": {
    headline: "전체 대조를 사람이 하던 일을, 예외만 검토하는 일로.",
    what: "보안점검 매핑·보고 자동화",
    audience: "보안점검 담당자 · 부서 담당자",
    steps: [
      { label: "월별 보안점검 Excel + 직원 명부 수동 대조", source: true },
      { label: "이름 · IP · 규칙으로 자동 매핑" },
      { label: "미확인 기기만 사람이 검토" },
      { label: "부서별 안전 · 취약 · 미점검 현황" },
      { label: "Excel · HWPX · PDF 산출" },
    ],
    compactSteps: ["점검 자료", "자동 매핑", "예외 검토·보고"],
    caption: "보안점검 업무 흐름 개념도.",
  },
  toolbox: {
    headline: "브라우저로 안 되는 문서 업무를, 설치된 한글·Office를 직접 제어해서.",
    what: "Windows 한글·Office 자동화 도구",
    audience: "문서 업무 담당자 · 기관 PC 사용자",
    steps: [
      { label: "HWP · Word · Excel · PPT가 섞인 문서 목록", source: true },
      { label: "설치된 한글·Office를 직접 제어" },
      { label: "일괄 PDF 변환 · 인쇄 · 병합" },
      { label: "오류 문서 오류 감시과 자동 재시작" },
      { label: "안전등급이 있는 시스템 정리 · 분석" },
    ],
    compactSteps: ["혼합 문서", "한글·Office 제어", "변환·복구"],
    caption: "Windows 문서 처리 흐름 개념도.",
  },
  "annual-plan-automation": {
    headline: "AI에게 한 번에 시키지 않고, 근거가 있는 제작 공정으로.",
    what: "연간 운영계획 → 발표자료 제작 공정",
    audience: "기획 담당자 · 발표자 · 의사결정자",
    steps: [
      { label: "방대한 연간 운영계획 원문", source: true },
      { label: "원문 구조화 → 단일 사실원천" },
      { label: "청중 전략과 스토리보드" },
      { label: "시범본 → 렌더 QA(PDF·PNG 검수)" },
      { label: "기준 발표자료 → 대상별 파생본 (편집 가능한 PPTX)" },
    ],
    compactSteps: ["운영계획", "사실·구성 검증", "발표자료"],
    caption: "제작 공정 개념도. 수치는 단일 사실원천에서만 가져오고 상충 정보는 질문 목록으로 분리합니다.",
  },
};
