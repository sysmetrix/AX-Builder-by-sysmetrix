"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PUBLISHABLE, changeWord, diffCareer, emptyCareer, newId, normalizeCareer, publicChanges, sections, sectionById, sensitiveHits, summarizeChanges, toPublic,
  type Career, type CareerItem, type Change, type SectionId,
} from "@/lib/career";
import { docTitle, toMarkdown, type DocKind } from "@/lib/career-export";
import {
  OWNER, PRIVATE_PATH, PRIVATE_REPO, PUBLIC_PATH, PUBLIC_REPO, listRevisions, readFile, whoAmI, writeFile,
  type Revision,
} from "@/lib/github-store";

const TOKEN_KEY = "axb-admin-token";
type Tab = SectionId | "settings" | "export" | "history";

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
      <section className="admin-login">
        <h1>이력 관리</h1>
        <p className="lede">본인 GitHub 토큰으로만 열립니다. 데이터는 비공개 저장소에 있고, 이 화면에는 저장되지 않습니다.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (draftToken.trim()) void connect(draftToken.trim(), remember); }}>
          <label className="admin-field">
            <span className="mono-ko">GitHub 토큰</span>
            <input type="password" autoComplete="off" spellCheck={false} value={draftToken} onChange={(e) => setDraftToken(e.target.value)} />
          </label>
          <label className="admin-check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            이 기기에서 기억하기 (개인 기기에서만)
          </label>
          <button className="admin-btn primary" disabled={busy}>연결</button>
        </form>
        {status && <p className="admin-status" role="status">{status}</p>}
        <details className="admin-help">
          <summary>토큰 만드는 법</summary>
          <ol>
            <li><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">GitHub → Fine-grained token</a>을 엽니다.</li>
            <li>Repository access: <code>{PRIVATE_REPO}</code>, <code>{PUBLIC_REPO}</code> 두 개만 선택합니다.</li>
            <li>Permissions → Contents: <b>Read and write</b>. 나머지는 모두 없음.</li>
            <li>만료 기간을 정하고 생성한 뒤, 여기에 붙여 넣습니다.</li>
          </ol>
        </details>
      </section>
    );
  }

  return (
    <section className="admin">
      <header className="admin-head">
        <h1>이력 관리</h1>
        <div className="admin-actions">
          <button className="admin-btn primary" onClick={save} disabled={busy || !dirty}>{dirty ? "저장" : "저장됨"}</button>
          <button className="admin-btn" onClick={logout}>로그아웃</button>
        </div>
      </header>
      {status && <p className="admin-status" role="status">{status}</p>}
      <nav className="admin-tabs" aria-label="이력 항목">
        {[...sections.map((s) => ({ id: s.id as Tab, label: s.label, n: career.sections[s.id].length })),
          { id: "settings" as Tab, label: "설정", n: 0 }, { id: "export" as Tab, label: "내보내기", n: 0 },
          { id: "history" as Tab, label: "기록", n: 0 }].map((t) => (
          <button key={t.id} className="filter" aria-pressed={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}{t.n ? ` ${t.n}` : ""}
          </button>
        ))}
      </nav>
      {pending && <PublishConfirm {...pending} onConfirm={() => void doSave()} onCancel={() => setPending(null)} />}
      {restoredFrom && (
        <p className="admin-status" role="status">
          {restoredFrom} 버전을 불러왔습니다. 내용을 확인한 뒤 저장하면 되돌리기가 완료됩니다. 저장 전에는 아무것도 바뀌지 않습니다.
        </p>
      )}
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

  useEffect(() => {
    listRevisions(token, PRIVATE_REPO, PRIVATE_PATH).then(setRevisions).catch((e) => setError((e as Error).message));
  }, [token]);

  const when = (iso: string) => new Date(iso).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" });

  const pick = async (rev: Revision) => {
    setError("");
    try {
      const file = await readFile(token, PRIVATE_REPO, PRIVATE_PATH, rev.sha);
      if (!file) throw new Error("이 버전의 파일을 찾을 수 없습니다.");
      const version = normalizeCareer(JSON.parse(file.text));
      setPicked({ rev, career: version, changes: diffCareer(current, version) });
    } catch (e) { setError((e as Error).message); }
  };

  const restore = () => {
    if (!picked) return;
    if (dirty && !window.confirm("저장하지 않은 변경이 있습니다. 이 버전으로 바꾸면 그 변경은 사라집니다. 계속할까요?")) return;
    onRestore(picked.career, when(picked.rev.date));
  };

  if (error) return <p className="admin-status" role="status">{error}</p>;
  if (!revisions) return <p className="mono-ko">불러오는 중…</p>;
  if (!revisions.length) return <p className="mono-ko">아직 저장 기록이 없습니다.</p>;

  return (
    <div className="admin-history">
      <ol className="admin-revs" aria-label="저장 기록">
        {revisions.map((r, i) => (
          <li key={r.sha}>
            <button className="admin-rev" aria-pressed={picked?.rev.sha === r.sha} onClick={() => pick(r)}>
              <span className="mono-ko">{when(r.date)}{i === 0 ? " · 최신" : ""}</span>
              <span>{r.message.replace(/^career:\s*/, "")}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="admin-rev-detail">
        {!picked ? (
          <p className="mono-ko">버전을 고르면, 지금 내용과 무엇이 다른지 보여 줍니다.</p>
        ) : (
          <>
            <h2 className="admin-rev-title">{when(picked.rev.date)} 버전</h2>
            {picked.changes.length === 0 ? (
              <p className="mono-ko">지금 내용과 같습니다.</p>
            ) : (
              <>
                <p className="mono-ko">이 버전으로 되돌리면 바뀌는 것 ({picked.changes.length})</p>
                <ul className="admin-changes">
                  {picked.changes.map((c) => (
                    <li key={`${c.section}-${c.id}-${c.kind}`}>
                      <span className={`admin-kind ${c.kind}`}>{changeWord[c.kind]}</span>
                      <span className="mono-ko">{c.id === "settings" ? "설정" : sectionById[c.section].label}</span>
                      <span>{c.label}</span>
                    </li>
                  ))}
                </ul>
                <button className="admin-btn primary" onClick={restore}>이 버전 불러오기</button>
                <p className="mono-ko">불러온 뒤 저장해야 반영됩니다. 기존 기록은 지워지지 않아 언제든 다시 되돌릴 수 있습니다.</p>
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
      {!PUBLISHABLE.has(id) && <p className="admin-private">이 탭은 개인정보라 공개 사이트에 절대 올라가지 않습니다. 비공개 저장소와 이력서 내보내기에만 쓰입니다.</p>}
      {items.length === 0 && <p className="mono-ko">아직 항목이 없습니다.</p>}
      {items.map((item: CareerItem, i) => (
        <fieldset key={item.id} className="admin-item">
          <legend className="mono-ko">{def.label} {def.single ? "" : i + 1}</legend>
          <div className="admin-item-bar">
            {PUBLISHABLE.has(id) ? (
              <label className="admin-check">
                <input type="checkbox" checked={item.public} onChange={(e) => set(i, "public", e.target.checked)} />
                공개 사이트에 표시
              </label>
            ) : (
              <span className="admin-private">비공개 전용 · 공개되지 않습니다</span>
            )}
            {!def.single && (
              <span>
                <button className="admin-btn small" onClick={() => move(i, -1)} aria-label="위로">↑</button>
                <button className="admin-btn small" onClick={() => move(i, 1)} aria-label="아래로">↓</button>
              </span>
            )}
            <button className="admin-btn small danger" onClick={() => remove(i)}>삭제</button>
          </div>
          <div className="admin-grid">
            {def.fields.map((f) => (
              <label key={f.key} className={`admin-field${f.type === "textarea" ? " wide" : ""}`}>
                <span className="mono-ko">{f.label}</span>
                {f.type === "textarea" ? (
                  <textarea rows={4} value={(item[f.key] as string) ?? ""} placeholder={f.placeholder} onChange={(e) => set(i, f.key, e.target.value)} />
                ) : (
                  <input type={f.type === "url" ? "url" : f.type === "month" ? "month" : "text"} value={(item[f.key] as string) ?? ""} placeholder={f.placeholder} onChange={(e) => set(i, f.key, e.target.value)} />
                )}
              </label>
            ))}
            <label className="admin-field wide">
              <span className="mono-ko">비공개 메모 (어디에도 내보내지 않음)</span>
              <textarea rows={2} value={item.note ?? ""} onChange={(e) => set(i, "note", e.target.value)} />
            </label>
          </div>
        </fieldset>
      ))}
      {!(def.single && items.length >= 1) && <button className="admin-btn" onClick={add}>+ {def.label} 추가</button>}
    </div>
  );
}

function Settings({ career, update }: { career: Career; update: (fn: (c: Career) => void) => void }) {
  const terms = (career.settings?.sensitiveTerms ?? []).join("\n");
  return (
    <div className="admin-section">
      <label className="admin-field wide">
        <span className="mono-ko">주의 단어 (줄마다 하나) — 공개 항목에 들어 있으면 저장 전에 경고합니다. 이 목록은 비공개입니다.</span>
        <textarea rows={6} value={terms} onChange={(e) => update((c) => { c.settings = { sensitiveTerms: e.target.value.split("\n").map((t) => t.trim()).filter(Boolean) }; })} />
      </label>
      <p className="mono-ko">마지막 저장: {career.updatedAt ? new Date(career.updatedAt).toLocaleString("ko-KR") : "없음"}</p>
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
      <div className="admin-item-bar">
        {(["resume", "career"] as DocKind[]).map((k) => (
          <button key={k} className="filter" aria-pressed={kind === k} onClick={() => setKind(k)}>{docTitle[k]}</button>
        ))}
      </div>
      <div className="admin-item-bar">
        <button className="admin-btn" onClick={() => window.print()}>PDF로 저장 (인쇄)</button>
        <button className="admin-btn" onClick={download}>Markdown 받기</button>
        <a className="admin-btn" href="https://to-hwpx.vercel.app/" target="_blank" rel="noopener noreferrer">To HWPX에서 HWPX로 변환 ↗</a>
      </div>
      <p className="mono-ko">HWPX: 받은 Markdown 파일을 To HWPX에 올리면 브라우저 안에서 한글 문서로 바뀝니다.</p>
      <article className="print-doc" dangerouslySetInnerHTML={{ __html: html }} />
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
