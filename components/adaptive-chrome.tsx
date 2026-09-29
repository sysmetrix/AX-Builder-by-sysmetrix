"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "./brand-mark";
import { MobileMenu } from "./mobile-menu";
import { PrimaryNav, type NavItem } from "./primary-nav";
import { BuilderLog, type BuilderLogStats } from "./builder-log";
import { brandForPath, brands, counterpartPath } from "@/lib/brands";

const axNav: NavItem[] = [
  { href: "/work", label: "작업" },
  { href: "/work#data", label: "데이터·조사" },
  { href: "/lab", label: "도구" },
  { href: "/about", label: "소개" },
];

const youthNav: NavItem[] = [
  { href: "/youth/work", label: "사업·활동" },
  { href: "/youth/work#data", label: "데이터·평가" },
  { href: "/youth/about", label: "소개" },
];

export function AdaptiveHeader() {
  const pathname = usePathname();
  const mode = brandForPath(pathname);
  const brand = brands[mode];
  const nav = mode === "youth" ? youthNav : axNav;
  const switchItem = {
    href: counterpartPath(pathname),
    label: mode === "youth" ? "AX Builder" : "Youth Worker",
  };
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link className="brand" href={mode === "youth" ? "/youth" : "/"} aria-label={`${brand.fullName} — 홈`}>
          <BrandMark />
          <span>
            <span className="brand-name">{brand.name}</span>
            <small>by sysmetrix</small>
          </span>
        </Link>
        <PrimaryNav items={nav} brandSwitch={switchItem} />
        <MobileMenu items={nav} brandSwitch={switchItem} />
      </div>
    </header>
  );
}

export function AdaptiveFooter({ stats }: { stats: BuilderLogStats }) {
  const pathname = usePathname();
  const mode = brandForPath(pathname);
  const brand = brands[mode];
  return (
    <footer className="site-footer">
      <div className="wrap foot">
        <div>
          <BuilderLog identity={brand.identity} stats={stats} brandName={brand.name} />
          <p className="mono">{brand.identity}</p>
        </div>
        <p className="foot-note">
          {mode === "youth" ? "더 나은 청소년 현장을 위한 사업과 시스템을 만듭니다." : "현장에서 출발한 시스템과 도구를 만듭니다."}
        </p>
      </div>
    </footer>
  );
}
