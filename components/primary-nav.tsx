"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export interface NavItem {
  href: string;
  label: string;
}

export function isCurrentNav(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  if (href.endsWith("/work") || href === "/work") return pathname === href || pathname.startsWith(`${href}/`);
  return pathname === href;
}

export function PrimaryNav({ items, brandSwitch }: { items: NavItem[]; brandSwitch?: NavItem }) {
  const pathname = usePathname();
  return (
    <nav className="nav-desktop" aria-label="주요 메뉴">
      {items.map((item) => (
        <Link key={item.href} href={item.href} aria-current={isCurrentNav(pathname, item.href) ? "page" : undefined}>
          {item.label}
        </Link>
      ))}
      {brandSwitch && <Link className="brand-mode-link" href={brandSwitch.href}>{brandSwitch.label}</Link>}
      <ThemeToggle />
    </nav>
  );
}
