import type { ThemeId } from "./themes";

export type ProjectCategory =
  | "selected-work"
  | "data-research"
  | "tools"
  | "experiments"
  | "history";

export type SourceVisibility = "public" | "private" | "internal" | "history";

export interface ProjectScreen {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  eyebrow: string;
  year: string;
  category: ProjectCategory;
  /** Domain axis (multi-valued, may be empty). See lib/themes.ts. */
  themes: ThemeId[];
  /** Name used inside the organisation, shown only as a small label on the detail page (never as the main title). */
  internalName?: string;
  /** Optional manual order inside a category (lower first). Default: order of appearance in this file. */
  order?: number;
  sourceVisibility: SourceVisibility;
  status: "Live" | "Active" | "Completed" | "Experiment" | "Distribution";
  oneLiner: string;
  problem: string;
  solution: string;
  outcome: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  role: string;
  screenshotCaptions?: string[];
  screens?: ProjectScreen[];
}

export const projects: Project[] = [
  {
    slug: "performance-management-system",
    title: "성과관리 운영 시스템",
    internalName: "BWYF KPI",
    eyebrow: "성과관리 시스템",
    year: "2026",
    category: "selected-work",
    themes: ["performance", "strategy"],
    sourceVisibility: "private",
    status: "Live",
    oneLiner: "엑셀 중심의 기관 성과관리를 입력·검증·집계·보고까지 이어지는 운영 시스템으로 전환.",
    problem: "성과자료가 엑셀과 개별 문서에 흩어져 입력, 확인, 집계, 경영평가 준비가 반복 작업에 의존했습니다.",
    solution: "역할별 실적 입력·확인·반려, 대시보드, 기간 잠금, 감사로그, 운영계획·평가 준비를 하나의 웹 서비스에 통합했습니다.",
    outcome: "성과관리 업무를 단일 시스템의 반복 가능한 업무 흐름으로 구조화했습니다.",
    tags: ["Next.js", "TypeScript", "Supabase", "RLS", "MFA", "PWA"],
    role: "제품 설계 · 업무 흐름 모델링 · 개발 · 운영",
    screenshotCaptions: [
      "기관 전체 성과를 한 화면에서 파악하는 통합 대시보드",
      "입력 → 확인요청 → 확인·반려로 이어지는 실제 성과관리 흐름",
      "성과관리에서 운영계획·평가 준비까지 확장된 업무 시스템"
    ],
    },
  {
    slug: "survey-intelligence",
    title: "Survey Intelligence",
    eyebrow: "청소년 사업 설문 분석·평가 도구",
    year: "2026",
    category: "selected-work",
    themes: ["youth-work", "data-evaluation", "performance", "document-engineering"],
    sourceVisibility: "public",
    status: "Live",
    oneLiner: "청소년 사업 담당자가 만족도·성과지표·사전·사후 변화를 분석하고, 결과평가 HWPX 보고서와 발표자료까지 만드는 현업 도구.",
    problem: "사업이 끝나면 만족도·성과지표·사전·사후 변화를 분석해 결과평가를 써야 하지만, 자료 정리부터 통계, 그래프, 결과문장, 한글 보고서와 발표자료까지 각각 따로 반복해야 했습니다.",
    solution: "청소년 사업의 설문 결과 파일을 올리면 문항·척도를 인식해 만족도·성과지표·사전·사후 변화를 분석하고, 결과 문장을 검토·수정해 HWPX 결과보고서와 PPTX·HTML·PDF 발표자료를 만드는 브라우저 기반 도구입니다.",
    outcome: "결과평가 업무를 자료 정리·분석·해석·결과보고서·발표자료가 이어지는 하나의 흐름으로 통합했습니다.",
    tags: ["JavaScript", "Statistics", "HWPX", "PPTX", "Local-first", "PWA"],
    repoUrl: "https://github.com/sysmetrix/Survey",
    liveUrl: "https://sysmetrix.github.io/Survey/",
    role: "제품 설계 · 평가 로직 · 개발",
    screenshotCaptions: [
      "청소년 사업의 설문 결과(Excel/CSV)를 올려 분석 준비를 시작하는 화면",
      "성과지표와 사전·사후 변화를 함께 보는 분석 결과",
      "문항별 만족도를 100점 환산 점수로 정리한 분석 결과"
    ],
    screens: [
      {
        src: "/projects/survey-intelligence/01-input.webp",
        alt: "청소년 사업 샘플 설문 파일의 문항 구성과 계산 기준을 확인하는 분석 설정 화면",
        width: 1254,
        height: 765,
        caption: "샘플 설문 파일을 불러와 문항 구성과 분석 기준을 설정하는 화면",
      },
      {
        src: "/projects/survey-intelligence/02-analysis.webp",
        alt: "샘플 응답으로 성과지표 달성과 사전·사후 성과 변화를 분석한 결과 화면",
        width: 1254,
        height: 765,
        caption: "성과지표와 사전·사후 변화를 함께 보는 분석 결과",
      },
      {
        src: "/projects/survey-intelligence/03-satisfaction.webp",
        alt: "샘플 응답으로 전반적 만족도와 문항별 만족도를 정리한 분석 결과 화면",
        width: 1254,
        height: 765,
        caption: "문항별 만족도를 100점 환산 점수로 정리한 분석 결과",
      },
    ],
    },
  {
    slug: "to-hwpx",
    title: "To HWPX",
    eyebrow: "Document Engineering",
    year: "2026",
    category: "selected-work",
    themes: ["document-engineering", "ax-automation"],
    sourceVisibility: "public",
    status: "Live",
    oneLiner: "AI·웹·CLI가 사용할 수 있는 로컬 우선 HWPX 문서 변환·생성 엔진.",
    problem: "AI·Markdown·웹에서 만든 결과가 최종 HWPX 문서로 넘어갈 때 복사·붙여넣기와 서식 수정이 다시 필요했습니다.",
    solution: "브라우저 변환기에서 출발해 공통 렌더러, CLI, MCP, 역변환, 문서 비교와 다층 품질검증으로 확장했습니다.",
    outcome: "단순 파일 변환기를 AI 에이전트도 호출할 수 있는 한국형 문서 엔진으로 확장했습니다.",
    tags: ["JavaScript", "HWPX", "CLI", "MCP", "Local-first", "QA"],
    repoUrl: "https://github.com/sysmetrix/To-Hwpx",
    liveUrl: "https://to-hwpx.vercel.app/",
    role: "제품 설계 · 문서 엔진 · 품질검증 구조",
    screenshotCaptions: [
      "여러 문서 형식을 HWPX로 전환하는 로컬 우선 웹 작업공간",
      "입력 형식과 변환 결과·경고를 한 화면에서 확인하는 결과 단계"
    ],
    screens: [
      {
        src: "/projects/to-hwpx/01-workspace.webp",
        alt: "공개 샘플 Markdown 문서와 변환 설정이 표시된 To HWPX 웹 작업공간",
        width: 1249,
        height: 762,
        caption: "공개 샘플 문서를 HWPX로 전환하기 위한 형식과 문서 설정",
      },
      {
        src: "/projects/to-hwpx/02-result.webp",
        alt: "문서 변환 완료 상태와 구조 검증 결과가 함께 표시된 To HWPX 결과 화면",
        width: 1249,
        height: 771,
        caption: "변환 파이프라인의 완료 상태와 문서 구조 검증 결과",
      },
    ],
    },
  {
    slug: "security-checkup",
    title: "Security Checkup",
    eyebrow: "Internal Workflow Automation",
    year: "2026",
    category: "selected-work",
    themes: ["ax-automation", "document-engineering"],
    sourceVisibility: "public",
    status: "Live",
    oneLiner: "보안점검 엑셀과 직원·기기정보를 자동 매핑하고 부서별 결과와 보고서를 생성.",
    problem: "보안점검 결과를 직원별 PC와 수동 대조하고 부서별로 다시 분류해 보고서를 만드는 작업이 반복됐습니다.",
    solution: "자동 매핑, 미확인 기기 검토, 사전규칙, 부서별 통계와 Excel/HWPX/PDF 내보내기를 구현했습니다.",
    outcome: "전체 자료를 사람이 재작성하는 업무를 시스템이 처리하고 사람은 예외만 판단하도록 바꿨습니다.",
    tags: ["JavaScript", "SheetJS", "JSZip", "HWPX", "Local-first"],
    repoUrl: "https://github.com/sysmetrix/security-checkup",
    liveUrl: "https://sysmetrix.github.io/security-checkup",
    role: "업무 흐름 설계 · 개발 · 내부 배포",
    screenshotCaptions: [
      "보안관제 Excel을 올리고 자동 매핑을 시작하는 1단계",
      "자동으로 연결되지 않은 기기만 사람이 검토하는 예외 처리 화면",
      "부서별 안전·취약·미점검 현황과 취약항목을 보는 최종 대시보드"
    ],
    screens: [
      {
        src: "/projects/security-checkup/01-upload.webp",
        alt: "보안점검 Excel을 올려 자동 매핑을 시작하는 Security Checkup 업로드 화면",
        width: 1264,
        height: 771,
        caption: "보안점검 Excel을 올려 자동 매핑을 시작하는 공개 서비스의 첫 단계",
      },
      {
        src: "/projects/security-checkup/02-review.webp",
        alt: "샘플 사용자와 문서화용 IP로 구성한 미매칭 기기 검토 및 할당 화면",
        width: 1249,
        height: 771,
        caption: "샘플 데이터로 자동 연결되지 않은 기기만 검토하는 예외 처리 화면",
      },
      {
        src: "/projects/security-checkup/03-dashboard.webp",
        alt: "샘플 부서와 가상 보안점수로 구성한 안전·취약·미점검 결과 대시보드",
        width: 1249,
        height: 762,
        caption: "샘플 데이터로 구성한 부서별 현황과 취약항목 분석 대시보드",
      },
    ],
  },
  {
    slug: "toolbox",
    title: "ToolBox",
    eyebrow: "Windows Office Automation",
    year: "2026",
    category: "selected-work",
    themes: ["document-engineering", "ax-automation"],
    sourceVisibility: "private",
    status: "Active",
    oneLiner: "한글·Office 문서 처리와 Windows 반복업무를 묶은 데스크톱 자동화 도구.",
    problem: "HWP·Word·Excel·PowerPoint 일괄 PDF/인쇄와 시스템 정리는 브라우저만으로 안정적으로 처리하기 어려웠습니다.",
    solution: "설치된 한글·Office를 COM으로 직접 제어하고 배치 변환, PDF 병합, 워치독, 안전 정리와 분석 도구를 통합했습니다.",
    outcome: "문제를 웹 환경에 맞춰 줄이지 않고 필요한 실행환경을 선택해 해결했습니다.",
    tags: ["Python", "PySide6", "COM", "pyhwpx", "Windows", "pypdf"],
    role: "데스크톱 제품 · 자동화 엔지니어링",
    screenshotCaptions: [
      "한글·Word·Excel·PowerPoint를 한 작업목록에서 처리하는 문서 자동화 화면",
      "파일 형식별 옵션과 진행상태를 확인하는 배치 처리 화면",
      "시스템 정리·분석을 안전등급과 함께 제공하는 유틸리티 화면"
    ],
    },
  {
    slug: "annual-plan-automation",
    title: "Annual Plan Automation",
    eyebrow: "AI Document Production System",
    year: "2026",
    category: "selected-work",
    themes: ["strategy", "ax-automation", "document-engineering"],
    sourceVisibility: "private",
    status: "Active",
    oneLiner: "연간 운영계획 원문을 근거 기반의 편집 가능한 발표자료와 대상별 파생본으로 전환.",
    problem: "방대한 운영계획을 발표자료로 다시 만들 때 내용 누락, 수치 오류와 디자인 편차가 발생하기 쉬웠습니다.",
    solution: "원문 구조화 → 단일 사실원천 → 청중전략 → 스토리보드 → 시범본 → 렌더 QA → 마스터덱 → 파생본의 제작 공정을 설계했습니다.",
    outcome: "생성형 AI 문서 제작을 근거성과 재현성을 가진 생산 시스템으로 바꿨습니다.",
    tags: ["PPTX", "Python", "AI Workflow", "Design Tokens", "QA"],
    role: "제작 공정 설계 · 콘텐츠 전략 · 자동화",
    screenshotCaptions: [
      "원문에서 미션·전략·사업·예산·KPI를 구조화하는 사실 추출 단계",
      "단일 사실원천과 스토리보드를 연결해 슬라이드를 설계하는 제작 단계",
      "PPTX를 PDF·PNG로 렌더하고 contact sheet로 전체 흐름을 검수하는 QA 단계"
    ],
    },

  {
    slug: "youthcenter-db",
    title: "Youthcenter DB",
    eyebrow: "Data & Research",
    year: "2026",
    category: "data-research",
    themes: ["youth-work", "policy", "data-evaluation", "strategy"],
    sourceVisibility: "private",
    status: "Completed",
    oneLiner: "청소년수련시설 현황 데이터를 탐색 가능한 전략기획용 웹 리포트로 전환.",
    problem: "시설 현황 데이터가 표 중심이라 패턴과 차이를 빠르게 파악하기 어려웠습니다.",
    solution: "데이터를 정리하고 Chart.js 기반의 인터랙티브 분석 화면으로 구성했습니다.",
    outcome: "정적 표를 전략 검토에 사용할 수 있는 데이터 탐색 화면으로 바꿨습니다.",
    tags: ["Chart.js", "Youth Policy", "Data Storytelling"],
    role: "Analysis · Visualization"
  },
  {
    slug: "youthday-2026",
    title: "Youth Day 2026",
    eyebrow: "Data & Research",
    year: "2026",
    category: "data-research",
    themes: ["youth-work", "data-evaluation", "performance"],
    sourceVisibility: "private",
    status: "Completed",
    oneLiner: "청소년의 날 참가자 만족도 결과를 평가회의용 인터랙티브 리포트로 시각화.",
    problem: "행사 만족도 결과가 단순 표로는 핵심 성과와 개선점을 회의에서 빠르게 전달하기 어려웠습니다.",
    solution: "핵심 지표·그래프·결과 해석을 한 페이지형 평가 리포트로 구성했습니다.",
    outcome: "결과보고 자료를 회의 중 바로 탐색하고 설명할 수 있는 화면으로 바꿨습니다.",
    tags: ["Chart.js", "Evaluation", "Youth"],
    role: "Analysis · Visualization"
  },
  {
    slug: "ai-usability-survey",
    title: "AI Usability Survey",
    eyebrow: "Data & Research",
    year: "2026",
    category: "data-research",
    themes: ["ax-automation", "data-evaluation"],
    sourceVisibility: "public",
    status: "Completed",
    oneLiner: "전 직원 AI 활용성 조사 결과를 분석·발표 가능한 웹 리포트로 구성.",
    problem: "조사결과를 보고서와 발표자료용으로 각각 다시 가공해야 했습니다.",
    solution: "차트, 핵심지표, 발견사항과 발표 모드를 한 웹 페이지에 통합했습니다.",
    outcome: "분석 결과와 발표 화면을 같은 데이터 표현에서 사용할 수 있게 했습니다.",
    tags: ["Chart.js", "AI Adoption", "Research"],
    repoUrl: "https://github.com/sysmetrix/AI_Usability_Survey",
    role: "Analysis · Visualization"
  },
  {
    slug: "markdown-workspace",
    title: "Markdown Workspace",
    eyebrow: "Tool",
    year: "2026",
    category: "tools",
    themes: ["document-engineering", "ax-automation"],
    sourceVisibility: "private",
    status: "Active",
    oneLiner: "Markdown 업무문서를 작성·진단하고 웹·메일·HWPX 채널별 배포 준비도를 확인.",
    problem: "하나의 문서를 웹, 이메일, HWPX 등 여러 채널에 맞게 반복 수정해야 했습니다.",
    solution: "문서 진단, 채널별 준비도, 로컬 버전기록, 백업과 메일/HWPX 연계를 통합했습니다.",
    outcome: "작성과 배포 전 검수를 하나의 로컬 작업공간으로 묶었습니다.",
    tags: ["Markdown", "Local-first", "Document QA"],
    role: "Product design · Development"
  },
  {
    slug: "youtube-reference-library",
    title: "YouTube Reference Library",
    eyebrow: "Personal Tool",
    year: "2026",
    category: "tools",
    themes: ["ax-automation"],
    sourceVisibility: "private",
    status: "Active",
    oneLiner: "대규모 YouTube 구독 채널을 태그·메모·규칙·AI로 관리하는 로컬 우선 지식 라이브러리.",
    problem: "구독 채널이 많아질수록 왜 구독했는지와 어떤 분야의 자료인지 다시 찾기 어려웠습니다.",
    solution: "다중 태그, 메모, 규칙/AI 분류, 검색문법, OAuth 동기화, 백업과 PWA를 구현했습니다.",
    outcome: "수동 구독 정리를 개인 지식관리 시스템으로 확장했습니다.",
    tags: ["IndexedDB", "YouTube API", "OAuth", "AI", "PWA"],
    role: "Product design · Development"
  },
  {
    slug: "sound-meter",
    title: "Sound Meter",
    eyebrow: "Windows Utility",
    year: "2026",
    category: "tools",
    themes: [],
    sourceVisibility: "public",
    status: "Active",
    oneLiner: "Windows 출력장치 두 개를 트레이와 단축키로 즉시 전환.",
    problem: "회의·헤드셋·스피커 전환 때마다 Windows 설정을 여러 단계 거쳐야 했습니다.",
    solution: "트레이 앱과 전역 단축키로 지정한 두 장치를 즉시 전환하도록 구현했습니다.",
    outcome: "반복적인 장치 전환을 한 동작으로 줄였습니다.",
    tags: ["C#", "Windows", "WinForms"],
    repoUrl: "https://github.com/sysmetrix/sound_meter",
    role: "Utility development"
  },
  {
    slug: "shutdown-studio",
    title: "Shutdown Studio",
    eyebrow: "Windows Utility",
    year: "2026",
    category: "tools",
    themes: [],
    sourceVisibility: "public",
    status: "Completed",
    oneLiner: "종료·재시작·로그아웃·절전을 예약하고 트레이에서 관리.",
    problem: "장시간 작업 후 PC 동작을 예약하려면 명령어나 별도 도구가 필요했습니다.",
    solution: "단일 실행파일 형태의 Windows 예약 유틸리티를 만들었습니다.",
    outcome: "명령어 기반 작업을 비개발자도 사용할 수 있는 GUI로 전환했습니다.",
    tags: ["C#", "WinForms", "Windows"],
    repoUrl: "https://github.com/sysmetrix/PC_Shutdown",
    role: "Utility development"
  },
  {
    slug: "bwyf-pc-info",
    title: "BWYF PC Info",
    eyebrow: "Internal Tool",
    year: "2026",
    category: "tools",
    themes: ["ax-automation"],
    sourceVisibility: "internal",
    status: "Completed",
    oneLiner: "사내 PC 네트워크·점검 정보를 간단히 수집·제출하기 위한 내부 지원 도구.",
    problem: "직원별 PC 정보를 수동 확인·작성하게 하면 오류와 문의가 늘어납니다.",
    solution: "직원이 간단히 실행해 필요한 정보를 확인·복사하고 제출할 수 있는 흐름을 만들었습니다.",
    outcome: "IT 정보 수집을 복잡한 확인 작업에서 안내된 단순 절차로 바꿨습니다.",
    tags: ["Windows", "Internal Tool", "Workflow"],
    role: "Workflow design · Development"
  },
  {
    slug: "monthly-report-automation",
    title: "Monthly Report Automation",
    eyebrow: "Administrative Automation",
    year: "2026",
    category: "tools",
    themes: ["document-engineering", "ax-automation"],
    sourceVisibility: "internal",
    status: "Active",
    oneLiner: "부서별 월간 업무보고를 지정 서식으로 자동 생성해 작성·취합 편차를 줄이는 자동화.",
    problem: "부서·작성자별 한글 월간보고 서식이 달라 담당자가 반복해서 형식을 맞춰야 했습니다.",
    solution: "사전 지정된 입력 구조에서 표준 서식의 월간 업무보고가 자동 도출되도록 설계했습니다.",
    outcome: "서식 준수 부담과 취합 담당자의 반복 편집을 동시에 줄이는 방향으로 업무를 재설계했습니다.",
    tags: ["HWPX", "Workflow", "Public Administration", "AX"],
    role: "Workflow design · Development"
  },

  {
    slug: "my-value-journey",
    title: "My Value Journey",
    eyebrow: "Experiment",
    year: "2026",
    category: "experiments",
    themes: ["data-evaluation", "ax-automation"],
    sourceVisibility: "private",
    status: "Experiment",
    oneLiner: "개인 가치 선택 과정을 데이터로 기록하고 여러 AI의 해석을 비교한 인터랙티브 시각화.",
    problem: "가치 탐색 결과를 단순 목록이 아니라 선택 과정과 해석까지 함께 보고 싶었습니다.",
    solution: "선택 흐름과 GPT·Claude·Gemini 분석을 웹 데이터스토리로 구성했습니다.",
    outcome: "개인 성찰 데이터를 인터랙티브 콘텐츠로 표현했습니다.",
    tags: ["Data Storytelling", "AI", "Chart.js"],
    role: "Experiment"
  },
  {
    slug: "writing-coaching",
    title: "Writing Coaching",
    eyebrow: "Experiment",
    year: "2026",
    category: "experiments",
    themes: [],
    sourceVisibility: "private",
    status: "Experiment",
    oneLiner: "글쓰기 강화 훈련 계획을 웹 경험으로 구성한 콘텐츠 실험.",
    problem: "훈련 계획을 읽는 문서보다 진행 흐름이 보이는 화면으로 표현하고 싶었습니다.",
    solution: "정적 웹 기반의 코칭 플랜 페이지를 제작했습니다.",
    outcome: "콘텐츠 구조를 웹 인터페이스로 재구성했습니다.",
    tags: ["HTML", "CSS", "Content Design"],
    role: "Experiment"
  },
  {
    slug: "ai-engineering",
    title: "AI Engineering",
    eyebrow: "Experiment",
    year: "2026",
    category: "experiments",
    themes: ["ax-automation"],
    sourceVisibility: "private",
    status: "Experiment",
    oneLiner: "AI 시대의 핵심 엔지니어링 개념을 16:9 웹 슬라이드로 표현.",
    problem: "기술 개념을 일반적인 PPT가 아닌 반응형 웹 화면으로 표현해 보고자 했습니다.",
    solution: "단일 웹 슬라이드 형태의 시각적 설명 자료를 구현했습니다.",
    outcome: "웹 기반 발표 콘텐츠 제작 방식을 실험했습니다.",
    tags: ["HTML", "CSS", "Presentation"],
    role: "Experiment"
  },
  {
    slug: "aid-30-practice",
    title: "AID 30+ Practice",
    eyebrow: "Learning",
    year: "2026",
    category: "experiments",
    themes: [],
    sourceVisibility: "public",
    status: "Experiment",
    oneLiner: "한양대 AID 30+ 집중캠프에서 진행한 React·vinext 기반 실습 프로젝트.",
    problem: "교육 과정에서 최신 웹 구성과 UI 컴포넌트 생태계를 실습할 필요가 있었습니다.",
    solution: "React, vinext, Tailwind, shadcn 기반 실습 환경을 구성했습니다.",
    outcome: "학습·검증용 프로젝트로 활용했습니다.",
    tags: ["React", "vinext", "Tailwind", "shadcn"],
    repoUrl: "https://github.com/sysmetrix/AID-30-Practice-260905",
    role: "Learning project"
  }
];


