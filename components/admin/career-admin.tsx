"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PUBLISHABLE, changeWord, diffCareer, emptyCareer, itemLabel, newId, normalizeCareer, publicChanges, sections, sectionById, sensitiveHits, summarizeChanges, toPublic,
  type Career, type CareerItem, type Change, type SectionId,
} from "@/lib/career";
import { docTitle, toMarkdown, type DocKind } from "@/lib/career-export";
import {
  OWNER, PRIVATE_PATH, PRIVATE_REPO, PUBLIC_PATH, PUBLIC_REPO, listRevisions, readFile, whoAmI, writeFile,
  type Revision,
} from "@/lib/github-store";

const TOKEN_KEY = "axb-admin-token";
type Tab = SectionId | "settings" | "export" | "history";
type IconName = "archive" | "arrow-down" | "arrow-up" | "check" | "clock" | "download" | "external" | "file" | "gear" | "lock" | "logout" | "plus" | "save" | "shield" | "trash" | "user";

const sectionDescriptions: Record<SectionId, string> = {
  profile: "사이트와 문서의 첫인상을 만드는 핵심 프로필입니다.",
  contacts: "이력서에 사용할 연락 수단과 외부 링크를 관리합니다.",
  experience: "기관, 역할, 주요 업무와 성과를 시간순으로 기록합니다.",
  youthPrograms: "청소년 현장에서 기획하고 운영한 사업과 활동을 정리합니다.",
  achievements: "주요 결과를 수치와 근거 중심으로 축적합니다.",
  education: "학력과 전공 정보를 관리합니다.",
  certifications: "보유 자격과 발급 정보를 기록합니다.",
  awards: "수상 이력과 수여 기관을 정리합니다.",
  activities: "교육, 강의, 연수와 대외활동을 기록합니다.",
};

const utilityTabs: { id: Tab; label: string; description: string; icon: IconName }[] = [
  { id: "export", label: "문서 내보내기", description: "이력서와 경력기술서를 미리 보고 변환합니다.", icon: "file" },
  { id: "history", label: "저장 기록", description: "이전 버전을 비교하고 안전하게 되돌립니다.", icon: "clock" },
  { id: "settings", label: "보안 설정", description: "공개 전 확인할 주의 단어를 관리합니다.", icon: "gear" },
];

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    archive: <><path d="M4 7.5h16v12H4z"/><path d="M3 4.5h18v3H3zM9 11.5h6"/></>,
    "arrow-down": <path d="M12 4v16m0 0 6-6m-6 6-6-6"/>,
    "arrow-up": <path d="M12 20V4m0 0 6 6m-6-6-6 6"/>,
    check: <path d="m5 12.5 4.5 4.5L19 7.5"/>,
    clock: <><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3.5 2"/></>,
    download: <><path d="M12 3v12m0 0 5-5m-5 5-5-5"/><path d="M4 19.5h16"/></>,
    external: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6H5V6h6"/></>,
    file: <><path d="M6 3.5h8l4 4V21H6z"/><path d="M14 3.5V8h4M9 12h6M9 16h6"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="M12 2.8v2M12 19.2v2M21.2 12h-2M4.8 12h-2M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4M18.5 18.5l-1.4-1.4M6.9 6.9 5.5 5.5"/></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    logout: <><path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    save: <><path d="M5 3.5h12l3 3V20.5H4V3.5z"/><path d="M8 3.5v6h8v-6M8 20.5v-7h8v7"/></>,
    shield: <><path d="M12 2.8 20 6v5.5c0 4.6-3.1 8-8 9.7-4.9-1.7-8-5.1-8-9.7V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    trash: <><path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 10.5v6M14 10.5v6"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6"/></>,
  };
  return <svg className="admin-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function loadToken(): string {
  try { return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
}
function storeToken(token: string, remember: boolean) {
  try {
    localStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(TOKEN_KEY);
    if (token) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch { /* storage unavailable: token lives only in memory */ }
}

export function CareerAdmin() {
  const [token, setToken] = useState("");
  const [draftToken, setDraftToken] = useState("");
  const [remember, setRemember] = useState(false);
  const [career, setCareer] = useState<Career | null>(null);
  /** The last saved version: the basis for the change summary in the commit message. */
  const [saved, setSaved] = useState<Career | null>(null);
  const [restoredFrom, setRestoredFrom] = useState("");
  const [pending, setPending] = useState<{ changes: Change[]; hits: string[] } | null>(null);
  const [sha, setSha] = useState<string | undefined>();
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState<Tab>("profile");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const connect = useCallback(async (t: string, keep: boolean) => {
    setBusy(true); setStatus("연결 중…");
    try {
      const login = await whoAmI(t);
      if (login.toLowerCase() !== OWNER.toLowerCase()) throw new Error(`이 관리 화면은 ${OWNER} 계정 전용입니다.`);
      const file = await readFile(t, PRIVATE_REPO, PRIVATE_PATH);
      const loaded = file ? normalizeCareer(JSON.parse(file.text)) : emptyCareer();
      setCareer(loaded); setSaved(loaded); setRestoredFrom("");
      setSha(file?.sha);
      setToken(t); storeToken(t, keep); setDirty(false);
      setStatus(file ? "불러왔습니다." : "저장된 이력이 없습니다. 입력 후 저장하면 새로 만들어집니다.");
    } catch (e) {
      setStatus((e as Error).message);
      storeToken("", false);
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { const t = loadToken(); if (t) void connect(t, !!localStorage.getItem(TOKEN_KEY)); }, [connect]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (fn: (c: Career) => void) => {
    setCareer((prev) => { if (!prev) return prev; const next = structuredClone(prev); fn(next); return next; });
    setDirty(true);
  };

  /** Saving that changes the public site first asks for confirmation (see PublishConfirm). */
  const save = () => {
    if (!career || !token) return;
    const changes = publicChanges(saved ?? emptyCareer(), career);
    if (changes.length) setPending({ changes, hits: sensitiveHits(career) });
    else void doSave();
  };

  const doSave = async () => {
    if (!career || !token) return;
    setPending(null);
    setBusy(true); setStatus("저장 중…");
    try {
      const next = { ...career, updatedAt: new Date().toISOString() };
      const summary = summarizeChanges(saved ? diffCareer(saved, next) : []);
      const message = restoredFrom ? `career: ${restoredFrom} 버전으로 되돌림 (${summary})` : `career: ${summary}`;
      const newSha = await writeFile(token, PRIVATE_REPO, PRIVATE_PATH, JSON.stringify(next, null, 2) + "\n", sha, message);
      setSha(newSha); setCareer(next); setSaved(next); setRestoredFrom(""); setDirty(false);
      const publicText = JSON.stringify(toPublic(next), null, 2) + "\n";
      const current = await readFile(token, PUBLIC_REPO, PUBLIC_PATH);
      const strip = (t: string) => t.replace(/"updatedAt": "[^"]*",?\n\s*/g, "");
      if (current && strip(current.text) === strip(publicText)) {
        setStatus("저장했습니다. 공개 항목은 바뀌지 않아 사이트는 그대로입니다.");
      } else {
        await writeFile(token, PUBLIC_REPO, PUBLIC_PATH, publicText, current?.sha, "career: update public profile");
        setStatus("저장했습니다. 공개 항목이 바뀌어 사이트가 1~2분 뒤 다시 배포됩니다.");
      }
    } catch (e) { setStatus((e as Error).message); } finally { setBusy(false); }
  };

  const logout = () => {
    if (dirty && !window.confirm("저장하지 않은 변경이 있습니다. 나갈까요?")) return;
    storeToken("", false); setToken(""); setCareer(null); setDraftToken(""); setStatus("로그아웃했습니다. 이 기기에서 토큰을 지웠습니다.");
  };

  if (!token || !career) {
    return (
      <section className="admin-login" aria-labelledby="admin-login-title">
        <div className="admin-login-intro">
          <p className="admin-eyebrow"><span className="admin-live-dot" /> Private workspace</p>
          <h1 id="admin-login-title">경력을 기록하고,<br />필요할 때 꺼내 쓰세요.</h1>
          <p className="lede">개인 이력은 비공개 저장소에서 관리하고, 이력서·경력기술서로 바로 내보냅니다.</p>
          <ul className="admin-login-points">
            <li><Icon name="lock" /><span><b>비공개 우선</b>토큰과 개인 데이터는 서버에 보관하지 않습니다.</span></li>
            <li><Icon name="clock" /><span><b>안전한 버전 기록</b>저장할 때마다 이력이 남아 언제든 비교하고 복구합니다.</span></li>
            <li><Icon name="file" /><span><b>한 번 기록, 여러 문서</b>같은 데이터로 이력서와 경력기술서를 만듭니다.</span></li>
          </ul>
        </div>
        <div className="admin-login-card">
          <div className="admin-login-card-head">
            <span className="admin-login-mark"><Icon name="shield" /></span>
            <div>
              <p className="mono">OWNER ACCESS</p>
              <h2>내 작업공간 연결</h2>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (draftToken.trim()) void connect(draftToken.trim(), remember); }}>
            <label className="admin-field">
              <span className="admin-label">GitHub Fine-grained token</span>
              <span className="admin-input-wrap"><Icon name="lock" /><input type="password" autoComplete="off" spellCheck={false} value={draftToken} placeholder="github_pat_…" onChange={(e) => setDraftToken(e.target.value)} /></span>
            </label>
            <label className="admin-check">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>이 기기에서 기억하기 <small>개인 기기에서만 사용</small></span>
            </label>
            <button className="admin-btn primary admin-login-submit" disabled={busy || !draftToken.trim()}>
              {busy ? <span className="admin-spinner" /> : <Icon name="arrow-up" />}
              {busy ? "연결하는 중" : "안전하게 연결"}
            </button>
          </form>
          {status && <p className="admin-status" role="status">{status}</p>}
          <details className="admin-help">
            <summary>처음인가요? 토큰 만드는 법</summary>
            <ol>
              <li><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">GitHub → Fine-grained token <Icon name="external" /></a>을 엽니다.</li>
              <li>Repository access에서 <code>{PRIVATE_REPO}</code>, <code>{PUBLIC_REPO}</code>만 선택합니다.</li>
              <li>Permissions → Contents를 <b>Read and write</b>로 설정합니다.</li>
              <li>만료 기간을 정해 생성한 토큰을 위에 붙여 넣습니다.</li>
            </ol>
          </details>
        </div>
      </section>
    );
  }

  const changeCount = saved ? diffCareer(saved, career).length : 0;
  const totalRecords = sections.reduce((sum, section) => sum + career.sections[section.id].length, 0);
  const activeSection = sections.find((section) => section.id === tab);
  const activeUtility = utilityTabs.find((item) => item.id === tab);
  const activeLabel = activeSection?.label ?? activeUtility?.label ?? "이력 관리";
  const activeDescription = activeSection ? sectionDescriptions[activeSection.id] : activeUtility?.description;

  return (
    <section className="admin" aria-labelledby="admin-title">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <p className="mono">CAREER OS</p>
          <h1 id="admin-title">이력 관리</h1>
          <div className="admin-library-meta"><span>{totalRecords}개 기록</span><span>비공개 저장소</span></div>
        </div>
        <nav className="admin-tabs" aria-label="이력 관리 메뉴">
          <p className="admin-nav-label">내 이력</p>
          {sections.map((section) => (
            <button key={section.id} className="admin-tab" aria-current={tab === section.id ? "page" : undefined} onClick={() => setTab(section.id)}>
              <span>{section.label}</span>
              <span className="admin-count">{career.sections[section.id].length}</span>
            </button>
          ))}
          <p className="admin-nav-label">도구</p>
          {utilityTabs.map((item) => (
            <button key={item.id} className="admin-tab admin-tab-tool" aria-current={tab === item.id ? "page" : undefined} onClick={() => setTab(item.id)}>
              <Icon name={item.icon} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-account">
          <span className="admin-avatar">S</span>
          <span><b>{OWNER}</b><small><span className="admin-live-dot" /> GitHub 연결됨</small></span>
          <button className="admin-icon-btn" onClick={logout} aria-label="로그아웃" title="로그아웃"><Icon name="logout" /></button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-command-bar">
          <div>
            <p className="admin-breadcrumb">이력 관리 <span>/</span> {activeLabel}</p>
            <div className={`admin-save-state${dirty ? " is-dirty" : ""}`}>
              <span>{dirty ? `${changeCount || 1}개 변경됨` : "모든 변경사항 저장됨"}</span>
            </div>
          </div>
          <div className="admin-actions">
            <button className="admin-btn ghost" onClick={logout}><Icon name="logout" />로그아웃</button>
            <button className="admin-btn primary" onClick={save} disabled={busy || !dirty}>
              {busy ? <span className="admin-spinner" /> : dirty ? <Icon name="save" /> : <Icon name="check" />}
              {busy ? "저장 중" : dirty ? "변경사항 저장" : "저장됨"}
            </button>
          </div>
        </header>

        <div className="admin-content">
          {status && <p className="admin-status" role="status">{status}</p>}
          {pending && <PublishConfirm {...pending} onConfirm={() => void doSave()} onCancel={() => setPending(null)} />}
          {restoredFrom && (
            <div className="admin-notice restore" role="status"><Icon name="clock" /><span><b>{restoredFrom} 버전을 불러왔습니다.</b> 내용을 확인하고 저장하면 되돌리기가 완료됩니다. 저장 전에는 아무것도 바뀌지 않습니다.</span></div>
          )}
          <header className="admin-panel-head">
            <div>
              <p className="mono">{activeSection ? "CAREER RECORD" : "WORKSPACE TOOL"}</p>
              <h2>{activeLabel}</h2>
              {activeDescription && <p>{activeDescription}</p>}
            </div>
            {activeSection && <span className="admin-record-total">{career.sections[activeSection.id].length}<small>records</small></span>}
          </header>

          <div className="admin-panel" key={tab}>
            {tab === "history" ? (
              <History
                token={token}
                current={career}
                dirty={dirty}
                onRestore={(version, label) => { setCareer(version); setDirty(true); setRestoredFrom(label); setTab("profile"); }}
              />
            ) : tab === "settings" ? <Settings career={career} update={update} />
              : tab === "export" ? <Export career={career} />
              : <SectionEditor id={tab} career={career} update={update} />}
          </div>
        </div>
      </div>
    </section>
  );
}

const publicWord: Record<Change["kind"], string> = {
  added: "새로 공개", changed: "공개 내용 수정", removed: "사이트에서 내림", published: "새로 공개", unpublished: "사이트에서 내림",
};

/** Shown before any save that changes what the public site shows. */
function PublishConfirm({ changes, hits, onConfirm, onCancel }: {
  changes: Change[]; hits: string[]; onConfirm: () => void; onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  const goesOut = changes.some((c) => c.kind === "added" || c.kind === "changed" || c.kind === "published");

  return (
    <dialog ref={ref} className="builder-log publish-confirm" aria-labelledby="publish-title" onCancel={(e) => { e.preventDefault(); onCancel(); }}>
      <div className="builder-log-body">
        <h2 id="publish-title">공개 사이트가 바뀝니다</h2>
        <ul className="admin-changes">
          {changes.map((c) => (
            <li key={`${c.section}-${c.id}-${c.kind}`}>
              <span className={`admin-kind ${c.kind}`}>{publicWord[c.kind]}</span>
              <span className="mono-ko">{sectionById[c.section].label}</span>
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
        {hits.length > 0 && (
          <p className="admin-status publish-warn">공개 항목에 주의 단어가 있습니다: <b>{hits.join(", ")}</b></p>
        )}
        <div className="publish-note">
          {goesOut && <p>저장하면 1~2분 뒤 누구나 볼 수 있는 사이트에 나타납니다.</p>}
          <p>
            공개된 내용은 공개 저장소의 기록에 <b>영구히 남습니다.</b> 나중에 비공개로 바꾸거나 지워도 사이트에서만 사라지고,
            GitHub의 과거 기록에서는 계속 볼 수 있습니다.
          </p>
        </div>
        <div className="builder-foot">
          <button type="button" className="admin-btn" onClick={onCancel} autoFocus>취소</button>
          <button type="button" className="admin-btn primary" onClick={onConfirm}>확인하고 저장</button>
        </div>
      </div>
    </dialog>
  );
}

function History({ token, current, dirty, onRestore }: {
  token: string; current: Career; dirty: boolean; onRestore: (version: Career, label: string) => void;
}) {
  const [revisions, setRevisions] = useState<Revision[] | null>(null);
  const [picked, setPicked] = useState<{ rev: Revision; career: Career; changes: Change[] } | null>(null);
  const [error, setError] = useState("");
  const [loadingSha, setLoadingSha] = useState("");

  useEffect(() => {
    listRevisions(token, PRIVATE_REPO, PRIVATE_PATH).then(setRevisions).catch((e) => setError((e as Error).message));
  }, [token]);

  const when = (iso: string) => new Date(iso).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" });

  const pick = async (rev: Revision) => {
    setError("");
    setLoadingSha(rev.sha);
    try {
      const file = await readFile(token, PRIVATE_REPO, PRIVATE_PATH, rev.sha);
      if (!file) throw new Error("이 버전의 파일을 찾을 수 없습니다.");
      const version = normalizeCareer(JSON.parse(file.text));
      setPicked({ rev, career: version, changes: diffCareer(current, version) });
    } catch (e) { setError((e as Error).message); }
    finally { setLoadingSha(""); }
  };

  const restore = () => {
    if (!picked) return;
    if (dirty && !window.confirm("저장하지 않은 변경이 있습니다. 이 버전으로 바꾸면 그 변경은 사라집니다. 계속할까요?")) return;
    onRestore(picked.career, when(picked.rev.date));
  };

  if (error) return <p className="admin-status" role="status">{error}</p>;
  if (!revisions) return <div className="admin-loading"><span className="admin-spinner" /><span>저장 기록을 불러오는 중</span></div>;
  if (!revisions.length) return <div className="admin-empty"><span className="admin-empty-icon"><Icon name="clock" /></span><h3>아직 저장 기록이 없습니다</h3><p>첫 저장부터 버전 기록이 시간순으로 쌓입니다.</p></div>;

  return (
    <div className="admin-history">
      <div className="admin-history-list">
        <div className="admin-history-caption"><span>저장된 버전</span><b>{revisions.length}</b></div>
        <ol className="admin-revs" aria-label="저장 기록">
          {revisions.map((r, i) => (
            <li key={r.sha}>
              <button className="admin-rev" aria-pressed={picked?.rev.sha === r.sha} onClick={() => pick(r)} disabled={loadingSha === r.sha}>
                <span className="admin-rev-node" aria-hidden="true" />
                <span><span className="mono-ko">{when(r.date)}{i === 0 ? " · 최신" : ""}</span><b>{r.message.replace(/^career:\s*/, "")}</b></span>
                {loadingSha === r.sha && <span className="admin-spinner" />}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="admin-rev-detail">
        {!picked ? (
          <div className="admin-history-placeholder"><span><Icon name="clock" /></span><h3>비교할 버전을 선택하세요</h3><p>왼쪽 기록을 고르면 지금 내용과 달라지는 항목을 보여줍니다.</p></div>
        ) : (
          <>
            <div className="admin-rev-detail-head"><div><p className="mono">SELECTED VERSION</p><h3 className="admin-rev-title">{when(picked.rev.date)}</h3></div><span className="admin-commit-id">{picked.rev.sha.slice(0, 7)}</span></div>
            {picked.changes.length === 0 ? (
              <div className="admin-notice public"><Icon name="check" /><span><b>현재 내용과 같습니다.</b> 되돌릴 변경사항이 없습니다.</span></div>
            ) : (
              <>
                <p className="admin-compare-title">이 버전으로 되돌릴 때 바뀌는 항목 <b>{picked.changes.length}</b></p>
                <ul className="admin-changes">
                  {picked.changes.map((c) => (
                    <li key={`${c.section}-${c.id}-${c.kind}`}>
                      <span className={`admin-kind ${c.kind}`}>{changeWord[c.kind]}</span>
                      <span className="mono-ko">{c.id === "settings" ? "설정" : sectionById[c.section].label}</span>
                      <span>{c.label}</span>
                    </li>
                  ))}
                </ul>
                <div className="admin-restore-action"><button className="admin-btn primary" onClick={restore}><Icon name="clock" />이 버전 불러오기</button><p>불러온 뒤 저장해야 반영됩니다. 기존 기록은 그대로 남습니다.</p></div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SectionEditor({ id, career, update }: { id: SectionId; career: Career; update: (fn: (c: Career) => void) => void }) {
  const def = sectionById[id];
  const items = career.sections[id];
  const add = () => update((c) => { c.sections[id].push({ id: newId(), public: false }); });
  const move = (i: number, d: number) => update((c) => {
    const list = c.sections[id]; const j = i + d; if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
  });
  const set = (i: number, key: string, value: string | boolean) => update((c) => { c.sections[id][i][key] = value; });
  const remove = (i: number) => { if (window.confirm("이 항목을 삭제할까요?")) update((c) => { c.sections[id].splice(i, 1); }); };

  return (
    <div className="admin-section">
      <div className={`admin-notice ${PUBLISHABLE.has(id) ? "public" : "private"}`}>
        <Icon name={PUBLISHABLE.has(id) ? "external" : "lock"} />
        <span>
          <b>{PUBLISHABLE.has(id) ? "선택한 정보만 사이트에 공개할 수 있습니다." : "이 탭은 비공개 전용입니다."}</b>
          {PUBLISHABLE.has(id)
            ? " 공개 스위치를 켠 뒤 저장하면 최종 확인을 한 번 더 거칩니다."
            : " 개인 정보는 비공개 저장소와 문서 내보내기에만 사용됩니다."}
        </span>
      </div>
      {items.length === 0 && (
        <div className="admin-empty">
          <span className="admin-empty-icon"><Icon name="archive" /></span>
          <h3>아직 기록이 없습니다</h3>
          <p>첫 항목을 추가해 경력을 구조화해 보세요. 입력한 내용은 저장 전까지 업로드되지 않습니다.</p>
          <button className="admin-btn primary" onClick={add}><Icon name="plus" />첫 {def.label} 추가</button>
        </div>
      )}
      {items.map((item: CareerItem, i) => (
        <fieldset key={item.id} className="admin-item">
          <legend className="admin-sr-only">{def.label} {def.single ? "" : i + 1}</legend>
          <div className="admin-item-head">
            <div className="admin-item-title">
              <span className="admin-item-index">{String(i + 1).padStart(2, "0")}</span>
              <span><b>{itemLabel(id, item)}</b><small>{def.label} {def.single ? "프로필" : `${i + 1}번째 기록`}</small></span>
            </div>
            <div className="admin-item-progress" title={`필드 ${def.fields.filter((field) => String(item[field.key] ?? "").trim()).length}/${def.fields.length}개 입력`}>
              <span style={{ width: `${Math.round(def.fields.filter((field) => String(item[field.key] ?? "").trim()).length / def.fields.length * 100)}%` }} />
            </div>
          </div>
          <div className="admin-item-bar">
            <div>
              {PUBLISHABLE.has(id) ? (
                <label className="admin-switch">
                  <input type="checkbox" checked={item.public} onChange={(e) => set(i, "public", e.target.checked)} />
                  <span className="admin-switch-track" aria-hidden="true"><span /></span>
                  <span><b>{item.public ? "사이트 공개" : "비공개"}</b><small>{item.public ? "저장하면 공개 사이트에 반영" : "내 문서에만 사용"}</small></span>
                </label>
              ) : (
                <span className="admin-privacy-chip"><Icon name="lock" /> 비공개 전용</span>
              )}
            </div>
            <div className="admin-item-controls">
              {!def.single && (
                <div className="admin-reorder" aria-label={`${def.label} ${i + 1} 순서 변경`}>
                  <button className="admin-icon-btn" onClick={() => move(i, -1)} aria-label="위로 이동" title="위로 이동" disabled={i === 0}><Icon name="arrow-up" /></button>
                  <button className="admin-icon-btn" onClick={() => move(i, 1)} aria-label="아래로 이동" title="아래로 이동" disabled={i === items.length - 1}><Icon name="arrow-down" /></button>
                </div>
              )}
              <button className="admin-icon-btn danger" onClick={() => remove(i)} aria-label={`${def.label} ${i + 1} 삭제`} title="삭제"><Icon name="trash" /></button>
            </div>
          </div>
          <div className="admin-grid">
            {def.fields.map((f) => (
              <label key={f.key} className={`admin-field${f.type === "textarea" ? " wide" : ""}`}>
                <span className="admin-label">{f.label}</span>
                {f.type === "textarea" ? (
                  <textarea rows={4} value={(item[f.key] as string) ?? ""} placeholder={f.placeholder} onChange={(e) => set(i, f.key, e.target.value)} />
                ) : (
                  <input type={f.type === "url" ? "url" : f.type === "month" ? "month" : "text"} value={(item[f.key] as string) ?? ""} placeholder={f.placeholder} onChange={(e) => set(i, f.key, e.target.value)} />
                )}
              </label>
            ))}
            <label className="admin-field wide admin-note-field">
              <span className="admin-label"><Icon name="lock" /> 비공개 메모 <small>내보내기와 공개 사이트에서 제외</small></span>
              <textarea rows={2} value={item.note ?? ""} placeholder="나만 볼 메모를 남겨두세요." onChange={(e) => set(i, "note", e.target.value)} />
            </label>
          </div>
        </fieldset>
      ))}
      {items.length > 0 && !(def.single && items.length >= 1) && <button className="admin-btn admin-add" onClick={add}><Icon name="plus" />{def.label} 추가</button>}
    </div>
  );
}

function Settings({ career, update }: { career: Career; update: (fn: (c: Career) => void) => void }) {
  const terms = (career.settings?.sensitiveTerms ?? []).join("\n");
  return (
    <div className="admin-section">
      <div className="admin-notice private"><Icon name="shield" /><span><b>공개 전 마지막 안전장치</b> 기본 정보에 아래 단어가 포함되면 저장 직전 경고합니다. 단어 목록도 비공개로 보관됩니다.</span></div>
      <div className="admin-tool-card">
        <label className="admin-field wide">
          <span className="admin-label">주의 단어 <small>줄마다 하나씩 입력</small></span>
          <textarea rows={8} value={terms} placeholder={"기관명\n부서명\n내부 프로젝트명"} onChange={(e) => update((c) => { c.settings = { sensitiveTerms: e.target.value.split("\n").map((t) => t.trim()).filter(Boolean) }; })} />
        </label>
        <div className="admin-tool-meta"><span>등록된 단어 <b>{career.settings?.sensitiveTerms?.length ?? 0}</b></span><span>마지막 저장 <b>{career.updatedAt ? new Date(career.updatedAt).toLocaleString("ko-KR") : "없음"}</b></span></div>
      </div>
    </div>
  );
}

function Export({ career }: { career: Career }) {
  const [kind, setKind] = useState<DocKind>("resume");
  const md = useMemo(() => toMarkdown(career, kind), [career, kind]);
  const html = useMemo(() => mdToHtml(md), [md]);

  const download = () => {
    const url = URL.createObjectURL(new Blob([md], { type: "text/markdown;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `${docTitle[kind]}.md`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="admin-section">
      <div className="admin-export-bar">
        <div className="admin-segmented" aria-label="문서 종류">
        {(["resume", "career"] as DocKind[]).map((k) => (
          <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)}>{docTitle[k]}</button>
        ))}
        </div>
        <div className="admin-item-bar">
          <button className="admin-btn" onClick={() => window.print()}><Icon name="file" />PDF</button>
          <button className="admin-btn" onClick={download}><Icon name="download" />Markdown</button>
          <a className="admin-btn primary" href="https://to-hwpx.vercel.app/" target="_blank" rel="noopener noreferrer">HWPX로 변환 <Icon name="external" /></a>
        </div>
      </div>
      <div className="admin-export-workspace">
        <aside className="admin-export-guide"><span className="admin-export-number">01</span><h3>문서 미리보기</h3><p>현재 입력된 내용으로 자동 구성했습니다. 부족한 항목은 해당 탭에서 보완하세요.</p><span className="admin-export-number">02</span><h3>원하는 형식으로 저장</h3><p>PDF나 Markdown으로 받거나 To HWPX에서 한글 문서로 변환할 수 있습니다.</p></aside>
        <div className="admin-paper"><div className="admin-paper-top"><span>{docTitle[kind]} PREVIEW</span><span>A4</span></div><article className="print-doc" dangerouslySetInnerHTML={{ __html: html }} /></div>
      </div>
    </div>
  );
}

/** Minimal Markdown → HTML for the generated documents (headings, lists, tables, bold, paragraphs). */
function mdToHtml(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/ {2}$/, "<br>");
  const out: string[] = [];
  let list = false, table = false;
  const close = () => { if (list) { out.push("</ul>"); list = false; } if (table) { out.push("</tbody></table>"); table = false; } };
  for (const line of md.split("\n")) {
    const h = line.match(/^(#{1,3}) (.*)$/);
    if (h) { close(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); continue; }
    if (line.startsWith("- ")) { if (!list) { close(); out.push("<ul>"); list = true; } out.push(`<li>${inline(line.slice(2))}</li>`); continue; }
    if (line.startsWith("|")) {
      if (/^\|[-| ]+\|$/.test(line)) continue;
      const cells = line.slice(1, -1).split("|").map((c) => inline(c.trim()));
      if (!table) { close(); out.push(`<table><thead><tr>${cells.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>`); table = true; }
      else out.push(`<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`);
      continue;
    }
    if (!line.trim()) { close(); continue; }
    close(); out.push(`<p>${inline(line)}</p>`);
  }
  close();
  return out.join("");
}
