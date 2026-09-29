"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface BuilderLogStats {
  projects: number;
  caseStudies: number;
  publicSources: number;
  themes: number;
}
export interface BuilderLogEntry { when: string; title: string; detail: string }

/**
 * Easter egg: type "a" then "x" anywhere (outside form fields), or tap the footer name five times.
 * Shows a small log built only from public data, and a quiet entrance to the owner's editor.
 */
export function BuilderLog({ identity, stats, timeline }: { identity: string; stats: BuilderLogStats; timeline: BuilderLogEntry[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [taps, setTaps] = useState<number[]>([]);

  const open = () => { if (!ref.current?.open) ref.current?.showModal(); };

  useEffect(() => {
    let last = "";
    let at = 0;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || e.altKey || t.closest("input, textarea, select, [contenteditable]")) return;
      const k = e.key.toLowerCase();
      if (k === "x" && last === "a" && Date.now() - at < 1000) open();
      last = k; at = Date.now();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tap = () => {
    const now = Date.now();
    const recent = [...taps.filter((t) => now - t < 2000), now];
    if (recent.length >= 5) { setTaps([]); open(); } else setTaps(recent);
  };

  return (
    <>
      <button type="button" className="brand-name foot-brand" onClick={tap}>
        AX Builder <small>by sysmetrix</small>
      </button>
      <dialog ref={ref} className="builder-log" aria-labelledby="builder-log-title" onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}>
        <div className="builder-log-body">
          <p className="mono">{identity}</p>
          <h2 id="builder-log-title">Builder log</h2>
          <dl className="builder-stats">
            <div><dt className="mono-ko">공개 작업</dt><dd>{stats.projects}</dd></div>
            <div><dt className="mono-ko">사례</dt><dd>{stats.caseStudies}</dd></div>
            <div><dt className="mono-ko">공개 소스</dt><dd>{stats.publicSources}</dd></div>
            <div><dt className="mono-ko">주제</dt><dd>{stats.themes}</dd></div>
          </dl>
          {timeline.length > 0 ? (
            <ol className="builder-timeline">
              {timeline.map((t) => (
                <li key={`${t.when}-${t.title}`}>
                  <span className="mono-ko">{t.when}</span>
                  <span>{t.title}{t.detail && <small> · {t.detail}</small>}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="builder-note">현장에서 시작해, 정책과 성과를 거쳐, 데이터와 AX로. 기록은 계속 쌓이는 중입니다.</p>
          )}
          <div className="builder-foot">
            <Link href="/admin" className="mono-ko builder-owner" onClick={() => ref.current?.close()}>owner</Link>
            <button type="button" className="admin-btn small" onClick={() => ref.current?.close()}>닫기</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
