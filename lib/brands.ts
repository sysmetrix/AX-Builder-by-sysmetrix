export type BrandMode = "ax" | "youth";

export const brands = {
  ax: {
    name: "AX Builder",
    fullName: "AX Builder by sysmetrix",
    identity: "Youth Work × Policy × Strategy × Data × AX",
  },
  youth: {
    name: "Youth Worker",
    fullName: "Youth Worker by sysmetrix",
    identity: "Youth Work × Programs × Policy × Data",
  },
} as const;

export function brandForPath(pathname: string): BrandMode {
  return pathname === "/youth" || pathname.startsWith("/youth/") ? "youth" : "ax";
}

export function counterpartPath(pathname: string): string {
  if (brandForPath(pathname) === "youth") {
    const ax = pathname.slice("/youth".length);
    return ax || "/";
  }
  if (pathname === "/") return "/youth";
  if (pathname === "/work") return "/youth/work";
  if (pathname.startsWith("/work/")) {
    const slug = pathname.slice("/work/".length);
    return youthCaseStudyProjects.some((project) => project.slug === slug) ? `/youth/work/${slug}` : "/youth/work";
  }
  if (pathname === "/about") return "/youth/about";
  return "/youth";
}
import { youthCaseStudyProjects } from "./catalog";
