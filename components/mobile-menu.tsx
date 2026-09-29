"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { isCurrentNav } from "./primary-nav";

/**
 * Disclosure menu for narrow viewports (CSS shows it <=720px).
 * While open: page content is inert (no tab stops behind the sheet), body scroll is locked,
 * Esc closes and returns focus to the button, and the sheet closes when the viewport widens.
 */
export function MobileMenu({ items, brandSwitch }: { items: { href: string; label: string }[]; brandSwitch?: { href: string; label: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const behind = [document.getElementById("main"), document.querySelector<HTMLElement>(".site-footer"), document.querySelector<HTMLElement>(".skip")];
    behind.forEach((el) => el && (el.inert = true));
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 721px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);

    return () => {
      behind.forEach((el) => el && (el.inert = false));
      document.documentElement.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <div className="nav-mobile">
      <button
        ref={btn}
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="mobile-panel"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "닫기" : "메뉴"}
      </button>
      {open && (
        <div id="mobile-panel" className="menu-panel">
          <nav aria-label="모바일 메뉴">
            {items.map((n, i) => (
              <Link key={n.href} href={n.href} aria-current={isCurrentNav(pathname, n.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                <span className="mono" aria-hidden="true">0{i + 1}</span>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="menu-row">
            {brandSwitch && <Link className="brand-mode-link" href={brandSwitch.href} onClick={() => setOpen(false)}>↔ {brandSwitch.label}</Link>}
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
