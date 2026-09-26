import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { identityLine } from "@/lib/identity";

const nav = [
  { href: "/work", label: "작업" },
  { href: "/work#data", label: "데이터·조사" },
  { href: "/lab", label: "도구" },
  { href: "/about", label: "소개" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link className="brand" href="/" aria-label="AX Builder by sysmetrix — 홈">
          <BrandMark />
          <span>
            <span className="brand-name">AX Builder</span>
            <small>by sysmetrix</small>
          </span>
        </Link>
        <nav className="nav-desktop" aria-label="주요 메뉴">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
        <MobileMenu items={nav} />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap foot">
        <div>
          <p className="brand-name">AX Builder <small>by sysmetrix</small></p>
          <p className="mono">{identityLine}</p>
        </div>
        <p className="foot-note">현장에서 출발한 시스템과 도구를 만듭니다.</p>
      </div>
    </footer>
  );
}
