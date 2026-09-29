"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export interface WorkItem {
  slug: string;
  title: string;
  oneLiner: string;
  themes: string[];
  themeLabels: string[];
  year: string;
  status: string;
  /** Present only when the project has a case-study page. */
  href?: string;
}

export interface WorkGroup {
  key: string;
  id: string;
  title: string;
  items: WorkItem[];
}

export interface WorkFilter {
  id: string;
  label: string;
}

const SELECTED_FILTER = "selected";
const SELECTED_GROUP = "selected-work";

/**
 * Archive list with a deliberately simple filter (one row of buttons).
 *  - Without JavaScript the full list is shown (the filter bar only appears after hydration).
 *  - The active filter lives in the URL (`?show=youth-work`) so a filtered view can be shared.
 *  - Data arrives as plain props; this file must not import the catalog (it would ship all project data to the client).
 */
export function WorkIndex({ groups, filters }: { groups: WorkGroup[]; filters: WorkFilter[] }) {
  const [active, setActive] = useState("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const wanted = new URLSearchParams(window.location.search).get("show");
      if (wanted && filters.some((f) => f.id === wanted)) setActive(wanted);
    } catch {
      /* no query support — stay on "all" */
    }
    setReady(true);
  }, [filters]);

  function pick(id: string) {
    setActive(id);
    try {
      const { pathname, hash } = window.location;
      window.history.replaceState(null, "", (id === "all" ? pathname : `${pathname}?show=${id}`) + hash);
    } catch {
      /* URL update is optional */
    }
  }

  const matches = (item: WorkItem, groupKey: string) =>
    active === "all" ||
    (active === SELECTED_FILTER ? groupKey === SELECTED_GROUP : item.themes.includes(active));

  const visible = groups.map((g) => ({ ...g, items: g.items.filter((it) => matches(it, g.key)) }));
  const total = visible.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      {ready && (
        <div className="filter-bar">
          <nav aria-label="작업 필터">
            <ul className="filters">
              {filters.map((f) => (
                <li key={f.id}>
                  <button type="button" className="filter" aria-pressed={active === f.id} onClick={() => pick(f.id)}>
                    {f.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mono-ko filter-count" role="status" aria-live="polite">
            {total}개 작업
          </p>
        </div>
      )}

      {visible.map((g) => (
        <section className="block" id={g.id} key={g.key} aria-labelledby={`wg-${g.id}`} hidden={g.items.length === 0}>
          <div className="sec-h">
            <h2 id={`wg-${g.id}`}>{g.title}</h2>
            <p>{g.items.length}개</p>
          </div>
          <ul className="rows">
            {g.items.map((it) => (
              <li className="row-item" key={it.slug}>
                <div>
                  <h3>{it.href ? <Link href={it.href}>{it.title}</Link> : it.title}</h3>
                  <p className="mono-ko">{it.themeLabels.join(" · ") || g.title}</p>
                </div>
                <div>
                  <p>{it.oneLiner}</p>
                  <p className="row-meta mono-ko">{it.year} · {it.status} · {it.href ? "사례 있음" : "목록 정보"}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {ready && total === 0 && <p className="lede">이 영역에는 아직 공개된 작업이 없습니다.</p>}
    </>
  );
}
