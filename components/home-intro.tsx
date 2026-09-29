"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { capabilityAxes } from "@/lib/capabilities";
import { identityLine } from "@/lib/identity";

const introKey = "axb-intro-seen";

export function HomeIntro() {
  useEffect(() => {
    const root = document.documentElement;
    try {
      if (sessionStorage.getItem(introKey) === "1") {
        root.dataset.intro = "seen";
        return;
      }
      sessionStorage.setItem(introKey, "1");
    } catch {
      // Storage can be unavailable; the first-view animation remains a safe fallback.
    }

    const timeout = window.setTimeout(() => {
      root.dataset.intro = "seen";
    }, 900);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-brand fade">
        <BrandMark motion="connect" className="mark-hero" />
        <span>
          <b>AX Builder</b>
          <small>by sysmetrix</small>
        </span>
      </div>
      <p className="mono fade">{identityLine}</p>
      <h1 id="hero-title" className="display">
        <span className="ln">I build systems</span>{" "}
        <span className="ln">
          for <em>better</em> public work.
        </span>
      </h1>
      <p className="lead-ko fade d3">공공의 일을 더 잘 작동하게 만드는 시스템을 만듭니다.</p>
      <div className="cols">
        <p>
          청소년 현장과 사업을 기반으로, 정책·성과·데이터·AX를 연결해
          실제 업무에 쓰이는 시스템과 도구를 만듭니다.
        </p>
        <div className="hero-paths">
          <ul aria-label="주요 역량">
            {capabilityAxes.map((axis) => (
              <li key={axis.en}>
                <span>{axis.en}</span>
                <small>{axis.ko}</small>
              </li>
            ))}
          </ul>
          <Link className="primary-cta" href="#work">
            대표 작업 살펴보기 ↓
          </Link>
        </div>
      </div>
    </section>
  );
}
